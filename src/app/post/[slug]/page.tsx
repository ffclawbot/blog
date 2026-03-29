import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 為靜態導出生成所有可能的 slug
export function generateStaticParams() {
  const postsDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(postsDir)) {
    return [];
  }
  
  const files = fs.readdirSync(postsDir);
  return files
    .filter(f => f.endsWith('.md'))
    .map(f => ({ slug: f.replace('.md', '') }));
}

function getPost(slug: string) {
  const postsDir = path.join(process.cwd(), 'content');
  const filePath = path.join(postsDir, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const title = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '').replace(/-/g, ' ');
  
  return { title, content };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">文章不存在</h1>
          <Link href="/" className="text-blue-600 hover:underline">返回首頁</Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link href="/" className="text-blue-600 hover:underline">← 返回首頁</Link>
        </div>
      </header>
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <article className="bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">{post.title}</h1>
          <pre className="whitespace-pre-wrap text-gray-700 leading-relaxed">{post.content}</pre>
        </article>
      </main>
    </div>
  );
}
