import { notFound } from "next/navigation";

interface BlogPostPageProps {
  params: { category: string; id: string; content: string };
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const { category, id, content } = params;

  if (!id) {
    return notFound();
  }

  return (
    <div>
      <h1>Blog Post: {id}</h1>
      <p>Category: {category}</p>
      <p>content: {content}</p>
    </div>
  );
}
