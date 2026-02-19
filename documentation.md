CSS Documentation
This documentation describes the function of each CSS file used in the online course platform project.
The file style.css is just the whole version of the css directory, it's here just for the record, do not use/modify it

CSS File Structure
The CSS has been divided into separate modules to improve maintainability and code organization.

reset.css
Function: Browser style reset

This file contains the fundamental reset styles that eliminate default browser margins and paddings and set the box-sizing to border-box for all elements. This ensures consistent layout behavior across all browsers.

Main content:

Global margin and padding reset

Setting box-sizing: border-box for consistent size calculation

layout.css
Function: General layout and base page structure

Defines the styles for the main structural elements of the site, such as the body, the main container, and generic sections. It sets the base typography, background colors, and a centered fixed-width layout.

Main content:

Body styles (fonts, colors, line-height)

Main container with maximum width and centering

Base section styles (padding, background, rounded corners, shadows)

Section title styles

header.css
Function: Styles for the header and navigation bar

Contains all styles related to the site header, including the sticky navigation bar, menu links, search bar, and the login button.

Main content:

Header with sticky positioning and dark background

Navigation with flex layout and alignment

Styles for navigation links with hover effects

Search field with rounded borders

Login button with a distinctive color

new-courses.css
Function: Styles for the "New Courses" section

Manages the visual appearance of the new courses section, including the slider-type layout with navigation arrows and individual course cards.

Main content:

Flex layout for the slider with circular arrow buttons

Course cards with images, titles, and descriptions

Hover effects on cards (lift and shadow)

"View Course" buttons with blue color

Styles for left/right navigation arrows

our-courses.css
Function: Styles for the "Our Courses" section

Defines the appearance of the main courses section with an alternating layout (image-text / text-image). Each course displays the professor's image, course name, professor's name, and a detailed description.

Main content:

Flex layout for articles with generous spacing

Circular professor images with colored borders

Styles for titles, subtitles, and descriptions

"Learn More" buttons with green color

Hover effects on articles (more pronounced shadow)

footer.css
Function: Footer styles

Contains all styles for the site footer, including policy links, contact information, copyright, and social media links.

Main content:

Footer with dark background and light text

Flex layout for navigation links

Styles for the email address with highlighted color

Social media links with stylized icons

Copyright text with a subtle color

responsive.css
Function: Media queries for mobile responsiveness

Contains CSS rules that adapt the layout for devices with smaller screens (maximum 768px wide). It modifies element behavior to ensure a good user experience on smartphones and tablets.

Main content:

Header with column layout on mobile

Full-width search bar

New Courses section with slider disabled (no arrows)

Our Courses section with vertical layout instead of alternating

Centered alignment for content on small screens

Import Order
CSS files must be imported in the following order in the HTML:

reset.css – to reset browser styles

layout.css – for the base structure

header.css – for the header

new-courses.css – for the new courses section

our-courses.css – for the main courses section

footer.css – for the footer

responsive.css – for responsive rules (must be last)

This order ensures that styles are applied correctly and that media queries have the necessary precedence.