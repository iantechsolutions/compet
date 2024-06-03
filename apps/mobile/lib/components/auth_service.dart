import 'package:auth0_flutter/auth0_flutter.dart';

class AuthService {
  static final AuthService _singleton = AuthService._internal();

  factory AuthService() {
    return _singleton;
  }

  AuthService._internal() : _credentials = null;

  Credentials? _credentials;

  void setCredentials(Credentials? credentials) {
    _credentials = credentials;
  }

  Credentials? getCredentials() {
    return _credentials;
  }
}
