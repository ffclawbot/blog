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
      excerpt: '閱讀更多...'
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

const CATEGORIES = [
  { id: 'work', name: '工作雜記', icon: '☕', color: 'bg-amber-50 text-amber-700 border-amber-200' },
  { id: 'security', name: '資安評論', icon: '📚', color: 'bg-stone-50 text-stone-700 border-stone-200' },
  { id: 'fortune', name: '命理', icon: '🌙', color: 'bg-orange-50 text-orange-700 border-orange-200' },
  { id: 'language', name: '外語學習', icon: '✏️', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  { id: 'finance', name: '財金投資', icon: '💡', color: 'bg-teal-50 text-teal-700 border-teal-200' },
];

export default function Home() {
  const posts = getAllPosts();
  
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-light text-stone-800 mb-3 tracking-wide">
              我的自動化部落格
            </h1>
            <p className="text-stone-500 text-sm tracking-widest uppercase">
              由 cron job 自動產生內容的個人空間
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-6 text-center">
            分類
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat.id}
                href={`/category/${cat.id}`}
                className={`px-4 py-2.5 rounded-full text-sm border ${cat.color} 
                  hover:shadow-md hover:-translate-y-0.5 transition-all duration-300`}
              >
                <span className="mr-1.5">{cat.icon}</span>
                {cat.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="flex items-center justify-center mb-16">
          <div className="h-px bg-stone-200 w-24"></div>
          <span className="mx-4 text-stone-300 text-xs">◆</span>
          <div className="h-px bg-stone-200 w-24"></div>
        </div>

        {/* Recent Posts */}
        <section>
          <h2 className="text-xs font-medium text-stone-400 tracking-widest uppercase mb-8 text-center">
            最新文章
          </h2>
          
          {posts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-stone-400 text-sm">
                還沒有文章，讓 cron job 開始產生內容吧
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {posts.map(post => (
                <article 
                  key={post.slug} 
                  className="bg-white rounded-lg p-8 shadow-sm hover:shadow-lg 
                    transition-all duration-300 border border-stone-100"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <time className="text-xs text-stone-400 tracking-wide">
                      {post.date}
                    </time>
                    <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                    <span className="text-xs text-stone-500">
                      {post.category}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium text-stone-800 mb-3 leading-relaxed">
                    <Link 
                      href={`/post/${post.slug}`} 
                      className="hover:text-amber-700 transition-colors"
                    >
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-stone-500 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    <Link 
                      href={`/post/${post.slug}`}
                      className="text-xs text-amber-700 hover:text-amber-800 
                        transition-colors tracking-wide"
                    >
                      閱讀全文 →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-stone-200 mt-20">
        <div className="max-w-3xl mx-auto px-6 py-10 text-center">
          <p className="text-stone-400 text-xs tracking-widest">
            由 Joyce 自動化系統驅動
          </p>
          <p className="text-stone-300 text-xs mt-2">
            © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
