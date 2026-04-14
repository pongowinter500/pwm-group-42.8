# ⌨️ CodeMaster Angular - Developer Keyboard Shortcuts & Tips

## 🚀 Essential Commands

### Starting & Stopping

```bash
npm start              # Start dev server (Ctrl+C to stop)
ng serve              # Alternative start command
ng serve --port 4300  # Use different port
ng serve --poll 2000  # Watch mode with polling
```

### Building & Testing

```bash
npm run build         # Production build
npm test              # Run unit tests
npm test --watch=false # Run tests once
ng lint               # Check code quality
```

### Development

```bash
npm install           # Install dependencies
npm update            # Update to latest versions
npm cache clean --force # Clear npm cache
rm -rf node_modules   # Reset dependencies
```

---

## 🖥️ IDE Shortcuts (VS Code)

### File Operations

| Shortcut | Action |
|----------|--------|
| Ctrl+N | New file |
| Ctrl+O | Open file |
| Ctrl+S | Save file |
| Ctrl+Shift+N | New folder |
| Ctrl+K Ctrl+W | Close file |
| Ctrl+` | Toggle terminal |

### Code Navigation

| Shortcut | Action |
|----------|--------|
| Ctrl+P | Quick file open |
| Ctrl+F | Find in file |
| Ctrl+H | Find & replace |
| Ctrl+G | Go to line |
| F12 | Go to definition |
| Shift+F12 | References |
| Ctrl+Shift+O | Go to symbol |

### Code Editing

| Shortcut | Action |
|----------|--------|
| Ctrl+/ | Toggle comment |
| Alt+Up/Down | Move line |
| Shift+Alt+Down | Copy line |
| Ctrl+Shift+K | Delete line |
| Ctrl+L | Select line |
| Ctrl+Shift+L | Multi-cursor |
| Ctrl+D | Select word |

### Formatting

| Shortcut | Action |
|----------|--------|
| Shift+Alt+F | Format document |
| Ctrl+K Ctrl+F | Format selection |
| Tab | Indent |
| Shift+Tab | Outdent |

---

## 🔍 Chrome DevTools (F12)

### Navigation

| Shortcut | Action |
|----------|--------|
| F12 | Open DevTools |
| Ctrl+Shift+C | Element picker |
| Ctrl+Shift+I | Inspect |
| Ctrl+Shift+J | Console |
| Ctrl+Shift+M | Device mode |

### Console

| Shortcut | Action |
|----------|--------|
| Up/Down | History |
| Ctrl+L | Clear console |
| Ctrl+Shift+J | Focus console |

### Debugging

| Shortcut | Action |
|----------|--------|
| F10 | Step over |
| F11 | Step into |
| Shift+F11 | Step out |
| F8 | Resume |
| Ctrl+Shift+D | Toggle breakpoint |

---

## 📁 File Navigation Tips

### Quick Access

```bash
# Navigate to src/app
cd src/app

# Navigate to specific component
cd src/app/pages/home

# Navigate back
cd ..

# Go to root
cd app_angular
```

### File Exploration

```bash
# List files in current directory
ls          # macOS/Linux
dir         # Windows

# List with details
ls -la       # macOS/Linux
dir /s       # Windows

# Find specific files
find . -name "*.component.ts"  # macOS/Linux
dir /s /b *component.ts        # Windows
```

---

## 🔄 Git Commands (If Using Version Control)

### Basic Operations

```bash
git status              # Check status
git add .               # Stage all files
git commit -m "message" # Commit
git push                # Push to remote
git pull                # Pull from remote
```

### Branching

```bash
git branch              # List branches
git checkout -b feature # Create new branch
git checkout main       # Switch branch
git merge feature       # Merge branch
```

---

## 🎯 Terminal Productivity

### Quick Tips

```bash
# Run last command
!!

# Run last command with sudo
sudo !!

# Search command history
Ctrl+R

# Clear screen
clear     # macOS/Linux
cls       # Windows

# Exit terminal
exit
```

### Multi-Command Execution

```bash
# Run multiple commands
npm install && npm start

# Run in sequence
npm install ; npm start

# Run in background
npm start &
```

---

## 🔧 npm Scripts

### Custom Scripts (in package.json)

```bash
npm start               # ng serve
npm test                # ng test
npm run build          # ng build
npm run lint           # ng lint
npm run start:prod     # Production build
```

### Adding Custom Scripts

```json
{
  "scripts": {
    "dev": "ng serve --port 4300",
    "prod": "ng build --prod",
    "watch": "ng build --watch"
  }
}
```

Run with: `npm run dev`

---

## 🐛 Debugging Tips

### Browser Console Logs

```typescript
// Basic logging
console.log(value);

// Table format
console.table(array);

// Performance timing
console.time('label');
// ... code ...
console.timeEnd('label');

// Groups
console.group('Group Name');
console.log('Item 1');
console.groupEnd();

// Warnings & Errors
console.warn('Warning');
console.error('Error');
```

### Chrome DevTools Console Commands

```javascript
// Select element
$('#id')
$('.class')

// Select first/all elements
$('selector')
$$('selector')

// Get element info
$0              // Last selected element
$1, $2, $3      // Previous selections

// Monitor function
monitorEvents($0)
unmonitorEvents($0)

// Break on value change
watch(obj, 'property')

