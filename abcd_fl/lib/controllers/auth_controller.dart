import 'package:flutter/services.dart';
import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:dio/dio.dart';
import '../api/dio_client.dart';
import '../api/config.dart';

class AuthController extends GetxController {
  var isAuthenticated = false.obs;
  var token = ''.obs;
  var refreshToken = ''.obs;
  var user = {}.obs;

  var isLoading = false.obs;
  var errorMessage = ''.obs;
  var successMessage = ''.obs;

  static const _platform = MethodChannel('com.example.abcd_fl/native_tests');

  @override
  void onInit() {
    super.onInit();
    _loadStoredData();
  }

  @override
  void onReady() {
    super.onReady();
  }

  Future<void> _loadStoredData() async {
    final prefs = await SharedPreferences.getInstance();
    final storedToken = prefs.getString('token');
    final storedRefreshToken = prefs.getString('refreshToken');

    if (storedToken != null && storedToken.isNotEmpty) {
      token.value = storedToken;
      if (storedRefreshToken != null) {
        refreshToken.value = storedRefreshToken;
      }
      isAuthenticated.value = true;
    }
  }

  Future<void> setCredentials(
    String newToken,
    String? newRefreshToken,
    Map userData,
  ) async {
    token.value = newToken;
    if (newRefreshToken != null) {
      refreshToken.value = newRefreshToken;
    }
    user.value = userData;
    isAuthenticated.value = true;

    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', newToken);
    if (newRefreshToken != null) {
      await prefs.setString('refreshToken', newRefreshToken);
    }
  }

  Future<void> updateToken(String newToken) async {
    token.value = newToken;
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('token', newToken);
  }

  Future<void> logout({bool allDevices = false}) async {
    try {
      isLoading.value = true;

      // 1. Call Backend Logout API if token exists
      if (token.value.isNotEmpty) {
        try {
          await DioClient().dio.post(
            ApiConfig.logout,
            data: {'allDevices': allDevices},
            options: Options(
              headers: {
                'Authorization': 'Bearer ${token.value}',
              },
            ),
          );
        } catch (e) {
          print('Logout API error (proceeding with local cleanup): $e');
        }
      }
    } finally {
      // 2. Clear Flutter State & Local Storage
      token.value = '';
      refreshToken.value = '';
      user.value = {};
      isAuthenticated.value = false;
      isLoading.value = false;

      final prefs = await SharedPreferences.getInstance();
      await prefs.remove('token');
      await prefs.remove('refreshToken');
      await prefs.remove('userData');

      // 3. Clear React Native / Android Native session
      try {
        await _platform.invokeMethod('clearNativeSession');
      } catch (e) {
        print('Native session clear error: $e');
      }

      // 4. Navigate back to Login Screen
      Get.offAllNamed('/login');
    }
  }

  // --- API Methods ---

  Future<void> login(String email, String password) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      final response = await DioClient().dio.post(
        ApiConfig.login,
        data: {'email': email, 'password': password},
      );

      final responseData = response.data['data'] ?? response.data;
      print('login-responseData==> $responseData');
      await setCredentials(
        responseData['accessToken'] ?? responseData['token'] ?? '',
        responseData['refreshToken'] ?? '',
        responseData['patient'] ?? responseData['user'] ?? {},
      );

      Get.offAllNamed('/home');
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ?? 'Login failed. Please try again.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred during login.';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> register(String name, String email, String password) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      await DioClient().dio.post(
        ApiConfig.register,
        data: {'name': name, 'email': email, 'password': password},
      );

      Get.toNamed('/verify-otp', arguments: {'email': email});
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ??
          'Registration failed. Please try again.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred during registration.';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> verifyOtp(String email, String otp) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      await DioClient().dio.post(
        ApiConfig.verifyRegister,
        data: {'email': email, 'otp': otp},
      );

      Get.offAllNamed('/login');
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ??
          'Verification failed. Please check your OTP.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred during verification.';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resendOtp(String email) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      final response = await DioClient().dio.post(
        ApiConfig.resendRegisterOtp,
        data: {'email': email},
      );

      successMessage.value =
          response.data['message'] ?? 'OTP sent successfully';
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ?? 'Failed to resend OTP.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred.';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> forgotPassword(String email) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';
      successMessage.value = '';

      final response = await DioClient().dio.post(
        ApiConfig.forgotPassword,
        data: {'email': email},
      );

      successMessage.value = response.data['message'] ?? 'OTP sent to email';
      Get.toNamed('/reset-password', arguments: {'email': email});
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ?? 'Failed to send OTP.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred.';
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> resetPassword(
    String email,
    String otp,
    String newPassword,
  ) async {
    try {
      isLoading.value = true;
      errorMessage.value = '';

      await DioClient().dio.post(
        ApiConfig.resetPassword,
        data: {'email': email, 'otp': otp, 'newPassword': newPassword},
      );

      Get.offAllNamed('/login');
    } on DioException catch (e) {
      errorMessage.value =
          e.response?.data?['message'] ?? 'Failed to reset password.';
    } catch (e) {
      errorMessage.value = 'An unexpected error occurred.';
    } finally {
      isLoading.value = false;
    }
  }
}
