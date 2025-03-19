"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineArrowLeft } from "react-icons/ai";

interface BlogPost {
  id: string;
  todo: string;
  content: string;
  category: string;
  authorName: string;
  createAt: string;
  isStar?: boolean;
}

export default function BlogCategoryPage({
  params,
}: {
  params: { category: string };
}) {
  const { category } = params;
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedPosts, setExpandedPosts] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("http://localhost:7000/todos");
        if (!response.ok) throw new Error("Failed to fetch posts");

        const data = await response.json();
        if (!Array.isArray(data.data)) throw new Error("Invalid data format");

        const filteredPosts = data.data.filter(
          (post: BlogPost) =>
            post.category.toLowerCase() === category.toLowerCase()
        );

        setPosts(filteredPosts);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [category]);

  const toggleExpand = (id: string) => {
    setExpandedPosts((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (loading) return <p className="text-center mt-4">Loading...</p>;
  if (error)
    return <p className="text-center mt-4 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <button
        onClick={() => router.push("/")}
        className="flex items-center text-blue-500 hover:text-blue-700 mb-4"
      >
        <AiOutlineArrowLeft className="mr-2 text-lg" /> Back
      </button>
      <h1 className="text-3xl font-bold capitalize">{category} Blogs</h1>
      <p className="mt-2 text-gray-600">
        Showing posts in the <strong>{category}</strong> category.
      </p>

      {/* Grid layout */}
      <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-4 border hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {post.todo}
              </h2>
              <div>
                <p
                  className={`text-gray-600 mt-2 ${
                    expandedPosts[post.id] ? "" : "line-clamp-3"
                  }`}
                >
                  {post.content}
                </p>
                <button
                  onClick={() => toggleExpand(post.id)}
                  className="text-blue-500 mt-1"
                >
                  {expandedPosts[post.id] ? "See Less" : "See More"}
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-3">
                By <span className="font-medium">{post.authorName}</span> •{" "}
                {new Date(post.createAt).toISOString().split("T")[0]}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center mt-6 text-gray-500 col-span-full">
            No posts found in this category.
          </p>
        )}
      </div>
    </div>
  );
}
