#!/usr/bin/env node
/**
 * 自動發布腳本 - 讓 cron job 能自動將 Markdown 發布到部落格
 * 
 * 使用方法:
 * node publish.js --title "文章標題" --category "工作雜記" --content "文章內容"
 * 
 * 或讀取檔案:
 * node publish.js --file /path/to/article.md
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 解析命令列參數
function parseArgs() {
  const args = process.argv.slice(2);
  const params = {};
  
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const value = args[i + 1] && !args[i + 1].startsWith('--') ? args[i + 1] : true;
      params[key] = value;
      if (value !== true) i++;
    }
  }
  
  return params;
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 50);
}

function createPost(params) {
  const title = params.title || '無標題文章';
  const category = params.category || '工作雜記';
  const tags = params.tags ? params.tags.split(',').map(t => t.trim()) : [];
  const excerpt = params.excerpt || '';
  const date = new Date().toISOString();
  
  let content = params.content || '';
  
  // 如果指定了檔案，讀取檔案內容
  if (params.file) {
    try {
      content = fs.readFileSync(params.file, 'utf8');
    } catch (e) {
      console.error('❌ 無法讀取檔案:', e.message);
      process.exit(1);
    }
  }
  
  const slug = generateSlug(title);
  const filename = `${date.split('T')[0]}-${slug}.md`;
  
  // 建立 frontmatter
  const frontmatter = `---
title: ${title}
date: ${date}
category: ${category}
${tags.length > 0 ? `tags:\n${tags.map(t => `  - ${t}`).join('\n')}` : 'tags: []'}
excerpt: ${excerpt || content.slice(0, 100).replace(/\n/g, ' ') + '...'}
---

${content}
`;
  
  // 寫入檔案
  const contentDir = path.join(__dirname, '..', 'content');
  if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir, { recursive: true });
  }
  
  const filepath = path.join(contentDir, filename);
  fs.writeFileSync(filepath, frontmatter);
  
  console.log('✅ 文章已建立:', filepath);
  return filename;
}

function pushToGit(filename) {
  try {
    console.log('🔄 推送到 GitHub...');
    execSync('git add .', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync(`git commit -m "Add post: ${filename}"`, { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    execSync('git push origin main', { cwd: path.join(__dirname, '..'), stdio: 'inherit' });
    console.log('🚀 已推送到 GitHub，Vercel 將自動部署！');
  } catch (e) {
    console.error('⚠️ Git 操作失敗:', e.message);
  }
}

// 主程式
const params = parseArgs();

if (params.help) {
  console.log(`
自動發布腳本 - 將 Markdown 發布到部落格

使用方法:
  node publish.js --title "文章標題" --category "工作雜記" --content "文章內容"
  
選項:
  --title       文章標題 (必填)
  --category    分類 (預設: 工作雜記)
  --content     文章內容
  --file        從檔案讀取內容
  --tags        標籤 (逗號分隔)
  --excerpt     文章摘要
  --no-push     不推送到 GitHub
  --help        顯示說明
`);
  process.exit(0);
}

if (!params.title && !params.file) {
  console.error('❌ 請提供 --title 或 --file');
  process.exit(1);
}

const filename = createPost(params);

if (!params['no-push']) {
  pushToGit(filename);
}

console.log('\n✨ 完成！');