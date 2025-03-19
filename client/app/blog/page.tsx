'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface BlogPost {
  id: string;
  todo: string;
  content: string;
  category: string;
  authorName: string;
  createAt: string;
  isStar?: boolean;
}

export default function AllPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 9;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:7000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        
        const sortedPosts = [...data.data].sort((a: BlogPost, b: BlogPost) => 
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );
        
        setPosts(sortedPosts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const toggleStar = async (id: string) => {
    try {
      const response = await fetch('http://localhost:7000/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const { todo: updatedPost } = await response.json();

      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
      );
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const response = await fetch('http://localhost:7000/todos', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  // Get current posts
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (posts.length === 0) return <div className="text-center py-8">No posts available.</div>;

  return (
    <div className="container mx-auto max-w-6xl py-8">
      <h1 className="text-3xl font-bold mb-8">All Blog Posts</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {currentPosts.map((post) => (
          <div key={post.id} className="border rounded-lg overflow-hidden shadow-md">
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-xl font-semibold mb-2">{post.todo}</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleStar(post.id)}
                    className={`text-2xl ${post.isStar ? 'text-yellow-500' : 'text-gray-300'}`}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => deletePost(post.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{post.content.substring(0, 100)}...</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>By {post.authorName}</span>
                <span>{new Date(post.createAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4">
                <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
                  {post.category}
                </span>
                <Link href={`/blog/${post.category.toLowerCase()}/${post.id}`} className="text-blue-500 hover:underline">
                  Read more
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center">
            <button
              onClick={() => paginate(currentPage > 1 ? currentPage - 1 : 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-l-md bg-white disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                <button
                  key={number}
                  onClick={() => paginate(number)}
                  className={`px-4 py-2 border-t border-b border-r ${
                    currentPage === number ? 'bg-blue-600 text-white' : 'bg-white'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => paginate(currentPage < totalPages ? currentPage + 1 : totalPages)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border-t border-b border-r rounded-r-md bg-white disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}