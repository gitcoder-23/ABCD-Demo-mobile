import 'package:dio/dio.dart';
import 'package:get/get.dart';
import '../controllers/auth_controller.dart';
import 'config.dart';

class DioClient {
  static final DioClient _instance = DioClient._internal();
  late Dio dio;

  factory DioClient() {
    return _instance;
  }

  DioClient._internal() {
    dio = Dio(
      BaseOptions(
        baseUrl: ApiConfig.baseUrl,
        connectTimeout: const Duration(seconds: 15),
        receiveTimeout: const Duration(seconds: 15),
        headers: {
          'Content-Type': 'application/json',
        },
      ),
    );

    dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) {
          final authController = Get.find<AuthController>();
          final token = authController.token.value;
          
          if (token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
        onError: (DioException e, handler) async {
          if (e.response?.statusCode == 401) {
            final authController = Get.find<AuthController>();
            final refreshToken = authController.refreshToken.value;

            if (refreshToken.isEmpty) {
              authController.logout();
              return handler.next(e);
            }

            try {
              // Attempt to refresh token
              final response = await Dio().post(
                '${ApiConfig.baseUrl}${ApiConfig.refreshToken}',
                data: {'refreshToken': refreshToken},
              );

              if (response.statusCode == 200 && response.data['token'] != null) {
                final newToken = response.data['token'];
                authController.updateToken(newToken);
                
                // Retry the original request
                final opts = e.requestOptions;
                opts.headers['Authorization'] = 'Bearer $newToken';
                final cloneReq = await Dio().fetch(opts);
                return handler.resolve(cloneReq);
              }
            } catch (refreshError) {
              authController.logout();
              return handler.next(e);
            }
          }
          return handler.next(e);
        },
      ),
    );
  }
}
