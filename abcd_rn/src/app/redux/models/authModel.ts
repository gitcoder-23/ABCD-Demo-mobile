export interface LoginBodyActionType {
  email?: string;
  password?: string;
  deviceIdentifier?: string;
  deviceName?: string;
  deviceType?: string;
}

export interface AuthLoginResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
  } | null;
}

export interface RefreshResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
  } | null;
}

// {
//   "success": false,
//   "statusCode": 400,
//   "message": "Foreign key constraint failed",
//   "timestamp": "2026-07-25T07:26:09.447Z",
//   "path": "/api/v1/auth/register"
// }

export interface RegisterBodyActionType {
  name?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
}

export interface RegisterResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    sent?: boolean;
    email?: string;
    message?: string;
  } | null;
}

export interface VerifyRegisterBodyActionType {
  email?: string;
  code?: string;
}

export interface VerifyRegisterResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    refreshToken?: string;
    tokenType?: string;
    expiresIn?: number;
    refreshExpiresIn?: number;
    patient?: {
      id?: string;
      patientCode?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      mobile?: string;
      isAppEnabled?: boolean;
    };
  } | null;
}

export interface ResendRegisterOtpBodyActionType {
  email?: string;
}

export interface ResendRegisterOtpResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    sent?: boolean;
    email?: string;
    message?: string;
  } | null;
}

export interface ForgotPasswordBodyActionType {
  email: string;
}

export interface ForgotPasswordResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    sent?: boolean;
  } | null;
}

export interface ResetPasswordBodyActionType {
  email: string;
  code: string;
  newPassword?: string;
}

export interface ResetPasswordResponseModel {
  success?: boolean;
  message?: string;
  data?: {
    reset?: boolean;
  } | null;
}
