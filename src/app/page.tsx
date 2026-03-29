import Link from 'next/link';
import fs from 'fs';
import path from 'path';

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
      title: f.replace('.md', '').replace(/-/g, ' ').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      date: f.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || new Date().toISOString().split('T')[0],
      category: '未分類',
      excerpt: '點擊閱讀更多...'
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const CATEGORIES = [
  { id: 'work', name: '💼 工作雜記', color: 'bg-blue-100 text-blue-800' },
  { id: 'security', name: '🔒 資安評論', color: 'bg-red-100 text-red-800' },
  { id: 'fortune', name: '🌟 命理', color: 'bg-purple-100 text-purple-800' },
  { id: 'language', name: '🌍 外語學習', color: 'bg-green-100 text-green-800' },
  { id: 'finance', name: '💰 財金投資', color: 'bg-yellow-100 text-yellow-800' },
];

export default function Home() {
  const posts = getAllPosts();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">我的自動化部落格</h1>
          <p className="text-gray-600">由 cron job 自動產生內容的個人空間</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Categories */}
        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">分類</h2>
          <div className="flex flex-wrap gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`px-4 py-2 rounded-full text-sm font-medium ${cat.color} hover:opacity-80 transition`}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">最新文章</h2>
          
          {posts.length === 0 ? (
            <div className="bg-white p-8 rounded-lg shadow-sm text-center">
              <p className="text-gray-500">還沒有文章，讓 cron job 開始產生內容吧！</p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map(post => (
                <article key={post.slug} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-gray-500">{post.date}</span>
                    <span className="text-xs px-2 py-1 bg-gray-100 rounded">{post.category}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    <Link href={`/post/${post.slug}`} className="hover:text-blue-600">
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-gray-600">{post.excerpt}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-4xl mx-auto px-4 py-6 text-center text-gray-500 text-sm">
          <p>由 Joyce 自動化系統驅動 © 2025</p>
        </div>
      </footer>
    </div>
  );
}