// Measure performance
performance.measure('name')
```

---

## 📊 Performance Profiling

### In Chrome DevTools

1. Open DevTools (F12)
2. Go to "Performance" tab
3. Click record
4. Perform actions
5. Click stop
6. Analyze results

### Angular-Specific

```bash
# Build with stats
ng build --stats-json

# Analyze bundle
webpack-bundle-analyzer dist/*/stats.json
```

---

## 🔍 Search & Replace

### In VS Code

**Find:**
- Ctrl+F - Find
- Enter/Esc - Navigate results
- Ctrl+L - Select all matches

**Replace:**
- Ctrl+H - Open find & replace
- Ctrl+Shift+1 - Replace one
- Ctrl+Alt+Enter - Replace all

### Pattern Tips

```
Search for: \b(TODO|FIXME|BUG)\b  # Regex mode
Replace with: [$1 - Fixed]

Search for: <div class="(.+?)">  # Multiple matches
Replace with: <section class="$1">
```

---

## 🎓 Code Generation

### Generate Components

```bash
# New component
ng generate component my-component
ng g c my-component  # Short form

# Specify location
ng g c components/my-component

# Skip tests
ng g c my-component --skip-tests
```

### Generate Services

```bash
# New service
ng generate service services/my-service
ng g s services/my-service

# Provide in root
ng g s services/my-service --providedIn root
```

### Other Generators

```bash
ng g directive my-directive
ng g pipe my-pipe
ng g interface models/my-model
ng g enum models/my-enum
```

---

## 🚀 Server Management

### Common Ports

```bash
ng serve --port 4200   # Default
ng serve --port 4300   # Alternative
ng serve --port 3000   # Another option
ng serve --port 8080   # Yet another
```

### Public Host

```bash
ng serve --host 0.0.0.0 --port 4200
# Access from other machines: http://your-ip:4200
```

### Disable Browser Auto-Open

```bash
ng serve --open=false
```

---

## 📱 Device Testing

### Responsive Design Mode

In Chrome DevTools:
- Ctrl+Shift+M - Toggle device mode
- Pick preset devices
- Or set custom size

### Testing Common Sizes

```
iPhone 12:      390 × 844
iPad:           768 × 1024
Desktop:        1920 × 1080
Tablet:         800 × 600
```

---

## 🎯 TypeScript Tips

### Compile Check

```bash
# Check for TypeScript errors
npx tsc --noEmit

# In VS Code: Ctrl+Shift+B configure tasks
```

### Strict Mode Tips

```typescript
// Strict null checking
const name: string | null = getValue();
if (name) {
  console.log(name.toUpperCase());
}

// Strict property initialization
name!: string;  // Non-null assertion

// optional chaining
obj?.property?.method();
```

---

## 🔄 Workflow Optimization

### Fast Development Loop

1. Start dev server: `npm start`
2. Keep Chrome open with app
3. Make code changes
4. File saves automatically
5. See changes in browser immediately
6. Fix any issues
7. Repeat

### Pre-commit Checklist

```bash
# Before committing code:
npm run lint      # Check for issues
npm test          # Run tests
npm run build     # Try production build
```

---

## 💪 Pro Tips

### Productive Shortcuts

**VS Code:**
- Ctrl+K Ctrl+0 - Fold all code
- Ctrl+K Ctrl+J - Unfold all code
- Ctrl+Shift+P - Command palette
- F2 - Rename symbol

**Chrome DevTools:**
- Ctrl+Shift+P - Command palette
- $_ - Last console result
- copy() - Copy to clipboard

**Angular:**
- ng serve -o - Auto-open in browser
- --poll 2000 - File change detection
- --aot - Ahead-of-time compilation

---

## 🆘 Emergency Commands

### When Nothing Works

```bash
# Full reset
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm start
```

### Clear All Caches

```bash
# Angular cache
rm -rf .angular/cache

# npm cache
npm cache clean --force

# Clear browser cache
# In browser: Ctrl+Shift+Delete
```

---

## 📝 Notes & Reminders

### Keep a Cheat Sheet

Create a `commands.md` file:
```markdown
# My Personal Commands

## Start Dev
npm start

## Quick Tests
npm test

## Deploy
npm run build
```

### Useful npm Aliases

Add to `.zshrc` or `.bashrc`:
```bash
alias ns='npm start'
alias ni='npm install'
alias nb='npm run build'
alias nt='npm test'
```

Then just type: `ns` instead of `npm start`

---

## 🎓 Resources

### Angular CLI Docs
```
ng help                 # Show all commands
ng serve --help        # Specific command help
```

### Online Tools
- [Angular CLI Docs](https://angular.io/cli)
- [npm Scripts](https://docs.npmjs.com/cli/run-script)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)

---

## ⏱️ Time-Saving Tips

### Estimated Time Savings

| Task | Manual | Shortcut | Saved |
|------|--------|----------|-------|
| Find file | 30s | Ctrl+P (5s) | 25s |
| Replace text | 1m | Ctrl+H (10s) | 50s |
| Go to line | 1m | Ctrl+G (5s) | 55s |
| Format code | 2m | Shift+Alt+F (10s) | 1m50s |

**Total: ~5 minutes per hour of development!**

---

**Remember:** The more shortcuts you learn, the faster you'll code! 🚀

Keep practicing and you'll be a keyboard warrior in no time! ⌨️💪
