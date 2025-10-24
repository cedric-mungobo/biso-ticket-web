# Implémentation Technique de l'Authentification Google pour Flutter

## Vue d'ensemble

Ce document explique en détail comment implémenter l'authentification Google dans votre application Flutter Biso Ticket, en s'appuyant sur l'implémentation web existante.

## Architecture Technique

### Stack Recommandé
- **Framework**: Flutter 3.x
- **Language**: Dart 3.x
- **Authentification**: google_sign_in package
- **HTTP Client**: Dio
- **Stockage**: flutter_secure_storage
- **State Management**: Provider
- **JSON Serialization**: json_annotation

### Flux d'Authentification
```
1. Lancement Application
   ↓
2. Vérification Token Local
   ↓
3. Token Valide ? → Oui → Dashboard
   ↓ Non
4. Page Login
   ↓
5. Google Sign-In Flow
   ↓
6. ID Token → Backend API
   ↓
7. Validation Backend → JWT Access Token
   ↓
8. Stockage Sécurisé → Dashboard
```

## Étape 1: Configuration du Projet

### 1.1 Dépendances

Ajoutez ces dépendances à votre `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  
  # Google Sign-In
  google_sign_in: ^6.2.1
  
  # HTTP Client
  dio: ^5.4.0
  
  # Stockage sécurisé
  flutter_secure_storage: ^9.0.0
  
  # State Management
  provider: ^6.1.1
  
  # JSON Serialization
  json_annotation: ^4.8.1
  
  # Local Storage (non-sensible)
  shared_preferences: ^2.2.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  
  # Code Generation
  json_serializable: ^6.7.1
  build_runner: ^2.4.7
```

### 1.2 Installation

```bash
flutter pub get
```

## Étape 2: Configuration Platform-Specific

### 2.1 Configuration Android

**1. Créez `android/app/google-services.json`:**
```json
{
  "project_info": {
    "project_number": "VOTRE_NUMERO_PROJET",
    "project_id": "bisoticket-app"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "VOTRE_APP_ID",
        "android_client_info": {
          "package_name": "com.bisoticket.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com",
          "client_type": 1,
          "android_info": {
            "package_name": "com.bisoticket.app",
            "certificate_hash": "SHA1_HASH"
          }
        }
      ]
    }
  ]
}
```

**2. Mettez à jour `android/build.gradle`:**
```gradle
buildscript {
    ext.kotlin_version = '1.9.10'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
        classpath 'com.google.gms:google-services:4.4.0'
    }
}
```

**3. Mettez à jour `android/app/build.gradle`:**
```gradle
plugins {
    id "com.android.application"
    id "kotlin-android"
    id "com.google.gms.google-services"  // Ajouter cette ligne
}

android {
    compileSdkVersion 34
    
    defaultConfig {
        applicationId "com.bisoticket.app"
        minSdkVersion 21
        targetSdkVersion 34
    }
}
```

**4. Configurez `android/app/src/main/AndroidManifest.xml`:**
```xml
<manifest>
    <application>
        <!-- Pour Google Sign-In -->
        <meta-data android:name="com.google.android.gms.version"
                   android:value="@integer/google_play_services_version"/>
    </application>
</manifest>
```

### 2.2 Configuration iOS

**1. Créez `ios/Runner/GoogleService-Info.plist`:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>CLIENT_ID</key>
    <string>35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com</string>
    <key>REVERSED_CLIENT_ID</key>
    <string>com.googleusercontent.apps.35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu</string>
    <key>API_KEY</key>
    <string>VOTRE_API_KEY</string>
    <key>GCM_SENDER_ID</key>
    <string>VOTRE_SENDER_ID</string>
    <key>PLIST_VERSION</key>
    <string>1</string>
    <key>BUNDLE_ID</key>
    <string>com.bisoticket.app</string>
    <key>PROJECT_ID</key>
    <string>bisoticket-app</string>
</dict>
</plist>
```

**2. Mettez à jour `ios/Runner/Info.plist`:**
```xml
<dict>
    <!-- Ajoutez ces lignes pour URL Scheme -->
    <key>CFBundleURLTypes</key>
    <array>
        <dict>
            <key>CFBundleURLSchemes</key>
            <array>
                <string>com.googleusercontent.apps.35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu</string>
            </array>
        </dict>
    </array>
    
    <!-- Pour iOS 9+ -->
    <key>LSApplicationQueriesSchemes</key>
    <array>
        <string>googlechromes</string>
        <string>googlechrome</string>
        <string>com.google.chrome.ios</string>
    </array>
