import 'package:flutter/material.dart';
import 'package:get/get.dart';
import '../../controllers/auth_controller.dart';

class VerifyOtpScreen extends StatefulWidget {
  const VerifyOtpScreen({super.key});

  @override
  State<VerifyOtpScreen> createState() => _VerifyOtpScreenState();
}

class _VerifyOtpScreenState extends State<VerifyOtpScreen> {
  final _otpController = TextEditingController();
  late String _email;
  final authController = Get.find<AuthController>();

  @override
  void initState() {
    super.initState();
    _email = Get.arguments?['email'] ?? '';
  }

  Future<void> _handleVerify() async {
    FocusScope.of(context).unfocus();
    await authController.verifyOtp(_email, _otpController.text);
  }

  Future<void> _handleResend() async {
    FocusScope.of(context).unfocus();
    await authController.resendOtp(_email);
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
                      const Text('Verify Email', style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Color(0xFF333333))),
                      const SizedBox(height: 8),
                      Text('Enter the OTP sent to $_email', style: const TextStyle(color: Color(0xFF666666))),
                      const SizedBox(height: 24),
                      Obx(() => authController.errorMessage.value.isNotEmpty
                          ? Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: Text(authController.errorMessage.value, style: const TextStyle(color: Colors.red)),
                            )
                          : const SizedBox.shrink()),
                      Obx(() => authController.successMessage.value.isNotEmpty
                          ? Padding(
                              padding: const EdgeInsets.only(bottom: 16),
                              child: Text(authController.successMessage.value, style: const TextStyle(color: Colors.green)),
                            )
                          : const SizedBox.shrink()),
                      TextField(
                        controller: _otpController,
                        keyboardType: TextInputType.number,
                        decoration: InputDecoration(
                          hintText: 'Enter OTP',
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
                        child: Obx(() => ElevatedButton(
                          onPressed: authController.isLoading.value ? null : _handleVerify,
                          style: ElevatedButton.styleFrom(
                            backgroundColor: const Color(0xFFB71234),
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                          ),
                          child: authController.isLoading.value 
                            ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white))
                            : const Text('Verify OTP', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                        )),
                      ),
                      const SizedBox(height: 10),
                      Center(
                        child: Obx(() => TextButton(
                          onPressed: authController.isLoading.value ? null : _handleResend,
                          child: const Text('Resend OTP', style: TextStyle(color: Color(0xFFB71234))),
                        )),
                      )
                    ],
                  ),
                ),
                const SizedBox(height: 24),
                Center(
                  child: TextButton(
                    onPressed: () => Get.offAllNamed('/login'),
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
