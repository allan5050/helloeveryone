# Known Issues

This document tracks current technical issues, test failures, and technical debt in the HelloEveryone project.

**Last Updated**: September 4, 2025  
**Test Results**: 84 failed tests, 42 passed (126 total)  
**Overall Coverage**: ~7% (Target: 70%)

---

## Critical Issues

### 1. Test Suite Failures (HIGH PRIORITY)
**Status**: 84/126 tests failing  
**Impact**: Cannot guarantee code quality or catch regressions

**Primary Failure Categories**:
- Mock configuration mismatches
- API implementation differences from test expectations
- Missing modules/functions that tests expect to exist
- Playwright/Jest configuration conflicts

**Affected Files**:
- `tests/__tests__/privacy.test.ts` - 15 failures
- `tests/__tests__/chat.test.tsx` - 12 failures  
- `tests/__tests__/calendar.test.ts` - 8 failures
- `tests/__tests__/rsvp.test.ts` - 10 failures
- `tests/__tests__/favorites.test.ts` - 9 failures
- `tests/__tests__/matching.test.ts` - 18 failures
- Several component tests with mock issues

### 2. ESLint Configuration Conflicts (MEDIUM PRIORITY)
**Status**: Linting fails with deprecation warnings  
**Impact**: Cannot run automated code quality checks

**Issues**:
- Next.js 16 deprecation warning for plugin compatibility
- ESLint plugin conflicts preventing `--fix` from running
- Some rules may not be enforcing properly

---

## Test-Specific Issues

### Jest Configuration Problems

#### Mock Setup Issues
- **Supabase Client Mocking**: Tests expect different mock structure than provided
- **Next.js Router Mocking**: Navigation mocks don't match actual implementation
- **Component Mocking**: UI component mocks missing required props
- **External API Mocking**: OpenAI and other API mocks inconsistent

#### Module Resolution Failures
```
Cannot find module '@/lib/matching/interests'
Cannot find module '@/lib/matching/semantic'  
Cannot find module '@/lib/matching/demographics'
Cannot find module '@/lib/matching/location'
Cannot find module '@/lib/matching/availability'
Cannot find module '@/lib/matching/engine'
```

**Root Cause**: Tests expect modular matching algorithm files that don't exist in current implementation.

### Specific Test Failures

#### Matching Algorithm Tests (`matching.test.ts`)
- **18 failing tests** expecting granular matching functions
- Tests expect separate files for interests, demographics, location, availability
- Current implementation may be monolithic or structured differently
- Performance tests failing due to mock timing issues

#### Privacy Tests (`privacy.test.ts`)  
- **15 failing tests** around mutual visibility features
- Row Level Security (RLS) policy tests not matching implementation
- Profile filtering tests expect different API structure

#### Chat System Tests (`chat.test.tsx`)
- **12 failing tests** in messaging functionality
- Real-time messaging mocks not configured properly
- Message component tests failing due to missing props

#### Calendar Integration Tests (`calendar.test.ts`)
- **8 failing tests** in ICS file generation
- Calendar export functionality tests not matching implementation
- Date/time handling tests failing

#### RSVP System Tests (`rsvp.test.ts`)
- **10 failing tests** in event RSVP functionality  
- Event capacity and waitlist tests not aligned with implementation
- Database query mocks not matching actual schema

#### Favorites Tests (`favorites.test.ts`)
- **9 failing tests** in user favorites functionality
- Database relationship tests not matching current schema
- Favorite/unfavorite action tests failing

---

## Infrastructure Issues

### Database & Schema Misalignment
- **Test Data**: Tests expect different database schema than current implementation
- **RLS Policies**: Row Level Security tests don't match actual policies
- **Relationships**: Some test relationships don't exist in current schema
- **Indexes**: Performance tests may fail due to missing indexes

### API Route Mismatches
- **Endpoint Structure**: Tests expect different API route structure
- **Response Format**: API responses don't match test expectations
- **Authentication**: Auth middleware tests not aligned with implementation
- **Error Handling**: Error response formats inconsistent

### Environment Configuration
- **Test Environment**: Some environment variables missing for tests
- **Database URLs**: Test database connections may be misconfigured
- **API Keys**: Mock API keys not properly configured for all services

---

## Performance Issues

### Test Performance
- **Slow Tests**: Some integration tests take >5 seconds
- **Memory Usage**: Test suite uses excessive memory for large datasets
- **Parallel Execution**: Tests not properly isolated for parallel runs

### Application Performance
- **Bundle Size**: Large bundle size due to unnecessary imports
- **Image Loading**: Some images not optimized for performance
- **Database Queries**: N+1 query issues in matching algorithm
- **Caching**: Limited caching of expensive operations

---

## Technical Debt

### Code Quality Issues

#### Type Safety
- **Missing Types**: Some functions lack proper TypeScript types
- **Any Types**: Several instances of `any` type usage
- **Strict Mode**: Not all files comply with strict TypeScript settings

#### Error Handling
- **Inconsistent Patterns**: Different error handling approaches across files
- **Missing Error Boundaries**: React error boundaries not implemented everywhere
- **API Errors**: Inconsistent API error response handling

#### Code Organization
- **Large Files**: Some components are too large and should be split
- **Duplicate Logic**: Repeated code patterns that should be abstracted
- **Unused Imports**: Several unused imports throughout codebase

