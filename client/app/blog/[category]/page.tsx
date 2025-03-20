"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  fetchPosts,
  toggleStar as toggleStarApi,
  deletePost as deletePostApi,
} from "@/utils/api";

interface BlogPost {
  id: string;
  todo: string;
  content: string;
  category: string;
  authorName: string;
  createAt: string;
  isStar: boolean;
}

export default function CategoryPage() {
  const params = useParams();
  const category = params.category as string;

  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const allPosts = await fetchPosts(
          category.toLowerCase() === "starblog" ? null : category
        );

        let filteredPosts;

        if (category.toLowerCase() === "starblog") {
          filteredPosts = allPosts.filter(
            (post: BlogPost) => post.isStar === true
          );
        } else {
          filteredPosts = allPosts;
        }

        const sortedPosts = [...filteredPosts].sort(
          (a: BlogPost, b: BlogPost) =>
            new Date(b.createAt).getTime() - new Date(a.createAt).getTime()
        );

        setPosts(sortedPosts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [category]);

  const handleToggleStar = async (id: string) => {
    try {
      const { todo: updatedPost } = await toggleStarApi(id);

      if (category.toLowerCase() === "starblog" && !updatedPost.isStar) {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
      } else {
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          )
        );
      }
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (id: string) => {
    try {
      await deletePostApi(id);
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== id));
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const getCategoryTitle = () => {
    if (category.toLowerCase() === "starblog") {
      return "Starred Posts";
    }
    return category.charAt(0).toUpperCase() + category.slice(1) + " Posts";
  };

  return (
    <div className="container mx-auto max-w-6xl py-12 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">
        {getCategoryTitle()}
      </h1>

      {loading ? (
        <div className="text-center py-8">Loading posts...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">Error: {error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">
            {category.toLowerCase() === "starblog"
              ? "No starred posts found. Star some posts to see them here!"
              : `No posts found in the ${category} category.`}
          </p>
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700"
          >
            Go to Homepage
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post.id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div className="p-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold mb-2">{post.todo}</h3>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStar(post.id)}
                      className={`text-2xl ${
                        post.isStar ? "text-yellow-500" : "text-gray-300"
                      }`}
                    >
                      ★
                    </button>
                    <button
                      onClick={() => handleDeletePost(post.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      ×
                    </button>
                  </div>
                </div>
                <p className="text-gray-600 mb-2">
                  {expandedPosts[post.id]
                    ? post.content
                    : `${post.content.substring(0, 100)}...`}
                </p>
                <button
                  onClick={() =>
                    setExpandedPosts((prev) => ({
                      ...prev,
                      [post.id]: !prev[post.id],
                    }))
                  }
                  className="text-blue-500 hover:underline"
                >
                  {expandedPosts[post.id] ? "See less" : "See more"}
                </button>
                <div className="flex justify-between items-center text-sm text-gray-500 mt-2">
                  <span>By {post.authorName}</span>
                  <span>{new Date(post.createAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
