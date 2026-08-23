class ApiConfig {
  static const String baseUrl = 'https://api.idemshealth.dtftsolutions.com/api/v1/app';

  // Auth Endpoints
  static const String register = '/auth/register';
  static const String login = '/auth/login';
  static const String logout = '/auth/logout';
  static const String changePassword = '/auth/change-password';
  static const String refreshToken = '/auth/refresh';
  static const String verifyRegister = '/auth/verify-register';
  static const String resendRegisterOtp = '/auth/resend-register-otp';
  static const String forgotPassword = '/auth/forgot-password';
  static const String resetPassword = '/auth/reset-password';

  // User Endpoints
  static const String userInfo = '/profile';
}
