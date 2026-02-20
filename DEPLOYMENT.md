# 🚀 Blink - Deployment Guide

## Quick Deploy Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd blink
vercel
```

Follow the prompts. Your app will be live in ~2 minutes.

---

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

---

### Option 3: GitHub Pages

1. Update `vite.config.ts`:
```typescript
export default defineConfig({
  plugins: [react()],
  base: '/blink/', // Replace with your repo name
})
```

2. Build and deploy:
```bash
npm run build
npx gh-pages -d dist
```

---

### Option 4: AWS S3 + CloudFront

```bash
# Build
npm run build

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

---

### Option 5: Docker

Create `Dockerfile`:
```dockerfile
FROM nginx:alpine
COPY dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
npm run build
docker build -t blink .
docker run -p 80:80 blink
```

---

## Environment Variables

Blink doesn't require any environment variables. All data is stored locally in the browser.

---

## Custom Domain Setup

### Vercel
1. Go to your project settings
2. Add your custom domain
3. Update DNS records as instructed

### Netlify
1. Go to Domain settings
2. Add custom domain
3. Configure DNS

---

## Performance Optimization

### Already Optimized
✅ Vite production build (minified, tree-shaken)
✅ Code splitting
✅ CSS purging via Tailwind
✅ Lazy loading components

### Optional Enhancements
- Enable gzip/brotli compression on your server
- Add CDN caching headers
- Use HTTP/2 or HTTP/3

---

## Browser Compatibility

Blink works on all modern browsers:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

## Monitoring & Analytics

### Add Google Analytics (Optional)

Install:
```bash
npm install react-ga4
```

Add to `src/main.tsx`:
```typescript
import ReactGA from 'react-ga4';

ReactGA.initialize('YOUR_GA_ID');
```

---

## Troubleshooting

### Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Hotkeys don't work
- Check browser permissions
- Ensure no conflicting extensions
- Try different key combination

### LocalStorage full
- Browser limit is ~5-10MB
- Export notes and clear old ones
- Consider implementing auto-cleanup

---

## Security Considerations

✅ No backend = No server vulnerabilities
✅ No user data collection
✅ No third-party tracking
✅ All data stays in browser

### Content Security Policy (Optional)

Add to `index.html`:
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; style-src 'self' 'unsafe-inline';">
```

---

## Backup & Export

Users can export their notes by:
1. Opening browser DevTools (F12)
2. Console tab
3. Run: `localStorage.getItem('blink-notes')`
4. Copy and save the JSON

Future feature: One-click export button.

---

## Support & Maintenance

### Update Dependencies
```bash
npm update
npm audit fix
```

### Check for Breaking Changes
```bash
npm outdated
```

---

## License

MIT License - Free to use, modify, and distribute.

---

**Need help?** Open an issue on GitHub or contact the maintainer.
