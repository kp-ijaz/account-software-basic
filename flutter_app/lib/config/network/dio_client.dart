import 'package:dio/dio.dart';
import 'package:madrasa_accounting/config/environment/environment.dart';
import 'package:madrasa_accounting/config/network/api_interceptors.dart';
// import 'package:madrasa_accounting/core/utils/logger.dart';

late Dio _dio;

Dio get dioClient => _dio;

void setupDioClient() {
  _dio = Dio(
    BaseOptions(
      baseUrl: Environment.baseUrl,
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      sendTimeout: const Duration(seconds: 30),
      contentType: Headers.jsonContentType,
      responseType: ResponseType.json,
      headers: Environment.getHeadersForEnvironment(),
    ),
  );

  // Add interceptors
  _dio.interceptors.add(
    LoggingInterceptor(),
  );
  _dio.interceptors.add(
    AuthInterceptor(),
  );
  _dio.interceptors.add(
    ErrorInterceptor(),
  );
}
