import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'controllers/auth_controller.dart';
import 'screens/splash.dart';
import 'screens/home.dart';
import 'screens/about.dart';
import 'screens/contact.dart';

// Auth Screens
import 'screens/auth/login.dart';
import 'screens/auth/register.dart';
import 'screens/auth/verify_otp.dart';
import 'screens/auth/forgot_password.dart';
import 'screens/auth/reset_password.dart';

void main() {
  // Initialize AuthController globally
  Get.put(AuthController());
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return GetMaterialApp(
      title: 'abcd_fl',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        scaffoldBackgroundColor: const Color(0xFFF8F9FA),
        appBarTheme: const AppBarTheme(
          backgroundColor: Color(0xFFB71234),
          foregroundColor: Colors.white,
          centerTitle: true,
          elevation: 0,
        ),
        useMaterial3: true,
      ),
      initialRoute: '/',
      getPages: [
        GetPage(name: '/', page: () => const SplashScreen()),
        // App
        GetPage(name: '/home', page: () => const HomeScreen()),
        GetPage(name: '/about', page: () => const AboutScreen()),
        GetPage(name: '/contact', page: () => const ContactScreen()),
        // Auth
        GetPage(name: '/login', page: () => const LoginScreen()),
        GetPage(name: '/register', page: () => const RegisterScreen()),
        GetPage(name: '/verify-otp', page: () => const VerifyOtpScreen()),
        GetPage(name: '/forgot-password', page: () => const ForgotPasswordScreen()),
        GetPage(name: '/reset-password', page: () => const ResetPasswordScreen()),
      ],
    );
  }
}