</dict>
```

**3. Mettez à jour `ios/Runner/AppDelegate.swift`:**
```swift
import UIKit
import Flutter
import GoogleSignIn

@UIApplicationMain
@objc class AppDelegate: FlutterAppDelegate {
  override func application(
    _ application: UIApplication,
    didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?
  ) -> Bool {
    GeneratedPluginRegistrant.register(with: self)
    
    // Initialize Google Sign-In
    guard let path = Bundle.main.path(forResource: "GoogleService-Info", ofType: "plist"),
          let plist = NSDictionary(contentsOfFile: path),
          let clientId = plist["CLIENT_ID"] as? String else {
        fatalError("GoogleService-Info.plist not found or CLIENT_ID missing")
    }
    
    GoogleSignIn.sharedInstance().clientID = clientId
    
    return super.application(application, didFinishLaunchingWithOptions: launchOptions)
  }
  
  @available(iOS 9.0, *)
  override func application(_ app: UIApplication, open url: URL, options: [UIApplication.OpenURLOptionsKey : Any] = [:]) -> Bool {
    return GoogleSignIn.sharedInstance().handle(url)
  }
}
```

## Étape 3: Modèles de Données

### 3.1 Créez `lib/models/user.dart`

```dart
import 'package:json_annotation/json_annotation.dart';

part 'user.g.dart';

@JsonSerializable()
class User {
  final int id;
  final String name;
  final String email;
  @JsonKey(name: 'google_id')
  final String? googleId;
  final String? role;
  @JsonKey(name: 'created_at')
  final DateTime createdAt;
  @JsonKey(name: 'updated_at')
  final DateTime updatedAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    this.googleId,
    this.role,
    required this.createdAt,
    required this.updatedAt,
  });

  bool get isGoogleUser => googleId != null;
  bool get isOrganizer => role == 'organizer';
  bool get isAdmin => role == 'admin';
  bool get isRegularUser => role == 'user' || role == null;

  factory User.fromJson(Map<String, dynamic> json) => _$UserFromJson(json);
  Map<String, dynamic> toJson() => _$UserToJson(this);
}

@JsonSerializable()
class AuthResponse {
  @JsonKey(name: 'access_token')
  final String accessToken;
  final User user;
  @JsonKey(name: 'expires_in')
  final int expiresIn;

  AuthResponse({
    required this.accessToken,
    required this.user,
    required this.expiresIn,
  });

  factory AuthResponse.fromJson(Map<String, dynamic> json) => _$AuthResponseFromJson(json);
  Map<String, dynamic> toJson() => _$AuthResponseToJson(this);
}
```

**Générez le code JSON:**
```bash
flutter packages pub run build_runner build --delete-conflicting-outputs
```

## Étape 4: Services d'Authentification

### 4.1 Service Google Sign-In

**Créez `lib/services/google_sign_in_service.dart`:**

```dart
import 'package:google_sign_in/google_sign_in.dart';

class GoogleSignInService {
  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: '35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com',
    scopes: [
      'email',
      'profile',
      'openid',
    ],
  );

  static GoogleSignInAccount? get currentUser => _googleSignIn.currentUser;
  static bool get isSignedIn => _googleSignIn.currentUser != null;

  /// Initialise Google Sign-In au démarrage
  static Future<void> initialize() async {
    try {
      await _googleSignIn.signInSilently();
      print('Google Sign-In initialized successfully');
    } catch (e) {
      print('Google Sign-In initialization failed: $e');
    }
  }

  /// Connecte l'utilisateur avec Google
  static Future<GoogleSignInAccount?> signIn() async {
    try {
      final GoogleSignInAccount? account = await _googleSignIn.signIn();
      print('Google Sign-In successful: ${account?.displayName}');
      return account;
    } catch (error) {
      print('Google Sign-In error: $error');
      return null;
    }
  }

  /// Déconnecte l'utilisateur de Google
  static Future<void> signOut() async {
    try {
      await _googleSignIn.signOut();
      print('Google Sign-Out successful');
    } catch (error) {
      print('Google Sign-Out error: $error');
    }
  }

  /// Récupère le token d'identification
  static Future<String?> getIdToken() async {
    try {
      final GoogleSignInAuthentication? auth = await _googleSignIn.currentUser?.authentication;
      return auth?.idToken;
    } catch (e) {
      print('Failed to get ID token: $e');
      return null;
    }
  }

  /// Récupère le token d'accès
  static Future<String?> getAccessToken() async {
    try {
      final GoogleSignInAuthentication? auth = await _googleSignIn.currentUser?.authentication;
      return auth?.accessToken;
    } catch (e) {
      print('Failed to get access token: $e');
      return null;
    }
  }

  /// Vérifie si l'utilisateur est connecté (asynchrone)
  static Future<bool> isSignedInAsync() async {
    try {
      await _googleSignIn.signInSilently();
      return _googleSignIn.currentUser != null;
    } catch (e) {
      return false;
    }
  }
}
```

### 4.2 Client HTTP Configuré

**Créez `lib/core/api/dio_client.dart`:**

```dart
import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import '../interceptors/auth_interceptor.dart';

