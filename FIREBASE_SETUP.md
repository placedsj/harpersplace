# 🔥 Firebase Setup Guide for Harper's Place

## Current Status
Harper's Place is running in **demo mode** without Firebase. All features work, but data is stored locally in the browser and will be lost when you clear your cache.

## To Enable Full Features (Authentication & Cloud Storage)

### Step 1: Create a Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name it "harpers-place" (or whatever you prefer)
4. Disable Google Analytics (not needed for personal use)
5. Click "Create project"

### Step 2: Register Your Web App
1. In your Firebase project, click the **Web icon** (</>)
2. Register app nickname: "Harper's Place Web"
3. **Copy the configuration values** shown

### Step 3: Enable Authentication
1. In Firebase Console, go to **Build → Authentication**
2. Click "Get started"
3. Enable **Email/Password** sign-in method
4. Click "Save"

### Step 4: Enable Firestore Database
1. In Firebase Console, go to **Build → Firestore Database**
2. Click "Create database"
3. Start in **test mode** (you can secure it later)
4. Choose a location close to you (e.g., `us-central` for USA)
5. Click "Enable"

### Step 5: Configure Your App
1. In your project folder, create a file named `.env.local`
2. Copy the contents from `.env.local.example`
3. Fill in your Firebase configuration values from Step 2
4. Save the file

### Step 6: Restart the Dev Server
```powershell
# Stop the current server (Ctrl+C in terminal)
npm run dev
```

## What Works in Demo Mode
✅ All UI features and navigation
✅ Dashboard and layout
✅ Local data storage (browser only)
✅ All forms and interactions

## What Requires Firebase
🔒 User authentication (sign up/login)
☁️ Cloud data storage (sync across devices)
👥 Multi-user family sharing
📊 Persistent data (survives browser clear)

## For Personal/Family Use
If you just want to try it out locally, **demo mode works perfectly!** You can set up Firebase later when you're ready to share with family or use across devices.

## Need Help?
- [Firebase Documentation](https://firebase.google.com/docs/web/setup)
- [Firebase Console](https://console.firebase.google.com/)
