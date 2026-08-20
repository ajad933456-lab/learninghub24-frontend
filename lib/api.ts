/**
 * Typed API client for LearningHub24.
 *
 * Every request automatically attaches the Firebase ID token as a Bearer token.
 * All responses follow the backend convention:
 *   { success: boolean, message: string, data: T, errors: null | {...} }
 */

import { auth } from './firebase';
import type { ApiResponse } from './types';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:5000';

// ─── Token helper ─────────────────────────────────────────────────────────────

async function getToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  // Try the cached token first; if the SDK hasn't cached one yet (e.g. on
  // first mount right after auth state restores), force-refresh to get a
  // valid token so the Authorization header is never empty.
  try {
    return await user.getIdToken();
  } catch {
    return await user.getIdToken(/* forceRefresh */ true);
  }
}

// ─── Core fetch wrapper ───────────────────────────────────────────────────────

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Pass false to skip attaching the Authorization header (public routes) */
  auth?: boolean;
  signal?: AbortSignal;
}

async function request<T = unknown>(
  path: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { method = 'GET', body, auth: withAuth = true, signal } = options;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (withAuth) {
    const token = await getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }

  const res = await fetch(`${BASE_URL}/api${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  // Always parse JSON — the backend always returns JSON
  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok) {
    let errorMessage = json.message ?? 'Something went wrong';
    
    // If backend provided detailed validation errors, surface them
    if (json.errors && Array.isArray(json.errors) && json.errors.length > 0) {
      // e.g. "Description must be at least 10 characters, Price is required"
      errorMessage = json.errors.map((e: any) => e.message).join(', ');
    }
    
    // Surface the backend error message
    throw new ApiError(errorMessage, res.status, json);
  }

  return json;
}

// ─── ApiError ─────────────────────────────────────────────────────────────────

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly response: ApiResponse<unknown>
  ) {
    super(message);
    this.name = 'ApiError';
  }

  /** Teacher has no credits — redirect to plan purchase */
  get isInsufficientCredits() {
    return this.status === 402;
  }

  /** Unauthenticated */
  get isUnauthorized() {
    return this.status === 401;
  }

  /** Forbidden */
  get isForbidden() {
    return this.status === 403;
  }
}

// ─── Public convenience methods ───────────────────────────────────────────────

export const api = {
  get<T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, { ...opts, method: 'GET' });
  },
  post<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) {
    return request<T>(path, { ...opts, method: 'POST', body });
  },
  put<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) {
    return request<T>(path, { ...opts, method: 'PUT', body });
  },
  patch<T>(path: string, body?: unknown, opts?: Omit<RequestOptions, 'method'>) {
    return request<T>(path, { ...opts, method: 'PATCH', body });
  },
  delete<T>(path: string, opts?: Omit<RequestOptions, 'method' | 'body'>) {
    return request<T>(path, { ...opts, method: 'DELETE' });
  },
};

// ─── Domain-specific API helpers ──────────────────────────────────────────────
// These are thin wrappers so pages import from one place.

export const authApi = {
  sync(payload: { role: string; fullName?: string; phone?: string }) {
    return api.post('/auth/sync', payload);
  },
  me() {
    return api.get('/auth/me');
  },
  verifyEmail() {
    return api.post('/auth/verify-email');
  },
};

export const studentApi = {
  getProfile() {
    return api.get('/students/profile');
  },
  upsertProfile(data: unknown) {
    return api.post('/students/profile', data);
  },
};

export const teacherApi = {
  getProfile() {
    return api.get('/teachers/profile');
  },
  upsertProfile(data: unknown) {
    return api.post('/teachers/profile', data);
  },
  getCredits() {
    return api.get<{ balance: number }>('/teachers/credits');
  },
};

export const queryApi = {
  browse(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/queries/browse${qs}`);
  },
  myQueries() {
    return api.get('/queries/my');
  },
  getOne(id: string) {
    return api.get(`/queries/${id}`);
  },
  create(data: unknown) {
    return api.post('/queries', data);
  },
  update(id: string, data: unknown) {
    return api.patch(`/queries/${id}`, data);
  },
  remove(id: string) {
    return api.delete(`/queries/${id}`);
  },
  unlock(id: string) {
    return api.post(`/queries/${id}/unlock`);
  },
  unlocked() {
    return api.get('/queries/unlocked');
  },
};

