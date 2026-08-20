# LearningHub24 — Backend System Design & Integration Guide

> **Purpose:** This document describes the complete backend architecture, data models, API surface, business logic, and the three new features to be implemented. It is written to be handed to an AI (or a developer) to implement the missing parts and integrate the backend with the frontend.

---

## Table of Contents

1. [Tech Stack & Project Structure](#1-tech-stack--project-structure)
2. [Authentication Model](#2-authentication-model)
3. [Role System](#3-role-system)
4. [Data Models (MongoDB / Mongoose)](#4-data-models-mongodb--mongoose)
5. [API Routes Reference](#5-api-routes-reference)
6. [Business Logic Flows](#6-business-logic-flows)
7. [New Feature 1 — Structured Subjects (Class → Subject Map)](#7-new-feature-1--structured-subjects-class--subject-map)
8. [New Feature 2 — Enquiry Token Economy & Plan Purchase](#8-new-feature-2--enquiry-token-economy--plan-purchase)
9. [New Feature 3 — Admin Recent Activity Feed](#9-new-feature-3--admin-recent-activity-feed)
10. [Files to Create / Modify (Implementation Checklist)](#10-files-to-create--modify-implementation-checklist)
11. [Environment Variables](#11-environment-variables)
12. [Error Handling Convention](#12-error-handling-convention)
13. [Frontend Integration Notes](#13-frontend-integration-notes)

---

## 1. Tech Stack & Project Structure

| Layer | Technology |
|---|---|
| Runtime | Node.js (ESM-disabled, `'use strict'` CommonJS) |
| Web Framework | Express.js v4 |
| Database | MongoDB via Mongoose v8 |
| Auth | Firebase Admin SDK (token verification only — no Firebase DB) |
| Payments | Razorpay (orders + webhooks) |
| Validation | Joi |
| Logging | Winston + Morgan |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize, hpp, xss-clean |
| Docs | Swagger UI at `/api/docs` |
| Tests | Jest + Supertest + mongodb-memory-server |

### Directory Layout

```
learninghub24-backend/
├── server.js                   # HTTP server entry point
├── src/
│   ├── app.js                  # Express app, middleware, routes registration
│   ├── config/
│   │   ├── firebase.js         # Firebase Admin SDK init
│   │   ├── razorpay.js         # Razorpay SDK init
│   │   ├── swagger.js          # Swagger spec config
│   │   └── logger.js           # Winston logger
│   ├── models/                 # Mongoose schemas
│   ├── controllers/            # Thin HTTP layer — calls services
│   ├── services/               # Business logic
│   ├── routes/                 # Express routers
│   ├── middlewares/            # Auth, role guards, error handler, validation
│   ├── validators/             # Joi schemas per domain
│   ├── utils/                  # AppError, catchAsync, apiResponse, pagination
│   └── seed/                   # DB seed scripts
```

---

## 2. Authentication Model

LearningHub24 uses **Firebase Authentication** on the client-side and **Firebase Admin SDK** on the backend for token verification. There is **no password storage** in MongoDB.

### Flow

```
Client (Frontend)
    │
    ├─ Signs in via Firebase (email/password, etc.)
    │
    ├─ Receives Firebase ID Token (JWT)
    │
    └─ Sends token as `Authorization: Bearer <token>` on every API call

Backend
    │
    ├─ verifyFirebaseToken middleware decodes & verifies the token
    │
    ├─ Looks up User in MongoDB by uid (Firebase UID)
    │
    └─ Attaches req.user = { _id, uid, email, role, profileStatus, ... }
```

### `POST /api/auth/sync`

Must be called **after every login/signup** on the frontend. It:
- Creates a new MongoDB `User` document (if first time) with the role provided.
- Updates `lastLoginAt` for returning users.
- Returns the full user object.

### `GET /api/auth/me`

Returns the currently authenticated user's MongoDB document.

---

## 3. Role System

Three roles exist. Each has different access levels enforced by the `restrictTo(role)` middleware.

| Role | Description |
|---|---|
| `student` | Can post learning queries, manage their profile |
| `teacher` | Must be approved by admin; can browse queries, buy plans, unlock student contact |
| `admin` | Full platform management, cannot be created via API (manually seeded) |

### Profile Status (`User.profileStatus`)

| Status | Meaning |
|---|---|
| `pending_details` | New user, profile not yet filled |
| `pending_approval` | Teacher submitted profile, waiting for admin approval |
| `active` | Account fully operational |
| `rejected` | Admin rejected teacher profile |
| `suspended` | Admin suspended user |

The `requireActiveProfile` middleware blocks teachers and students with non-`active` status from performing gated operations (browsing queries, creating queries, etc.).

---

## 4. Data Models (MongoDB / Mongoose)

### 4.1 User

```js
{
  uid: String,           // Firebase UID (unique, indexed)
  email: String,         // lowercase, unique
  fullName: String,
  phone: String,
  role: 'admin' | 'teacher' | 'student',
  profileStatus: 'pending_details' | 'pending_approval' | 'active' | 'rejected' | 'suspended',
  isActive: Boolean,     // admin can toggle
  avatarUrl: String,
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.2 TeacherProfile

> **CHANGE REQUIRED:** `subjectsTaught` is being changed from `[String]` to a structured map `{ className: [subjectNames] }`. See Section 7.

```js
{
  user: ObjectId → User,
  subjectsTaught: Map,   // NEW: { "Class 1": ["English", "Math"], "Bachelor's of Arts": ["Sociology"] }
  qualifications: [String],
  experienceYears: Number,
  teachingMode: 'online' | 'offline' | 'both',
  city: String,
  bio: String,
  hourlyRate: Number,
  isApproved: Boolean,
  rejectionReason: String,
  enquiryCreditsBalance: Number,  // live balance; updated on plan purchase & query unlock
  averageRating: Number,
  totalReviews: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.3 StudentProfile

```js
{
  user: ObjectId → User,
  class: String,          // e.g. "Class 10", "Bachelor's of Science"
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Other',
  city: String,
  subjectsInterested: [String],
  preferredMode: 'online' | 'offline' | 'both',
  budgetRange: { min: Number, max: Number },
  preferredLanguage: [String],
  learningGoal: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.4 SubjectCatalog (NEW MODEL)

This is the admin-managed, platform-wide class → subjects map. Pre-seeded with defaults; admin can update.

```js
{
  _id: ObjectId,
  catalog: {
    type: Map,
    of: [String],
    // e.g. { "Class 1": ["English", "Math", "EVS"], "Class 10": ["Physics", "Chemistry", ...] }
  },
  updatedBy: ObjectId → User,   // last admin who edited
  createdAt: Date,
  updatedAt: Date
}
```

> There will be **only one document** in this collection (singleton pattern). The admin UI reads it and patches entries.

### 4.5 Query (Student Learning Request)

```js
{
  student: ObjectId → User,
  title: String,          // max 200 chars
  subject: String,        // must match a subject from SubjectCatalog
  class: String,          // the class level this query is for
  description: String,    // max 2000 chars
  board: 'CBSE' | 'ICSE' | 'State Board' | 'IB' | 'Cambridge' | 'Other' | '',
  city: String,
  preferredMode: 'online' | 'offline' | 'both',
  budget: Number,
  status: 'open' | 'closed' | 'moderated',
  contactedBy: [ObjectId → User],  // teachers who have unlocked this query
  moderationNote: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes:**
- `{ subject: 1, city: 1, status: 1 }` — for teacher browse filtering
- `{ status: 1, createdAt: -1 }` — for latest open queries

### 4.6 Plan (Enquiry Credit Package)

```js
{
  name: String,          // e.g. "Silver", "Gold", "Diamond", "Custom"
  description: String,
  credits: Number,       // number of enquiry tokens granted
  price: Number,         // in paise (INR x 100). e.g. 49900 = Rs.499
  isActive: Boolean,
  displayOrder: Number,  // for UI ordering (0 = first)
  createdAt: Date,
  updatedAt: Date
}
```

**Predefined plans (seeded):**
| Plan | Credits | Price |
|---|---|---|
| Silver | 10 | Rs.299 |
| Gold | 25 | Rs.599 |
| Diamond | 60 | Rs.999 |
| Custom | admin-set | admin-set |

### 4.7 Payment (Razorpay Transaction Record)

```js
{
  teacher: ObjectId → User,
  plan: ObjectId → Plan,
  razorpayOrderId: String,     // unique
  razorpayPaymentId: String,   // filled after payment
  razorpaySignature: String,   // filled after verification
  amount: Number,              // in paise
  currency: 'INR',
  status: 'created' | 'paid' | 'failed' | 'refunded',
  creditsGranted: Number,      // credits added on successful payment
  paidAt: Date,
  notes: Mixed,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.8 EnquiryTransaction (Credit Ledger)

Every credit change (purchase or spend) is logged here.

```js
{
  teacher: ObjectId → User,
  type: 'credit' | 'debit',
  credits: Number,
  description: String,
  payment: ObjectId → Payment,              // set for 'credit' entries
  contactUnlock: ObjectId → ContactUnlock,  // set for 'debit' entries
  balanceAfter: Number,                     // snapshot of balance after this transaction
  createdAt: Date,
  updatedAt: Date
}
```

### 4.9 ContactUnlock

Records which teacher unlocked which query (preventing double-spend).

```js
{
  teacher: ObjectId → User,
  query: ObjectId → Query,
  student: ObjectId → User,
  creditsSpent: Number,    // default 1
  unlockedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
// Unique index: { teacher: 1, query: 1 }
```

### 4.10 Notification

```js
{
  user: ObjectId → User,
  type: 'teacher_approved' | 'teacher_rejected' | 'query_contacted' | 'payment_success' | 'payment_failed' | 'new_review' | 'profile_incomplete' | 'general',
  title: String,
  message: String,
  isRead: Boolean,
  metadata: Mixed,   // extra context (paymentId, queryId, etc.)
  createdAt: Date,
  updatedAt: Date
}
```

### 4.11 ActivityLog (NEW MODEL)

Powers the admin "Recent Activity" feed.

```js
{
  actor: ObjectId → User,
  actorRole: 'teacher' | 'student' | 'admin',
  actorName: String,   // denormalized for display speed
  actorEmail: String,  // denormalized for display speed
  type: String,        // event type enum (see table below)
  description: String, // human-readable summary
  metadata: Mixed,     // additional context (planId, queryId, etc.)
  createdAt: Date,
  updatedAt: Date
}
```

**Index:** `{ createdAt: -1 }` and `{ type: 1, createdAt: -1 }`

**Event types for `ActivityLog.type`:**
| Type | Triggered When |
|---|---|
| `teacher_login` | Teacher calls POST /api/auth/sync (returning user) |
| `student_login` | Student calls POST /api/auth/sync (returning user) |
| `teacher_registered` | New teacher signs up (first sync) |
| `student_registered` | New student signs up (first sync) |
| `teacher_profile_submitted` | Teacher submits/updates profile |
| `teacher_approved` | Admin approves a teacher |
| `teacher_rejected` | Admin rejects a teacher |
| `query_posted` | Student posts a query |
| `query_unlocked` | Teacher unlocks a student query (spends a token) |
| `payment_initiated` | Teacher creates a Razorpay order |
| `payment_success` | Teacher payment verified & credits added |
| `payment_failed` | Payment webhook reports failure |
| `plan_purchased` | Alias of payment_success for clarity |
| `user_suspended` | Admin toggles a user inactive |
| `user_activated` | Admin re-activates a user |

### 4.12 Course

```js
{
  teacher: ObjectId → User,
  title: String,
  subject: String,
  description: String,
  price: Number,
  mode: 'online' | 'offline' | 'both',
  thumbnailUrl: String,
  board: String,
  class: String,
  language: String,
  isPublished: Boolean,
  averageRating: Number,
  totalReviews: Number,
  totalEnrolled: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### 4.13 Review

```js
{
  teacher: ObjectId → User,
  student: ObjectId → User,
  course: ObjectId → Course,
  rating: Number,   // 1 to 5
  comment: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 5. API Routes Reference

All routes are prefixed with `/api`.
Auth header: `Authorization: Bearer <Firebase ID Token>`

### Auth

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/auth/sync` | Yes | any | Sync Firebase user to MongoDB; call on every login |
| GET | `/auth/me` | Yes | any | Get authenticated user's profile |

### Students

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/students/profile` | Yes | student | Create or update student profile |
| GET | `/students/profile` | Yes | student | Get own student profile |
| GET | `/students/:userId/profile` | Yes | any | Get a student's public profile |

### Teachers

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/teachers/profile` | Yes | teacher | Create or update teacher profile (sets status to pending_approval) |
| GET | `/teachers/profile` | Yes | teacher | Get own teacher profile |
| GET | `/teachers/credits` | Yes | teacher | Get own enquiry credit balance |
| GET | `/teachers/:userId/profile` | No | public | Get a teacher's approved public profile |

### Queries

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/queries` | Yes | student | Create a learning query |
| GET | `/queries/my` | Yes | student | Get own queries |
| GET | `/queries/browse` | Yes | teacher (active) | Browse open queries with filters |
| GET | `/queries/:id` | Yes | any | Get a single query |
| PATCH | `/queries/:id` | Yes | student | Update own query |
| DELETE | `/queries/:id` | Yes | student | Delete own query |
| POST | `/queries/:id/unlock` | Yes | teacher (active) | Spend 1 credit to reveal full student contact info |

### Payments

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/payments/create-order` | Yes | teacher | Create Razorpay order for a plan |
| POST | `/payments/verify` | Yes | teacher | Verify payment signature; credits added on success |
| POST | `/payments/webhook` | No | Razorpay | Razorpay webhook (raw body, signature in header) |
| GET | `/payments/my` | Yes | teacher | Get own payment / plan purchase history |
| GET | `/payments/credits/history` | Yes | teacher | Get credit ledger (purchases + spends) |

### Plans

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/plans` | No | public | List all active plans (for teachers to browse before buying) |

### Subject Catalog (NEW)

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/subjects` | No | public | Get full subject catalog (used in forms) |

### Courses

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/courses` | Yes | teacher | Create a course |
| GET | `/courses` | No | public | List published courses with filters |
| GET | `/courses/:id` | No | public | Get a single course |
| PATCH | `/courses/:id` | Yes | teacher | Update own course |
| DELETE | `/courses/:id` | Yes | teacher | Delete own course |

### Reviews

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| POST | `/reviews` | Yes | student | Post a review for a course |
| GET | `/reviews/course/:courseId` | No | public | Get reviews for a course |

### Notifications

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/notifications` | Yes | any | Get own notifications |
| PATCH | `/notifications/:id/read` | Yes | any | Mark notification as read |
| PATCH | `/notifications/read-all` | Yes | any | Mark all notifications as read |

### Admin

| Method | Path | Auth | Role | Description |
|---|---|---|---|---|
| GET | `/admin/dashboard/stats` | Yes | admin | Platform-wide stats |
| GET | `/admin/dashboard/activity` | Yes | admin | NEW — Recent activity feed |
| GET | `/admin/teachers/pending` | Yes | admin | Get teachers awaiting approval |
| PATCH | `/admin/teachers/:id/approve` | Yes | admin | Approve a teacher |
| PATCH | `/admin/teachers/:id/reject` | Yes | admin | Reject a teacher with reason |
| GET | `/admin/users` | Yes | admin | All users with filters |
| GET | `/admin/users/:id` | Yes | admin | Get single user |
| PATCH | `/admin/users/:id/toggle-status` | Yes | admin | Activate / deactivate user |
| GET | `/admin/plans` | Yes | admin | All plans (including inactive) |
| POST | `/admin/plans` | Yes | admin | Create a plan |
| PATCH | `/admin/plans/:id` | Yes | admin | Update a plan |
| DELETE | `/admin/plans/:id` | Yes | admin | Delete a plan |
| GET | `/admin/payments` | Yes | admin | All payments platform-wide |
| GET | `/admin/queries` | Yes | admin | All queries with filters |
| PATCH | `/admin/queries/:id/moderate` | Yes | admin | Moderate (change status, add note) |
| GET | `/admin/courses` | Yes | admin | All courses (all teachers) |
| PATCH | `/admin/courses/:id` | Yes | admin | Edit any course |
| DELETE | `/admin/courses/:id` | Yes | admin | Delete any course |
| GET | `/admin/subjects` | Yes | admin | NEW — Get subject catalog with audit info |
| PUT | `/admin/subjects` | Yes | admin | NEW — Replace full subject catalog |
| PATCH | `/admin/subjects/:className` | Yes | admin | NEW — Add/update subjects for one class |
| DELETE | `/admin/subjects/:className` | Yes | admin | NEW — Remove a class from catalog |

---

## 6. Business Logic Flows

### 6.1 Teacher Onboarding

```
1. Teacher signs up via Firebase (frontend)
2. Frontend calls POST /api/auth/sync { role: "teacher", fullName, phone }
   → MongoDB User created with profileStatus: "pending_details"
3. Teacher fills profile form (subjects by class, experience, etc.)
4. Frontend calls POST /api/teachers/profile { subjectsTaught: {...}, ... }
   → TeacherProfile created/updated; User.profileStatus → "pending_approval"
5. Admin sees teacher in pending list
6. Admin approves → User.profileStatus → "active"; TeacherProfile.isApproved → true
   → Notification sent to teacher
7. Teacher can now browse student queries and buy plans
```

### 6.2 Student Query Flow

```
1. Student signs up → POST /api/auth/sync { role: "student" }
2. Student fills profile → POST /api/students/profile { class, board, city, subjects, ... }
   → User.profileStatus → "active"
3. Student posts query → POST /api/queries { title, subject, class, description, ... }
4. Query appears in teacher browse feed (GET /api/queries/browse)
5. Teacher sees query card with minimal info:
   • Subject, Class, City, Board, Budget, Preferred Mode, Time Posted
   • Student name is MASKED (first name + last initial only)
   • Student contact (email, phone) is HIDDEN
6. Teacher clicks "Reveal Contact" → POST /api/queries/:id/unlock
   → 1 credit deducted from TeacherProfile.enquiryCreditsBalance
   → ContactUnlock record created
   → Full student contact (name, email, phone) returned
   → Student notified via Notification
```

### 6.3 Plan Purchase Flow (Razorpay)

```
1. Teacher selects a plan (Silver / Gold / Diamond / Custom)
2. Frontend calls POST /api/payments/create-order { planId }
   → Razorpay order created; Payment document saved (status: "created")
   → Returns { order: { id, amount, currency }, payment: { _id } }
3. Frontend opens Razorpay checkout modal with order.id, key_id
4. User completes payment in modal
5. Frontend calls POST /api/payments/verify { razorpayOrderId, razorpayPaymentId, razorpaySignature }
   → Signature verified using HMAC-SHA256
   → Payment.status → "paid"; credits added to TeacherProfile.enquiryCreditsBalance
   → EnquiryTransaction (type: "credit") logged
   → Teacher notified; ActivityLog entry created
6. Razorpay also fires webhook to POST /api/payments/webhook (idempotent — credits NOT double-added here)
```

### 6.4 Admin Activity Feed

```
Events are logged to ActivityLog at service execution time:
- auth.service.js    → sync()           → teacher_login / student_login / *_registered
- teacher.service.js → upsertProfile()  → teacher_profile_submitted
- admin.service.js   → approveTeacher() → teacher_approved
- admin.service.js   → rejectTeacher()  → teacher_rejected
- query.service.js   → createQuery()    → query_posted
- query.service.js   → unlockContact()  → query_unlocked
- payment.service.js → createOrder()    → payment_initiated
- payment.service.js → verifyPayment()  → payment_success / plan_purchased
- payment.service.js → handleWebhook()  → payment_failed
- admin.service.js   → toggleUserStatus() → user_suspended / user_activated

GET /api/admin/dashboard/activity returns last N entries sorted by createdAt desc, paginated.
```

---

## 7. New Feature 1 — Structured Subjects (Class to Subject Map)

### What Changes

Previously `TeacherProfile.subjectsTaught` was a flat `[String]` array.
Now it becomes a **Map** where each key is a class/level name and each value is an array of subjects the teacher teaches for that specific class/level.

### Why This Matters

- Students select a `class` when posting a query.
- Teachers must indicate which subjects they teach **per class**, enabling precise matching.
- The admin defines the global catalog of valid classes and their available subjects.
- Teachers pick from the catalog (not free-text) to ensure data integrity.

### SubjectCatalog Document (Singleton)

Create model: `src/models/SubjectCatalog.js`

```js
const subjectCatalogSchema = new mongoose.Schema({
  catalog: {
    type: Map,
    of: [String],
    default: new Map(),
  },
  updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });
```

**Default seeded catalog:**

```json
{
  "Class 1":  ["English", "Math", "EVS"],
  "Class 2":  ["English", "Math", "EVS"],
  "Class 3":  ["English", "Math", "Science", "Social Studies"],
  "Class 4":  ["English", "Math", "Science", "Social Studies"],
  "Class 5":  ["English", "Math", "Science", "Social Studies"],
  "Class 6":  ["English", "Math", "Science", "Social Studies", "Hindi"],
  "Class 7":  ["English", "Math", "Science", "Social Studies", "Hindi"],
  "Class 8":  ["English", "Math", "Science", "Social Studies", "Hindi"],
  "Class 9":  ["English", "Math", "Physics", "Chemistry", "Biology", "History", "Geography", "Hindi"],
  "Class 10": ["English", "Math", "Physics", "Chemistry", "Biology", "History", "Geography", "Hindi"],
  "Class 11 (Science)":  ["Physics", "Chemistry", "Biology", "Math", "English"],
  "Class 11 (Commerce)": ["Accountancy", "Business Studies", "Economics", "Math", "English"],
  "Class 11 (Arts)":     ["History", "Political Science", "Geography", "Economics", "English"],
  "Class 12 (Science)":  ["Physics", "Chemistry", "Biology", "Math", "English"],
  "Class 12 (Commerce)": ["Accountancy", "Business Studies", "Economics", "Math", "English"],
  "Class 12 (Arts)":     ["History", "Political Science", "Geography", "Economics", "English"],
  "Bachelor's of Science":   ["Physics", "Chemistry", "Biology", "Math", "Statistics"],
  "Bachelor's of Commerce":  ["Accountancy", "Finance", "Economics", "Business Law"],
  "Bachelor's of Arts":      ["Sociology", "History", "Political Science", "Psychology", "English Literature"],
  "Bachelor's of Technology": ["Data Structures", "Algorithms", "DBMS", "Operating Systems", "Networks"]
}
```

### TeacherProfile Schema Change

```js
// BEFORE
subjectsTaught: { type: [String], required: true }

// AFTER
subjectsTaught: {
  type: Map,
  of: [String],
  required: [true, 'Subjects taught is required'],
  validate: {
    validator: (map) => map && map.size > 0,
    message: 'At least one class and subject must be specified',
  },
}
```

**Example teacher payload:**
```json
{
  "subjectsTaught": {
    "Class 9": ["Math", "Physics"],
    "Class 10": ["Math", "Physics"],
    "Class 11 (Science)": ["Math"]
  },
  "experienceYears": 5,
  "teachingMode": "both",
  "city": "Delhi",
  "hourlyRate": 500
}
```

### Admin Subject Management

#### GET /api/subjects (public)
Returns full catalog so frontend forms can populate dropdowns.

#### PUT /api/admin/subjects (admin)
Replace entire catalog. Body: `{ "catalog": { "Class 1": ["English", "Math"], ... } }`

#### PATCH /api/admin/subjects/:className (admin)
Update subjects for one class. Body: `{ "subjects": ["English", "Math", "EVS", "Art"] }`

#### DELETE /api/admin/subjects/:className (admin)
Remove a class from the catalog (URL-encode the class name).

---

## 8. New Feature 2 — Enquiry Token Economy & Plan Purchase

### How It Works (End-to-End)

```
TEACHER DASHBOARD
    │
    ├─ Sees list of student queries — minimal info only:
    │   • Student first name + last initial (e.g., "Rahul S.")
    │   • Subject
    │   • Class / Level
    │   • City
    │   • Board
    │   • Budget range
    │   • Preferred mode (online/offline/both)
    │   • Time posted
    │   • HIDDEN: full name, email, phone
    │
    ├─ Teacher clicks "Reveal Contact"
    │   → Credit balance >= 1:
    │       POST /api/queries/:id/unlock
    │       1 credit deducted; full contact returned
    │   → Credit balance = 0:
    │       Redirect to Plan Purchase page
    │
    └─ Teacher buys a plan → credits added → can unlock more queries
```

### Plan Tiers

| Plan Name | Enquiry Credits | Price (INR) |
|---|---|---|
| Silver | 10 | Rs.299 |
| Gold | 25 | Rs.599 |
| Diamond | 60 | Rs.999 |
| Custom | admin-defined | admin-defined |

### Teacher's Plan History

Route: `GET /api/payments/my`

Returns all payment records sorted by `createdAt` desc, each including plan details (name, credits, price), amount paid, status, and `paidAt`.

### Teacher's Credit Transaction History

Route: `GET /api/payments/credits/history`

Returns every credit/debit event from `EnquiryTransaction`, including:
- `type`: `"credit"` (plan purchase) or `"debit"` (query unlock)
- `credits`: amount
- `description`: human-readable
- `balanceAfter`: snapshot balance
- `createdAt`: timestamp

### Browse Queries — What Teachers See (Before Unlock)

When a teacher calls `GET /api/queries/browse`, the response intentionally masks student contact.
The service layer should:
1. Return `student.fullName` as masked (first name + last initial) for non-unlocked queries.
2. Include `isUnlocked: true` for queries this teacher already unlocked (in `contactedBy` array).
3. Never include `student.email` or `student.phone` in browse results.

```json
{
  "queries": [
    {
      "_id": "queryId",
      "title": "Need a Math tutor",
      "subject": "Math",
      "class": "Class 10",
      "board": "CBSE",
      "city": "Mumbai",
      "preferredMode": "online",
      "budget": 500,
      "student": {
        "fullName": "R***l K.",
        "avatarUrl": "...",
        "city": "Mumbai"
      },
      "isUnlocked": false,
      "createdAt": "..."
    }
  ]
}
```

---

## 9. New Feature 3 — Admin Recent Activity Feed

### Overview

The admin dashboard "Recent Activity" section shows a live reverse-chronological feed of significant platform events.

### ActivityLog Model

File: `src/models/ActivityLog.js`

```js
const activityLogSchema = new mongoose.Schema({
  actor:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  actorRole:  { type: String, enum: ['teacher', 'student', 'admin'] },
  actorName:  { type: String, default: '' },
  actorEmail: { type: String, default: '' },
  type: {
    type: String,
    enum: [
      'teacher_login', 'student_login',
      'teacher_registered', 'student_registered',
      'teacher_profile_submitted',
      'teacher_approved', 'teacher_rejected',
      'query_posted', 'query_unlocked',
      'payment_initiated', 'payment_success', 'payment_failed',
      'plan_purchased',
      'user_suspended', 'user_activated',
    ],
    required: true,
  },
  description: { type: String, required: true },
  metadata:    { type: mongoose.Schema.Types.Mixed, default: {} },
}, { timestamps: true });

activityLogSchema.index({ createdAt: -1 });
activityLogSchema.index({ type: 1, createdAt: -1 });
```

### Where to Log Activity (Service Layer Integration)

Add `ActivityLog.create(...)` calls at these points:

| Service File | Function | Activity Type |
|---|---|---|
| `auth.service.js` | `sync()` — new user | `teacher_registered` / `student_registered` |
| `auth.service.js` | `sync()` — existing user | `teacher_login` / `student_login` |
| `teacher.service.js` | `upsertProfile()` | `teacher_profile_submitted` |
| `admin.service.js` | `approveTeacher()` | `teacher_approved` |
| `admin.service.js` | `rejectTeacher()` | `teacher_rejected` |
| `admin.service.js` | `toggleUserStatus()` | `user_suspended` / `user_activated` |
| `query.service.js` | `createQuery()` | `query_posted` |
| `query.service.js` | `unlockContact()` | `query_unlocked` |
| `payment.service.js` | `createOrder()` | `payment_initiated` |
| `payment.service.js` | `verifyPayment()` | `payment_success` + `plan_purchased` |
| `payment.service.js` | `handleWebhook()` (failed) | `payment_failed` |

### Admin Activity API

Route: `GET /api/admin/dashboard/activity`

Query params:
- `page` (default: 1)
- `limit` (default: 20)
- `type` — filter by event type (optional)

Sample Response:
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "_id": "...",
        "actorName": "Ramesh Kumar",
        "actorEmail": "ramesh@email.com",
        "actorRole": "teacher",
        "type": "payment_success",
        "description": "Teacher Ramesh Kumar purchased the Gold plan (25 credits) for Rs.599",
        "metadata": { "planName": "Gold", "credits": 25, "amountINR": 599 },
        "createdAt": "2026-07-29T10:45:00Z"
      },
      {
        "_id": "...",
        "actorName": "Priya Sharma",
        "actorRole": "student",
        "type": "query_posted",
        "description": "Student Priya Sharma posted a query: 'Need Chemistry tutor for Class 12'",
        "createdAt": "2026-07-29T10:30:00Z"
      }
    ],
    "pagination": { "total": 142, "page": 1, "limit": 20, "pages": 8 }
  }
}
```

---

## 10. Files to Create / Modify (Implementation Checklist)

### New Files to Create

| File | Purpose |
|---|---|
| `src/models/SubjectCatalog.js` | Mongoose model for class to subject map |
| `src/models/ActivityLog.js` | Mongoose model for admin activity feed |
| `src/controllers/subject.controller.js` | HTTP handlers for subject catalog endpoints |
| `src/services/subject.service.js` | Business logic for subject catalog CRUD |
| `src/routes/subject.routes.js` | Public + admin subject routes |
| `src/validators/subject.validator.js` | Joi validation for subject catalog payloads |
| `src/seed/subjectCatalog.seed.js` | Seed script to insert default subject catalog |

### Existing Files to Modify

| File | What to Change |
|---|---|
| `src/models/TeacherProfile.js` | Change `subjectsTaught` from `[String]` to `Map` type |
| `src/validators/teacher.validator.js` | Update Joi schema to validate `subjectsTaught` as object/map |
| `src/services/auth.service.js` | Add `ActivityLog.create()` calls in `sync()` for login/register events |
| `src/services/teacher.service.js` | Add `ActivityLog.create()` call in `upsertProfile()` |
| `src/services/admin.service.js` | Add `ActivityLog.create()` in approve/reject/toggle functions; add `getRecentActivity()` function |
| `src/services/query.service.js` | Add `ActivityLog.create()` in `createQuery()` and `unlockContact()`; add name masking logic in `browseQueries()` |
| `src/services/payment.service.js` | Add `ActivityLog.create()` in `createOrder()`, `verifyPayment()`, `handleWebhook()` |
| `src/controllers/admin.controller.js` | Add `getRecentActivity` handler; add subject management handlers |
| `src/routes/admin.routes.js` | Add `/dashboard/activity` route; add `/subjects` CRUD routes |
| `src/app.js` | Register `subjectRoutes` under `/api/subjects` |
| `src/seed/seed.js` | Run SubjectCatalog seeder |

---

## 11. Environment Variables

```dotenv
# Server
NODE_ENV=development
PORT=5000

# MongoDB
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/learninghub24

# Firebase Admin SDK
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Razorpay
RAZORPAY_KEY_ID=
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=

# CORS
CORS_ORIGIN=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX=100
```

---

## 12. Error Handling Convention

All errors use `AppError` (extends `Error`) with a `statusCode`.

```js
throw new AppError('Message for client', statusCode);
```

The `globalErrorHandler` middleware converts all errors to:

```json
{
  "success": false,
  "message": "Human-readable error message",
  "data": null,
  "errors": null
}
```

All controller functions are wrapped with `catchAsync(async (req, res) => { ... })` — no try/catch needed in controllers.

All success responses use `sendSuccess(res, statusCode, 'message', data)`:
```json
{ "success": true, "message": "...", "data": { ... }, "errors": null }
```

---

## 13. Frontend Integration Notes

### Authentication

1. Sign in with Firebase SDK. After login, call `firebase.auth().currentUser.getIdToken()`.
2. Include token as `Authorization: Bearer <token>` on every API request.
3. After login/signup, immediately call `POST /api/auth/sync` with `{ role, fullName, phone }`.
4. Store the returned `user` object in state (role, profileStatus, etc.).

### Profile Setup Flow

| profileStatus | Action |
|---|---|
| `pending_details` | Redirect to profile setup (student or teacher form) |
| `pending_approval` | Show "Your profile is under review" screen (teacher only) |
| `active` | Full dashboard access |
| `rejected` | Show rejection reason; allow re-submission |

### Subject Dropdown Population

1. On teacher profile form load, call `GET /api/subjects` to get the full catalog.
2. Render a multi-level UI: first pick a class, then pick subjects for that class.
3. Submit `subjectsTaught` as a nested JSON object: `{ "Class 10": ["Math", "Physics"] }`.
4. On student query form, use the same catalog to populate the class + subject dropdowns.

### Teacher Dashboard — Query Cards

- Call `GET /api/queries/browse` with optional filters (`subject`, `city`, `board`, `preferredMode`).
- Each card shows: subject, class, city, board, budget, mode, time posted.
- Student name shown as masked (handled by backend).
- "Reveal Contact" button → `POST /api/queries/:id/unlock`.
  - If 402 response (insufficient credits), redirect to plan purchase page.
  - On success, display full contact info inline.

### Plan Purchase UI

1. Call `GET /api/plans` to get available plan tiers.
2. On plan select, call `POST /api/payments/create-order { planId }`.
3. Load Razorpay checkout with `order.id` and `RAZORPAY_KEY_ID`.
4. On success callback, call `POST /api/payments/verify`.
5. Refresh credit balance via `GET /api/teachers/credits`.
6. Redirect to query browse or show success modal.

### Plan / Credit History UI (Teacher)

- **Plan purchase history:** `GET /api/payments/my` — show as a table with plan name, amount, date, status.
- **Credit history:** `GET /api/payments/credits/history` — show as a ledger with +/- credits, description, balance.

### Admin Dashboard

- Stats: `GET /api/admin/dashboard/stats`
- Recent Activity: `GET /api/admin/dashboard/activity?page=1&limit=20`
- Subjects Management: `GET/PUT/PATCH/DELETE /api/admin/subjects`
- Poll `/dashboard/activity` every 30 seconds for live updates (or implement WebSocket in future).

---

*Document version: 1.0 — Generated 2026-07-29*
