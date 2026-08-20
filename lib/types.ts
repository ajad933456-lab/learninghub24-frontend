// ─── All TypeScript types matching the backend Mongoose models ───────────────

export type UserRole = 'admin' | 'teacher' | 'student';

export type ProfileStatus =
  | 'pending_details'
  | 'pending_approval'
  | 'active'
  | 'rejected'
  | 'suspended';

export interface User {
  _id: string;
  uid: string;
  email: string;
  isEmailVerified: boolean;
  fullName: string;
  phone: string;
  role: UserRole;
  profileStatus: ProfileStatus;
  isActive: boolean;
  avatarUrl?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ─── TeacherProfile ───────────────────────────────────────────────────────────

export interface TeacherProfile {
  _id: string;
  user: string | User;
  /** Map: { "Class 9": ["Math", "Physics"], ... } */
  subjectsTaught: Record<string, string[]>;
  qualifications: string[];
  experienceYears: number;
  teachingMode: 'online' | 'offline' | 'both';
  city: string;
  bio: string;
  hourlyRate: number;
  isApproved: boolean;
  rejectionReason?: string;
  enquiryCreditsBalance: number;
  averageRating: number;
  totalReviews: number;
  createdAt: string;
  updatedAt: string;
}

// ─── StudentProfile ───────────────────────────────────────────────────────────

export type Board = 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Other';

export interface StudentProfile {
  _id: string;
  user: string | User;
  class: string;
  board: Board;
  city: string;
  subjectsInterested: string[];
  preferredMode: 'online' | 'offline' | 'both';
  budgetRange: { min: number; max: number };
  preferredLanguage: string[];
  learningGoal: string;
  createdAt: string;
  updatedAt: string;
}

// ─── SubjectCatalog ───────────────────────────────────────────────────────────

/** One class entry returned by GET /api/subjects */
export interface SubjectCatalogItem {
  _id: string;
  name: string;
  subjects: string[];
  createdAt: string;
  updatedAt: string;
}

/** The full response from GET /api/subjects — data.classes is the array of entries */
export interface SubjectCatalogResponse {
  classes: SubjectCatalogItem[];
}

/**
 * Converts the API array to the Record<className, subjects[]> shape
 * expected by SubjectPicker and all form state.
 */
export function catalogArrayToRecord(items: SubjectCatalogItem[]): Record<string, string[]> {
  return Object.fromEntries(items.map((item) => [item.name, item.subjects]));
}

// ─── Query ────────────────────────────────────────────────────────────────────

export type QueryStatus = 'open' | 'closed' | 'moderated';
export type PreferredMode = 'online' | 'offline' | 'both';

export interface Query {
  _id: string;
  student: string | User;
  title: string;
  subject: string;
  class: string;
  description: string;
  board: Board | '';
  city: string;
  preferredMode: PreferredMode;
  budget: number;
  status: QueryStatus;
  contactedBy: string[];
  moderationNote?: string;
  /** Present in browse results — true if this teacher has unlocked */
  isUnlocked?: boolean;
  createdAt: string;
  updatedAt: string;
}

// ─── Plan ─────────────────────────────────────────────────────────────────────

export interface Plan {
  _id: string;
  name: string;
  description: string;
  credits: number;
  /** In paise (INR × 100) */
  price: number;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────────

export type PaymentStatus = 'created' | 'paid' | 'failed' | 'refunded';

export interface Payment {
  _id: string;
  teacher?: string | User;   // undefined for guest payments
  plan?: string | Plan;
  paymentType?: 'plan' | 'custom' | 'guest';
  customDetails?: {
    email?: string;
    number?: string;
    phone?: string;
    fullName?: string;
  };
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  currency: 'INR';
  status: PaymentStatus;
  creditsGranted: number;
  paidAt?: string;
  notes?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── EnquiryTransaction ───────────────────────────────────────────────────────

export interface EnquiryTransaction {
  _id: string;
  teacher: string | User;
  type: 'credit' | 'debit';
  credits: number;
  description: string;
  payment?: string;
  contactUnlock?: string;
  balanceAfter: number;
  createdAt: string;
  updatedAt: string;
}

// ─── ContactUnlock ────────────────────────────────────────────────────────────

export interface ContactUnlock {
  _id: string;
  teacher: string | User;
  query: string | Query;
  student: string | User;
  creditsSpent: number;
  unlockedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ─── Notification ─────────────────────────────────────────────────────────────

export type NotificationType =
  | 'teacher_approved'
  | 'teacher_rejected'
  | 'query_contacted'
  | 'payment_success'
  | 'payment_failed'
  | 'new_review'
  | 'profile_incomplete'
  | 'general';

export interface Notification {
  _id: string;
  user: string | User;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── ActivityLog ──────────────────────────────────────────────────────────────

export type ActivityType =
  | 'teacher_login'
  | 'student_login'
  | 'teacher_registered'
  | 'student_registered'
  | 'teacher_profile_submitted'
  | 'teacher_approved'
  | 'teacher_rejected'
  | 'query_posted'
  | 'query_unlocked'
  | 'payment_initiated'
  | 'payment_success'
  | 'payment_failed'
  | 'plan_purchased'
  | 'user_suspended'
  | 'user_activated'
  | 'query_created'
  | 'payment_made'
  | 'guest_payment_made'
  | 'credits_adjusted';

export interface ActivityLog {
  _id: string;
  type: ActivityType;
  message: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

// ─── Course ───────────────────────────────────────────────────────────────────

export interface Course {
  _id: string;
  teacher: string | User;
  title: string;
  subject: string;
  description: string;
  price: number;
  mode: 'online' | 'offline' | 'both';
  thumbnailUrl?: string;
  board: string;
  class: string;
  language: string;
  isPublished: boolean;
  averageRating: number;
  totalReviews: number;
  totalEnrolled: number;
  createdAt: string;
  updatedAt: string;
}

// ─── Review ───────────────────────────────────────────────────────────────────

export interface Review {
  _id: string;
  teacher: string | User;
  student: string | User;
  course: string | Course;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

// ─── API Response wrappers ────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors: null | Record<string, string>;
}

export interface PaginatedResponse<T> {
  items: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export interface AdminStats {
  users: {
    total: number;
    students: number;
    teachers: number;
  };
  teachers: {
    pending: number;
    active: number;
  };
  queries: {
    total: number;
    open: number;
  };
  courses: {
    total: number;
    published: number;
  };
  reviews: {
    total: number;
  };
  revenue: {
    totalPaise: number;
    totalINR: number;
  };
}


