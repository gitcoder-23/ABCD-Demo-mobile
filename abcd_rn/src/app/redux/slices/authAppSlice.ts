import {
  LoginAction,
  RefreshTokenAction,
  RegisterAction,
  VerifyRegisterAction,
  ResendRegisterOtpAction,
  ForgotPasswordAction,
  ResetPasswordAction,
} from '../actions/authAction';
import { AuthLoginResponseModel } from '../models/authModel';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface AuthAppState {
  // Login
  loginResponse: AuthLoginResponseModel | null;
  isLoginLoading: boolean;
  accessToken: string;
  refreshToken: string;
  errorMessage: string | undefined;
  isError: boolean;

  // Register
  isRegisterLoading: boolean;
  registerError: string | null;

  // Verify
  isVerifyLoading: boolean;
  verifyError: string | null;

  // Resend OTP
  isResendOtpLoading: boolean;
  resendOtpError: string | null;

  // Forgot Password
  isForgotPasswordLoading: boolean;
  forgotPasswordError: string | null;

  // Reset Password
  isResetPasswordLoading: boolean;
  resetPasswordError: string | null;
}

const initialState: AuthAppState = {
  // Login
  loginResponse: null,
  isLoginLoading: false,
  accessToken: '',
  refreshToken: '',
  errorMessage: undefined,
  isError: false,

  // Register
  isRegisterLoading: false,
  registerError: null,

  // Verify
  isVerifyLoading: false,
  verifyError: null,

  // Resend OTP
  isResendOtpLoading: false,
  resendOtpError: null,

  // Forgot Password
  isForgotPasswordLoading: false,
  forgotPasswordError: null,

  // Reset Password
  isResetPasswordLoading: false,
  resetPasswordError: null,
};

const authAppSlice = createSlice({
  name: 'authApp',
  initialState,
  reducers: {
    // Reducer action
    setLogin: (state, action: PayloadAction<{ token: string }>) => {
      state.accessToken = action.payload.token;
      state.errorMessage = 'Login success';
      state.isLoginLoading = false;
    },
    updateTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
    },

    setLogout: state => {
      state.accessToken = '';
      state.refreshToken = '';
      state.loginResponse = null;
      state.errorMessage = 'Logout success';
      state.isLoginLoading = false;
    },
    setSessionFromNative: (
      state,
      action: PayloadAction<{
        accessToken: string;
        refreshToken?: string;
        userData?: any;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
      if (action.payload.userData) {
        state.loginResponse = {
          success: true,
          data: {
            accessToken: action.payload.accessToken,
            refreshToken: action.payload.refreshToken || '',
            ...action.payload.userData,
          },
        };
      }
      state.isLoginLoading = false;
      state.isError = false;
      state.errorMessage = 'Logged in via SSO';
    },
  },
  extraReducers: function (builder) {
    // Login - pending
    builder.addCase(LoginAction.pending, state => {
      state.isLoginLoading = true;
      state.isError = false;
      state.errorMessage = '';
    });

    // Login - fulfilled (success)
    builder.addCase(
      LoginAction.fulfilled,
      (state, action: PayloadAction<AuthLoginResponseModel>) => {
        state.isLoginLoading = false;
        state.isError = false;
        const responseData = action.payload;
        state.loginResponse = responseData;
        state.accessToken = responseData.data?.accessToken || '';
        state.refreshToken = responseData.data?.refreshToken || '';
        state.errorMessage = responseData?.message || '';
      },
    );

    // Login - rejected (failure)
    builder.addCase(LoginAction.rejected, (state, action) => {
      state.isLoginLoading = false;
      state.isError = true;
      const responseData = action.payload;
      state.errorMessage = responseData?.message || 'Login Failed';
      state.loginResponse = responseData || null;
      state.accessToken = '';
      state.refreshToken = '';
    });
    // Refresh Token
    builder.addCase(RefreshTokenAction.fulfilled, (state, action) => {
      const responseData = action.payload;
      state.accessToken = responseData.data?.accessToken || '';
      state.refreshToken = responseData.data?.refreshToken || '';
    });
    builder.addCase(RefreshTokenAction.rejected, state => {
      state.accessToken = '';
      state.refreshToken = '';
    });

    // Register
    builder.addCase(RegisterAction.pending, state => {
      state.isRegisterLoading = true;
      state.registerError = '';
    });
    builder.addCase(RegisterAction.fulfilled, state => {
      state.isRegisterLoading = false;
      state.registerError = '';
    });
    builder.addCase(RegisterAction.rejected, (state, action) => {
      state.isRegisterLoading = false;
      state.registerError = action.payload?.message || 'Registration failed';
    });

    // Verify Register
    builder.addCase(VerifyRegisterAction.pending, state => {
      state.isVerifyLoading = true;
      state.verifyError = '';
    });
    builder.addCase(VerifyRegisterAction.fulfilled, (state, action) => {
      state.isVerifyLoading = false;
      state.verifyError = '';
      const responseData = action.payload;
      if (responseData.data) {
        state.accessToken = responseData.data.accessToken || '';
        state.refreshToken = responseData.data.refreshToken || '';
      }
    });
    builder.addCase(VerifyRegisterAction.rejected, (state, action) => {
      state.isVerifyLoading = false;
      state.verifyError = action.payload?.message || 'Verification failed';
    });
    // Resend OTP
    builder.addCase(ResendRegisterOtpAction.pending, state => {
      state.isResendOtpLoading = true;
      state.resendOtpError = null;
    });
    builder.addCase(ResendRegisterOtpAction.fulfilled, state => {
      state.isResendOtpLoading = false;
      state.resendOtpError = null;
    });
    builder.addCase(ResendRegisterOtpAction.rejected, (state, action) => {
      state.isResendOtpLoading = false;
      state.resendOtpError = action.payload?.message || 'Failed to resend OTP';
    });
    // Forgot Password
    builder.addCase(ForgotPasswordAction.pending, state => {
      state.isForgotPasswordLoading = true;
      state.forgotPasswordError = null;
    });
    builder.addCase(ForgotPasswordAction.fulfilled, state => {
      state.isForgotPasswordLoading = false;
      state.forgotPasswordError = null;
    });
    builder.addCase(ForgotPasswordAction.rejected, (state, action) => {
      state.isForgotPasswordLoading = false;
      state.forgotPasswordError =
        action.payload?.message || 'Failed to send reset link';
    });
    // Reset Password
    builder.addCase(ResetPasswordAction.pending, state => {
      state.isResetPasswordLoading = true;
      state.resetPasswordError = null;
    });
    builder.addCase(ResetPasswordAction.fulfilled, state => {
      state.isResetPasswordLoading = false;
      state.resetPasswordError = null;
    });
    builder.addCase(ResetPasswordAction.rejected, (state, action) => {
      state.isResetPasswordLoading = false;
      state.resetPasswordError =
        action.payload?.message || 'Failed to reset password';
    });
  },
});

export const { setLogin, setLogout, updateTokens, setSessionFromNative } =
  authAppSlice.actions;

export default authAppSlice.reducer;
