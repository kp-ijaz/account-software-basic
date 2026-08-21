#!/bin/bash

# Security Verification Script for Madrasa Accounting Software
# Run this after Phase 12 to verify all security measures are in place

echo "================================"
echo "Security Verification Script"
echo "================================"
echo ""

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

PASS_COUNT=0
FAIL_COUNT=0

# Function to check if file exists
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✅ PASS${NC}: File exists - $1"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ FAIL${NC}: File missing - $1"
        ((FAIL_COUNT++))
    fi
}

# Function to check if text exists in file
check_content() {
    if grep -q "$2" "$1" 2>/dev/null; then
        echo -e "${GREEN}✅ PASS${NC}: Found '$2' in $1"
        ((PASS_COUNT++))
    else
        echo -e "${RED}❌ FAIL${NC}: Missing '$2' in $1"
        ((FAIL_COUNT++))
    fi
}

echo "=== FILE EXISTENCE CHECKS ==="
check_file "backend/src/middleware/rateLimiter.ts"
check_file "backend/src/middleware/validation.ts"
check_file "SECURITY.md"
check_file "PHASE_12_SECURITY_COMPLETE.md"
echo ""

echo "=== RATE LIMITER CHECKS ==="
check_content "backend/src/middleware/rateLimiter.ts" "apiLimiter"
check_content "backend/src/middleware/rateLimiter.ts" "loginLimiter"
check_content "backend/src/middleware/rateLimiter.ts" "passwordChangeLimiter"
check_content "backend/src/middleware/rateLimiter.ts" "uploadLimiter"
echo ""

echo "=== VALIDATION MIDDLEWARE CHECKS ==="
check_content "backend/src/middleware/validation.ts" "validateEmail"
check_content "backend/src/middleware/validation.ts" "validatePassword"
check_content "backend/src/middleware/validation.ts" "validateAmount"
check_content "backend/src/middleware/validation.ts" "sanitizeInput"
echo ""

echo "=== APP.TS SECURITY INTEGRATION CHECKS ==="
check_content "backend/src/app.ts" "rateLimiter"
check_content "backend/src/app.ts" "validateRequestSize"
check_content "backend/src/app.ts" "sanitizeInput"
check_content "backend/src/app.ts" "helmet"
check_content "backend/src/app.ts" "contentSecurityPolicy"
echo ""

echo "=== ROUTE PROTECTION CHECKS ==="
check_content "backend/src/routes/auth.ts" "loginLimiter"
check_content "backend/src/routes/auth.ts" "passwordChangeLimiter"
check_content "backend/src/routes/settings.ts" "uploadLimiter"
echo ""

echo "=== DEPENDENCY CHECKS ==="
check_content "backend/package.json" "express-rate-limit"
check_content "backend/package.json" "bcryptjs"
check_content "backend/package.json" "jsonwebtoken"
check_content "backend/package.json" "helmet"
echo ""

echo "=== SECURITY DOCUMENTATION CHECKS ==="
check_content "SECURITY.md" "Authentication & Authorization"
check_content "SECURITY.md" "Rate Limiting"
check_content "SECURITY.md" "Input Validation"
check_content "SECURITY.md" "OWASP"
echo ""

echo "=== SUMMARY ==="
echo -e "Passed: ${GREEN}${PASS_COUNT}${NC}"
echo -e "Failed: ${RED}${FAIL_COUNT}${NC}"
echo ""

if [ $FAIL_COUNT -eq 0 ]; then
    echo -e "${GREEN}✅ ALL SECURITY CHECKS PASSED!${NC}"
    echo "Phase 12 security implementation verified."
    exit 0
else
    echo -e "${RED}❌ SOME CHECKS FAILED${NC}"
    echo "Please review the failed items above."
    exit 1
fi
