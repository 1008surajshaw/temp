// ============================================
// API SKELETON - Complete Backend API Documentation
// ============================================

// ============================================
// 🔐 AUTHENTICATION APIs
// ============================================

export const AuthenticationAPIs = {
  // Owner Registration
  "POST /api/owners/register": {
    input: {
      name: "string",
      email: "string", 
      password: "string",
      accountType: "'admin' | 'superadmin'",
      organizationId: "string (optional)"
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        name: "string",
        email: "string",
        accountType: "string",
        organizationId: "string | undefined",
        organizationCreated: "boolean",
        isActive: "boolean",
        createdAt: "Date"
      }
    },
    auth: "None (Public)",
    description: "Register new owner/admin account"
  },

  // Owner Login
  "POST /api/owners/login": {
    input: {
      email: "string",
      password: "string"
    },
    output: {
      success: "boolean",
      data: {
        token: "string (JWT)",
        owner: {
          id: "string",
          name: "string",
          email: "string",
          accountType: "string",
          organizationId: "string | undefined",
          organizationCreated: "boolean",
          isActive: "boolean",
          createdAt: "Date"
        }
      },
      message: "string"
    },
    auth: "None (Public)",
    description: "Login and get JWT token"
  },

  // Get Owner Profile
  "GET /api/owners/profile": {
    input: "None",
    output: {
      success: "boolean",
      data: {
        id: "string",
        name: "string",
        email: "string",
        accountType: "string",
        organizationId: "string | undefined",
        organizationCreated: "boolean",
        isActive: "boolean",
        createdAt: "Date"
      }
    },
    auth: "Bearer JWT Token",
    description: "Get current owner profile"
  }
};

// ============================================
// 👥 OWNER MANAGEMENT APIs
// ============================================

