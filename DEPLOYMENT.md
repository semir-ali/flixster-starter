# Flixster Deployment Guide

## Deployment to Render

This guide walks you through deploying your Flixster app to [Render](https://render.com), a cloud platform that offers free hosting for web applications.

### Prerequisites

1. A [Render](https://render.com) account (free)
2. Your Flixster code pushed to a GitHub repository
3. Your TMDb API key and OpenRouter API key

### Step-by-Step Deployment

#### 1. Prepare Your Repository

Ensure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

#### 2. Create a New Web Service on Render

1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click **"New +"** and select **"Static Site"**
3. Connect your GitHub account if you haven't already
4. Select your **flixster-starter** repository
5. Click **"Connect"**

> **Note:** This app is a client-side SPA built with Vite, so it deploys as a Render **Static Site** (matching `env: static` in [render.yaml](render.yaml)) — not a Node Web Service. There is no server process; Render serves the static files in `dist/`. The `/* → /index.html` rewrite in `render.yaml` (mirrored by `public/_redirects`) is what makes React Router's clean URLs work on refresh and deep-links. Do **not** use `npm run preview` as a start command — `vite preview` is only a local preview server, not for production.

#### 3. Configure Your Static Site

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `flixster` (or any name you prefer) |
| **Branch** | `main` |
| **Root Directory** | Leave blank |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### 4. Add Environment Variables

In the **Environment Variables** section, add:

1. Click **"Add Environment Variable"**
2. Add the following variables:

   ```
   Key: VITE_API_KEY
   Value: [Your TMDb API Key]
   ```

   ```
   Key: VITE_OPENROUTER_API_KEY
   Value: [Your OpenRouter API Key]
   ```

3. Click **"Add"** for each variable

#### 5. Deploy

1. Click **"Create Static Site"** at the bottom
2. Render will automatically:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Publish the `dist/` folder behind its global CDN
3. Wait 2-5 minutes for the initial deployment

#### 6. Access Your Live App

Once deployment is complete, you'll see:
- A green **"Live"** indicator
- Your app URL: `https://flixster-[random-string].onrender.com`

Click the URL to open your live Flixster app!

---

## Troubleshooting

### Build Fails

**Error:** `npm install failed`
- **Solution:** Check that your `package.json` is valid and all dependencies are listed correctly.

**Error:** `Environment variable undefined`
- **Solution:** Verify you added both `VITE_API_KEY` and `VITE_OPENROUTER_API_KEY` in the Render dashboard.

### App Doesn't Load

**Issue:** Blank page or 404 error
- **Solution:** Ensure your build command is `npm install && npm run build` and the publish directory is `dist`.
- **Routing 404 on refresh/deep-link:** Confirm the `/* → /index.html` rewrite from `render.yaml` is active (Static Site → Settings → Redirects/Rewrites). Without it, React Router routes like `/search` 404 on a hard refresh.
- **Check:** In Render logs, look for any build errors.

**Issue:** "Network error" when loading movies
- **Solution:** Check that your TMDb API key is valid and correctly added as `VITE_API_KEY`.

### API Keys Don't Work in Production

**Issue:** Movies don't load, AI recommendations fail
- **Solution:** Environment variables in Vite **must** be prefixed with `VITE_`. Double-check:
  - `VITE_API_KEY` (not `API_KEY`)
  - `VITE_OPENROUTER_API_KEY` (not `OPENROUTER_API_KEY`)

---

## Updating Your Deployed App

To deploy updates:

1. Make changes locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update feature X"
   git push origin main
   ```
3. Render will **automatically redeploy** your app (takes 2-5 minutes)

---

## Custom Domain (Optional)

To use your own domain (e.g., `flixster.yourdomain.com`):

1. Go to your Render service → **Settings**
2. Scroll to **Custom Domains**
3. Click **"Add Custom Domain"**
4. Follow instructions to add DNS records

---

## Free Tier Limitations

Render's free tier includes:
- ✅ 750 hours/month of runtime (enough for continuous hosting)
- ✅ Automatic HTTPS
- ✅ Automatic deploys from GitHub
- ⚠️ Apps sleep after 15 minutes of inactivity (first request takes ~30 seconds)
- ⚠️ 512 MB RAM, shared CPU

**Note:** The app will "wake up" when someone visits it. The first load may be slow, but subsequent loads are fast.

---

## Alternative: Vercel Deployment

If you prefer **Vercel** (another popular free platform):

1. Visit [vercel.com](https://vercel.com)
2. Click **"Import Project"**
3. Select your GitHub repository
4. Set environment variables:
   - `VITE_API_KEY`
   - `VITE_OPENROUTER_API_KEY`
5. Click **"Deploy"**

Vercel automatically detects Vite projects and configures build settings.

---

## Alternative: Netlify Deployment

If you prefer **Netlify**:

1. Visit [netlify.com](https://netlify.com)
2. Click **"Add new site"** → **"Import an existing project"**
3. Connect your GitHub repository
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variables in **Site settings → Environment variables**
6. Click **"Deploy"**

---

## Production Checklist

Before deploying, ensure:

- [ ] All stretch features implemented and tested locally
- [ ] Environment variables set correctly in Render
- [ ] Code pushed to GitHub
- [ ] No console errors in browser DevTools
- [ ] All routes work (`/`, `/search`, `/favorites`, `/watched`)
- [ ] Genre onboarding appears on first visit
- [ ] Favorites and watched lists persist
- [ ] Trailers load in movie modal
- [ ] AI recommendations appear
- [ ] Responsive design works on mobile

---

## Support

If you encounter issues:
- Check [Render's documentation](https://render.com/docs)
- Review build logs in Render dashboard
- Test locally with `npm run build && npm run preview` to simulate production

---

**Congratulations! Your Flixster app is now live! 🎬🎉**
