import { apiClient, type ApiError } from './client';

export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  isEmailVerified: boolean;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface SignInRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  phone: string;
}

export interface GoogleAuthRequest {
  idToken: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyEmailRequest {
  code: string;
}

export interface VerifyEmailOtpRequest {
  email: string;
  code: string;
  name?: string;
}

export interface RequestEmailOtpRequest {
  email: string;
}

export interface RequestEmailOtpResponse {
  message: string;
  isNewUser: boolean;
}

export interface ResendCodeRequest {
  email: string;
}

export const authApi = {
  signIn: async (data: SignInRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/app/auth/signin', data);
  },

  signUp: async (data: SignUpRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/app/auth/signup?platform=web', data);
  },

  signInWithGoogle: async (data: GoogleAuthRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/app/auth/google?platform=web', data);
  },

  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    return apiClient.post('/app/auth/forgot-password', data);
  },

  verifyEmail: async (data: VerifyEmailRequest): Promise<AuthResponse | { message: string }> => {
    return apiClient.post('/app/auth/verify-email', data);
  },

  verifyEmailOtp: async (data: VerifyEmailOtpRequest): Promise<AuthResponse> => {
    return apiClient.post<AuthResponse>('/app/auth/verify-email-otp?platform=web', data);
  },

  requestEmailOtp: async (data: RequestEmailOtpRequest): Promise<RequestEmailOtpResponse> => {
    return apiClient.post<RequestEmailOtpResponse>('/app/auth/request-email-otp', data);
  },

  resendCode: async (data: ResendCodeRequest): Promise<{ message: string }> => {
    return apiClient.post('/app/auth/resend-code', data);
  },

  getCurrentUser: async (): Promise<User> => {
    return apiClient.get<User>('/app/auth/me');
  },
};

export const isEmailVerificationError = (error: unknown): error is ApiError => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.status === 403 && apiError.data?.email !== undefined;
  }
  return false;
};

export const getErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (typeof error === 'object' && error !== null) {
    const apiError = error as ApiError;
    return apiError.data?.message || apiError.data?.error || apiError.message || defaultMessage;
  }
  if (typeof error === 'string') {
    return error;
  }
  return defaultMessage;
};