class DioClient {
  static DioClient? _instance;
  static DioClient get instance => _instance ??= DioClient._();

  late final Dio _dio;

  DioClient._() {
    _dio = Dio(BaseOptions(
      baseUrl: 'https://api.bisoticket.com/api',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'BisoTicket-Flutter/1.0.0',
      },
    ));

    // Ajouter les intercepteurs
    _dio.interceptors.add(AuthInterceptor());
    
    // Logger en mode debug
    if (kDebugMode) {
      _dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
        error: true,
      ));
    }
  }

  Dio get dio => _dio;

  /// Getter pour le Dio sans intercepteurs (pour l'auth)
  Dio get rawDio {
    final dio = Dio(BaseOptions(
      baseUrl: 'https://api.bisoticket.com/api',
      connectTimeout: const Duration(seconds: 30),
      receiveTimeout: const Duration(seconds: 30),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    ));

    if (kDebugMode) {
      dio.interceptors.add(LogInterceptor(
        requestBody: true,
        responseBody: true,
        requestHeader: true,
      ));
    }

    return dio;
  }
}
```

**Créez `lib/core/interceptors/auth_interceptor.dart`:**

```dart
import 'package:dio/dio.dart';
import 'package:bisoticket/services/auth_service.dart';

class AuthInterceptor extends Interceptor {
  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) async {
    // Ajouter le token d'authentification si disponible
    final token = await AuthService.getAccessToken();
    if (token != null) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    // Gérer les erreurs 401 (token expiré)
    if (err.response?.statusCode == 401) {
      final refreshed = await AuthService.refreshToken();
      if (refreshed) {
        // Réessayer la requête avec le nouveau token
        final token = await AuthService.getAccessToken();
        final options = err.requestOptions;
        options.headers['Authorization'] = 'Bearer $token';
        
        try {
          final response = await Dio().fetch(options);
          handler.resolve(response);
          return;
        } catch (e) {
          // Si le refresh échoue, continuer vers le logout
        }
      }
      
      // Forcer la déconnexion
      await AuthService.logout();
    }
    handler.next(err);
  }
}
```

### 4.3 Service d'Authentification Principal

**Créez `lib/services/auth_service.dart`:**

```dart
import 'dart:convert';
import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:bisoticket/models/user.dart';
import 'package:bisoticket/services/google_sign_in_service.dart';
import 'package:bisoticket/core/api/dio_client.dart';

class AuthService {
  static const String _baseUrl = 'https://api.bisoticket.com/api';
  static const FlutterSecureStorage _storage = FlutterSecureStorage(
    aOptions: AndroidOptions(
      encryptedSharedPreferences: true,
    ),
    iOptions: IOSOptions(
      accessibility: KeychainItemAccessibility.first_unlock_this_device,
    ),
  );

  static const String _tokenKey = 'access_token';
  static const String _userKey = 'user_data';
  static const String _refreshTokenKey = 'refresh_token';

