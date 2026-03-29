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
  
  // 移除 frontmatter
  const cleanContent = content.replace(/---[\s\S]*?---/, '').trim();
  
  // 從 slug 提取標題
  const title = slug
    .replace(/^\d{4}-\d{2}-\d{2}-/, '')
    .replace(/-/g, ' ');
  
  // 嘗試從內容中提取日期
  const dateMatch = content.match(/date:\s*(.+)/);
  const date = dateMatch ? dateMatch[1].trim().split('T')[0] : '';
  
  return { title, content: cleanContent, date };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-light text-stone-800 mb-4">文章不存在</h1>
          <Link 
            href="/" 
            className="text-amber-700 hover:text-amber-800 text-sm transition-colors"
          >
            ← 返回首頁
          </Link>
        </div>
      </div>
    );
  }
  
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
      
      {/* Article */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <article className="bg-white rounded-lg p-8 md:p-12 shadow-sm border border-stone-100">
          {/* Date */}
          {post.date && (
            <time className="text-xs text-stone-400 tracking-widest uppercase block mb-4">
              {post.date}
            </time>
          )}
          
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-light text-stone-800 mb-8 leading-relaxed">
            {post.title}
          </h1>
          
          {/* Divider */}
          <div className="w-16 h-px bg-amber-300 mb-8"></div>
          
          {/* Content */}
          <div className="prose prose-stone max-w-none">
            <pre className="whitespace-pre-wrap text-stone-700 leading-[1.9] text-base font-light">
              {post.content}
            </pre>
          </div>
          
          {/* Back link */}
          <div className="mt-12 pt-8 border-t border-stone-100">
            <Link 
              href="/"
              className="text-sm text-amber-700 hover:text-amber-800 transition-colors"
            >
              ← 返回所有文章
            </Link>
          </div>
        </article>
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
