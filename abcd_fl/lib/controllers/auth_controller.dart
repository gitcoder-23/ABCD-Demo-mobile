import 'package:get/get.dart';
import 'package:shared_preferences/shared_preferences.dart';

class AuthController extends GetxController {
  var isAuthenticated = false.obs;
  var token = ''.obs;
  var refreshToken = ''.obs;
  var user = {}.obs;

  @override
  void onInit() {
    super.onInit();
    _loadStoredData();
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

  Future<void> setCredentials(String newToken, String? newRefreshToken, Map userData) async {
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

  Future<void> logout() async {
    token.value = '';
    refreshToken.value = '';
    user.value = {};
    isAuthenticated.value = false;

    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('token');
    await prefs.remove('refreshToken');
    
    Get.offAllNamed('/login');
  }
}
