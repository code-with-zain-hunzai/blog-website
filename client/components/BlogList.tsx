'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { fetchPosts, toggleStar as toggleStarApi, deletePost as deletePostApi } from '@/utils/api';
import { FiStar, FiTrash } from 'react-icons/fi';

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
    const getPosts = async () => {
      try {
        const data = await fetchPosts(category);
        setPosts(data);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [category]);

  const toggleStar = async (id: string) => {
    try {
      const { todo: updatedPost } = await toggleStarApi(id);
      setPosts((prev) => prev.map((post) => (post.id === updatedPost.id ? updatedPost : post)));
    } catch (err) {
      console.error('Error updating post:', err);
    }
  };

  const deletePost = async (id: string) => {
    try {
      const success = await deletePostApi(id);
      if (success) setPosts((prev) => prev.filter((post) => post.id !== id));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  if (loading) return <div className="text-center py-8 text-lg font-medium">Loading posts...</div>;
  if (error) return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  if (posts.length === 0) return <div className="text-center py-8 text-gray-500">No posts found in this category.</div>;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <div key={post.id} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-xl">
          <div className="p-6">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white truncate">{post.todo}</h3>
              <div className="flex space-x-3">
                <button onClick={() => toggleStar(post.id)} className="text-xl transition-colors duration-300 hover:scale-110">
                  <FiStar className={post.isStar ? 'text-yellow-500' : 'text-gray-400 dark:text-gray-600'} />
                </button>
                <button onClick={() => deletePost(post.id)} className="text-red-500 hover:text-red-700 transition-colors duration-300 hover:scale-110">
                  <FiTrash />
                </button>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">{post.content.substring(0, 100)}...</p>
            <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
              <span>By {post.authorName}</span>
              <span>{new Date(post.createAt).toLocaleDateString()}</span>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full px-3 py-1 text-sm font-semibold">
                {post.category}
              </span>
              <Link href={`/blog/${post.category.toLowerCase()}/${post.id}`} className="text-blue-500 hover:underline">
                Read more →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BlogList;