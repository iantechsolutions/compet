import 'package:auth0_flutter/auth0_flutter.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mplikelanding/Models/pedidos.dart';
import 'package:mplikelanding/Models/clientes.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:mplikelanding/components/auth_service.dart';
import 'package:mplikelanding/constants.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

part 'pedido_event.dart';
part 'pedido_state.dart';

class PedidoBloc extends Bloc<PedidoEvent, PedidoState> {
  final String _baseUrl = Constants.BASE_URL; // replace with your API URL
  final storage = const FlutterSecureStorage();

  PedidoBloc() : super(PedidoInitial()) {
    on<PedidoEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshPedidos) {
        print('Fetching pedidos...');
        List<Pedido> pedidos = await _getPedidosFromApi();
        print('Fetched ${pedidos.length} pedidos');
        emit(PedidosFetched(pedidoes: pedidos));
      }
      if (event is DetailsInitial) {
        print('Fetching pedido details...');
        Pedido? pedido = await _getPedidoFromApi(id: event.pedidoId);
        print('Fetched pedido: ${pedido?.id}');
        emit(pedido != null ? PedidoFetched(pedido: pedido) : PedidoNotFound());
      }
    });
  }

  Future<List<Pedido>> _getPedidosFromApi() async {
    String? accessToken = await storage.read(key: "credenciales");
    final response = await http.get(
      Uri.parse('$_baseUrl/pedidos'),
      headers: <String, String>{'Authorization': "Bearer $accessToken" ?? ""},
    );
    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      Map<String, dynamic> map = json.decode(response.body);
      Iterable list = map['pedidos'];
      return list.map((model) => Pedido.fromJson(model)).toList();
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to load pedidos');
    }
  }

  Future<Pedido?> _getPedidoFromApi({required String id}) async {
    String? accessToken = await storage.read(key: "credenciales");
    final response = await http.get(Uri.parse('$_baseUrl/pedidos/$id'),
        headers: <String, String>{
          'Authorization': "Bearer $accessToken" ?? ""
        }); // replace '/pedidos' with your endpoint

    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      return Pedido.fromJson(json.decode(response.body));
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to load pedido');
    }
  }
}
