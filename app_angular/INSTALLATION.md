# CodeMaster Angular - Installation Guide

## Prerequisites

Before you begin, ensure you have installed:
- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Angular CLI** (optional but recommended): `npm install -g @angular/cli`

## Quick Start

### Option 1: Using Setup Script (Recommended)

#### On macOS/Linux:
```bash
cd app_angular
chmod +x setup.sh
./setup.sh
npm install
npm start
```

#### On Windows:
```bash
cd app_angular
setup.bat
npm install
npm start
```

### Option 2: Manual Setup

If the setup script doesn't work, follow these steps:

#### 1. Copy Data Files
Copy `content.json` from the parent `data/` directory:
```bash
mkdir -p public/data
cp ../data/content.json public/data/
```

#### 2. Copy Images
Copy all images from parent `images/` directory:
```bash
mkdir -p public/assets/images
cp -r ../images/* public/assets/images/  # macOS/Linux
xcopy ..\images public\assets\images\ /E /I /Y  # Windows PowerShell
```

#### 3. Install Dependencies
```bash
npm install
```

#### 4. Start Development Server
```bash
npm start
# or
ng serve
```

The application will be available at **http://localhost:4200**

## File Structure After Setup

```
app_angular/
├── public/
│   ├── assets/
│   │   └── images/          ← Course icons, instructor photos
│   └── data/
│       └── content.json     ← Course data
├── src/
│   ├── app/
│   │   ├── components/      ← Reusable components
│   │   ├── pages/          ← Full-page components
│   │   ├── services/       ← Data services
│   │   ├── models/         ← TypeScript interfaces
│   │   ├── shared/         ← Shared components (Header, Footer)
│   │   ├── app.component.ts
│   │   ├── app.routes.ts
│   │   └── app.css
│   ├── environments/       ← Environment configuration
│   ├── styles.css         ← Global styles
│   └── main.ts            ← Application entry point
├── angular.json           ← Angular CLI config
├── package.json
└── tsconfig.json
```

## Common Commands

### Development
```bash
# Start development server (single process)
npm start

# Start with advanced options
ng serve --open --port 4200

# Watch for changes and rebuild
ng serve --poll 2000
```

### Building
```bash
# Build for production
npm run build
# or
ng build --configuration production

# Build and opening the output
ng build --open
```

### Testing
```bash
# Run unit tests
npm test
# or
ng test

# Run tests with code coverage
ng test --code-coverage

# Run tests once (CI mode)
ng test --watch=false
```

### Linting
```bash
# Lint the codebase
ng lint
```

## Data Loading

The application uses a two-stage data loading system:

1. **data-loader.js** - Preloads `content.json` on page load
2. **CourseService** - Reads from cached data window object

### How It Works:
- The `index.html` includes `data-loader.js` script before Angular bootstrap
- The script fetches `public/data/content.json` and stores it in `window.__PWM_COURSES_CACHE`
- `CourseService` reads from this cache on initialization
- Components subscribe to Observable streams from `CourseService`

### To Update Course Data:
1. Modify or replace `public/data/content.json`
2. Restart the development server (`npm start`)

## Responsive Design

The application is fully responsive with three breakpoints:

| Device | Width Range | Layout |
|--------|-------------|--------|
| Mobile | 0-480px | Single column, touch-optimized |
| Tablet | 481-768px | 2 columns, adjusted spacing |
| Desktop | 769px+ | Full layout with sidebars |

### Testing Responsiveness:
```bash
# In Chrome DevTools
1. Press F12 to open DevTools
2. Click the device toggle (top-left corner)
3. Select different devices or custom dimensions
```

## Environment Configuration

The application supports multiple environments:

### Development (`src/environments/environment.ts`)
- Used when running `ng serve`
- Local data loading from `public/data/content.json`

### Production (`src/environments/environment.prod.ts`)
- Used when running `ng build --configuration production`
- Optimized build with tree-shaking and minification

To switch environments in code:
```typescript
import { environment } from '../environments/environment';

console.log(environment.production); // false (development)
```

## Troubleshooting

### Port Already in Use
If port 4200 is already in use:
```bash
ng serve --port 4300
# Access at http://localhost:4300
```

### data-loader.js Error
If you see "Failed to load resources" errors:
1. Verify `public/data/content.json` exists
2. Check browser console for specific path errors
3. Ensure the file path is correct in `data-loader.js`

### CSS Not Loading
If styles don't appear:
1. Clear Angular cache: `rm -rf .angular/cache`
2. Clear npm cache: `npm cache clean --force`
3. Reinstall: `rm -rf node_modules && npm install`
4. Restart: `npm start`

### Module Not Found Errors
If you see import errors:
1. Check that all required files exist in `src/app/`
2. Verify file names match import statements (case-sensitive on Linux/macOS)
3. Run `npm install` to ensure all dependencies are installed

### Images Not Showing
1. Verify images copied to `public/assets/images/`
2. Check image file names in `content.json` match actual files
3. Verify paths in component templates use correct references

## Performance Tips

1. **Use Production Build for Testing**:
   ```bash
   ng build --configuration production
   ng serve --prod
   ```

2. **Check Bundle Size**:
   ```bash
   ng build --stats-json
   webpack-bundle-analyzer dist/codemaster-angular/stats.json
   ```

3. **Enable Service Worker** (optional):
   - Uncomment `ServiceWorkerModule` in `app.config.ts`
   - Improves offline experience

## Support

For issues or questions:
1. Check the [Angular Documentation](https://angular.io/docs)
2. Review the main [README.md](./README.md)
3. Check project structure in [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)

## Next Steps

1. ✅ Complete the setup steps above
2. 🔍 Verify all pages load correctly
3. 📱 Test responsiveness on different screen sizes
4. 🎨 Verify CSS styling matches original design
5. 🚀 Build for production when ready

Happy coding! 🚀
