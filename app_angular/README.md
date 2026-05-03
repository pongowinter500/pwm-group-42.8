# CodeMaster (PWM Group 42.8)

**CodeMaster** is a modern web platform for managing and delivering computer science courses, developed with Angular and Firebase. The project offers authentication, course management, user roles (admin/student), course enrollment, and a responsive interface.

---

## Project Structure

```
pwm-group-42.8/
│
├── README.md
├── app_angular/
│   ├── angular.json
│   ├── package.json
│   ├── README.md
│   ├── src/
│   │   ├── index.html
│   │   ├── main.ts
│   │   ├── styles.css
│   │   └── app/
│   │       ├── app.config.ts
│   │       ├── app.css
│   │       ├── app.html
│   │       ├── app.routes.ts
│   │       ├── app.ts
│   │       ├── models/
│   │       │   └── course.model.ts
│   │       ├── services/
│   │       │   ├── auth.service.ts
│   │       │   └── course.service.ts
│   │       ├── guards/
│   │       │   └── auth.guard.ts
│   │       ├── pages/
│   │       │   ├── home/
│   │       │   │   ├── home.component.ts / .html / .css
│   │       │   ├── course-detail/
│   │       │   │   ├── course-detail.component.ts / .html / .css
│   │       │   ├── about/
│   │       │   │   ├── about.component.ts / .html / .css
│   │       │   ├── business/
│   │       │   │   ├── business.component.ts / .html / .css
│   │       │   ├── login/
│   │       │   │   ├── login.component.ts / .html / .css
│   │       ├── shared/
│   │       │   └── components/
│   │       │       ├── header/
│   │       │       │   ├── header.component.ts / .html / .css
│   │       │       └── footer/
│   │       │           ├── footer.component.ts / .html / .css
│   ├── public/
│   │   └── assets/
│   │       ├── images/
│   │       └── data/
│   │           ├── content.json
│   │           └── users.json
│   └── environments/
│       ├── environment.prod.ts
│       └── environment.ts
├── css/ (legacy styles)
├── figma_mockups/ (design mockups)
└── images/
```

---

## Main Folders Description

- **src/app/models/**  
  Defines TypeScript interfaces for main data (Course, Instructor, ContentData, etc).

- **src/app/services/**  
  Contains Angular services for business logic and Firebase integration:
  - `auth.service.ts`: Authentication and user profile management.
  - `course.service.ts`: Course CRUD, data loading, enrollments.

- **src/app/guards/**  
  Contains route guards for authentication and role-based protection.

- **src/app/pages/**  
  Contains the main application pages:
  - `home/`: Landing page, course catalog, admin form.
  - `course-detail/`: Course detail, enrollment, edit/delete (admin).
  - `about/`, `business/`, `login/`: Info and login pages.

- **src/app/shared/components/**  
  Reusable components like header and footer.

---

## Key Files and Functions

### 1. **Data Model (`models/course.model.ts`)
Defines the main data structures:
- `Course`: All course fields (id, name, description, instructor, etc).
- `Instructor`, `ContentData`, `Feature`, etc.

### 2. **Services**

#### `services/auth.service.ts`
- **login(email, password)**: User login with Firebase.
- **register(email, password, role)**: Registration and profile creation in Firestore.
- **logout()**: User logout.
- **checkAuthStatus()**: Real-time authentication state sync.
- **getUserProfileFromFirestore(email)**: Fetches user profile from Firestore.

#### `services/course.service.ts`
- **loadAllContent()**: Loads courses, instructors, and static data from Firestore.
- **loadCourses()**: Loads all courses, normalizes assets, assigns id.
- **createCourse(course)**: Creates a new course in Firestore.
- **updateCourse(course)**: Updates an existing course.
- **deleteCourse(courseName)**: Deletes a course.
- **isEnrolled(userId, courseId)**: Checks enrollment.
- **enrollCourse(userId, courseId)**: Enrolls a student.
- **disenrollCourse(userId, courseId)**: Unenrolls a student.
- **getStudentCourses(userId)**: Returns courses the user is enrolled in.

### 3. **Pages**

#### `pages/home/home.component.ts`
- **newCourses$ / catalogueCourses$**: Streams for slider and catalog.
- **userRole$**: User role (admin/student).
- **submitNewCourse()**: Handles new course creation (admin).
- **deleteCourse(course)**: Deletes course (admin).

#### `pages/course-detail/course-detail.component.ts`
- **course**: Current course data.
- **userRole$ / isAuthenticated$**: Streams for permissions and visibility.
- **enrollCourse() / disenrollCourse()**: Enrollment/unenrollment.
- **deleteCourse()**: Deletes course (admin).
- **toggleEditMode() / saveCourse()**: Edit course (admin).

### 4. **Shared Components**

#### `shared/components/header/header.component.ts`
- **userRole$, isAuthenticated$, currentUser$**: Streams for menu and actions visibility.
- **logout()**: Quick logout from user menu.

#### `shared/components/footer/footer.component.ts`
- Static footer with links and info.

---

## Main Features

- **Firebase Authentication**: Login, registration, role management.
- **Course Management**: CRUD, enrollment/unenrollment, admin/student visibility.
- **Firestore**: All persistent data (courses, users, enrollments).
- **Responsive UI**: Mobile-first layout, slider, dynamic modules.
- **Roles**: Admin can create/edit/delete courses, student can enroll.
- **Clean Code**: Uses async pipe, BehaviorSubject, RxJS, standalone modules.

---

## How to Start the Project

1. Install dependencies:
   ```
   npm install
   ```
2. Start the development server:
   ```
   ng serve
   ```
3. Go to [http://localhost:4200](http://localhost:4200)

---

## Final Notes

- All CRUD operations are protected by authentication and role.
- Data is synced in real time via Firestore.
- The code is modular and easily extendable.

For details on each function or file, see the inline comments in the TypeScript files.
