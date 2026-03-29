/**
 * Content Loader - Dynamically loads content from content.json
 * Works together with module-loader.js to populate HTML elements with data from JSON
 */

// Cache for loaded data
let contentData = null;
let isAdminEditMode = false;

// Map for file names that don't match the courseName
const COURSE_FILE_NAME_MAP = {
    'cyber': 'cybersecurity'
};

const DEFAULT_ADMIN_EDITABLE_SELECTORS = [
    '[data-course-title]',
    '[data-course-subtitle]',
    '[data-course-instructor-name]',
    '[data-course-instructor-title]',
    '[data-course-section1-text]',
    '[data-course-topics] li'
];

/**
 * Reads from JSON the selectors editable by admin.
 * If not present or not valid, uses the local fallback.
 */
function getAdminEditableSelectors() {
    const selectors = contentData?.frontendConfig?.adminEditableSelectors;

    if (Array.isArray(selectors) && selectors.length > 0) {
        return selectors;
    }

    return DEFAULT_ADMIN_EDITABLE_SELECTORS;
}

/**
 * Loads the content.json file
 */
async function loadContentData() {
    if (contentData) return contentData;
    
    try {
        const response = await fetch('data/content.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        contentData = await response.json();
        return contentData;
    } catch (error) {
        console.error('Error loading content.json:', error);
        return null;
    }
}

/**
 * Finds a course by name or ID
 */
function getCourse(identifier) {
    if (!contentData || !contentData.courses) return null;
    
    if (typeof identifier === 'number') {
        return contentData.courses.find(c => c.id === identifier);
    }
    return contentData.courses.find(c => c.courseName === identifier);
}

/**
 * Finds an instructor by ID
 */
function getInstructor(instructorId) {
    if (!contentData || !contentData.instructors) return null;
    return contentData.instructors.find(i => i.id === instructorId);
}

/**
 * Populates elements with data-content-type attribute
 * Examples:
 * - data-content-type="about.hero.title"
 * - data-content-type="business.hero.description"
 * - data-content-type="siteInfo.name"
 */
function populateContentElements() {
    if (!contentData) return;
    
    const elements = document.querySelectorAll('[data-content-type]');
    
    elements.forEach(element => {
        const path = element.getAttribute('data-content-type');
        const value = getNestedValue(contentData, path);
        
        if (value !== undefined && value !== null) {
            if (element.tagName === 'IMG') {
                element.src = value;
                element.alt = element.alt || value;
            } else if (element.tagName === 'A' && path.includes('Email')) {
                element.href = `mailto:${value}`;
                element.textContent = value;
            } else {
                element.textContent = value;
            }
        }
    });
}

/**
 * Gets a value from an object using a dot notation path
 * E.g.: "about.hero.title" -> contentData.about.hero.title
 */
function getNestedValue(obj, path) {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

/**
 * Populates courses on the catalogue or new_courses page
 * Looks for elements with data-course-list="all" or data-course-list="new"
 */
function populateCourseList() {
    if (!contentData || !contentData.courses) {
        console.error('contentData or courses not found');
        return;
    }
    
    const courseListContainers = document.querySelectorAll('[data-course-list]');
    
    courseListContainers.forEach(container => {
        const listType = container.getAttribute('data-course-list');
        
        // Checks if courses have already been loaded
        if (container.dataset.loaded === 'true') {
            return;
        }
        
        let coursesToShow = contentData.courses;
        
        // Filters only new courses if requested
        if (listType === 'new') {
            coursesToShow = contentData.courses.filter(c => c.isNew === true);
            
            // Layout for new courses (cards with icons)
            const coursesHTML = coursesToShow.map((course, index) => {
                const fileName = COURSE_FILE_NAME_MAP[course.courseName] || course.courseName;
                const isFirst = index === 0 ? ' class="active"' : '';
                return `
                <article${isFirst}>
                    <p>${course.description || course.courseSubtitle}</p>
                    <h2><img src="${course.icon}" alt="${course.courseTitle}" class="course-icon"> ${course.courseTitle}</h2>
                    <a href="html/courses/${fileName}.html">View Course</a>
                </article>
            `;
            }).join('');
            
            // Se container è una section, aggiungi dopo l'h1
            if (container.tagName === 'SECTION') {
                const title = container.querySelector('h1');
                if (title) {
                    title.insertAdjacentHTML('afterend', coursesHTML);
                    
                    // Add carousel logic for arrows on mobile
                    const section = container;
                    const articles = section.querySelectorAll('[data-course-list="new"] article');
                    const prevBtn = section.querySelector('.slider-btn--prev');
                    const nextBtn = section.querySelector('.slider-btn--next');
                    let currentIndex = 0;
                    
                    if (articles.length > 1 && prevBtn && nextBtn) {
                        const showCourse = (index) => {
                            articles.forEach((article, idx) => {
                                article.classList.remove('active');
                                if (idx === index) {
                                    article.classList.add('active');
                                }
                            });
                        };
                        
                        prevBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex - 1 + articles.length) % articles.length;
                            showCourse(currentIndex);
                        });
                        
                        nextBtn.addEventListener('click', () => {
                            currentIndex = (currentIndex + 1) % articles.length;
                            showCourse(currentIndex);
                        });
                    }
                }
            } else {
                container.innerHTML = coursesHTML;
            }
            
        } else {
            // For the catalogue, shows only courses that are NOT new
            coursesToShow = contentData.courses.filter(c => c.isNew !== true);
            
            // Layout for catalogue (image always on top)
            const coursesHTML = coursesToShow.map((course, index) => {
                const fileName = COURSE_FILE_NAME_MAP[course.courseName] || course.courseName;
                const imgElement = `<img src="${course.instructorImg}" alt="${course.instructorName}">`;
                const contentElement = `
                    <div>
                        <h2>${course.courseTitle}</h2>
                        <h3>${course.instructorName}</h3>
                        <p class="section1-text">${course.section1Text || ''}</p>
                        <p data-catalogue-description>${course.catalogueDescription || course.section1Text}</p>
                        <a href="html/courses/${fileName}.html">Learn More</a>
                    </div>
                `;
                
                // Image always on top on mobile and tablet
                return `<article>${imgElement + contentElement}</article>`;
            }).join('');
            
            // Se container è una section, aggiungi dopo l'h1
            if (container.tagName === 'SECTION') {
                const title = container.querySelector('h1');
                if (title) {
                    title.insertAdjacentHTML('afterend', coursesHTML);
                }
            } else {
                container.innerHTML = coursesHTML;
            }
        }
        
        // Marks the container as loaded
        container.dataset.loaded = 'true';
    });
}

