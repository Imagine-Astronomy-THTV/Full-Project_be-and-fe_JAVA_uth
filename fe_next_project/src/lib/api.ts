// API configuration and helper functions to connect with Backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role?: string; // Optional, BE sẽ có default
}

export interface AuthResponse {
  token: string;
  role: string;
}

export interface FeedbackRequest {
  name?: string;
  course: string;
  teacher: string;
  date: string; // yyyy-MM-dd format
  mode?: string; // Trực tiếp / Online / Hybrid
  rating: number; // 1-5
  useful?: string; // yes / no
  comments: string;
  suggestions?: string;
  anonymous?: boolean;
}

export interface Feedback {
  id: number;
  name?: string;
  course: string;
  teacher: string;
  date: string;
  mode?: string;
  rating: number;
  useful?: string;
  comments: string;
  suggestions?: string;
  anonymous: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Login API call
 */
export async function login(credentials: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Đăng nhập thất bại' }));
    throw new Error(error.message || error.error || 'Đăng nhập thất bại');
  }

  return response.json();
}

/**
 * Register API call
 */
export async function register(data: RegisterRequest): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Đăng ký thất bại' }));
    throw new Error(error.message || error.error || 'Đăng ký thất bại');
  }

  return response.json();
}

/**
 * Store token in localStorage
 */
export function storeToken(token: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
  }
}

/**
 * Get token from localStorage
 */
export function getToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
}

/**
 * Remove token from localStorage
 */
export function removeToken(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}

/**
 * Make authenticated API call to BE
 */
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || error.error || `Request failed with status ${response.status}`);
    }

    return response.json();
  } catch (error: any) {
    // Handle network errors (backend not running, CORS, etc.)
    if (error instanceof TypeError && error.message === 'Failed to fetch') {
      throw new Error(
        `Không thể kết nối đến server backend (${API_BASE_URL}). ` +
        `Vui lòng kiểm tra xem backend đã chạy chưa.`
      );
    }
    // Re-throw other errors as-is
    throw error;
  }
}

/**
 * Create feedback
 */
export async function createFeedback(data: FeedbackRequest): Promise<Feedback> {
  return apiCall<Feedback>('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * Get all feedbacks
 */
export async function getAllFeedbacks(): Promise<Feedback[]> {
  return apiCall<Feedback[]>('/api/feedback');
}




