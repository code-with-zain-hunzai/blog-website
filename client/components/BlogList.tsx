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

const BlogList: React.FC<{ category?: string | null }> = ({ category = null }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('http://localhost:7000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();

        // Ensure TypeScript knows the expected data structure
        const filteredPosts: BlogPost[] = category
          ? data.data.filter((post: BlogPost) => post.category.toLowerCase() === category.toLowerCase())
          : data.data;

        setPosts(filteredPosts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

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

  if (loading) return <div className="text-center py-8">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (posts.length === 0) return <div className="text-center py-8">No posts found in this category.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
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
  );
};

export default BlogList;