/**
 * Populates features on the business page
 * Looks for elements with data-features-list
 */
function populateBusinessFeatures() {
    if (!contentData || !contentData.business || !contentData.business.features) return;
    
    const featuresContainer = document.querySelector('[data-features-list]');
    if (!featuresContainer) return;
    
    const featuresHTML = contentData.business.features.map(feature => `
        <div class="feature-card">
            <h3>${feature.title}</h3>
            <p>${feature.description}</p>
        </div>
    `).join('');
    
    featuresContainer.innerHTML = featuresHTML;
}

/**
 * Populates course details for individual course pages
 * Uses the course name from the URL or from a data-course attribute
 */
function populateCourseDetails() {
    if (!contentData) return;
    
    // Looks for the data-course attribute in the hero section or in the body
    const courseHero = document.querySelector('[data-course]');
    if (!courseHero) return;
    
    let courseName = courseHero.getAttribute('data-course');
    
    // If data-course is empty, tries to extract the course name from the URL
    if (!courseName) {
        const path = window.location.pathname;
        const match = path.match(/\/courses\/([^/.]+)\.html/);
        if (match) {
            courseName = match[1] === 'cybersecurity' ? 'cyber' : match[1];
            courseHero.setAttribute('data-course', courseName);
        }
    }
    
    const course = getCourse(courseName);
    
    if (!course) {
        console.warn(`Course not found: ${courseName}`);
        return;
    }
    
    // Populates all elements with data-course-field
    const fieldMap = {
        'title': 'courseTitle',
        'subtitle': 'courseSubtitle',
        'instructor-img': 'instructorImg',
        'instructor-name': 'instructorName',
        'instructor-title': 'instructorTitle',
        'section1-text': 'section1Text'
    };
    
    Object.entries(fieldMap).forEach(([dataAttr, fieldName]) => {
        const element = document.querySelector(`[data-course-${dataAttr}]`);
        if (element && course[fieldName]) {
            if (dataAttr === 'instructor-img') {
                element.src = course[fieldName];
            } else if (dataAttr === 'price') {
                element.textContent = `€${course[fieldName]}`;
            } else {
                element.textContent = course[fieldName];
            }
        }
    });
    
    // Populates topics if present
    const topicsList = document.querySelector('[data-course-topics]');
    if (topicsList && course.topics) {
        const topicsHTML = course.topics.map(topic => `<li>${topic}</li>`).join('');
        topicsList.innerHTML = topicsHTML;
    }
    
    // Populates the catalogueDescription if present
    const descriptionElement = document.querySelector('[data-catalogue-description]');
    if (descriptionElement && course.catalogueDescription) {
        descriptionElement.textContent = course.catalogueDescription;
    }
}

