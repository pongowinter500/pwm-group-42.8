# CodeMaster Angular Version

## Setup

1. Navigate to the app_angular directory:
```bash
cd app_angular
```

2. Install dependencies:
```bash
npm install
```

3. Copy data and images (if not already linked):
```bash
# Copy content data
cp ../data/content.json public/data/

# Copy images
cp -r ../images/* public/assets/images/
```

## Development

Run the development server:
```bash
npm start
# or
ng serve
```

Navigate to `http://localhost:4200/`

## Build

Build for production:
```bash
npm run build
# or
ng build --configuration production
```

## Project Structure

```
app_angular/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── course-card/
│   │   │   └── footer/
│   │   ├── pages/
│   │   │   ├── about/
│   │   │   ├── business/
│   │   │   ├── course-detail/
│   │   │   ├── home/
│   │   │   └── login/
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   └── course.service.ts
│   │   ├── models/
│   │   │   └── course.model.ts
│   │   ├── shared/
│   │   │   └── components/
│   │   │       └── header/
│   │   ├── app.component.ts
│   │   ├── app.component.css
│   │   ├── app.routes.ts
│   │   └── responsive.css
│   ├── styles.css
│   ├── index.html
│   └── main.ts
├── public/
│   ├── assets/
│   │   └── images/
│   ├── data/
│   │   └── content.json
│   └── data-loader.js
├── angular.json
├── tsconfig.json
├── tsconfig.app.json
└── package.json
```

## Features

- **Responsive Design**: Mobile-first approach with tablet and desktop breakpoints
- **Standalone Components**: Modern Angular with standalone components
- **Routing**: Full navigation between pages
- **Course Management**: Display and filter courses
- **Authentication**: Login page with validation
- **Footer Navigation**: Collapsible menu for mobile

## Pages

- **Home** (`/`): Main page with new courses and full catalogue
- **Catalogue** (`/`): Display all available courses
- **About** (`/about`): Company information and mission
- **Business** (`/business`): Business solutions overview
- **Login** (`/login`): User authentication
- **Course Detail** (`/course/:id`): Detailed course information

## Components

- **Header**: Navigation with responsive menu
- **Footer**: Footer with collapsible navigation
- **CourseCard**: Reusable course display component
- **Home**: Main landing page with slider
- **About**: About page with mission statement
- **Business**: Business enterprise page
- **Login**: Login page with form validation
- **CourseDetail**: Detailed course view

## Services

- **CourseService**: Manages course data and operations
- **AuthService**: Handles authentication

## Styling

All CSS is optimized for responsiveness:
- Mobile First (< 480px)
- Tablet (481px - 768px)
- Desktop/Laptop (769px+)

Global styles are in `src/styles.css` and responsive utilities in `src/app/responsive.css`.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
