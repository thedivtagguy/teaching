# Review: Darshan

Disclosure: Parts of this review were put together with an LLM after a thorough manual review.

## The Good

- Blog is very well organized in terms of the content collections.
- **Your whole theme lives in CSS variables.** `src/styles/global.css` names every color and font by role. To change your accent, you edit one line.
- **Your components take props and get reused.** `Panel.astro` frames all six sections, and `Card.astro` serves four different lists with one `variant` prop. nice work maintaining this.

## Things to improve

### 1. Remove the secret token from your repo and make a new one

Your repo is public, and `live-status/heartbeat-windows.ps1` contains your worker's secret token on line 6. Anyone can copy that token and send pings to your worker. Then your badge shows LIVE when you are away. Deleting the file is not enough, because the token stays in your git history.

**What to do:** Make a new random token. Put the new token into your Cloudflare worker and into the script on your PC. Then remove the folder from the repo:

```sh
git rm -r live-status
git commit -m "Remove heartbeat scripts from the repo"
```

Since the scripts run on your Windows machine, not on Cloudflare Pages, the site does not need them in the repo.

## Little things

- The badge script in `index.astro` still calls `https://your-worker.your-subdomain.workers.dev/status`. Put your real worker URL there.
- Compress `public/assets/bg-texture.png` (1.6 MB) and `public/images/placeholder.png` (4.2 MB) at squoosh.app