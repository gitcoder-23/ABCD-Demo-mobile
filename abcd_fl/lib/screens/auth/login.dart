import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';
import '../../api/dio_client.dart';
import '../../api/config.dart';
import 'package:dio/dio.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _isLoading = false;
  String _error = '';
  bool _isPasswordVisible = false;

  Future<void> _handleLogin() async {
    setState(() {
      _isLoading = true;
      _error = '';
    });

    try {
      final response = await DioClient().dio.post(ApiConfig.login, data: {
        'email': _emailController.text,
        'password': _passwordController.text,
      });

      final authController = Get.find<AuthController>();
      await authController.setCredentials(
        response.data['token'],
        response.data['refreshToken'],
        response.data['user'] ?? {},
      );
      
      Get.offAllNamed('/home');
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.data?['message'] ?? 'Login failed. Please try again.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(24.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Container(
                  padding: const EdgeInsets.all(24.0),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(16.0),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.05),
                        offset: const Offset(0, 4),
                        blurRadius: 12.0,
                      ),
                    ],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text(
                        'Welcome Back',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF333333)),
                      ),
                      const SizedBox(height: 8),
                      const Text('Sign in to continue', style: TextStyle(color: Color(0xFF666666))),
                      const SizedBox(height: 24),
                      if (_error.isNotEmpty)
                        Padding(
                          padding: const EdgeInsets.only(bottom: 16),
                          child: Text(_error, style: const TextStyle(color: Colors.red)),
                        ),
                      _buildTextField(_emailController, 'Email', TextInputType.emailAddress),
                      const SizedBox(height: 16),
                      _buildTextField(_passwordController, 'Password', TextInputType.text, true),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleLogin,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFB71234),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: _isLoading 
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white))
                            : const Text('Login', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                      Center(
                        child: TextButton(
                          onPressed: () => Get.toNamed('/forgot-password'),
                          child: const Text('Forgot Password?', style: TextStyle(color: Color(0xFFB71234))),
                        ),
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Center(
                  child: TextButton(
                    onPressed: () => Get.toNamed('/register'),
                    child: const Text.rich(
                      TextSpan(
                        text: 'Don\'t have an account? ',
                        style: TextStyle(color: Color(0xFF666666)),
                        children: [
                          TextSpan(text: 'Register', style: TextStyle(color: Color(0xFFB71234))),
                        ],
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String hint, [TextInputType? type, bool isPassword = false]) {
    return TextField(
      controller: controller,
      keyboardType: type,
      obscureText: isPassword && !_isPasswordVisible,
      decoration: InputDecoration(
        hintText: hint,
        filled: true,
        fillColor: const Color(0xFFF8F9FA),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFE5E5E5))),
        enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFE5E5E5))),
        focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFB71234))),
        suffixIcon: isPassword
            ? IconButton(
                icon: Icon(
                  _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  color: Colors.grey,
                ),
                onPressed: () {
                  setState(() {
                    _isPasswordVisible = !_isPasswordVisible;
                  });
                },
              )
            : null,
      ),
    );
  }
}