  /// Connecte l'utilisateur avec Google
  static Future<AuthResult> signInWithGoogle() async {
    try {
      // 1. Sign in with Google
      final GoogleSignInAccount? googleUser = await GoogleSignInService.signIn();
      if (googleUser == null) {
        return AuthResult.success(
          user: null,
          message: 'Google sign-in cancelled by user',
        );
      }

      // 2. Get ID Token
      final String? idToken = await GoogleSignInService.getIdToken();
      if (idToken == null) {
        return AuthResult.error(
          message: 'Failed to get Google ID token',
        );
      }

      // 3. Send token to backend
      final dio = DioClient.instance.rawDio;
      final response = await dio.post(
        '$_baseUrl/auth/google',
        data: {
          'token': idToken,
          'device_info': await _getDeviceInfo(),
        },
      );

      if (response.statusCode == 201) {
        final authResponse = AuthResponse.fromJson(response.data);
        
        // 4. Store tokens and user data securely
        await _storeAuthData(authResponse);
        
        return AuthResult.success(
          user: authResponse.user,
          message: 'Authentication successful',
        );
      } else {
        return AuthResult.error(
          message: 'Server error: ${response.statusCode}',
        );
      }
    } on DioException catch (e) {
      String errorMessage = 'Authentication failed';
      
      if (e.response?.data != null && e.response!.data['message'] != null) {
        errorMessage = e.response!.data['message'];
      } else if (e.type == DioExceptionType.connectionTimeout) {
        errorMessage = 'Connection timeout';
      } else if (e.type == DioExceptionType.connectionError) {
        errorMessage = 'No internet connection';
      }
      
      return AuthResult.error(message: errorMessage);
    } catch (e) {
      return AuthResult.error(
        message: 'Authentication failed: $e',
      );
    }
  }

  /// Déconnecte l'utilisateur
  static Future<LogoutResult> logout() async {
    try {
      final String? token = await getAccessToken();
      
      // 1. Call backend logout
      if (token != null) {
        try {
          final dio = DioClient.instance;
          await dio.post(
            '$_baseUrl/auth/logout',
            options: Options(
              headers: {'Authorization': 'Bearer $token'},
            ),
          );
        } catch (e) {
          print('Backend logout failed: $e');
        }
      }

      // 2. Clear local storage
      await _clearAuthData();
      
      // 3. Sign out from Google
      await GoogleSignInService.signOut();

      return LogoutResult.success(
        message: 'Successfully logged out',
      );
    } catch (e) {
      return LogoutResult.error(
        message: 'Logout failed: $e',
      );
    }
  }

  /// Vérifie si l'utilisateur est authentifié
  static Future<bool> isAuthenticated() async {
    try {
      final token = await _storage.read(key: _tokenKey);
      if (token == null) return false;

      // Vérifier si les données utilisateur existent
      final userData = await _storage.read(key: _userKey);
      if (userData == null) return false;

      // Vérifier si l'utilisateur Google est toujours connecté
      final user = User.fromJson(jsonDecode(userData));
      if (user.isGoogleUser) {
        final isGoogleSignedIn = await GoogleSignInService.isSignedInAsync();
        if (!isGoogleSignedIn) {
          await _clearAuthData();
          return false;
        }
      }

      return true;
    } catch (e) {
      print('Auth check failed: $e');
      return false;
    }
  }

  /// Récupère l'utilisateur courant
  static Future<User?> getCurrentUser() async {
    try {
      final userData = await _storage.read(key: _userKey);
      if (userData != null) {
        return User.fromJson(jsonDecode(userData));
      }
      return null;
    } catch (e) {
      print('Failed to get current user: $e');
      return null;
    }
  }

  /// Récupère le token d'accès
  static Future<String?> getAccessToken() async {
    try {
      return await _storage.read(key: _tokenKey);
    } catch (e) {
      return null;
    }
  }

  /// Rafraîchit le token d'accès
  static Future<bool> refreshToken() async {
    try {
      final refreshToken = await _storage.read(key: _refreshTokenKey);
      if (refreshToken == null) return false;

      final dio = DioClient.instance.rawDio;
      final response = await dio.post(
        '$_baseUrl/auth/refresh',
        data: {'refresh_token': refreshToken},
      );

      if (response.statusCode == 200) {
        final authResponse = AuthResponse.fromJson(response.data);
        await _storeAuthData(authResponse);
        return true;
      }
      return false;
    } catch (e) {
      print('Token refresh failed: $e');
      return false;
    }
  }

  /// Stocke les données d'authentification de manière sécurisée
  static Future<void> _storeAuthData(AuthResponse authResponse) async {
    await _storage.write(
      key: _tokenKey, 
      value: authResponse.accessToken,
    );
    await _storage.write(
      key: _userKey, 
      value: jsonEncode(authResponse.user.toJson()),
    );
    
    // Stocker la date d'expiration pour vérification
    final expiryTime = DateTime.now().add(Duration(seconds: authResponse.expiresIn));
    await _storage.write(
      key: 'token_expiry',
      value: expiryTime.toIso8601String(),
    );
  }

