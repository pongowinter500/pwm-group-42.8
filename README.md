# CodeMaster

Online platform for computer science courses developed by **Group 42.8**.

## Team
- **Alberto Federici**
- **Andrea Pedrini**
- **Daniel Radoi**

## Description
WebMaster is an interactive web platform offering computer science courses across various technology areas. The project features a modern, responsive interface with a modular architecture.

## Project Requirements
-newest courses section
-login form 
-possibility of searching specific courses
-course catalogue
-section about the platform
-intuitive design 
-possibility for businesses to contact the platform 

### Main Pages
- **`index.html`** - Implements the landing page
- **`html/about.html`** - About/business page
- **`html/business.html`** - About/business page
- **`html/login.html`** - Login page

### Course Pages (Details)
Course details are contained in the `html/courses/` folder.
- **`html/courses/ml.html`** - Machine Learning Bootcamp
- **`html/courses/cybersecurity.html`** - Cybersecurity Fundamentals
- **`html/courses/cloud.html`** - Cloud Computing Essentials
- **`html/courses/fullstack.html`** - Full-Stack Development
- **`html/courses/python.html`** - Python for Beginners
- **`html/courses/database.html`** - Database Design and SQL
- **`html/courses/devops.html`** - DevOps and Docker

### HTML Modules (used only by the landing page, separated for clarity)
- **`html/new_courses.html`** - New courses section with slider
- **`html/catalogue.html`** - Full course catalogue

### HTML Templates
Modular HTML files are grouped under `html/templates/`.
Header and footer are used by every page. 
Course-template is used by all the course detail pages (all the pages inside "courses" directory)
- **`html/templates/header.html`** - Header and navigation
- **`html/templates/footer.html`** - Site footer
- **`html/templates/course-template.html`** - Standardized template for course detail pages

### Resources
- **`figma_mockups/`** - Design mockups in PDF and PNG formats. Only header and footer have a storyboard,
- because they're the only components whose design changed. Pages mockups have the second version (v2) of header and footer because we didn't modify them,
- but in reality the implementation follows the third version (v3) of header and footer
- **`css/`** - Modular style sheets
- **`images/`** - Graphic assets

## Features

### UI/UX Features
**Responsive Design**
- Mobile-first approach with three breakpoints: 481px (tablet), 769px (laptop), 1024px (desktop)
- Optimized layouts for all screen sizes
- Mobile menu with toggle button and keyboard navigation
- Search functionality with mobile toggle

**Modular Architecture**
- Reusable HTML components (header, footer, course sections)
- Modular CSS for easy maintenance with CSS custom properties (variables)
- Dynamic module loading system
- Custom themes per course
- Centralized UI state management (UIState object)

**Interactive Components**
- Mobile navigation menu with slide-out drawer
- Search bar with mobile toggle
- Course slider with previous/next navigation buttons
- Course description dropdowns with expandable content
- Footer menu toggles for mobile/tablet views

**Alternating Layout (Desktop)**
- Course instructor images alternate left-right on desktop view
- Circular instructor images with colored border
- Text and image alignment adjusts responsively

### Authentication & User Management
- **Login System** with HTML5 Constraint Validation
- Email and password validation with custom error messages
- User authentication against `data/users.json`
- Role-based interface modifications (admin/user)
- Authentication state persistence with localStorage
- **Automatic Logout** after 30 minutes of inactivity
- Session tracking with login time storage
- Show/hide password toggle for better UX

**Admin Features**
- Admin users can edit course content inline on course detail pages
- Edit mode activated via "Edit Course" button (visible only to admin users)
- Editable fields include: course title, subtitle, instructor name/title, course descriptions, and topics
- Changes are applied frontend-only (no JSON persistence)
- Admin dashboard banner (red) displays when logged in as admin

### JavaScript Utilities & Functions
**Centralized Configuration**
- `UI_SELECTORS` object - All DOM selectors in one place
- `UIState` object - Global UI state management with methods:
  - `setState(key, value)` - Set state values
  - `isInitialized(id)` - Check if feature is initialized
  - `markInitialized(id)` - Mark feature as initialized

**Reusable Functions**
- `debounce(func, delay)` - Performance optimization for resize events
- `createToggleHandler(toggleSelector, contentSelector, options)` - Factory function for toggle components
  - Supports custom callbacks (onOpen, onClose)
  - Auto-focus on element when opened
  - Keyboard escape key support
  - Click-outside closing
  - ARIA accessibility attributes

**Dynamic Module Processing**
- `loadHTMLModules()` - Dynamically loads external HTML files using `data-include-html` attribute
- `markActiveNav()` - Highlights current page in navigation
- `initSearchToggle()` - Mobile search bar toggle with focus management
- `initMobileMenu()` - Mobile menu with slide animation and keyboard controls
- `initNewCoursesSlider()` - Course slider with pagination buttons
- `initFooterMenus()` - Mobile/tablet footer menu toggles
- `initDescriptionToggle()` - Expandable course descriptions
- `initPasswordToggle()` - Show/hide password in login form
- `initLogoutTimer()` - Auto-logout on inactivity
- `initResponsiveHandlers()` - Resize event management
- `closeAllMobileUI()` - Closes all mobile UI elements at desktop breakpoint

