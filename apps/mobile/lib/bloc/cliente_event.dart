part of 'cliente_bloc.dart';

abstract class ClienteEvent extends Equatable {
  const ClienteEvent();

  @override
  List<Object> get props => [];
}

class Initial extends ClienteEvent {}

class DetailsInitial extends ClienteEvent {
  const DetailsInitial({required this.clienteId});

  final String clienteId;

  @override
  List<Object> get props => [clienteId];
}

class RefreshClientes extends ClienteEvent {}

class DeleteCliente extends ClienteEvent {
  const DeleteCliente({required this.cliente});

  final Cliente cliente;

  @override
  List<Object> get props => [cliente];
}

class AddCliente extends ClienteEvent {
  const AddCliente({required this.cliente});

  final Map<String, dynamic> cliente;

  @override
  List<Object> get props => [cliente];
}