  /// Nettoie toutes les données d'authentification
  static Future<void> _clearAuthData() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _userKey);
    await _storage.delete(key: _refreshTokenKey);
    await _storage.delete(key: 'token_expiry');
  }

  /// Récupère les informations du device pour tracking
  static Future<Map<String, dynamic>> _getDeviceInfo() async {
    // Implémentation simplifiée - à enrichir avec device_info_plus
    return {
      'platform': 'flutter',
      'os': 'unknown', // À implémenter avec device_info_plus
      'app_version': '1.0.0',
      'device_id': 'flutter_device_id', // À implémenter avec unique_id
    };
  }

  /// Vérifie si le token est expiré
  static Future<bool> isTokenExpired() async {
    try {
      final expiryString = await _storage.read(key: 'token_expiry');
      if (expiryString == null) return true;

      final expiryTime = DateTime.parse(expiryString);
      return DateTime.now().isAfter(expiryTime);
    } catch (e) {
      return true;
    }
  }
}

// Classes de résultat
class AuthResult {
  final bool success;
  final User? user;
  final String message;

  AuthResult({required this.success, this.user, required this.message});

  factory AuthResult.success({User? user, required String message}) {
    return AuthResult(success: true, user: user, message: message);
  }

  factory AuthResult.error({required String message}) {
    return AuthResult(success: false, message: message);
  }
}

class LogoutResult {
  final bool success;
  final String message;

  LogoutResult({required this.success, required this.message});

  factory LogoutResult.success({required String message}) {
    return LogoutResult(success: true, message: message);
  }

  factory LogoutResult.error({required String message}) {
    return LogoutResult(success: false, message: message);
  }
}
```

## Étape 5: State Management

### 5.1 Provider d'Authentification

**Créez `lib/providers/auth_provider.dart`:**

```dart
import 'package:flutter/foundation.dart';
import 'package:bisoticket/services/auth_service.dart';
import 'package:bisoticket/services/google_sign_in_service.dart';
import 'package:bisoticket/models/user.dart';

class AuthProvider extends ChangeNotifier {
  User? _user;
  bool _isLoading = false;
  String? _error;
  bool _isInitialized = false;

  // Getters
  User? get user => _user;
  bool get isLoading => _isLoading;
  String? get error => _error;
  bool get isAuthenticated => _user != null;
  bool get isGoogleUser => _user?.isGoogleUser ?? false;
  bool get isOrganizer => _user?.isOrganizer ?? false;
  bool get isAdmin => _user?.isAdmin ?? false;
  bool get isRegularUser => _user?.isRegularUser ?? false;
  bool get isInitialized => _isInitialized;

