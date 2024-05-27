import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:mplikelanding/Models/clientes.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';
import 'package:mplikelanding/constants.dart';

part 'cliente_event.dart';
part 'cliente_state.dart';

class ClienteBloc extends Bloc<ClienteEvent, ClienteState> {
  final String _baseUrl = Constants.BASE_URL; // replace with your API URL

  ClienteBloc() : super(ClienteInitial()) {
    on<ClienteEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshClientes) {
        print('Fetching clientes...');
        List<Cliente> clientes = await _getClientesFromApi();
        print('Fetched ${clientes.length} clientes');
        emit(ClientesFetched(clientes: clientes));
      }
      if (event is DetailsInitial) {
        print('Fetching cliente details...');
        Cliente? cliente = await _getClienteFromApi(id: event.clienteId);
        print('Fetched cliente: ${cliente?.nombre}');
        emit(cliente != null
            ? ClienteFetched(cliente: cliente)
            : ClienteNotFound());
      }
      // if (event is AddCliente) {
      //   print('Adding cliente...');
      // }
    });
  }

  Future<List<Cliente>> _getClientesFromApi() async {
    final response = await http.get(Uri.parse(
        '$_baseUrl/clients')); // replace '/clients' with your endpoint

    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      Iterable list = json.decode(response.body);
      return list.map((model) => Cliente.fromJson(model)).toList();
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to load clients');
    }
  }

  Future<Cliente?> _getClienteFromApi({required String id}) async {
    final response = await http.get(Uri.parse(
        '$_baseUrl/clients/$id')); // replace '/clients' with your endpoint

    if (response.statusCode == 200) {
      // If the server returns a 200 OK response, parse the JSON.
      return Cliente.fromJson(json.decode(response.body));
    } else {
      // If the server returns an unsuccessful response code, throw an exception.
      throw Exception('Failed to load client');
    }
  }
}
