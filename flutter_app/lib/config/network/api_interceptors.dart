import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:madrasa_accounting/core/utils/logger.dart';

class LoggingInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    AppLogger.info('Sending ${options.method} request to ${options.path}');
    AppLogger.debug('Headers: ${options.headers}');
    if (options.data != null) {
      AppLogger.debug('Body: ${options.data}');
    }
    handler.next(options);
  }

  @override
  void onResponse(Response response, ResponseInterceptorHandler handler) {
    AppLogger.info('Received response: ${response.statusCode} from ${response.requestOptions.path}');
    handler.next(response);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    AppLogger.error('Error: ${err.message}', error: err.error);
    handler.next(err);
  }
}

class AuthInterceptor extends Interceptor {
  static const String _tokenKey = 'auth_token';
  static const _secureStorage = FlutterSecureStorage();

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Skip token addition for login endpoint
    if (options.path.contains('/auth/login')) {
      handler.next(options);
      return;
    }

    try {
      final token = await _secureStorage.read(key: _tokenKey);
      if (token != null && token.isNotEmpty) {
        options.headers['Authorization'] = 'Bearer $token';
      }
    } catch (e) {
      AppLogger.error('Error reading auth token', error: e);
    }

    handler.next(options);
  }

  static Future<void> saveToken(String token) async {
    try {
      await _secureStorage.write(key: _tokenKey, value: token);
    } catch (e) {
      AppLogger.error('Error saving auth token', error: e);
    }
  }

  static Future<void> removeToken() async {
    try {
      await _secureStorage.delete(key: _tokenKey);
    } catch (e) {
      AppLogger.error('Error removing auth token', error: e);
    }
  }
}

class ErrorInterceptor extends Interceptor {
  @override
  void onError(DioException err, ErrorInterceptorHandler handler) {
    if (err.response?.statusCode == 401) {
      // Unauthorized - token might be expired
      AppLogger.warning('Unauthorized access - token might be expired');
      AuthInterceptor.removeToken();
      // Navigate to login page
    } else if (err.response?.statusCode == 403) {
      // Forbidden
      AppLogger.warning('Forbidden access');
    }
    handler.next(err);
  }
}
