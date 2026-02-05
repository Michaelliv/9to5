# Reddit Trend Scout

Monitor a subreddit for trending posts and automatically draft blog posts from interesting topics.

## CLI Command

```bash
9to5 add "Reddit trend scout" \
  --prompt 'Step 1: Fetch trending posts from r/ClaudeAI using curl:
  curl -s -H "User-Agent: 9to5-bot/1.0" "https://www.reddit.com/r/ClaudeAI/hot.json?limit=25" | jq "[.data.children[].data | {id, title, selftext, url, score, num_comments, created_utc}]"

Step 2: Filter for posts with 20+ score or 15+ comments. Ignore memes, images (i.redd.it), megathreads, and pure industry gossip.

Step 3: Assess which posts overlap with these topics: Claude Code, agent architecture, tool design, infrastructure, context engineering, CLI tooling, semantic layers, software engineering. Pick the single best candidate for a blog post.

Step 4: If you find a strong candidate:
- Read existing blog posts to match the voice
- Draft a 300-600 word post
- Create branch, commit, push, open a PR with summary

Step 5: If nothing is worth drafting, report what you found and why you skipped.' \
  --cwd /path/to/blog \
  --rrule "FREQ=HOURLY;INTERVAL=4" \
  --model sonnet \
  --max-budget-usd 0.50 \
  --system-prompt "You are a blog content scout. Be aggressive about drafting - a throwaway PR is cheap, missing a trending topic is expensive. No fluff, no filler, no emojis. First person, direct voice."
```

## JSON

```json
{
  "name": "Reddit trend scout",
  "prompt": "Step 1: Fetch trending posts from r/ClaudeAI using curl:\n  curl -s -H \"User-Agent: 9to5-bot/1.0\" \"https://www.reddit.com/r/ClaudeAI/hot.json?limit=25\" | jq \"[.data.children[].data | {id, title, selftext, url, score, num_comments, created_utc}]\"\n\nStep 2: Filter for posts with 20+ score or 15+ comments. Ignore memes, images (i.redd.it), megathreads, and pure industry gossip.\n\nStep 3: Assess which posts overlap with these topics: Claude Code, agent architecture, tool design, infrastructure, context engineering, CLI tooling, semantic layers, software engineering. Pick the single best candidate for a blog post.\n\nStep 4: If you find a strong candidate:\n- Read existing blog posts to match the voice\n- Draft a 300-600 word post\n- Create branch, commit, push, open a PR with summary\n\nStep 5: If nothing is worth drafting, report what you found and why you skipped.",
  "status": "active",
  "cwd": "/path/to/blog",
  "rrule": "FREQ=HOURLY;INTERVAL=4",
  "model": "sonnet",
  "max_budget_usd": 0.5,
  "allowed_tools": null,
  "system_prompt": "You are a blog content scout. Be aggressive about drafting - a throwaway PR is cheap, missing a trending topic is expensive. No fluff, no filler, no emojis. First person, direct voice."
}
```

## How it works

1. **Fetches** trending posts from Reddit's JSON API (no auth required)
2. **Filters** by engagement thresholds (score, comments)
3. **Evaluates** topic relevance against your interests
4. **Drafts** a blog post matching your writing style
5. **Opens a PR** so you can review before publishing

## Customization

- Change the subreddit by modifying the URL in Step 1
- Adjust score/comment thresholds in Step 2
- Update topic areas in Step 3 to match your interests
- Modify the system prompt to match your writing voice