### Architecture Concerns

#### Component Structure
- **Prop Drilling**: Some components have excessive prop drilling
- **State Management**: Inconsistent state management patterns
- **Component Coupling**: Some components too tightly coupled

#### API Design
- **RESTful Patterns**: Some API routes don't follow REST conventions
- **Response Consistency**: API responses have inconsistent structure
- **Validation**: Input validation inconsistent across endpoints

---

## Security Concerns

### Authentication Issues
- **Session Management**: Session handling tests reveal potential issues
- **Token Validation**: JWT token validation not thoroughly tested
- **Password Security**: Password hashing tests indicate potential weaknesses

### Data Privacy
- **Profile Visibility**: Mutual visibility rules not fully tested
- **Data Leakage**: Some tests suggest potential data exposure issues
- **GDPR Compliance**: Privacy controls not fully implemented or tested

---

## Browser Compatibility Issues

### Known Browser Problems
- **Safari**: Some PWA features don't work properly in Safari
- **iOS Safari**: Touch interactions have occasional issues
- **Older Browsers**: Limited testing on older browser versions
- **Mobile Browsers**: Performance issues on some mobile browsers

---

## Dependencies & External Services

### Outdated Dependencies
- **Security Vulnerabilities**: Some dependencies have known security issues
- **Version Conflicts**: Dependency version conflicts causing build issues
- **Deprecated APIs**: Using deprecated APIs in some external services

### External Service Issues
- **Supabase**: Occasional connection timeouts
- **OpenAI API**: Rate limiting not properly handled in tests
- **Calendar Services**: Integration reliability issues

---

## Deployment Issues

### Build Problems
- **Build Warnings**: Several build warnings that should be addressed
- **Asset Optimization**: Images and assets not fully optimized
- **Bundle Analysis**: Bundle size analysis reveals optimization opportunities

### Production Configuration
- **Environment Variables**: Production environment variable management
- **Monitoring**: Limited error monitoring and alerting
- **Performance Tracking**: Insufficient performance monitoring

---

## Testing Infrastructure Issues

### Test Coverage Gaps
- **Integration Tests**: Limited integration test coverage
- **E2E Tests**: End-to-end tests not covering all critical paths
- **Edge Cases**: Many edge cases not tested
- **Error Scenarios**: Error handling scenarios undertested

### Test Maintenance
- **Outdated Tests**: Many tests written for older implementation
- **Mock Maintenance**: Mocks not updated with implementation changes
- **Test Data**: Test data setup is complex and fragile

---

## Development Experience Issues

### Developer Tooling
- **Hot Reload**: Occasional issues with hot reload in development
- **Source Maps**: Source maps not always accurate for debugging
- **Error Messages**: Some error messages not developer-friendly

### Documentation
- **API Documentation**: API endpoints not fully documented
- **Component Documentation**: Component props and usage not documented
- **Setup Instructions**: Developer setup instructions incomplete

---

## Immediate Action Items

### High Priority (Fix within 1 week)
1. **Fix Critical Test Failures**: Address the 84 failing tests
2. **Resolve ESLint Configuration**: Fix linting setup
3. **Update Mock Configurations**: Align mocks with actual implementation
4. **Fix Security Test Failures**: Address authentication and privacy test failures

### Medium Priority (Fix within 2 weeks)  
1. **Improve Test Coverage**: Increase coverage from 7% to at least 50%
2. **Resolve Performance Issues**: Address slow database queries
3. **Update Outdated Dependencies**: Update packages with security issues
4. **Standardize Error Handling**: Implement consistent error handling

### Low Priority (Fix within 1 month)
1. **Refactor Large Components**: Break down overly complex components
2. **Improve Documentation**: Add comprehensive API and component documentation
3. **Optimize Bundle Size**: Reduce bundle size for better performance
4. **Enhance Browser Compatibility**: Test and fix issues in all supported browsers

---

## Monitoring & Tracking

### Metrics to Track
- **Test Pass Rate**: Currently 33% (42/126), target 95%+
- **Test Coverage**: Currently ~7%, target 70%+
- **Build Success Rate**: Track deployment success rate
- **Performance Metrics**: Page load times, API response times

### Regular Reviews
- **Weekly**: Review test failures and fix critical issues
- **Bi-weekly**: Review technical debt and plan refactoring
- **Monthly**: Full codebase review and dependency updates
- **Quarterly**: Architecture review and major updates

---

## Notes for Developers

### Working with Known Issues
- **Priorities**: Focus on high-priority issues first
- **Testing**: Run tests locally before submitting PRs
- **Documentation**: Update this file when issues are resolved
- **Communication**: Communicate any new critical issues immediately

### Contributing Fixes
- **One Issue Per PR**: Address one issue per pull request
- **Test Coverage**: Include tests for any bug fixes
- **Documentation**: Update relevant documentation
- **Review Process**: Get code review for all fixes

---

## Contact & Support

For questions about these issues or to report new problems:
- **Project Lead**: allan5050
- **Repository**: https://github.com/allan5050/helloeveryone
- **Issues Tracker**: Use GitHub issues for tracking new problems
- **Priority Issues**: Tag critical issues with "high-priority" label