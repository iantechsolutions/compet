import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mplikelanding/Models/instalaciones.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:mplikelanding/components/auth_service.dart';
import 'package:mplikelanding/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
part 'instalacion_event.dart';
part 'instalacion_state.dart';

class InstalacionBloc extends Bloc<InstalacionEvent, InstalacionState> {
  final String _baseUrl = Constants.BASE_URL; // replace with your API URL
  final storage = const FlutterSecureStorage();

  InstalacionBloc() : super(InstalacionInitial()) {
    on<InstalacionEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshInstalacions) {
        print('Fetching instalacions...');
        List<Instalacion> instalacions = await _getInstalacionsFromApi();
        print('Fetched ${instalacions.length} instalacions');
        emit(InstalacionsFetched(instalaciones: instalacions));
      }
      if (event is StandByInstalacion){
        emit(InstalacionInitial());
      }
      if (event is DetailsInitial) {
        try {
          print('Fetching instalacion details...');
          print("acaca");
          Instalacion? instalacion =
              await _getInstalacionFromBarCode(event.barcode);
          print('Fetched ${instalacion}');
          print("aca");
          print(instalacion);
          if (instalacion != null) {
            print("aca?");
            emit(InstalacionFetched(instalacion: instalacion));
          } else {
            print("emiteado");
            emit(InstalacionNotFound());
          }
        } catch (e) {
          emit(InstalacionNotFound());
        }
      }
      if (event is AddInstalacion) {
        print('Creating instalacion...');
        String? result = await _createInstalacion(event.instalacion);
        if(result == null){
          emit(InstalacionAdditionSuccess());
          
        }
        else{
          emit(InstalacionAdditionFailure(error: result));
        }
      }
      if (event is EditInstalacion) {
        print('Editing instalacion...');
        await _editInstalacion(event.instalacion);
      }
    });
  }

  Future<List<Instalacion>> _getInstalacionsFromApi() async {
    String? accessToken = await storage.read(key: "credenciales");
    final response = await http.get(
      Uri.parse('$_baseUrl/instalaciones'),
      headers: <String, String>{'Authorization': "Bearer $accessToken" ?? ""},
    );
    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      Map<String, dynamic> map = json.decode(response.body);
      Iterable list = map['instalaciones'];
      return list.map((model) => Instalacion.fromJson(model)).toList();
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to load pedidos');
    }
    // Fetch data from API
  }

  Future<Instalacion?> _getInstalacionFromBarCode(String barcode) async {
    String? accessToken = await storage.read(key: "credenciales");
    final response = await http.get(
      Uri.parse('$_baseUrl/instalaciones/barcode/$barcode'),
      headers: <String, String>{'Authorization': "Bearer $accessToken" ?? ""},
    );
    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      Map<String, dynamic> map = json.decode(response.body);

      // Iterable list = ;
      print("parsea");
      try {
        Instalacion instalacion = Instalacion.fromJson(map['instalaciones']);

        return instalacion;
      } catch (e) {
        return null;
      }
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      // throw Exception('Failed to load instalacion');
      return null;
    }
    // Fetch data from API
  }

  Future<String?> _createInstalacion(Map<String, dynamic> instalacion) async {
    String? accessToken = await storage.read(key: "credenciales");
    print(accessToken);
    var coso = jsonEncode(instalacion);
    print("aca no hay error");
    final response = await http.post(
      Uri.parse('$_baseUrl/instalaciones/post'),
      body: coso,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': "Bearer $accessToken"
      },
    );
    print("response");
    print(response.body);
    print(response.body == '"Codigo en uso"');
    print(response.body == '"Codigo no sistema"');
    if (response.statusCode == 200) {
      if(response.body == '"Codigo en uso"'){
        return ("El Codigo de barras ya esta en uso");
      }
      else if (response.body == '"Codigo no sistema"'){
        return ("El Codigo de barras no existe en el sistema");
      }
      return null;
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      return ('Error al crear la instalacion');
    }
  }

  Future<void> _editInstalacion(Map<String, dynamic> instalacion) async {
    String? accessToken = await storage.read(key: "credenciales");
    var coso = jsonEncode(instalacion);
    final response = await http.put(
      Uri.parse('$_baseUrl/instalaciones/update/' + instalacion['Id']),
      body: coso,
      headers: <String, String>{
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': "Bearer $accessToken"
      },
    );

    if (response.statusCode == 200) {
      Map<String, dynamic> map = json.decode(response.body);
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to update instalacion');
    }
  }
}