export const planApi = {
  list() {
    return api.get('/plans', { auth: false });
  },
};

export const paymentApi = {
  createOrder(payload: { paymentType?: 'plan'; planId: string } | { paymentType: 'custom'; customAmount: number; email: string; number: string; fullName: string }) {
    return api.post('/payments/create-order', payload);
  },
  verify(payload: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    return api.post('/payments/verify', payload);
  },
  myPayments() {
    return api.get('/payments/my');
  },
  creditHistory() {
    return api.get('/payments/credits/history');
  },
};

export const subjectApi = {
  catalog() {
    return api.get('/subjects', { auth: false });
  },
};

export const notificationApi = {
  list() {
    return api.get('/notifications');
  },
  markRead(id: string) {
    return api.patch(`/notifications/${id}/read`);
  },
  markAllRead() {
    return api.patch('/notifications/read-all');
  },
};

export const courseApi = {
  list(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/courses${qs}`, { auth: false });
  },
  getOne(id: string) {
    return api.get(`/courses/${id}`, { auth: false });
  },
  getMyCourses() {
    return api.get('/courses/my');
  },
  create(data: unknown) {
    return api.post('/courses', data);
  },
  update(id: string, data: unknown) {
    return api.patch(`/courses/${id}`, data);
  },
  remove(id: string) {
    return api.delete(`/courses/${id}`);
  },
};

export const adminApi = {
  stats() {
    return api.get('/admin/dashboard/stats');
  },
  activity(params?: { page?: number; limit?: number; type?: string }) {
    const qs = params ? '?' + new URLSearchParams(
      Object.fromEntries(
        Object.entries(params)
          .filter(([, v]) => v !== undefined)
          .map(([k, v]) => [k, String(v)])
      )
    ).toString() : '';
    return api.get(`/admin/dashboard/activity${qs}`);
  },
  pendingTeachers() {
    return api.get('/admin/teachers/pending');
  },
  approveTeacher(id: string) {
    return api.patch(`/admin/teachers/${id}/approve`);
  },
  rejectTeacher(id: string, reason: string) {
    return api.patch(`/admin/teachers/${id}/reject`, { reason });
  },
  adjustTeacherCredits(id: string, data: { delta: number; reason: string }) {
    return api.patch(`/admin/teachers/${id}/credits`, data);
  },
  users(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/admin/users${qs}`);
  },
  getUserById(id: string) {
    return api.get(`/admin/users/${id}`);
  },
  toggleUserStatus(id: string) {
    return api.patch(`/admin/users/${id}/toggle-status`);
  },
  plans() {
    return api.get('/admin/plans');
  },
  createPlan(data: unknown) {
    return api.post('/admin/plans', data);
  },
  updatePlan(id: string, data: unknown) {
    return api.patch(`/admin/plans/${id}`, data);
  },
  deletePlan(id: string) {
    return api.delete(`/admin/plans/${id}`);
  },
  payments() {
    return api.get('/admin/payments');
  },
  queries(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/admin/queries${qs}`);
  },
  moderateQuery(id: string, data: { status: string; moderationNote?: string }) {
    return api.patch(`/admin/queries/${id}/moderate`, data);
  },
  subjects() {
    return api.get('/admin/subjects');
  },
  replaceSubjectCatalog(catalog: Record<string, string[]>) {
    return api.put('/admin/subjects', { catalog });
  },
  updateSubjectClass(className: string, subjects: string[]) {
    return api.patch(`/admin/subjects/${encodeURIComponent(className)}`, { subjects });
  },
  deleteSubjectClass(className: string) {
    return api.delete(`/admin/subjects/${encodeURIComponent(className)}`);
  },
  courses(params?: Record<string, string>) {
    const qs = params ? '?' + new URLSearchParams(params).toString() : '';
    return api.get(`/admin/courses${qs}`);
  },
  updateCourse(id: string, data: unknown) {
    return api.patch(`/admin/courses/${id}`, data);
  },
  deleteCourse(id: string) {
    return api.delete(`/admin/courses/${id}`);
  },
};
