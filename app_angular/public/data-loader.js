/**
 * Data Loader Script
 * Loads course data from public/data/content.json and caches it in window object
 * This allows components to access data without making HTTP requests
 */

(function() {
  'use strict';

  // Load courses data
  async function loadCoursesData() {
    try {
      const response = await fetch('/data/content.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      window.__PWM_COURSES_CACHE = data.courses || [];
      window.__PWM_CONTENT_CACHE = data;
      console.log('Courses data loaded successfully');
    } catch (error) {
      console.error('Failed to load courses data:', error);
      window.__PWM_COURSES_CACHE = [];
      window.__PWM_CONTENT_CACHE = {};
    }
  }

  // Run on DOM ready or immediately if already loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCoursesData);
  } else {
    loadCoursesData();
  }
})();