  /// Initialise l'état d'authentification au démarrage de l'app
  Future<void> initialize() async {
    if (_isInitialized) return;
    
    _setLoading(true);
    _clearError();

    try {
      // Initialiser Google Sign-In
      await GoogleSignInService.initialize();
      
      // Vérifier si l'utilisateur est déjà authentifié
      final isAuth = await AuthService.isAuthenticated();
      if (isAuth) {
        _user = await AuthService.getCurrentUser();
        
        // Double vérification pour les utilisateurs Google
        if (_user?.isGoogleUser == true) {
          final isGoogleSignedIn = await GoogleSignInService.isSignedInAsync();
          if (!isGoogleSignedIn) {
            print('Google user not signed in, forcing logout');
            await forceLogout();
            return;
          }
        }
        
        print('User initialized: ${_user?.email}');
      }
      
      _isInitialized = true;
      notifyListeners();
    } catch (e) {
      print('Auth initialization failed: $e');
      _setError('Failed to initialize authentication: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Connexion avec Google
  Future<bool> signInWithGoogle() async {
    _setLoading(true);
    _clearError();

    try {
      print('Starting Google sign-in...');
      final result = await AuthService.signInWithGoogle();
      
      if (result.success && result.user != null) {
        _user = result.user;
        print('Sign-in successful: ${_user?.email}');
        notifyListeners();
        return true;
      } else {
        print('Sign-in failed: ${result.message}');
        _setError(result.message);
        return false;
      }
    } catch (e) {
      print('Sign-in exception: $e');
      _setError('Sign in failed: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Déconnexion
  Future<bool> logout() async {
    _setLoading(true);
    _clearError();

    try {
      print('Starting logout...');
      final result = await AuthService.logout();
      
      if (result.success) {
        _user = null;
        print('Logout successful');
        notifyListeners();
        return true;
      } else {
        print('Logout failed: ${result.message}');
        _setError(result.message);
        return false;
      }
    } catch (e) {
      print('Logout exception: $e');
      _setError('Logout error: $e');
      return false;
    } finally {
      _setLoading(false);
    }
  }

  /// Force la déconnexion (nettoyage complet)
  Future<void> forceLogout() async {
    _setLoading(true);
    
    try {
      print('Force logout initiated...');
      await AuthService.logout();
      _user = null;
      _clearError();
      print('Force logout completed');
      notifyListeners();
    } catch (e) {
      print('Force logout error: $e');
    } finally {
      _setLoading(false);
    }
  }

  /// Met à jour les informations utilisateur
  Future<void> updateUser() async {
    try {
      final updatedUser = await AuthService.getCurrentUser();
      if (updatedUser != null) {
        _user = updatedUser;
        notifyListeners();
      }
    } catch (e) {
      print('Failed to update user: $e');
      _setError('Failed to update user: $e');
    }
  }

  /// Efface les erreurs
  void clearError() {
    _clearError();
  }

  // Private methods
  void _setLoading(bool loading) {
    if (_isLoading != loading) {
      _isLoading = loading;
      notifyListeners();
    }
  }

  void _setError(String? error) {
    _error = error;
    notifyListeners();
  }

  void _clearError() {
    _error = null;
  }
}
```

## Étape 6: Widgets d'Interface

### 6.1 Bouton de Connexion Google

**Créez `lib/widgets/auth/google_login_button.dart`:**

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bisoticket/providers/auth_provider.dart';

class GoogleLoginButton extends StatefulWidget {
  final VoidCallback? onSuccess;
  final VoidCallback? onError;
  final String? text;
  final bool showLoading;

  const GoogleLoginButton({
    Key? key,
    this.onSuccess,
    this.onError,
    this.text,
    this.showLoading = true,
  }) : super(key: key);

  @override
  State<GoogleLoginButton> createState() => _GoogleLoginButtonState();
}

class _GoogleLoginButtonState extends State<GoogleLoginButton> {
  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        return SizedBox(
          width: double.infinity,
          height: 50,
          child: ElevatedButton.icon(
            onPressed: (widget.showLoading && authProvider.isLoading) 
                ? null 
                : () => _handleSignIn(context, authProvider),
            icon: _buildIcon(authProvider.isLoading),
            label: Text(
              widget.text ?? 'Se connecter avec Google',
              style: const TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.w500,
                color: Colors.black87,
              ),
            ),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.white,
              foregroundColor: Colors.black87,
              side: BorderSide(color: Colors.grey.shade300, width: 1),
              elevation: 2,
              shadowColor: Colors.black12,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ),
        );
      },
    );
  }

  Widget _buildIcon(bool isLoading) {
    if (widget.showLoading && isLoading) {
      return const SizedBox(
        width: 18,
        height: 18,
        child: CircularProgressIndicator(
          strokeWidth: 2,
          valueColor: AlwaysStoppedAnimation<Color>(Colors.black54),
        ),
      );
    }

    return Container(
      width: 18,
      height: 18,
      decoration: const BoxDecoration(
        image: DecorationImage(
          image: AssetImage('assets/images/google_logo.png'),
          fit: BoxFit.contain,
        ),
      ),
    );
  }

  Future<void> _handleSignIn(BuildContext context, AuthProvider authProvider) async {
    final success = await authProvider.signInWithGoogle();
    
    if (success) {
      widget.onSuccess?.call();
      
      // Afficher un message de succès
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Bienvenue ${authProvider.user?.name}!'),
          backgroundColor: Colors.green,
          duration: const Duration(seconds: 2),
        ),
      );
      
      // Navigation vers la page principale (à adapter selon votre routeur)
      Navigator.of(context).pushReplacementNamed('/home');
    } else {
      widget.onError?.call();
      
      // Afficher un message d'erreur
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(authProvider.error ?? 'Échec de la connexion'),
          backgroundColor: Colors.red,
          action: authProvider.error?.contains('cancelled') == true 
              ? null 
              : SnackBarAction(
                  label: 'Réessayer',
                  textColor: Colors.white,
                  onPressed: () => _handleSignIn(context, authProvider),
                ),
        ),
      );
    }
  }
}
```

### 6.2 Écran de Connexion

**Créez `lib/screens/auth/login_screen.dart`:**

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bisoticket/providers/auth_provider.dart';
import 'package:bisoticket/widgets/auth/google_login_button.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      _initializeAuth();
    });
  }

  Future<void> _initializeAuth() async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    await authProvider.initialize();
    
    if (authProvider.isAuthenticated) {
      if (mounted) {
        Navigator.of(context).pushReplacementNamed('/home');
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F5F5),
      body: SafeArea(
        child: Consumer<AuthProvider>(
          builder: (context, authProvider, child) {
            if (authProvider.isLoading && !authProvider.isInitialized) {
              return const Center(
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircularProgressIndicator(),
                    SizedBox(height: 16),
                    Text('Chargement...'),
                  ],
                ),
              );
            }

            return SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 60),
                  
                  // Logo
                  Center(
                    child: Container(
                      width: 120,
                      height: 120,
                      decoration: BoxDecoration(
                        color: Theme.of(context).primaryColor,
                        borderRadius: BorderRadius.circular(20),
                        boxShadow: [
                          BoxShadow(
                            color: Colors.black.withOpacity(0.1),
                            blurRadius: 10,
                            offset: const Offset(0, 5),
                          ),
                        ],
                      ),
                      child: const Icon(
                        Icons.confirmation_number,
                        size: 60,
                        color: Colors.white,
                      ),
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Title
                  const Text(
                    'Biso Ticket',
                    style: TextStyle(
                      fontSize: 32,
                      fontWeight: FontWeight.bold,
                      color: Colors.black87,
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 8),
                  
                  Text(
                    'Votre billetterie en ligne',
                    style: TextStyle(
                      fontSize: 16,
                      color: Colors.grey[600],
                    ),
                    textAlign: TextAlign.center,
                  ),
                  
                  const SizedBox(height: 60),
                  
                  // Google Login Button
                  GoogleLoginButton(
                    onSuccess: () {
                      // Navigation gérée dans le widget
                    },
                    onError: () {
                      // Erreur gérée dans le widget
                    },
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Divider
                  Row(
                    children: [
                      const Expanded(child: Divider()),
                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          'ou',
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 14,
                          ),
                        ),
                      ),
                      const Expanded(child: Divider()),
                    ],
                  ),
                  
                  const SizedBox(height: 24),
                  
                  // Email Login (future implementation)
                  OutlinedButton.icon(
                    onPressed: () {
                      _showComingSoonDialog();
                    },
                    icon: const Icon(Icons.email_outlined),
                    label: const Text('Se connecter avec Email'),
                    style: OutlinedButton.styleFrom(
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(8),
                      ),
                      side: BorderSide(color: Colors.grey.shade300),
                    ),
                  ),
                  
                  const SizedBox(height: 40),
                  
                  // Terms and conditions
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Text(
                      'En continuant, vous acceptez nos\nConditions d\'utilisation et Politique de confidentialité',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[600],
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ),
                  
                  const SizedBox(height: 20),
                  
                  // Version info
                  Center(
                    child: Text(
                      'Version 1.0.0',
                      style: TextStyle(
                        fontSize: 12,
                        color: Colors.grey[400],
                      ),
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ),
    );
  }

  void _showComingSoonDialog() {
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Bientôt disponible'),
          content: const Text('La connexion par email sera bientôt disponible.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('OK'),
            ),
          ],
        );
      },
    );
  }
}
```

## Étape 7: Intégration Principale

### 7.1 Configuration du Main

**Mettez à jour `lib/main.dart`:**

```dart
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:bisoticket/providers/auth_provider.dart';
import 'package:bisoticket/screens/auth/login_screen.dart';
import 'package:bisoticket/screens/home/home_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialisation globale
  await _initializeApp();
  
  runApp(const BisoTicketApp());
}