**Authentication & User Interface**
- `handleLogin(event)` - Form submission handler with validation
- `checkAuthStatus()` - Checks authentication status and updates UI
  - Shows authentication banner (green for user, red for admin)
  - Converts login link to logout
  - Handles logout event with localStorage clear

### CSS Features
**CSS Variables System**
- 40+ semantic CSS custom properties for colors, spacing, sizing, and transitions
- Single source of truth for design system
- Organized by category: colors, spacing, sizing, transitions

**Responsive CSS Organization**
- Mobile base styles in individual component files
- Tablet styles (481px) in component files and responsive.css
- Desktop/Laptop styles (769px+) in responsive.css
- Semantic breakpoint organization

**Visual Effects**
- Smooth transitions for interactive elements
- Shake animation for form validation errors
- Box shadows for depth
- Hover effects on buttons and cards

## Technologies Used
- **HTML5** - Semantic markup
- **CSS3** - Modular architecture with custom properties
- **JavaScript (ES6+)** - Dynamic component loading, event handling, state management
- **Fetch API** - Async HTML and JSON loading
- **LocalStorage API** - Session management
- **HTML5 Constraint Validation API** - Form validation

## Data Files

### data/users.json
- Stores user credentials for authentication
- Contains user roles and metadata
- Used for login form validation

### data/content.json
- Stores course content information
- Used for dynamic course data population

## Responsive Breakpoints

| Breakpoint | Resolution | Usage |
|-----------|-----------|-------|
| Mobile | 0-480px | Base mobile styles, full-width layout, column stacking |
| Tablet | 481px-768px | Two-column layouts, medium text sizes |
| Desktop | 769px+ | Full multi-column layouts, large components, alternating image placement |
| Large Desktop | 1024px+ | Extra spacing, maximum content width constraints |

## File Structure

```
pwm-group-42.8/
├── index.html                          # Landing page
├── module-loader.js                    # Core JS functionality (structure, layout, behavior)
├── content-loader.js                   # Content data population (text, images)
├── README.md                           # This file
│
├── css/
│   ├── layout.css                      # Global layout with CSS variables
│   ├── header.css                      # Header and navigation styles
│   ├── footer.css                      # Footer styles
│   ├── login.css                       # Login form styles
│   ├── new-courses.css                 # New courses section styles
│   ├── our-courses.css                 # Course catalogue section styles
│   ├── course-template.css             # Course detail page template styles
│   ├── about.css                       # About page styles
│   ├── business.css                    # Business page styles
│   ├── course-themes.css               # Course-specific color themes
│   └── responsive.css                  # Responsive breakpoints and media queries
│
├── html/
│   ├── about.html                      # About the platform page
│   ├── business.html                   # Business contact/info page
│   ├── catalogue.html                  # Full course catalogue
│   ├── login.html                      # Login form page
│   ├── new_courses.html                # New courses section (homepage)
│   │
│   ├── courses/                        # Detailed course pages
│   │   ├── ml.html                     # Machine Learning Bootcamp
│   │   ├── cybersecurity.html          # Cybersecurity Fundamentals
│   │   ├── cloud.html                  # Cloud Computing Essentials
│   │   ├── fullstack.html              # Full-Stack Development
│   │   ├── python.html                 # Python for Beginners
│   │   ├── database.html               # Database Design and SQL
│   │   └── devops.html                 # DevOps and Docker
│   │
│   └── templates/                      # Reusable HTML components
│       ├── header.html                 # Navigation header (used by all pages)
│       ├── footer.html                 # Footer (used by all pages)
│       └── course-template.html        # Course detail template (used by all course pages)
│
├── data/
│   ├── users.json                      # User credentials and roles for authentication
│   └── content.json                    # Course metadata, instructors, business info, admin config
│
├── images/                             # Graphic assets (icons, instructor photos, etc.)
│
├── figma_mockups_sprint1/              # Initial design mockups (PDF/PNG)
├── figma_mockups_sprint2/              # Updated design mockups (PDF/PNG)
│
└── .git/                               # Version control history
```

## Getting Started
1. Open `index.html` in the browser to access the platform's landing page
2. Use the navigation menu to explore different sections
3. Click "Login" to test the authentication system
   - **Test Credentials**: See `data/users.json` for available user accounts
   - Available roles: `student` (can enroll in courses) and `admin` (can edit course content)
4. Responsive design automatically adapts to your screen size
5. **To test admin features**: Login with an admin account and navigate to any course page
   - Click "Edit Course" button to enter edit mode
   - Editable fields will display with orange borders
   - Changes can be made inline and persist during the session

## Code Quality
- All comments in English for international collaboration
- Semantic HTML for accessibility
- CSS custom properties for maintainability
- Centralized configuration for easy updates
- Event delegation for performance optimization
- Proper error handling and logging 
