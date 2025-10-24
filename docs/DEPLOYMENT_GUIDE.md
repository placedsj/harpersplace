# Deployment Guide for Harper's Place

## Pre-Deployment Checklist

### Environment Setup
- [ ] All environment variables configured in production
- [ ] Firebase project created and configured
- [ ] Production Firebase security rules deployed
- [ ] API keys generated and secured
- [ ] Domain name configured (if applicable)
- [ ] SSL certificate obtained (usually automatic with Vercel/Netlify)

### Code Quality
- [ ] All tests passing
- [ ] TypeScript compilation successful (`npm run typecheck`)
- [ ] No ESLint errors (`npm run lint`)
- [ ] Build completes successfully (`npm run build`)
- [ ] All dependencies up to date
- [ ] No security vulnerabilities (`npm audit`)

### Security
- [ ] Security headers configured in next.config.ts
- [ ] Environment validation implemented
- [ ] Input sanitization applied to all user inputs
- [ ] Rate limiting implemented for sensitive endpoints
- [ ] Error boundaries in place
- [ ] Proper authentication flow tested
- [ ] Firebase security rules reviewed and tested

### Performance
- [ ] Images optimized and using Next.js Image component
- [ ] Code splitting implemented where appropriate
- [ ] Lazy loading for heavy components
- [ ] Bundle size analyzed and optimized
- [ ] Performance testing completed

### Accessibility
- [ ] All forms have proper labels
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Color contrast meets WCAG AA standards
- [ ] Focus indicators visible
- [ ] Alt text for all images

## Deployment Steps

### Option 1: Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all variables from `.env.example`:
     ```
     NEXT_PUBLIC_FIREBASE_API_KEY=your_key
     NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
     NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
     NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_bucket
     NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
     NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
     GEMINI_API_KEY=your_gemini_key
     ```

3. **Configure Build Settings**
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Install Command: `npm install --legacy-peer-deps`
   - Node Version: 18.x or higher

4. **Deploy Production**
   ```bash
   vercel --prod
   ```

### Option 2: Firebase Hosting

1. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login to Firebase**
   ```bash
   firebase login
   ```

3. **Initialize Firebase Hosting**
   ```bash
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to `out`
   - Configure as single-page app: No
   - Set up automatic builds with GitHub: Optional

4. **Update Build Scripts**
   Add to package.json:
   ```json
   "scripts": {
     "export": "next build && next export",
     "deploy": "npm run export && firebase deploy --only hosting"
   }
   ```

5. **Deploy**
   ```bash
   npm run deploy
   ```

### Option 3: Netlify

1. **Install Netlify CLI**
   ```bash
   npm install -g netlify-cli
   ```

2. **Login to Netlify**
   ```bash
   netlify login
   ```

3. **Initialize Site**
   ```bash
   netlify init
   ```

4. **Configure Build Settings**
   Create `netlify.toml`:
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"
   
   [[plugins]]
     package = "@netlify/plugin-nextjs"
   
   [build.environment]
     NODE_VERSION = "18"
   ```

5. **Deploy**
   ```bash
   netlify deploy --prod
   ```

## Post-Deployment Checklist

### Verification
- [ ] Site loads correctly at production URL
- [ ] All pages accessible
- [ ] Authentication flow works
- [ ] Database operations successful
- [ ] File uploads working
- [ ] Email notifications sent (if applicable)
- [ ] Mobile responsiveness verified
- [ ] Cross-browser testing completed

### Monitoring Setup
- [ ] Error tracking configured (Sentry, LogRocket, etc.)
- [ ] Analytics configured (Google Analytics, etc.)
- [ ] Uptime monitoring enabled
- [ ] Performance monitoring active
- [ ] Security monitoring in place

### Documentation
- [ ] Production URL documented
- [ ] Admin credentials secured
- [ ] Deployment process documented
- [ ] Rollback procedure documented
- [ ] Support contacts updated

## Environment Variables Reference