Future<void> _initializeApp() async {
  // Initialiser les services si nécessaire
  // Ex: Firebase, services locaux, etc.
}

class BisoTicketApp extends StatelessWidget {
  const BisoTicketApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (context) => AuthProvider(),
      child: MaterialApp(
        title: 'Biso Ticket',
        debugShowCheckedModeBanner: false,
        theme: ThemeData(
          primarySwatch: Colors.blue,
          visualDensity: VisualDensity.adaptivePlatformDensity,
          useMaterial3: true,
        ),
        home: const AuthWrapper(),
      ),
    );
  }
}

class AuthWrapper extends StatelessWidget {
  const AuthWrapper({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Consumer<AuthProvider>(
      builder: (context, authProvider, child) {
        if (!authProvider.isInitialized) {
          return const Scaffold(
            body: Center(
              child: CircularProgressIndicator(),
            ),
          );
        }

        if (authProvider.isAuthenticated) {
          return const HomeScreen();
        } else {
          return const LoginScreen();
        }
      },
    );
  }
}
```

### 7.2 Guard de Route

**Créez `lib/guards/auth_guard.dart`:**

```dart
import 'package:flutter/material.dart';
import 'package:bisoticket/providers/auth_provider.dart';

class AuthGuard {
  static Future<bool> canAccess(BuildContext context, String route) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    
    // Routes publiques
    const publicRoutes = ['/login', '/register', '/forgot-password'];
    if (publicRoutes.contains(route)) {
      return true;
    }
    
