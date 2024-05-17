part of 'pedido_bloc.dart';

abstract class PedidoState extends Equatable {
  const PedidoState();

  @override
  List<Object> get props => [];
}

class PedidoInitial extends PedidoState {}

class Loading extends PedidoState {}

class PedidosFetched extends PedidoState {
  const PedidosFetched({required this.pedidoes});

  final List<Pedido> pedidoes;

  @override
  List<Object> get props => [pedidoes];
}

class PedidoFetched extends PedidoState {
  const PedidoFetched({required this.pedido});

  final Pedido pedido;

  @override
  List<Object> get props => [pedido];
}

class PedidoNotFound extends PedidoState {}

class PedidoDeletionFailure extends PedidoState {}

class PedidoDeletionSuccess extends PedidoState {}

class PedidoAdditionSuccess extends PedidoState {}

class PedidoAdditionFailure extends PedidoState {}
