import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:flutter/services.dart';
import 'package:http/http.dart' as http;
import 'package:permission_handler/permission_handler.dart';
import 'package:mplikelanding/components/auth_service.dart';
import 'package:shadcn_ui/shadcn_ui.dart'; // Ensure this package is correctly imported
// ignore: depend_on_referenced_packages
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({Key? key}) : super(key: key);

  @override
  LoginScreenState createState() => LoginScreenState();
}

class LoginScreenState extends State<LoginScreen> {
  Credentials? _credentials;
  final storage = new FlutterSecureStorage();

  late Auth0 auth0;

  @override
  void initState() {
    super.initState();
    auth0 = Auth0('https://dev-66yy7ysg5y71pl8j.us.auth0.com',
        'uEQAlmj7yP6A8ZEGWgnTyrERFwkeRcBq');
    _checkPermission(); // Check for GPS permission on init
  }

  Future<void> _checkPermission() async {
    var status = await Permission.location.status;
    if (status.isGranted) {
      // Permission is granted, proceed as usual
    } else {
      // Request permission
      _requestPermission();
    }
  }

  Future<void> _requestPermission() async {
    var status = await Permission.location.request();
    if (!status.isGranted) {
      _showPermissionDeniedDialog();
    }
  }

  void _showPermissionDeniedDialog() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text('Permiso denegado'),
        content: Text('Acceso a la ubicacion es necesario para usar esta app.'),
        actions: [
          TextButton(
            onPressed: () => SystemNavigator.pop(),
            child: Text('Salir'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Theme(
      data: ThemeData(
        primaryColor: Colors.blue, // Set your theme colors here
        buttonTheme: ButtonThemeData(
          buttonColor: Colors.blue, // Default color for all buttons
          shape:
              RoundedRectangleBorder(borderRadius: BorderRadius.circular(30)),
          padding: EdgeInsets.symmetric(vertical: 15, horizontal: 30),
        ),
      ),
      child: MaterialApp(
        home: Scaffold(
          body: Center(
            child: SingleChildScrollView(
              child: Center(
                child: Container(
                  padding: EdgeInsets.all(20),
                  child: _credentials == null ? loginButton() : userActions(),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  Widget loginButton() {
    return ShadButton.secondary(
      // Shadcn button component
      backgroundColor: Theme.of(context).colorScheme.primary,
      onPressed: () async {
        final credentials =
            await auth0.webAuthentication(scheme: 'demo').login(useHTTPS: true);
        print(credentials?.accessToken);
        await storage.write(
            key: "credenciales", value: credentials?.accessToken);
        setState(() {
          _credentials = credentials;
        });
      },
      text:
          Text("Ingresar", style: TextStyle(fontSize: 20, color: Colors.white)),
      borderRadius: BorderRadius.circular(20.0),
    );
  }

  Widget userActions() {
    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        actionButton("Entrar como empalmista", '/uploadScreen'),
        actionButton("Listado clientes", '/clientes'),
        actionButton("Listado pedidos", '/pedidos'),
        actionButton("Listado empalmistas", '/empalmistasLista'),
        actionButton("Listado instalaciones", '/instalaciones'),
        logoutButton(),
      ],
    );
  }

  Widget actionButton(String text, String route) {
    return ShadButton.outline(
      // Using shadcn UI component
      onPressed: () {
        Navigator.pushNamed(context, route);
      },
      text: Text(
        text,
        style: TextStyle(color: Colors.black),
      ),
      borderRadius: BorderRadius.circular(15.0),
      padding:
          EdgeInsets.symmetric(vertical: 10, horizontal: 15), // Custom padding
    );
  }

  Widget logoutButton() {
    return ShadButton.destructive(
      onPressed: () async {
        await auth0.webAuthentication(scheme: 'demo').logout();
        await storage.delete(key: "credenciales");

        setState(() {
          _credentials = null;
        });
      },
      text: const Text("Cerrar sesion", style: TextStyle(fontSize: 20)),
      borderRadius: BorderRadius.circular(15.0),
    );
  }
}
