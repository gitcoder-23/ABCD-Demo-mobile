export const baseUrl = 'https://api.idemshealth.dtftsolutions.com/api/v1/app';

// Auth Endpoints
export const registerApi = '/auth/register';
export const loginApi = '/auth/login';
export const logoutApi = '/auth/logout';
export const changePasswordApi = '/auth/change-password';
export const refreshTokenApi = '/auth/refresh';
export const verifyRegisterApi = '/auth/verify-register';
export const resendRegisterOtpApi = '/auth/resend-register-otp';
export const forgotPasswordApi = '/auth/forgot-password';
export const resetPasswordApi = '/auth/reset-password';

// User Endpoints
export const userInfoApi = '/profile';

export const testCatalogList = (
  limit: number,
  page: number,
  search: string,
  maxPrice: any,
  minPrice: any,
  categoryId: any,
  query: string = '',
) =>
  `/catalog/tests?limit=${limit}&page=${page}&search=${search}&maxPrice=${maxPrice}&minPrice=${minPrice}&categoryId=${categoryId}&q=${query}`;

export const testDetailApi = (testId: string) => `/catalog/tests/${testId}`;
