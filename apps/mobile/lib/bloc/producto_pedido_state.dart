part of 'producto_pedido_bloc.dart';

abstract class ProductoPedidoState extends Equatable {
  const ProductoPedidoState();

  @override
  List<Object> get props => [];
}

class ProductoPedidoInitial extends ProductoPedidoState {}

class Loading extends ProductoPedidoState {}

class ProductoPedidosFetched extends ProductoPedidoState {
  const ProductoPedidosFetched({required this.pedidoes});

  final List<ProductoPedido> pedidoes;

  @override
  List<Object> get props => [pedidoes];
}

class ProductoPedidoFetched extends ProductoPedidoState {
  const ProductoPedidoFetched({required this.pedido});

  final ProductoPedido pedido;

  @override
  List<Object> get props => [pedido];
}

class ProductoPedidoNotFound extends ProductoPedidoState {}

class ProductoPedidoDeletionFailure extends ProductoPedidoState {}

class ProductoPedidoDeletionSuccess extends ProductoPedidoState {}

class ProductoPedidoAdditionSuccess extends ProductoPedidoState {}

class ProductoPedidoAdditionFailure extends ProductoPedidoState {}
