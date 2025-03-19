import React from "react";
import Link from "next/link";
import BlogList from "../components/BlogList";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div>
      <Navbar />
      <section className="bg-blue-700 text-white py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Welcome to Next-Blog</h1>
          <p className="text-xl mb-6">
            Discover the latest insights on health, lifestyle, sports, and more.
          </p>
          <Link
            href="/new"
            className="inline-block bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
          >
            Start Writing
          </Link>
        </div>
      </section>

      <section className="container mx-auto max-w-6xl py-12">
        <h2 className="text-3xl font-bold mb-8 text-center">Latest Posts</h2>
        <BlogList />
      </section>

      <section className="bg-gray-100 py-12">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Explore Categories
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {["health", "lifestyle", "sports", "starblog"].map((category) => (
              <Link key={category} href={`/blog/${category}`} className="block">
                <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <h3 className="text-xl font-semibold mb-2 capitalize">
                    {category}
                  </h3>
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
