# CodeMaster

Online platform for computer science courses developed by **Group 42.8**.

## Team
- **Alberto Federici**
- **Andrea Pedrini**
- **Daniel Radoi**

## Description
WebMaster is an interactive web platform offering computer science courses across various technology areas. The project features a modern, responsive interface with a modular architecture.

## Project Structure

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

**User Interface**
- Modern, professional design
- Responsive layout for mobile and desktop
- Sticky navigation with hover effects
- Search bar

**Course Catalogue**
- Slider-style course display
- Detail pages for each course
- Instructor and curriculum information

**Modular Architecture**
- Reusable HTML components (header, footer)
- Modular CSS for easy maintenance
- Dynamic module loading system
- Custom themes per course

**Access System**
- Dedicated login page
- Business section for companies

## Technologies Used
- HTML5
- CSS3 (modular architecture)
- JavaScript (dynamic component loading)

## JavaScript Functionality

**`module-loader.js`** - Core functionality script that provides:

**Dynamic Module Loading**
- Automatically loads HTML components (header, footer, course sections) into pages using the `data-include-html` attribute
- Uses the Fetch API to load external HTML files asynchronously
- Replaces placeholder elements with loaded content seamlessly

**Course Data Population**
- Populates course detail pages using the `courseData` object defined in each course page
- Maps data attributes to course-specific information (title, instructor, topics, etc.)
- Dynamically generates course content from JavaScript objects for easy maintenance

**Navigation Management**
- Automatically highlights the active navigation link based on the current page URL
- Adds the `.active` class to the corresponding navigation item

All functions execute automatically on page load via the `DOMContentLoaded` event.

## Getting Started
Open `index.html` in the browser to access the platform's landing page. 