export const OwnerAPIs = {
  // Get All Owners
  "GET /api/owners": {
    input: "None",
    output: {
      success: "boolean",
      data: "Owner[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all owners"
  },

  // Get Owner by ID
  "GET /api/owners/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "Owner"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific owner by ID"
  },

  // Update Owner
  "PUT /api/owners/:id": {
    input: {
      params: { id: "string" },
      body: {
        name: "string (optional)",
        email: "string (optional)",
        accountType: "'admin' | 'superadmin' (optional)",
        isActive: "boolean (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Owner"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Update owner details"
  },

  // Delete Owner
  "DELETE /api/owners/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Delete owner account"
  }
};

// ============================================
// 🏢 ORGANIZATION APIs
// ============================================

export const OrganizationAPIs = {
  // Create Organization
  "POST /api/organizations": {
    input: {
      name: "string",
      description: "string",
      ownerId: "string"
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        name: "string",
        description: "string",
        ownerId: "string",
        isActive: "boolean",
        createdAt: "Date"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Create new organization (sets organizationCreated=true for owner)"
  },

  // Get All Organizations
  "GET /api/organizations": {
    input: "None",
    output: {
      success: "boolean",
      data: "Organization[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all organizations"
  },

  // Get Organization by ID
  "GET /api/organizations/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "Organization"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific organization"
  },

  // Get Organizations by Owner
  "GET /api/organizations/owner/:ownerId": {
    input: {
      params: { ownerId: "string" }
    },
    output: {
      success: "boolean",
      data: "Organization[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all organizations owned by specific owner"
  },

  // Update Organization
  "PUT /api/organizations/:id": {
    input: {
      params: { id: "string" },
      body: {
        name: "string (optional)",
        description: "string (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Organization"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Update organization details"
  },

  // Delete Organization
  "DELETE /api/organizations/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Delete organization"
  }
};

// ============================================
// 🎯 FEATURE APIs
// ============================================

export const FeatureAPIs = {
  // Create Feature
  "POST /api/features": {
    input: {
      name: "string",
      description: "string",
      organizationId: "string"
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        name: "string",
        description: "string",
        organizationId: "string",
        isActive: "boolean",
        createdAt: "Date"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Create new feature"
  },

  // Get All Features (Organization Filtered)
  "GET /api/features": {
    input: "None",
    output: {
      success: "boolean",
      data: "Feature[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get features (filtered by user's organization, superadmin sees all)"
  },

  // Get Feature by ID
  "GET /api/features/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "Feature"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific feature"
  },

  // Get Features by Organization
  "GET /api/features/organization/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: "Feature[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all features for specific organization"
  },

  // Update Feature
  "PUT /api/features/:id": {
    input: {
      params: { id: "string" },
      body: {
        name: "string (optional)",
        description: "string (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Feature"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Update feature details"
  },

  // Delete Feature
  "DELETE /api/features/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Delete feature"
  }
};

// ============================================
// 💳 PLAN APIs
// ============================================

export const PlanAPIs = {
  // Create Plan
  "POST /api/plans": {
    input: {
      name: "string",
      description: "string",
      price: "number",
      organizationId: "string",
      features: [
        {
          featureId: "string",
          limit: "number",
          isUnlimited: "boolean"
        }
      ]
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        name: "string",
        description: "string",
        organizationId: "string",
        features: "FeatureLimit[]",
        price: "number",
        isActive: "boolean",
        createdAt: "Date"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Create new plan with feature limits"
  },

  // Get All Plans (Organization Filtered)
  "GET /api/plans": {
    input: "None",
    output: {
      success: "boolean",
      data: "Plan[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get plans (filtered by user's organization, superadmin sees all)"
  },

  // Get Plan by ID
  "GET /api/plans/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "Plan"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific plan with populated features"
  },

  // Get Plans by Organization
  "GET /api/plans/organization/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: "Plan[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all plans for specific organization"
  },

  // Update Plan
  "PUT /api/plans/:id": {
    input: {
      params: { id: "string" },
      body: {
        name: "string (optional)",
        description: "string (optional)",
        price: "number (optional)",
        features: "FeatureLimit[] (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Plan"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Update plan details"
  },

  // Delete Plan
  "DELETE /api/plans/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Delete plan"
  }
};

// ============================================
// 👤 FEATURE USER APIs
// ============================================

export const FeatureUserAPIs = {
  // Create Feature User
  "POST /api/feature-users": {
    input: {
      name: "string",
      email: "string",
      featureId: "string",
      organizationId: "string"
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        accessToken: "string",
        name: "string",
        email: "string",
        featureId: "string"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Create feature user and generate access token"
  },

  // Get Feature User by ID
  "GET /api/feature-users/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "FeatureUser"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific feature user"
  },

  // Get Feature Users by Feature
  "GET /api/feature-users/feature/:featureId": {
    input: {
      params: { featureId: "string" }
    },
    output: {
      success: "boolean",
      data: "FeatureUser[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all users for specific feature"
  },

  // Get Feature Users by Organization
  "GET /api/feature-users/organization/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: "FeatureUser[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all feature users in organization"
  },

  // Validate Feature User Token
  "POST /api/feature-users/validate": {
    input: {
      accessToken: "string"
    },
    output: {
      success: "boolean",
      data: {
        valid: "boolean",
        userId: "string",
        featureId: "string",
        organizationId: "string"
      }
    },
    auth: "None (Public)",
    description: "Validate feature user access token"
  },

  // Deactivate Feature User
  "PATCH /api/feature-users/:id/deactivate": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Deactivate feature user account"
  }
};

// ============================================
// 📋 USER PLAN APIs
// ============================================

export const UserPlanAPIs = {
  // Create User Plan
  "POST /api/user-plans": {
    input: {
      userId: "string",
      planId: "string",
      organizationId: "string",
      expiryDate: "string (ISO date)"
    },
    output: {
      success: "boolean",
      data: {
        id: "string",
        accessToken: "string",
        planId: "string",
        expiryDate: "Date"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Assign plan to user and generate plan access token"
  },

  // Get User Plan by ID
  "GET /api/user-plans/:id": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      data: "UserPlan"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get specific user plan"
  },

  // Get User Plans by User
  "GET /api/user-plans/user/:userId": {
    input: {
      params: { userId: "string" }
    },
    output: {
      success: "boolean",
      data: "UserPlan[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get all plans for specific user"
  },

  // Validate User Plan Token
  "POST /api/user-plans/validate": {
    input: {
      accessToken: "string"
    },
    output: {
      success: "boolean",
      data: {
        valid: "boolean",
        planId: "string",
        userId: "string",
        expiryDate: "Date"
      }
    },
    auth: "None (Public)",
    description: "Validate user plan access token"
  },

  // Upgrade User Plan
  "PATCH /api/user-plans/:id/upgrade": {
    input: {
      params: { id: "string" },
      body: { newPlanId: "string" }
    },
    output: {
      success: "boolean",
      data: "UserPlan",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Upgrade user to higher plan (generates new token)"
  },

  // Downgrade User Plan
  "PATCH /api/user-plans/:id/downgrade": {
    input: {
      params: { id: "string" },
      body: { newPlanId: "string" }
    },
    output: {
      success: "boolean",
      data: "UserPlan",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Downgrade user to lower plan (generates new token)"
  },

  // Extend Plan Expiry
  "PATCH /api/user-plans/:id/extend": {
    input: {
      params: { id: "string" },
      body: { newExpiryDate: "string (ISO date)" }
    },
    output: {
      success: "boolean",
      data: "UserPlan",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Extend plan expiry date"
  },

  // Remove User Plan
  "DELETE /api/user-plans/:id/remove": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Completely remove user plan from database"
  },

  // Deactivate User Plan
  "PATCH /api/user-plans/:id/deactivate": {
    input: {
      params: { id: "string" }
    },
    output: {
      success: "boolean",
      message: "string"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Deactivate user plan (sets isActive=false)"
  },

  // Get Plan History
  "GET /api/user-plans/history/:userId": {
    input: {
      params: { userId: "string" }
    },
    output: {
      success: "boolean",
      data: "UserPlan[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get complete plan history for user (active + inactive)"
  }
};

// ============================================
// 📊 USAGE TRACKING APIs
// ============================================

export const UsageAPIs = {
  // Track Usage
  "POST /api/usage/track": {
    input: {
      accessToken: "string (user plan token)",
      featureId: "string"
    },
    output: {
      success: "boolean",
      data: {
        currentUsage: "number",
        limit: "number | 'unlimited'",
        remaining: "number | 'unlimited'"
      }
    },
    auth: "None (Public)",
    description: "Track feature usage and check limits"
  },

  // Get Usage by Organization
  "GET /api/usage/organization/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: "Usage[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get usage statistics for organization"
  },

  // Get Usage by Feature
  "GET /api/usage/feature/:featureId": {
    input: {
      params: { featureId: "string" }
    },
    output: {
      success: "boolean",
      data: "Usage[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get usage statistics for specific feature"
  }
};

// ============================================
// 📈 ANALYTICS APIs
// ============================================

export const AnalyticsAPIs = {
  // Get Organization Analytics
  "GET /api/analytics/organization/:organizationId": {
    input: {
      params: { organizationId: "string" },
      query: {
        startDate: "string (optional)",
        endDate: "string (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Analytics[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get analytics data for organization with date filtering"
  },

  // Get Feature Analytics
  "GET /api/analytics/feature/:featureId": {
    input: {
      params: { featureId: "string" },
      query: {
        startDate: "string (optional)",
        endDate: "string (optional)"
      }
    },
    output: {
      success: "boolean",
      data: "Analytics[]"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get analytics data for specific feature"
  },

  // Get Dashboard Stats (Simple)
  "GET /api/analytics/dashboard/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: {
        totalRequests: "number",
        successfulRequests: "number",
        failedRequests: "number",
        limitExceededCount: "number",
        avgResponseTime: "number"
      }
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get basic dashboard statistics for today"
  }
};

// ============================================
// 🎛️ COMPREHENSIVE DASHBOARD APIs
// ============================================

export const DashboardAPIs = {
  // Get Comprehensive Organization Dashboard
  "GET /api/dashboard/organization/:organizationId": {
    input: {
      params: { organizationId: "string" }
    },
    output: {
      success: "boolean",
      data: {
        overview: {
          totalUsers: "number",
          totalFeatures: "number",
          totalPlans: "number",
          activeUserPlans: "number",
          totalRevenue: "number",
          monthlyActiveUsers: "number"
        },
        userStats: {
          newUsersThisMonth: "number",
          userGrowthRate: "number",
          activeUsersToday: "number",
          topActiveUsers: "Array<{userId, userName, email, totalUsage, lastActive}>"
        },
        featureStats: {
          mostPopularFeatures: "Array<{featureId, featureName, userCount, totalUsage, avgUsagePerUser}>",
          featureUsageTrend: "Array<{featureId, featureName, dailyUsage: Array<{date, usage}>}>"
        },
        planStats: {
          mostPopularPlans: "Array<{planId, planName, price, subscriberCount, revenue, conversionRate}>",
          planDistribution: "Array<{planName, count, percentage}>",
          revenueByPlan: "Array<{planName, revenue, percentage}>"
        },
        usageStats: {
          totalApiCalls: "number",
          successRate: "number",
          avgResponseTime: "number",
          peakUsageHours: "Array<{hour, usage}>",
          monthlyUsageTrend: "Array<{month, totalUsage, uniqueUsers}>"
        },
        performanceStats: {
          limitExceededCount: "number",
          errorRate: "number",
          topErrorFeatures: "Array<{featureId, featureName, errorCount, errorRate}>"
        }
      },
      organizationName: "string",
      generatedAt: "string (ISO date)"
    },
    auth: "Bearer JWT Token (Admin)",
    description: "Get comprehensive dashboard with all analytics, trends, and insights"
  }
};

// ============================================
// 🏥 HEALTH CHECK APIs
// ============================================

export const HealthAPIs = {
  // API Health Check
  "GET /api/": {
    input: "None",
    output: {
      message: "string",
      timestamp: "string",
      status: "string"
    },
    auth: "None (Public)",
    description: "Basic API health check"
  },

  // Server Health Check
  "GET /health": {
    input: "None",
    output: {
      status: "string",
      timestamp: "string",
      uptime: "number",
      database: "string"
    },
    auth: "None (Public)",
    description: "Detailed server health status"
  }
};

// ============================================
// 📝 API SUMMARY
// ============================================

export const APISummary = {
  totalEndpoints: 47,
  publicEndpoints: 6,
  protectedEndpoints: 41,
  subjects: [
    "Authentication (3 endpoints)",
    "Owner Management (4 endpoints)", 
    "Organizations (6 endpoints)",
    "Features (6 endpoints)",
    "Plans (6 endpoints)",
    "Feature Users (6 endpoints)",
    "User Plans (9 endpoints)",
    "Usage Tracking (3 endpoints)",
    "Analytics (3 endpoints)",
    "Dashboard (1 endpoint)",
    "Health Check (2 endpoints)"
  ],
  authenticationTypes: [
    "None (Public) - 6 endpoints",
    "Bearer JWT Token (Admin) - 41 endpoints"
  ],
  organizationFiltering: [
    "GET /api/features - Filtered by user's organization",
    "GET /api/plans - Filtered by user's organization",
    "All other endpoints respect organization boundaries"
  ]
};

// ============================================
// 🔑 AUTHENTICATION FLOW
// ============================================

export const AuthenticationFlow = {
  step1: "POST /api/owners/register - Create admin account",
  step2: "POST /api/owners/login - Get JWT token",
  step3: "Use JWT token in Authorization: Bearer <token> header",
  step4: "Token contains organization context for automatic filtering",
  tokenStructure: {
    ownerId: "string",
    email: "string", 
    accountType: "string",
    organizationId: "string (optional)"
  }
};

// ============================================
// 🔄 TYPICAL USAGE FLOW
// ============================================

export const TypicalUsageFlow = {
  adminSetup: [
    "1. Register owner account",
    "2. Login to get JWT token", 
    "3. Create organization",
    "4. Create features",
    "5. Create plans with feature limits"
  ],
  userOnboarding: [
    "6. Create feature users",
    "7. Assign plans to users (creates user plans)",
    "8. Users get access tokens for API usage"
  ],
  usageTracking: [
    "9. Users make API calls with plan tokens",
    "10. System tracks usage against limits",
    "11. Analytics are recorded automatically"
  ],
  monitoring: [
    "12. View usage analytics",
    "13. Monitor dashboard statistics", 
    "14. Manage plan upgrades/downgrades"
  ]
};