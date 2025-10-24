# Google Authentication Implementation - Flutter Integration Guide

## Overview

This document explains how Google authentication works in the Biso Ticket web application and provides guidance for implementing the same functionality in Flutter.

## Current Web Implementation

### Technology Stack
- **Google Sign-In JavaScript API** (`https://accounts.google.com/gsi/client`)
- **Custom authentication flow** with backend validation
- **Cookie-based session management** with localStorage fallback
- **JWT tokens** for API authentication

### Key Configuration

#### Google OAuth Configuration
```typescript
// Client ID from Google Cloud Console
googleClientId: "35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com"

// Authorized Origins
- Development: http://localhost:3000
- Production: https://bisoticket.com

// Authorized Redirect URIs  
- Development: http://localhost:3000
- Production: https://bisoticket.com
```

#### Environment Variables
```bash
# Public (client-side)
NUXT_PUBLIC_GOOGLE_CLIENT_ID=35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com
NUXT_PUBLIC_API_BASE_URL=https://api.bisoticket.com/api

# Server-side (if needed)
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

## Authentication Flow

### 1. Web Login Process
```
1. User clicks "Se connecter avec Google" button
2. Google Sign-In popup appears
3. User authenticates with Google account
4. Google returns ID Token (JWT)
5. Frontend sends ID token to backend endpoint
6. Backend validates token with Google servers
7. Backend creates user account or retrieves existing one
8. Backend returns access token + user data
9. Client stores tokens and user data
10. Redirect to profile page
```

### 2. Key API Endpoints

#### Google Login Endpoint
```
POST /auth/google
Content-Type: application/json

Request Body:
{
  "token": "google_id_token"
}

Response (201):
{
  "access_token": "jwt_access_token",
  "user": {
    "id": 123,
    "name": "John Doe",
    "email": "john@example.com",
    "google_id": "google_user_id",
    "role": "user",
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

#### Google Logout Endpoint
```
POST /auth/google/logout
Authorization: Bearer {access_token}

Response (200):
{
  "message": "Successfully logged out"
}
```

## Flutter Implementation Guide

### 1. Required Dependencies

```yaml
# pubspec.yaml
dependencies:
  google_sign_in: ^6.1.6
  http: ^1.1.0
  flutter_secure_storage: ^8.0.0
  provider: ^6.0.5
  json_annotation: ^4.8.1

dev_dependencies:
  json_serializable: ^6.7.1
  build_runner: ^2.4.7
```

### 2. Google Sign-In Configuration

#### Create `google_sign_in_service.dart`
```dart
import 'package:google_sign_in/google_sign_in.dart';

class GoogleSignInService {
  static final GoogleSignIn _googleSignIn = GoogleSignIn(
    clientId: '35309590308-vs79kc9pb1tpi0577l0dvpsllvjh3vfu.apps.googleusercontent.com',
    scopes: ['email', 'profile'],
  );

  static Future<GoogleSignInAccount?> signIn() async {
    try {
      return await _googleSignIn.signIn();
    } catch (error) {
      print('Google sign in error: $error');
      return null;
    }
  }

  static Future<void> signOut() async {
    await _googleSignIn.signOut();
  }
}
```

### 3. Authentication Service

#### Create `auth_service.dart`
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'google_sign_in_service.dart';

class AuthService {
  static const String _baseUrl = 'https://api.bisoticket.com/api';
  static const FlutterSecureStorage _storage = FlutterSecureStorage();

  static Future<bool> signInWithGoogle() async {
    try {
      final GoogleSignInAccount? googleUser = await GoogleSignInService.signIn();
      if (googleUser == null) return false;

      final GoogleSignInAuthentication? googleAuth = 
          await googleUser.authentication;
      
      if (googleAuth?.idToken == null) return false;

      final response = await http.post(
        Uri.parse('$_baseUrl/auth/google'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({'token': googleAuth!.idToken}),
      );

      if (response.statusCode == 201) {
        final data = jsonDecode(response.body);
        final String accessToken = data['access_token'];
        final userData = jsonEncode(data['user']);

        await _storage.write(key: 'access_token', value: accessToken);
        await _storage.write(key: 'user_data', value: userData);
        return true;
      }
      return false;
    } catch (e) {
      print('Authentication failed: $e');
      return false;
    }
  }

  static Future<bool> logout() async {
    try {
      await _storage.delete(key: 'access_token');
      await _storage.delete(key: 'user_data');
      await GoogleSignInService.signOut();
      return true;
    } catch (e) {
      print('Logout failed: $e');
      return false;
    }
  }
}
```

### 4. Platform Configuration

#### Android
1. Add `google-services.json` to `android/app/`
2. Update `android/build.gradle`:
```gradle
dependencies {
    classpath 'com.google.gms:google-services:4.3.15'
}
```
3. Update `android/app/build.gradle`:
```gradle
apply plugin: 'com.google.gms.google-services'
```

#### iOS
1. Add `GoogleService-Info.plist` to `ios/Runner/`
2. Configure URL schemes in `Info.plist`
3. Update `AppDelegate.swift` with Google Sign-In initialization

## Security Considerations

- Use `flutter_secure_storage` for sensitive data
- Never store tokens in plain text
- Implement proper error handling
- Validate server certificates in production

## Usage Example

```dart
class LoginScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ElevatedButton(
          onPressed: () async {
            final success = await AuthService.signInWithGoogle();
            if (success) {
              Navigator.pushReplacementNamed(context, '/profile');
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                SnackBar(content: Text('Login failed')),
              );
            }
          },
          child: Text('Se connecter avec Google'),
        ),
      ),
    );
  }
}
```

This implementation provides a secure Google authentication system for Flutter that mirrors your web application's functionality.

