import fs from 'fs';
import path from 'path';

// 預定義五個分類
const CATEGORIES = [
  { id: 'work', name: '工作雜記' },
  { id: 'security', name: '資安評論' },
  { id: 'fortune', name: '命理' },
  { id: 'language', name: '外語學習' },
  { id: 'finance', name: '財金投資' },
];

// 為靜態導出生成所有分類 ID
export function generateStaticParams() {
  return CATEGORIES.map(cat => ({ id: cat.id }));
}

interface Post {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
}

function getAllPosts(): Post[] {
  const postsDir = path.join(process.cwd(), 'content');
  if (!fs.existsSync(postsDir)) return [];
  
  return fs.readdirSync(postsDir)
    .filter(f => f.endsWith('.md'))
    .map(f => ({
      slug: f.replace('.md', ''),
      title: f.replace('.md', '').replace(/-/g, ' '),
      date: new Date().toISOString(),
      category: '未分類',
      excerpt: ''
    }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const posts = getAllPosts().filter(p => p.category === params.id);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">{params.id}</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        {posts.length === 0 ? (
          <p className="text-gray-500">這個分類還沒有文章～</p>
        ) : (
          <div className="space-y-4">
            {posts.map(post => (
              <article key={post.slug} className="bg-white p-6 rounded-lg shadow-sm">
                <h2 className="text-xl font-semibold">{post.title}</h2>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}