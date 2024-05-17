part of 'cliente_bloc.dart';

abstract class ClienteState extends Equatable {
  const ClienteState();

  @override
  List<Object> get props => [];
}

class ClienteInitial extends ClienteState {}

class Loading extends ClienteState {}

class ClientesFetched extends ClienteState {
  const ClientesFetched({required this.clientes});

  final List<Cliente> clientes;

  @override
  List<Object> get props => [clientes];
}

class ClienteFetched extends ClienteState {
  const ClienteFetched({required this.cliente});

  final Cliente cliente;

  @override
  List<Object> get props => [cliente];
}

class ClienteNotFound extends ClienteState {}

class ClienteDeletionFailure extends ClienteState {}

class ClienteDeletionSuccess extends ClienteState {}

class ClienteAdditionSuccess extends ClienteState {}

class ClienteAdditionFailure extends ClienteState {}
