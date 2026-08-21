class Environment {
  static late String apiBaseUrl;
  static late String environment;
  static late bool isProduction;
  static late bool isStaging;
  static late bool isDevelopment;

  static Future<void> initialize() async {
    // Use default development values
    // In production, set via environment variables
    environment = 'development';
    apiBaseUrl = 'http://localhost:5000/api';

    isProduction = environment == 'production';
    isStaging = environment == 'staging';
    isDevelopment = environment == 'development';
  }

  static String get baseUrl => apiBaseUrl;
  static String get env => environment;

  static Map<String, String> getHeadersForEnvironment() {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
  }
}