/**
 * Populates instructors
 */
function populateInstructors() {
    if (!contentData || !contentData.instructors) return;
    
    const instructorsContainer = document.querySelector('[data-instructors-list]');
    if (!instructorsContainer) return;
    
    const instructorsHTML = contentData.instructors.map(instructor => `
        <div class="instructor-card">
            <img src="${instructor.image}" alt="${instructor.name}">
            <h3>${instructor.name}</h3>
            <p class="title">${instructor.title}</p>
            <p class="bio">${instructor.bio}</p>
            <div class="specializations">
                ${instructor.specialization.map(spec => `<span class="tag">${spec}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    instructorsContainer.innerHTML = instructorsHTML;
}

/**
 * Changes the "Enroll Now" button to "Edit Course" for admins
 */
function updateEnrollButtonForAdmin() {
    const isAdmin = localStorage.getItem('userRole') === 'admin';
    
    if (isAdmin) {
        const enrollButton = document.querySelector('.btn-enroll');
        if (enrollButton) {
            enrollButton.textContent = 'Edit Course';
            enrollButton.href = '#edit-course';
            if (enrollButton.dataset.adminEditBound !== 'true') {
                enrollButton.addEventListener('click', handleAdminEditButtonClick);
                enrollButton.dataset.adminEditBound = 'true';
            }
        }
    }
}

/**
 * Returns editable text elements on the course page.
 */
function getAdminEditableElements() {
    const selectors = getAdminEditableSelectors();

    return selectors.flatMap(selector =>
        Array.from(document.querySelectorAll(selector))
    );
}

/**
 * Enables/disables inline edit mode for admins.
 * Front-end only: modifies the DOM in memory, without writing to JSON.
 */
function toggleAdminEditMode(enable) {
    const courseContent = document.querySelector('.course-content');
    const editableElements = getAdminEditableElements();

    editableElements.forEach(element => {
        element.contentEditable = enable ? 'true' : 'false';
        element.classList.toggle('admin-editable-field', enable);
        element.setAttribute('spellcheck', 'false');
    });

    if (courseContent) {
        courseContent.classList.toggle('admin-edit-mode', enable);
    }

    isAdminEditMode = enable;
}

/**
 * Handles the course button click in admin mode.
 */
function handleAdminEditButtonClick(event) {
    event.preventDefault();

    const button = event.currentTarget;
    if (!button) return;

    const shouldEnableEdit = !isAdminEditMode;
    toggleAdminEditMode(shouldEnableEdit);

    button.textContent = shouldEnableEdit ? 'Save Changes' : 'Edit Course';
    button.href = shouldEnableEdit ? '#save-course' : '#edit-course';
}

/**
 * Main function that loads and populates all content
 */
async function initContentLoader() {
    // Loads data
    await loadContentData();
    
    if (!contentData) {
        console.error('Unable to load content data');
        return;
    }
    
    // Populates various types of content present on the page
    populateContentElements();
    populateCourseList();
    populateCourseDetails();
    populateBusinessFeatures();
    populateInstructors();
    
    // Updates the Enroll button for admins
    updateEnrollButtonForAdmin();
    
    // Reinitializes the new courses slider after courses have been loaded
    // Resets the UIState to allow reinitialization
    if (typeof UIState !== 'undefined' && UIState.initialized) {
        UIState.initialized.delete('slider');
    }
    
    if (typeof initNewCoursesSlider === 'function') {
        initNewCoursesSlider();
    }
}

// Initializes the content loader after HTML modules have been loaded
// Listens to the 'modulesLoaded' event emitted by module-loader.js
window.addEventListener('modulesLoaded', initContentLoader);

// If modules have already been loaded (pages without module-loader), initialize immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a tick to give module-loader time to emit the event
        setTimeout(() => {
            if (!contentData) initContentLoader();
        }, 100);
    });
} else {
    // If the DOM is already ready and there are no modules to load
    setTimeout(() => {
        if (!contentData) initContentLoader();
    }, 100);
}

// Exports functions for external use if needed
if (typeof window !== 'undefined') {
    window.contentLoader = {
        loadContentData,
        getCourse,
        getInstructor,
        initContentLoader,
        populateContentElements,
        populateCourseList,
        populateCourseDetails,
        updateEnrollButtonForAdmin,
        toggleAdminEditMode
    };
}
