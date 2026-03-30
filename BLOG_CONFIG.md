# BLOG_CONFIG.md - 4 Bot Blog System Configuration
# Generated: 2026-03-30
# 此檔案為所有 Bot 共用設定，請勿手動修改

## Blog Information
- URL: https://beautiful-selkie-86c507.netlify.app
- Repo Path: /Users/peterfan/.openclaw/workspace-joyce/blog
- Content Dir: /Users/peterfan/.openclaw/workspace-joyce/blog/content
- Publish Script: /Users/peterfan/.openclaw/workspace-joyce/blog/scripts/publish.js

## Netlify Settings
- Site ID: beautiful-selkie-86c507

## Bot Report Settings

### Annie (中央總控)
- Schedule: 每天 09:00
- Category: 工作雜記
- Tags: 營運,每日報告,Annie
- Title Format: [Annie] 每日營運摘要 YYYY-MM-DD
- Content: 昨日工作完成狀態,今日待辦事項,重要提醒

### Anita (資安情報分析師)
- Schedule: 每天 12:00
- Category: 資安評論
- Tags: 資安,快報,Anita
- Title Format: [Anita] 每日資安快報 YYYY-MM-DD
- Content: 最新資安威脅摘要,漏洞/攻擊事件分析,防護建議

### Joyce (文案與行銷總監)
- Schedule: 每天 15:00
- Category: 工作雜記
- Tags: 行銷,報告,Joyce
- Title Format: [Joyce] 每日行銷報告 YYYY-MM-DD
- Content: 今日文案創意方向,品牌策略建議,社群話題靈感

### Cherry (英日文教學專員)
- Schedule: 每天 21:00
- Category: 外語學習
- Tags: 語言,學習,Cherry
- Title Format: [Cherry] 每日語言學習 YYYY-MM-DD
- Content: 每日英文單字/句型,每日日文單字/句型,實用例句

## Git Settings
- Branch: main
- Remote: origin
- User: Blog Bot
- Email: bot@ffclaw.com

## Timezone
- TZ: Asia/Taipei

## How to Publish
使用 publish.js 腳本:
node scripts/publish.js --title "標題" --category "分類" --content "內容" --tags "tag1,tag2"
