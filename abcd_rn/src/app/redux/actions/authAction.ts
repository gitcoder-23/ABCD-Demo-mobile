import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  AuthLoginResponseModel,
  LoginBodyActionType,
  RefreshResponseModel,
  LogoutBodyActionType,
  LogoutResponseModel,
  RegisterBodyActionType,
  RegisterResponseModel,
  VerifyRegisterBodyActionType,
  VerifyRegisterResponseModel,
  ResendRegisterOtpBodyActionType,
  ResendRegisterOtpResponseModel,
  ForgotPasswordBodyActionType,
  ForgotPasswordResponseModel,
  ResetPasswordBodyActionType,
  ResetPasswordResponseModel,
} from '../models/authModel';
import rootApi from '../../api/rootApi';
import {
  loginApi,
  logoutApi,
  refreshTokenApi,
  baseUrl,
  registerApi,
  verifyRegisterApi,
  resendRegisterOtpApi,
  forgotPasswordApi,
  resetPasswordApi,
} from '../../api/config';
import axios from 'axios';

export const LoginAction = createAsyncThunk<
  AuthLoginResponseModel,
  LoginBodyActionType,
  { rejectValue: AuthLoginResponseModel }
>('login/post', async (postLogin, { rejectWithValue }) => {
  try {
    const response = await rootApi.post(loginApi, postLogin);
    console.log('LoginAction==>', response.data);

    return response.data;
  } catch (err: any) {
    console.log('LoginAction-err==>', err.response?.data);
    return rejectWithValue(err.response?.data?.error);
  }
});

export const RefreshTokenAction = createAsyncThunk<
  RefreshResponseModel,
  { refreshToken: string },
  { rejectValue: any }
>('auth/refresh', async (postPayload, { rejectWithValue }) => {
  try {
    // Use axios directly instead of rootApi to prevent sending the expired accessToken
    console.log('refresh-payload==>', postPayload);
    const response = await axios.post(
      `${baseUrl}${refreshTokenApi}`,
      postPayload,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const LogoutAction = createAsyncThunk<
  LogoutResponseModel,
  LogoutBodyActionType | undefined,
  { rejectValue: any }
>('auth/logout', async (payload = { allDevices: false }, { rejectWithValue }) => {
  try {
    const response = await rootApi.post<LogoutResponseModel>(logoutApi, payload);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const RegisterAction = createAsyncThunk<
  RegisterResponseModel,
  RegisterBodyActionType,
  { rejectValue: RegisterResponseModel }
>('auth/register', async (postRegister, { rejectWithValue }) => {
  try {
    const response = await rootApi.post(registerApi, postRegister);
    console.log('RegisterAction==>', response.data);
    return response.data;
  } catch (err: any) {
    console.log('RegisterAction-err==>', err.response?.data);
    return rejectWithValue(err.response?.data);
  }
});

export const VerifyRegisterAction = createAsyncThunk<
  VerifyRegisterResponseModel,
  VerifyRegisterBodyActionType,
  { rejectValue: any }
>('auth/verify-register', async (payload, { rejectWithValue }) => {
  try {
    const response = await rootApi.post<VerifyRegisterResponseModel>(
      verifyRegisterApi,
      payload,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const ResendRegisterOtpAction = createAsyncThunk<
  ResendRegisterOtpResponseModel,
  ResendRegisterOtpBodyActionType,
  { rejectValue: any }
>('auth/resend-register-otp', async (payload, { rejectWithValue }) => {
  try {
    const response = await rootApi.post<ResendRegisterOtpResponseModel>(
      resendRegisterOtpApi,
      payload,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const ForgotPasswordAction = createAsyncThunk<
  ForgotPasswordResponseModel,
  ForgotPasswordBodyActionType,
  { rejectValue: any }
>('auth/forgot-password', async (payload, { rejectWithValue }) => {
  try {
    const response = await rootApi.post<ForgotPasswordResponseModel>(
      forgotPasswordApi,
      payload,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});

export const ResetPasswordAction = createAsyncThunk<
  ResetPasswordResponseModel,
  ResetPasswordBodyActionType,
  { rejectValue: any }
>('auth/reset-password', async (payload, { rejectWithValue }) => {
  try {
    const response = await rootApi.post<ResetPasswordResponseModel>(
      resetPasswordApi,
      payload,
    );
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data);
  }
});
