"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const categories = [
    { name: "Health", path: "/blog/health" },
    { name: "Lifestyle", path: "/blog/lifestyle" },
    { name: "Sports", path: "/blog/sports" },
    { name: "Starblog", path: "/blog/starblog" },
  ];

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="bg-gray-800 text-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold">
              Next-Blog
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className={`hover:text-gray-300 ${
                  isActive(category.path) ? "font-bold underline" : ""
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white focus:outline-none"
            >
              {isMenuOpen ? "Close" : "Menu"}
            </button>
          </div>
        </div>
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={category.path}
                className={`block py-2 hover:text-gray-300 ${
                  isActive(category.path) ? "font-bold" : ""
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {category.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