### Required Variables
```bash
# Firebase Configuration (Public - can be exposed to client)
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Optional: Google Gemini AI (Server-side only)
GEMINI_API_KEY=

# Optional: Service Account for Admin SDK
FIREBASE_SERVICE_ACCOUNT_KEY=
```

### Finding Firebase Config Values

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project Settings
4. Scroll down to "Your apps"
5. Click on your web app
6. Copy the configuration values

### Getting Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and securely store the key

## Firebase Security Rules

### Firestore Rules
Deploy these rules to Firebase:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId}/{document=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Shared data (with proper access control)
    match /shared/{documentId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        resource.data.participants.hasAny([request.auth.uid]);
    }
  }
}
```

### Storage Rules
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // User-specific folders
    match /users/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // File size limit: 10MB
    match /{allPaths=**} {
      allow write: if request.resource.size < 10 * 1024 * 1024;
    }
  }
}
```

## Rollback Procedure

### Quick Rollback (Vercel)
```bash
# List recent deployments
vercel ls

# Rollback to previous deployment
vercel rollback [deployment-url]
```

### Quick Rollback (Firebase)
```bash
# List recent deployments
firebase hosting:clone SOURCE_SITE_ID:SOURCE_VERSION TARGET_SITE_ID

# Or use Firebase Console
# Hosting → Release History → Rollback
```

### Emergency Rollback
1. Identify the issue
2. Roll back to last known good deployment
3. Investigate the problem
4. Fix and redeploy

## Performance Optimization

### Before Deployment
```bash
# Analyze bundle size
npm run build
npx @next/bundle-analyzer

# Check lighthouse score
npx lighthouse https://your-site.com --view
```

### Optimization Tips
1. Use Next.js Image component for all images
2. Enable static generation where possible
3. Implement code splitting with dynamic imports
4. Minimize external dependencies
5. Use CDN for static assets
6. Enable compression (Brotli/Gzip)
7. Implement proper caching headers

## Monitoring & Alerts

### Recommended Services
1. **Sentry** - Error tracking
2. **Vercel Analytics** - Performance monitoring
3. **UptimeRobot** - Uptime monitoring
4. **Google Analytics** - User analytics
5. **Firebase Analytics** - Mobile & web analytics

### Key Metrics to Monitor
- Error rate
- Response times
- Page load times
- Authentication success rate
- Database query performance
- Storage usage
- API rate limits

## Troubleshooting Common Issues

### Build Fails
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install --legacy-peer-deps
npm run build
```

### Environment Variables Not Working
- Ensure variables are prefixed with `NEXT_PUBLIC_` for client-side access
- Restart dev server after adding variables
- Check Vercel/Netlify dashboard for proper configuration
- Verify no typos in variable names

### Firebase Connection Issues
- Verify Firebase config is correct
- Check Firebase project is active
- Ensure billing is enabled (required for some features)
- Verify security rules allow your operations

### Performance Issues
- Check bundle size and optimize
- Enable caching properly
- Use CDN for static assets
- Implement lazy loading
- Optimize images

## Security Considerations

### Before Going Live
1. Review all Firebase security rules
2. Ensure all API keys are secured
3. Enable rate limiting
4. Set up monitoring for suspicious activity
5. Implement proper error handling (no sensitive data in errors)
6. Enable HTTPS-only (enforced by most platforms)
7. Configure CORS properly
8. Implement CSP headers

### Regular Maintenance
- Update dependencies monthly
- Run security audits weekly
- Review access logs regularly
- Monitor for unusual activity
- Keep Firebase SDK updated
- Rotate API keys quarterly

## Support & Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Firebase: https://firebase.google.com/docs
- Vercel: https://vercel.com/docs
- Harper's Place Guide: See `docs/NEW_BRUNSWICK_GUIDE.md`

### Community
- Next.js Discord
- Firebase Slack
- GitHub Issues

### Getting Help
1. Check documentation first
2. Search existing issues
3. Ask in community forums
4. Contact support if needed

---

**Last Updated**: October 2025
**Review Before Each Deployment**: Yes
**Keep Updated**: As deployment process evolves
