export type UserRole = 'respondent' | 'coach' | 'partner' | 'admin';
export type SubscriptionTier = 'basic' | 'basic_plus' | 'advanced' | 'partner' | 'admin';

export interface User {
  userId: string;
  email: string;
  fullName: string;
  role: UserRole;
  subscription_tier: SubscriptionTier;
  createdAt: Date;
  updatedAt: Date;
}

export interface Admin {
  userId: string;
  permissions: {
    manageUsers: boolean;
    manageCoaches: boolean;
    managePartners: boolean;
    manageAssessmentCodes: boolean;
    viewAnalytics: boolean;
    manageSystem: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Partner {
  userId: string;
  permissions: {
    manageCoaches: boolean;
    createAssessmentCodes: boolean;
  };
  maxCoaches: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Coach {
  userId: string;
  partnerId?: string;
  assessmentCode: string;
  tier: 'basic' | 'basic_plus' | 'advanced' | 'partner';
  aiAnalysisAccess: boolean;
  createdAt: Date;
  updatedAt: Date;
}