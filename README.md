# Harper's Place 🏡

**Child-Centered Co-Parenting & Family Management Platform**

Harper's Place is a comprehensive, secure web application that puts your child's emotional well-being and best interests at the center of every co-parenting decision. Built with Next.js, Firebase, and AI-powered features, it provides court-ready documentation, professional communication tools, and child-focused family management.

## 🌟 **Live Preview**
🚀 **[View Harper's Place Live](https://harpersplace.vercel.app)** *(Deploying soon)*

## 👶 **Child-First Approach**
Every feature is designed to prioritize your child's emotional safety, stability, and well-being above all else.

## ✨ Key Features

### 🗓️ Smart Calendar & Scheduling
- Shared custody calendar with conflict detection
- Medical appointment tracking
- School event integration
- Automatic reminders for both parents
- AI-powered schedule optimization

### 👶 Child Development Tracking
- Milestone documentation with photos
- Daily activity logging (feedings, sleep, diapers)
- Growth charts and health records
- Medical history tracking
- Sleep pattern analysis

### 💰 Financial Transparency (Harper's Fund)
- Track all child-related expenses
- Transparent contribution records
- AI-powered expense categorization
- Receipt storage
- Generate reports for records or court

### 💬 Communication Tools
- Secure parent-to-parent messaging
- AI Communication Coach
- Evidence logging for important conversations
- Professional communication templates

### 📝 Memory Keeping
- Digital journal with multimedia support
- Milestone celebrations
- Photo and video storage
- Private or shared entries

### 🤖 AI-Powered Features
- Expense categorization
- Schedule optimization
- Communication improvement
- Sleep schedule suggestions
- Document analysis

## 🚀 **Quick Start & Deployment**

### Local Development
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5000
```

### Deploy to Vercel (Recommended)
1. Push to GitHub (already done! ✅)
2. Visit [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. In **Project Settings → Environment Variables**, add the variables listed in `.env.example`
5. Deploy automatically!

## 🎯 **Interactive Features**

### **📱 Communication Platform Demo**
- Live cost calculator with sliders
- Functional video call simulator  
- Child welfare metrics dashboard
- Development timeline visualization

### **🤖 AI-Powered Child Protection**
- Communication tone analysis for child safety
- Expense categorization prioritizing child needs
- Document analysis for child-relevant information
- Conflict resolution and emotional safety features

### 🔒 Enterprise-Grade Security
- Bank-level encryption
- HTTPS-only connections
- Input sanitization (XSS/injection protection)
- Secure authentication with Firebase Auth
- Role-based access controls
- Regular security audits
- WCAG 2.1 AA accessibility compliance

## 🚀 Quick Start

### For Users
1. Visit the application
2. Create an account
3. Set up your profile
4. Start tracking!

See [QUICK_START.md](docs/QUICK_START.md) for a detailed 5-minute setup guide.

### For Developers

#### Prerequisites
- Node.js 18.x or higher
- npm or yarn
- Firebase account
- Google Gemini API key (optional, for AI features)

#### Installation

```bash
# Clone the repository
git clone https://github.com/placedsj/harpersplace.git
cd harpersplace

# Install dependencies
npm install --legacy-peer-deps

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev

# Open http://localhost:5000
```

#### Environment Variables

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_firebase_app_id
GEMINI_API_KEY=your_gemini_api_key (optional)
```

See [DEPLOYMENT_GUIDE.md](docs/DEPLOYMENT_GUIDE.md) for detailed setup instructions.

## 📚 Documentation

- **[Quick Start Guide](docs/QUICK_START.md)** - Get started in 5 minutes
- **[New Brunswick Family Guide](docs/NEW_BRUNSWICK_GUIDE.md)** - Comprehensive user documentation
- **[Security Checklist](docs/SECURITY_CHECKLIST.md)** - Security best practices and compliance
- **[Deployment Guide](docs/DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[Setup Guide](HARPERS_PLACE_SETUP.md)** - Google Drive automation setup

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6
- **Authentication**: Firebase Auth
- **Database**: Cloud Firestore
- **Storage**: Firebase Storage
- **AI**: Google Gemini (via Genkit)
- **UI**: React 18 + Tailwind CSS + Radix UI
- **Forms**: React Hook Form + Zod validation
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready (also supports Firebase Hosting)

## 🔒 Security Features

- ✅ Zero npm security vulnerabilities
- ✅ HTTPS-only with HSTS enabled
- ✅ XSS and injection protection
- ✅ Clickjacking protection
- ✅ MIME sniffing protection
- ✅ Strong password requirements (8+ chars, mixed case, numbers)
- ✅ Input sanitization on all user inputs
- ✅ Rate limiting utilities
- ✅ Environment variable validation
- ✅ Error boundaries for graceful failures
- ✅ Secure session management

## ♿ Accessibility

- ✅ WCAG 2.1 AA compliant
- ✅ Screen reader compatible
- ✅ Full keyboard navigation
- ✅ Proper ARIA labels
- ✅ Focus indicators
- ✅ Color contrast verified
- ✅ Responsive text sizing

## 🧪 Development

```bash
# Type checking
npm run typecheck

# Linting
npm run lint

# Build for production
npm run build

# Start production server
npm start

# Run Genkit AI tools (dev mode)
npm run genkit:dev
```

## 📦 Project Structure

```
harpersplace/
├── docs/                    # Comprehensive documentation
│   ├── NEW_BRUNSWICK_GUIDE.md
│   ├── SECURITY_CHECKLIST.md
│   ├── DEPLOYMENT_GUIDE.md
│   └── QUICK_START.md
├── src/
│   ├── ai/                  # AI flows and Genkit integration
│   │   └── flows/          # AI-powered features
│   ├── app/                # Next.js app router
│   │   ├── (auth)/        # Authentication pages
│   │   └── (main)/        # Main application pages
│   ├── components/         # React components
│   │   ├── ui/            # Reusable UI components
│   │   ├── error-boundary.tsx
│   │   └── loading-state.tsx
│   ├── firebase/           # Firebase configuration
│   ├── hooks/              # Custom React hooks
│   └── lib/                # Utility functions
│       ├── accessibility.ts
│       ├── performance.ts
│       ├── input-sanitization.ts
│       └── env-validation.ts
├── next.config.ts          # Next.js configuration
├── tailwind.config.ts      # Tailwind CSS configuration
└── package.json
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- Follow TypeScript best practices
- Write accessible, semantic HTML
- Use Tailwind CSS for styling
- Add proper error handling
- Include JSDoc comments for complex functions
- Test thoroughly before submitting

## 📄 License

This project is proprietary software owned by Harper's Place.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Powered by [Firebase](https://firebase.google.com/)
- AI features by [Google Gemini](https://deepmind.google/technologies/gemini/)
- UI components from [Radix UI](https://www.radix-ui.com/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

## 📞 Support

- 📧 Email: support@harpersplace.app
- 📖 Documentation: [docs/](docs/)
- 🐛 Issues: [GitHub Issues](https://github.com/placedsj/harpersplace/issues)

---

**Made with ❤️ for New Brunswick families**

*Harper's Place - Where families come together, even when apart.*
