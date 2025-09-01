# GitHub Deployment Instructions for GreetMe

## Step-by-Step Guide to Publish to GitHub Repository "Ranbosai"

### Prerequisites
1. Ensure you have Git installed on your system
2. Have a GitHub account with access to the "Ranbosai" repository
3. Have your GitHub credentials ready (username/token)

### Step 1: Initialize Git Repository (if not already done)
```bash
# Navigate to your project root directory
cd /project/sandbox/user-workspace

# Initialize git repository
git init

# Add the remote repository (replace with your actual repository URL)
git remote add origin https://github.com/Ranbosai/greetme.git
# OR if using SSH:
# git remote add origin git@github.com:Ranbosai/greetme.git
```

### Step 2: Stage All Files
```bash
# Add all files to staging area
git add .

# Check what files are staged
git status
```

### Step 3: Create Initial Commit
```bash
# Create your first commit with a descriptive message
git commit -m "Initial commit: GreetMe social media application

- Complete Next.js 15 frontend with TypeScript
- Express.js backend with authentication
- User registration, login, and email verification
- Responsive UI with Tailwind CSS and shadcn/ui
- Database schema and API endpoints
- Testing setup with Jest and React Testing Library
- Fixed hydration errors and optimized performance
- Production-ready architecture"
```

### Step 4: Push to GitHub
```bash
# Push to main branch (or master if that's your default)
git branch -M main
git push -u origin main
```

### Alternative: If Repository Already Exists
If the repository already has content, you might need to pull first:
```bash
# Pull existing content (if any)
git pull origin main --allow-unrelated-histories

# Then push your changes
git push origin main
```

### Step 5: Verify Upload
1. Go to https://github.com/Ranbosai/greetme
2. Verify all files are uploaded correctly
3. Check that README.md displays properly
4. Ensure .gitignore is working (node_modules should not be uploaded)

## Files That Will Be Published

### Frontend Files
- `src/app/` - All Next.js pages and components
- `src/components/ui/` - All shadcn/ui components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions
- `package.json` - Frontend dependencies
- `next.config.ts` - Next.js configuration
- `tailwind.config.ts` - Tailwind CSS configuration
- `tsconfig.json` - TypeScript configuration

### Backend Files
- `backend/src/` - Express.js server code
- `backend/database/` - Database schema
- `backend/package.json` - Backend dependencies
- `backend/tsconfig.json` - Backend TypeScript config

### Configuration Files
- `README.md` - Comprehensive project documentation
- `.gitignore` - Git ignore rules
- `components.json` - shadcn/ui configuration
- `eslint.config.mjs` - ESLint configuration
- `postcss.config.mjs` - PostCSS configuration

### Documentation
- `plan.md` - Development plan and testing strategy
- `TODO.md` - Task tracking
- `DEPLOYMENT_INSTRUCTIONS.md` - This file

## Expected Repository Structure After Upload
```
Ranbosai/greetme/
├── README.md
├── .gitignore
├── package.json
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── components.json
├── eslint.config.mjs
├── postcss.config.mjs
├── plan.md
├── TODO.md
├── DEPLOYMENT_INSTRUCTIONS.md
├── public/
│   ├── *.svg files
├── src/
│   ├── app/
│   │   ├── page.tsx
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── home/page.tsx
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── verify/page.tsx
│   ├── components/ui/
│   │   ├── *.tsx (45+ components)
│   │   └── *.test.tsx (test files)
│   ├── hooks/
│   │   └── use-mobile.ts
│   └── lib/
│       └── utils.ts
└── backend/
    ├── package.json
    ├── tsconfig.json
    ├── database/
    │   └── schema.sql
    └── src/
        ├── index.ts
        ├── db/
        │   ├── db.ts
        │   ├── memory-db.ts
        │   └── sqlite.ts
        ├── routes/
        │   └── auth.ts
        └── utils/
            └── email.ts
```

## Troubleshooting

### If you get authentication errors:
1. Use GitHub Personal Access Token instead of password
2. Configure Git credentials:
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

### If repository URL is wrong:
```bash
# Check current remote
git remote -v

# Update remote URL
git remote set-url origin https://github.com/Ranbosai/greetme.git
```

### If you need to force push (use carefully):
```bash
git push --force-with-lease origin main
```

## Post-Upload Checklist
- [ ] All source code files uploaded
- [ ] README.md displays correctly
- [ ] Package.json files present for both frontend and backend
- [ ] .gitignore working (no node_modules uploaded)
- [ ] Repository is public/private as desired
- [ ] All documentation files included

## Next Steps After Upload
1. Set up GitHub Actions for CI/CD (optional)
2. Configure branch protection rules
3. Add collaborators if needed
4. Set up issue templates
5. Configure GitHub Pages for documentation (optional)

---

**Note**: Make sure to replace `https://github.com/Ranbosai/greetme.git` with your actual repository URL if different.
