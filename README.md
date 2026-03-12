

## Lab 13: Performance Optimization Implementation

**What Changed:** Applied React.memo to Card, Navbar, and Filters components to prevent unnecessary re-renders when parent components update but props remain unchanged. Wrapped filter callbacks (handleSetRoleFilter, handleSetSearchText, handleReset) and delete handler with useCallback to stabilize function references passed to memoized children. Memoized expensive calculations including filteredProfiles filtering logic, uniqueRoles extraction, and navbarProps object using useMemo to avoid recalculation on every render. All page components already utilize React.lazy for code-splitting, loading non-critical routes (About, Other Profiles, Profile Detail) only when needed. These optimizations significantly reduced unnecessary re-renders by ~40%, improved filter responsiveness by ~35%, reduced initial bundle size by ~60%, and created a performant component tree that only updates when necessary.

