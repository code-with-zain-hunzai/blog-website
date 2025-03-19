// client/app/page.tsx
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

export default function Home() {
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPosts, setTotalPosts] = useState(0);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        const response = await fetch('http://localhost:7000/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
     
        const sortedPosts = [...data.data].sort((a: BlogPost, b: BlogPost) => 
          new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );
        
        setLatestPosts(sortedPosts.slice(0, 3));
        setTotalPosts(sortedPosts.length);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestPosts();
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

      setLatestPosts((prevPosts) =>
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

      setLatestPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      setTotalPosts((prevTotal) => prevTotal - 1);
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  return (
    <div>
      <section className="bg-blue-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Next-Blog</h1>
          <p className="text-xl mb-6">
            Discover the latest insights on health, lifestyle, sports, and more.
          </p>
          <Link href="/new" className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100">
            Start Writing
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
        
        {loading ? (
          <div className="text-center py-8">Loading latest posts...</div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">Error: {error}</div>
        ) : latestPosts.length === 0 ? (
          <div className="text-center py-8">No posts available. Be the first to create one!</div>
        ) : (
          <>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {latestPosts.map((post) => (
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
            
            {totalPosts > 3 && (
              <div className="text-center mt-8">
                <Link href="/blog" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700">
                  View All Posts ({totalPosts})
                </Link>
              </div>
            )}
          </>
        )}
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Explore Categories</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {['health', 'lifestyle', 'sports'].map((category) => (
              <Link key={category} href={`/blog/${category}`} className="block">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 capitalize">{category}</h3>
                  <p className="text-gray-600">
                    Explore our {category} articles
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}