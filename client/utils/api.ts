"use client";


export interface BlogPost {
  id: string;
  todo: string;
  content: string;
  category: string;
  authorName: string;
  createdAt: string;
  isStar?: boolean;
}

const API_BSE_URL = "http://localhost:7000/api/todos";

export const fetchPosts = async (category?: string | null) => {
  try {
    const response = await fetch(API_BSE_URL);
    if (!response.ok) throw new Error("Failed to fetch posts");

    const data = await response.json();
    return category
      ? data.data.filter(
          (post: any) => post.category.toLowerCase() === category.toLowerCase()
        )
      : data.data;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const toggleStar = async (id: string) => {
  try {
    const response = await fetch(API_BSE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error("Failed to update post");

    return await response.json();
  } catch (error) {
    throw new Error((error as Error).message);
  }
};

export const deletePost = async (id: string) => {
  try {
    const response = await fetch(API_BSE_URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error("Failed to delete post");

    return true;
  } catch (error) {
    throw new Error((error as Error).message);
  }
};
