import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../api/dio_client.dart';
import '../../api/config.dart';
import 'package:dio/dio.dart';

class ForgotPasswordScreen extends StatefulWidget {
  const ForgotPasswordScreen({super.key});

  @override
  State<ForgotPasswordScreen> createState() => _ForgotPasswordScreenState();
}

class _ForgotPasswordScreenState extends State<ForgotPasswordScreen> {
  final _emailController = TextEditingController();
  bool _isLoading = false;
  String _error = '';
  String _message = '';

  Future<void> _handleForgot() async {
    setState(() {
      _isLoading = true;
      _error = '';
      _message = '';
    });

    try {
      await DioClient().dio.post(ApiConfig.forgotPassword, data: {
        'email': _emailController.text,
      });
      Get.toNamed('/reset-password', arguments: {'email': _emailController.text});
    } on DioException catch (e) {
      setState(() {
        _error = e.response?.data?['message'] ?? 'Request failed. Please try again.';
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
                    boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), offset: const Offset(0, 4), blurRadius: 12.0)],
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('Forgot Password', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF333333))),
                      const SizedBox(height: 8),
                      const Text('Enter your email to receive a reset code', style: TextStyle(color: Color(0xFF666666))),
                      const SizedBox(height: 24),
                      if (_error.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 16), child: Text(_error, style: const TextStyle(color: Colors.red))),
                      if (_message.isNotEmpty) Padding(padding: const EdgeInsets.only(bottom: 16), child: Text(_message, style: const TextStyle(color: Colors.green))),
                      TextField(
                        controller: _emailController,
                        keyboardType: TextInputType.emailAddress,
                        decoration: InputDecoration(
                          hintText: 'Email',
                          filled: true,
                          fillColor: const Color(0xFFF8F9FA),
                          border: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFE5E5E5))),
                          enabledBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFE5E5E5))),
                          focusedBorder: OutlineInputBorder(borderRadius: BorderRadius.circular(8), borderSide: const BorderSide(color: Color(0xFFB71234))),
                        ),
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _isLoading ? null : _handleForgot,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFB71234),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: _isLoading 
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white))
                            : const Text('Send Code', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Center(
                  child: TextButton(
                    onPressed: () => Get.back(),
                    child: const Text('Back to Login', style: TextStyle(color: Color(0xFF666666))),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
