import fs from 'fs';
import path from 'path';
import Link from 'next/link';

// 預定義五個分類
const CATEGORIES = [
  { id: 'work', name: '工作雜記', icon: '☕' },
  { id: 'security', name: '資安評論', icon: '📚' },
  { id: 'fortune', name: '命理', icon: '🌙' },
  { id: 'language', name: '外語學習', icon: '✏️' },
  { id: 'finance', name: '財金投資', icon: '💡' },
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
      title: f.replace('.md', '').replace(/-/g, ' ').replace(/^\d{4}-\d{2}-\d{2}-/, ''),
      date: f.match(/^\d{4}-\d{2}-\d{2}/)?.[0] || new Date().toISOString().split('T')[0],
      category: '未分類',
      excerpt: ''
    }));
}

export default function CategoryPage({ params }: { params: { id: string } }) {
  const category = CATEGORIES.find(c => c.id === params.id);
  const posts = getAllPosts().filter(p => p.category === params.id);
  
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <Link 
            href="/" 
            className="text-sm text-stone-500 hover:text-amber-700 transition-colors"
          >
            ← 返回首頁
          </Link>
        </div>
      </nav>
      
      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Category Header */}
        <div className="text-center mb-12">
          <div className="text-4xl mb-4">{category?.icon || '📁'}</div>
          <h1 className="text-3xl font-light text-stone-800 mb-2">
            {category?.name || params.id}
          </h1>
          <div className="w-16 h-px bg-amber-300 mx-auto mt-4"></div>
        </div>
        
        {/* Posts */}
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border border-stone-100">
            <p className="text-stone-400">這個分類還沒有文章～</p>
          </div>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <article 
                key={post.slug} 
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md 
                  transition-all duration-300 border border-stone-100"
              >
                <div className="flex items-center gap-2 mb-3">
                  <time className="text-xs text-stone-400">{post.date}</time>
                </div>
                <h2 className="text-lg font-medium text-stone-800 mb-2">
                  <Link 
                    href={`/post/${post.slug}`}
                    className="hover:text-amber-700 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-stone-500 text-sm">{post.excerpt || '閱讀更多...'}</p>
              </article>
            ))}
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-16">
        <div className="max-w-3xl mx-auto px-6 py-8 text-center">
          <p className="text-stone-400 text-xs tracking-widest">
            由 Joyce 自動化系統驅動
          </p>
        </div>
      </footer>
    </div>
  );
}
