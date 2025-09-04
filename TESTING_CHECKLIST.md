# Manual Testing Checklist

This checklist provides step-by-step manual testing procedures for HelloEveryone.fun to ensure all features work correctly before deployment.

## Pre-Testing Setup

### Environment Verification
- [ ] Verify development environment is running: `npm run dev`
- [ ] Check that localhost:3000 is accessible
- [ ] Confirm all environment variables are set in `.env.local`:
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Verify database connection is working
- [ ] Clear browser cache and cookies for clean testing

### Test User Accounts
- [ ] Test User 1: Fresh registration account
- [ ] Test User 2: Existing user with profile data
- [ ] Test User 3: User with events and matches
- [ ] Admin account (if applicable)

---

## Landing Page Testing

### Navigation & Layout
- [ ] **Logo/Brand**: HelloEveryone logo displays correctly
- [ ] **Navigation Menu**: All nav links work (Features, Stories, FAQ)
- [ ] **Mobile Menu**: Hamburger menu works on mobile devices
- [ ] **Smooth Scrolling**: Navigation links scroll to correct sections
- [ ] **Responsive Design**: Page looks good on desktop, tablet, mobile

### Hero Section
- [ ] **Main Tagline**: "Find Your People" displays prominently
- [ ] **Subtitle**: Smart social matching tagline is visible
- [ ] **CTA Buttons**: "Start Connecting" and "Learn More" buttons work
- [ ] **Hero Animation**: Any animations or transitions work smoothly

### Statistics Section
- [ ] **Member Count**: "10K+ Active Members" displays
- [ ] **Event Count**: "500+ Events Monthly" displays
- [ ] **Satisfaction**: "95% Match Satisfaction" displays
- [ ] **Counter Animation**: Statistics animate on scroll (if implemented)

### Features Section
- [ ] **Smart Matching**: Feature card displays with icon
- [ ] **Local Events**: Feature card displays with icon
- [ ] **Easy Planning**: Feature card displays with icon
- [ ] **Meaningful Connections**: Feature card displays with icon
- [ ] **Hover Effects**: Cards have proper hover animations
- [ ] **Feature Icons**: All Lucide icons render correctly

### Success Stories/Testimonials
- [ ] **Sarah M.**: Testimonial displays with star rating
- [ ] **Mike L.**: Testimonial displays with star rating
- [ ] **Alex K.**: Testimonial displays with star rating
- [ ] **Star Ratings**: All testimonials show 5-star ratings
- [ ] **Carousel**: Testimonials scroll/change (if implemented)

### FAQ Section
- [ ] **FAQ Header**: "Frequently Asked Questions" displays
- [ ] **Accordion**: FAQ items expand/collapse properly
- [ ] **Content**: FAQ answers display completely
- [ ] **Multiple Open**: Check if multiple FAQs can be open simultaneously

### Call-to-Action Section
- [ ] **CTA Header**: "Ready to Find Your People?" displays
- [ ] **CTA Subtitle**: Descriptive text about joining displays
- [ ] **CTA Button**: "Get Started Free" button works
- [ ] **Button Styling**: CTA button has proper styling and hover effects

