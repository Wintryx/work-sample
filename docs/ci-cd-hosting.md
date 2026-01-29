# CI/CD and Hosting Recommendations

## Scope
This document outlines pragmatic, cost-effective CI/CD and hosting options for a private work-sample project. The goal is a professional setup with minimal operational overhead.

## Industry-Standard Baseline
- **CI**: GitHub Actions (runs on every push/PR).
- **CD**: Hosted platforms with automatic deploys and preview URLs (Vercel, Netlify, Cloudflare Pages, Azure Static Web Apps).
- **Quality Gates**: Lint, tests, build, and (optionally) e2e checks.

## Recommended Setups

### Option A — Static/Prerender (lowest cost, simplest)
Best when SSR is not required.
- **Hosting**: Cloudflare Pages, Netlify, or Azure Static Web Apps.
- **Pros**: Free tiers, easy setup, fast global CDN.
- **Cons**: No full SSR runtime.

### Option B — SSR (full server rendering)
Best when SSR is required.
- **Hosting**: Vercel or Netlify (Angular SSR support).
- **Pros**: Simple Git-based deployment, preview deployments for PRs.
- **Cons**: SSR adds runtime cost; free tier limits can apply.

## CI Workflow (GitHub Actions)
Typical pipeline for Angular projects:
1. Install dependencies: `npm ci`
2. Lint: `npm run lint`
3. Unit tests: `npm run test -- --watch=false`
4. Build: `npm run build`

This repository provides a baseline workflow at:
- `.github/workflows/ci.yml`

## CD Workflow (Hosting)
- Connect the GitHub repo to the hosting platform.
- Configure build command and output directory.
- Each push triggers an automatic deploy.
- Each PR gets a preview URL (for review).

## Vercel (Minimal Static Setup)
Use this when you want the simplest setup without SSR runtime.
- **Build Command**: `npm run build`
- **Output Directory**: `dist/wintryx-progress-maker/browser`
- Result: Static deployment only; SSR bundle is not used.

## Deployment Gating (Optional)
By default, Vercel deploys immediately on push, independent of GitHub Actions.
If you want deployments only after CI succeeds:
- Disable Vercel auto-deploys and trigger deployments from GitHub Actions (requires a Vercel token).
- Or use Vercel deployment checks if available on your plan.
Recommended (CI-triggered deploy) setup:
1. In Vercel, disable Git deployments for Production (Project Settings -> Git).
2. Add GitHub Secrets:
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`
3. Add a deploy job that runs after the CI job.

Example GitHub Actions job:
```yaml
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Deploy to Vercel (Production)
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
        run: npx vercel deploy --prod --yes --token $VERCEL_TOKEN
```

## SPA Deep-Link Refresh (Vercel)
Static deployments need a rewrite so client-side routes work on refresh.
- File: `vercel.json`
- Purpose: serve `index.csr.html` for routes like `/dashboard` or `/notifications`.

## Suggested Choice for a Work Sample
- **If SSR is not required**: Cloudflare Pages or Netlify (free + simple).
- **If SSR is required**: Vercel (popular, reliable, strong previews).

## Cost Considerations
- Public repos typically get free GitHub Actions minutes.
- Most hosting platforms have free tiers with limits that are sufficient for a portfolio/work sample.
- If SSR is used, watch runtime limits and request quotas.

## Secrets and Variables (Future Note)
- Not required for basic CI (lint/test/build).
- Add only when integrating external services (e.g., deploy tokens, API keys).
- Prefer repository secrets for shared keys; environment secrets only if you need environment-specific values.

## Minimal Setup Checklist
- [ ] GitHub Actions workflow (lint/test/build)
- [ ] Hosting connected to GitHub repo
- [ ] Preview deployments enabled
- [ ] Custom domain (optional)
- [ ] README updated with deploy URL

## Helpful References
- GitHub Actions: https://docs.github.com/actions
- Vercel Angular: https://vercel.com/guides/deploying-angular-with-vercel
- Netlify Angular Runtime: https://github.com/netlify/angular-runtime
- Cloudflare Pages: https://www.cloudflare.com/developer-platform/products/pages/
- Azure Static Web Apps: https://azure.microsoft.com/services/app-service/static/