    // Vérifier l'authentification
    if (!authProvider.isAuthenticated) {
      Navigator.of(context).pushReplacementNamed('/login');
      return false;
    }
    
    // Vérifier les rôles si nécessaire
    const organizerRoutes = ['/organizer', '/create-event'];
    if (organizerRoutes.contains(route) && !authProvider.isOrganizer) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Accès réservé aux organisateurs'),
          backgroundColor: Colors.red,
        ),
      );
      return false;
    }
    
    return true;
  }
}
```

## Étape 8: Tests

### 8.1 Tests Unitaires

**Créez `test/services/auth_service_test.dart`:**

```dart
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
import 'package:bisoticket/services/auth_service.dart';

class MockGoogleSignInService extends Mock implements GoogleSignInService {}
class MockDio extends Mock implements Dio {}

void main() {
  group('AuthService Tests', () {
    late MockGoogleSignInService mockGoogleSignIn;
    late MockDio mockDio;

    setUp(() {
      mockGoogleSignIn = MockGoogleSignInService();
      mockDio = MockDio();
    });

    test('should sign in with Google successfully', () async {
      // Setup
      when(mockGoogleSignIn.signIn()).thenAnswer((_) async => mockGoogleUser);
      when(mockGoogleSignIn.getIdToken()).thenAnswer((_) async => 'mock_id_token');
      when(mockDio.post(any, data: anyNamed('data')))
          .thenAnswer((_) async => Response(data: mockAuthResponse, statusCode: 201));

      // Act
      final result = await AuthService.signInWithGoogle();

      // Assert
      expect(result.success, true);
      expect(result.user?.email, 'test@example.com');
    });

    test('should handle Google sign-in cancellation', () async {
      // Setup
      when(mockGoogleSignIn.signIn()).thenAnswer((_) async => null);

      // Act
      final result = await AuthService.signInWithGoogle();

      // Assert
      expect(result.success, false);
      expect(result.message, contains('cancelled'));
    });
  });
}
```

## Étape 9: Sécurité

### 9.1 Bonnes Pratiques

1. **Stockage Sécurisé**:
   - Utiliser `flutter_secure_storage` pour les tokens
   - Configurer les options Android/iOS appropriées
   - Ne jamais stocker de données sensibles en clair

2. **Validation Tokens**:
   - Vérifier l'expiration des tokens
   - Implémenter le rafraîchissement automatique
   - Valider l'état de connexion Google

3. **Gestion Erreurs**:
   - Ne jamais exposer les tokens dans les messages d'erreur
   - Logger les erreurs côté serveur uniquement
   - Messages génériques pour l'utilisateur

4. **HTTPS Obligatoire**:
   - Toutes les communications API doivent utiliser HTTPS
   - Valider les certificats SSL en production
   - Implémenter le certificate pinning si possible

### 9.2 Variables d'Environnement

**Créez `lib/core/config/app_config.dart`:**

```dart
class AppConfig {
  static const String googleClientId = String.fromEnvironment(
    'GOOGLE_CLIENT_ID',
    defaultValue: '35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com',
  );
  
  static const String apiBaseUrl = String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://api.bisoticket.com/api',
  );
  
  static const bool isDebugMode = bool.fromEnvironment(
    'DEBUG_MODE',
    defaultValue: false,
  );
}
```

## Étape 10: Dépannage

### Problèmes Communs et Solutions

1. **"Google Sign-In failed"**:
   - Vérifier la configuration Google Cloud Console
   - Confirmer les SHA-1 fingerprints pour Android
   - Valider les URL schemes pour iOS

2. **"Network error"**:
   - Vérifier la connectivité internet
   - Confirmer l'URL de l'API
   - Vérifier les configurations firewall

3. **"Invalid token"**:
   - S'assurer que le token n'est pas expiré
   - Vérifier le format du token envoyé au backend
   - Implémenter le refresh token

4. **"Storage access denied"**:
   - Vérifier les permissions Android/iOS
   - Confirmer la configuration du secure storage
   - Tester sur device physique

Cette implémentation complète fournit une base solide et sécurisée pour l'authentification Google dans votre application Flutter Biso Ticket.