### Footer
- [ ] **Footer Sections**: Product, Company, Legal sections display
- [ ] **Footer Links**: All footer links are clickable
- [ ] **Privacy Policy**: Link works (even if page doesn't exist yet)
- [ ] **Terms of Service**: Link works (even if page doesn't exist yet)
- [ ] **Copyright**: Copyright notice displays correctly
- [ ] **Contact Info**: Any contact information is accurate

---

## Authentication Flow Testing

### Registration Process
- [ ] **Registration Page**: `/signup` loads correctly
- [ ] **Form Validation**: 
  - [ ] Empty email field shows error
  - [ ] Invalid email format shows error
  - [ ] Empty password field shows error
  - [ ] Short password shows error
  - [ ] Password mismatch shows error
- [ ] **Successful Registration**: 
  - [ ] Valid form submission works
  - [ ] User receives confirmation email (check if implemented)
  - [ ] Redirects to appropriate page after signup
- [ ] **Error Handling**: 
  - [ ] Duplicate email shows appropriate error
  - [ ] Network errors are handled gracefully

### Login Process  
- [ ] **Login Page**: `/login` loads correctly
- [ ] **Form Validation**:
  - [ ] Empty email shows error
  - [ ] Empty password shows error
  - [ ] Invalid credentials show error
- [ ] **Successful Login**:
  - [ ] Valid credentials log user in
  - [ ] Redirects to dashboard or intended page
  - [ ] User session persists across page refreshes
- [ ] **Remember Me**: Checkbox works (if implemented)
- [ ] **OAuth Login**: Google login button works (if enabled)

### Password Reset
- [ ] **Reset Page**: `/auth/reset-password` loads correctly
- [ ] **Email Field**: Accepts valid email addresses
- [ ] **Reset Email**: Password reset email is sent
- [ ] **Reset Link**: Email link redirects to reset form
- [ ] **New Password**: User can set new password successfully
- [ ] **Login**: User can login with new password

### Session Management
- [ ] **Persistent Login**: User stays logged in across browser sessions
- [ ] **Automatic Logout**: Session expires appropriately (if implemented)
- [ ] **Protected Routes**: Unauthenticated users redirected to login
- [ ] **Logout**: Logout button properly ends session

---

## Profile Management Testing

### Profile Creation/Setup
- [ ] **Basic Info**: Name, age, location can be entered
- [ ] **Bio Section**: Bio text area accepts input
- [ ] **Interests**: User can add/remove interests
- [ ] **Photo Upload**: Profile photo upload works (if implemented)
- [ ] **Privacy Settings**: Privacy controls are available
- [ ] **Save Changes**: Profile updates save successfully

### Profile Editing
- [ ] **Edit Mode**: Profile can be switched to edit mode
- [ ] **Field Updates**: Individual fields can be modified
- [ ] **Validation**: Required fields are validated
- [ ] **Cancel Changes**: Changes can be cancelled
- [ ] **Save Confirmation**: User receives confirmation when saved

### Profile Visibility
- [ ] **Own Profile**: User can view their complete profile
- [ ] **Other Profiles**: User can view other users' profiles
- [ ] **Privacy Filters**: Hidden fields are not shown to others
- [ ] **Match Context**: Profile shown differently based on match status

---

## Event System Testing

### Event Discovery
- [ ] **Event List**: Events display in list/grid format
- [ ] **Event Cards**: Each event shows title, date, location, description
- [ ] **Event Images**: Event photos display correctly (if implemented)
- [ ] **Load More**: Pagination or infinite scroll works
- [ ] **Empty State**: Appropriate message when no events found

### Event Filtering
- [ ] **Location Filter**: Filter events by location
- [ ] **Date Filter**: Filter events by date range
- [ ] **Category Filter**: Filter by event type/category
- [ ] **Interest Filter**: Filter by matching interests
- [ ] **Search**: Text search in event titles/descriptions
- [ ] **Clear Filters**: Reset all filters functionality

### Event Details
- [ ] **Event Page**: Individual event pages load correctly
- [ ] **Full Details**: Complete event information displays
- [ ] **RSVP Button**: RSVP functionality works
- [ ] **Attendee List**: List of attendees displays (with privacy settings)
- [ ] **Map/Location**: Event location shown clearly
- [ ] **Calendar Integration**: Add to calendar functionality

### RSVP Management
- [ ] **RSVP Status**: User can see their RSVP status
- [ ] **Change RSVP**: User can change from Yes to No and vice versa
- [ ] **RSVP Limits**: Event capacity limits enforced
- [ ] **Waitlist**: Waitlist functionality (if implemented)
- [ ] **RSVP History**: User can see their event history

---

## Matching System Testing

### Match Discovery
- [ ] **Match List**: Potential matches display correctly
- [ ] **Match Cards**: Show name, photo, compatibility score
- [ ] **Match Details**: Click to view detailed match profile
- [ ] **Match Filtering**: Filter matches by various criteria
- [ ] **Load More**: Pagination works for match results

### Match Interaction
- [ ] **Like/Pass**: User can like or pass on matches
- [ ] **Mutual Matches**: Mutual likes create match connection
- [ ] **Match Notifications**: User notified of new matches
- [ ] **Undo Actions**: Ability to undo like/pass (if implemented)

### Match Quality
- [ ] **Score Accuracy**: Match scores seem reasonable
- [ ] **Interest Alignment**: Matches show common interests
- [ ] **Location Relevance**: Matches are geographically appropriate
- [ ] **Age Appropriateness**: Matches are age-appropriate
- [ ] **Diversity**: Match results show variety

---

## Communication Testing

### Chat System
- [ ] **Chat List**: List of conversations displays
- [ ] **Chat Messages**: Messages display in correct order
- [ ] **Send Message**: User can send new messages
- [ ] **Message Status**: Sent/delivered/read status (if implemented)
- [ ] **Real-time**: Messages appear in real-time
- [ ] **Media Sharing**: Photo/file sharing (if implemented)

### Message Safety
- [ ] **Blocking**: User can block other users
- [ ] **Reporting**: User can report inappropriate messages
- [ ] **Message History**: Chat history persists correctly
- [ ] **Privacy**: Only matched users can message each other

---

## Calendar Integration Testing

### Event Calendar Export
- [ ] **ICS Generation**: Calendar files generate correctly
- [ ] **File Download**: ICS files download properly
- [ ] **Calendar Import**: ICS files import into calendar apps
- [ ] **Event Details**: All event details included in calendar entry
- [ ] **Reminders**: Calendar reminders work (if set)

### Calendar Sync
- [ ] **Google Calendar**: Integration works with Google Calendar
- [ ] **Outlook**: Integration works with Outlook
- [ ] **Apple Calendar**: Integration works with Apple Calendar
- [ ] **Automatic Updates**: Calendar updates when RSVP changes

---

## Mobile PWA Testing

### Mobile Responsiveness
- [ ] **Navigation**: Mobile navigation works smoothly
- [ ] **Touch Targets**: All buttons/links are easily tappable
- [ ] **Text Size**: Text is readable on mobile devices
- [ ] **Image Scaling**: Images scale correctly on mobile
- [ ] **Form Input**: Forms work well on mobile keyboards

### PWA Functionality
- [ ] **Install Prompt**: App install prompt appears
- [ ] **Home Screen**: App can be added to home screen
- [ ] **Splash Screen**: Splash screen displays on app launch
- [ ] **Offline Mode**: Basic functionality works offline
- [ ] **Push Notifications**: Notifications work (if implemented)

### Performance on Mobile
- [ ] **Load Speed**: Pages load quickly on mobile data
- [ ] **Battery Usage**: App doesn't drain battery excessively
- [ ] **Memory Usage**: App runs smoothly without crashes
- [ ] **Network Handling**: Handles poor network conditions

---

## Cross-Browser Testing

### Desktop Browsers
- [ ] **Chrome**: Full functionality in latest Chrome
- [ ] **Firefox**: Full functionality in latest Firefox
- [ ] **Safari**: Full functionality in latest Safari
- [ ] **Edge**: Full functionality in latest Edge

### Mobile Browsers
- [ ] **Mobile Chrome**: Android Chrome browser
- [ ] **Mobile Safari**: iOS Safari browser
- [ ] **Samsung Internet**: Samsung's browser (Android)
- [ ] **Firefox Mobile**: Mobile Firefox browser

---

## Performance Testing

### Page Load Times
- [ ] **Landing Page**: Loads within 2 seconds
- [ ] **Dashboard**: Loads within 3 seconds after login
- [ ] **Event Pages**: Individual event pages load quickly
- [ ] **Profile Pages**: Profile pages load within 2 seconds

### Interactive Performance
- [ ] **Button Response**: Buttons respond immediately to clicks
- [ ] **Form Submission**: Forms submit without delay
- [ ] **Image Loading**: Images load progressively
- [ ] **Scroll Performance**: Smooth scrolling throughout app

### Network Conditions
- [ ] **Fast 3G**: App works well on fast 3G
- [ ] **Slow 3G**: App remains usable on slow 3G
- [ ] **Offline**: Graceful handling of network loss
- [ ] **Network Recovery**: Proper reconnection handling

---

## Accessibility Testing

### Keyboard Navigation
- [ ] **Tab Order**: Logical tab order throughout app
- [ ] **Focus Indicators**: Visible focus indicators on all interactive elements
- [ ] **Skip Links**: Skip to main content links (if implemented)
- [ ] **Modal Navigation**: Modals trap focus appropriately

### Screen Reader Support
- [ ] **Alt Text**: All images have appropriate alt text
- [ ] **Form Labels**: All form inputs have proper labels
- [ ] **Headings**: Proper heading hierarchy (h1, h2, h3, etc.)
- [ ] **ARIA Labels**: Interactive elements have appropriate ARIA labels

### Color and Contrast
- [ ] **Color Contrast**: Text meets WCAG contrast requirements
- [ ] **Color Blindness**: Information not conveyed by color alone
- [ ] **High Contrast**: App works with high contrast mode
- [ ] **Font Size**: Text scales properly with browser zoom

---

## Security Testing

### Data Protection
- [ ] **Password Security**: Passwords are not visible in forms
- [ ] **Session Security**: Sessions expire appropriately
- [ ] **Data Validation**: User input is validated server-side
- [ ] **SQL Injection**: Forms protected against SQL injection

### Privacy Controls
- [ ] **Profile Privacy**: Users can control profile visibility
- [ ] **Data Export**: Users can export their data (if implemented)
- [ ] **Account Deletion**: Users can delete their accounts
- [ ] **GDPR Compliance**: Privacy controls meet GDPR requirements

---

## Error Handling Testing

### Network Errors
- [ ] **API Failures**: Graceful handling of API failures
- [ ] **Timeout Errors**: Proper timeout error messages
- [ ] **404 Errors**: Custom 404 page displays
- [ ] **500 Errors**: Custom error page for server errors

### User Input Errors
- [ ] **Form Validation**: Clear error messages for invalid input
- [ ] **Required Fields**: Required field errors are clear
- [ ] **File Upload Errors**: Proper handling of file upload failures
- [ ] **Rate Limiting**: Proper handling of rate limit errors

---

## Final Testing Checklist

### Before Release
- [ ] All critical user flows tested end-to-end
- [ ] No console errors in browser developer tools
- [ ] All external links work correctly
- [ ] Contact information and legal links are accurate
- [ ] Database performance is acceptable under load
- [ ] All environment variables are properly configured for production

### Post-Release Monitoring
- [ ] Set up error monitoring (Sentry, etc.)
- [ ] Monitor application performance metrics
- [ ] Track user engagement and conversion rates
- [ ] Set up alerts for critical functionality failures
- [ ] Plan regular testing cycles for ongoing maintenance

---

## Notes for Testers

### Test Data Management
- Use realistic but fake data for testing
- Don't use real email addresses in development
- Clean up test data regularly to avoid confusion
- Document any known test data accounts

### Bug Reporting Format
When reporting bugs, include:
1. Steps to reproduce
2. Expected behavior
3. Actual behavior
4. Browser/device information
5. Screenshots or video if helpful

### Testing Frequency
- Run this checklist before every major release
- Perform spot checks for minor updates
- Conduct full regression testing monthly
- Update this checklist as features are added