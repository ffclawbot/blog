#!/bin/bash
# Auto deploy script for 4 Bot Blog System
# Usage: ./deploy.sh

SITE_ID="1593e0cd-5ff3-4e7a-8f44-7892739b3835"
TOKEN="nfp_BMgpuSm83dJCZM8nJXPzPA7qis5R46zTb2f7"
BLOG_DIR="/Users/peterfan/.openclaw/workspace-joyce/blog"

echo "🚀 開始部署部落格..."

# 建立壓縮檔
cd /Users/peterfan/.openclaw/workspace-joyce
zip -r blog-deploy.zip blog/content/ blog/scripts/ blog/package.json blog/README.md

# 呼叫 Netlify API 部署
echo "📤 上傳到 Netlify..."
curl -X POST "https://api.netlify.com/api/v1/sites/${SITE_ID}/deploys" \
  -H "Authorization: Bearer ${TOKEN}" \
  -H "Content-Type: application/zip" \
  --data-binary @${BLOG_DIR}/../blog-deploy.zip

echo "✅ 部署完成！"
echo "🌐 網址: https://beautiful-selkie-86c507.netlify.app"
