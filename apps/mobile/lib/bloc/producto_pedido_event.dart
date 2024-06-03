part of 'producto_pedido_bloc.dart';

abstract class ProductoPedidoEvent extends Equatable {
  const ProductoPedidoEvent();

  @override
  List<Object> get props => [];
}

class Initial extends ProductoPedidoEvent {}

class DetailsInitial extends ProductoPedidoEvent {
  const DetailsInitial({required this.pedidoId});

  final String pedidoId;

  @override
  List<Object> get props => [pedidoId];
}

class RefreshProductoPedidos extends ProductoPedidoEvent {}

class DeleteProductoPedido extends ProductoPedidoEvent {
  const DeleteProductoPedido({required this.pedido});

  final ProductoPedido pedido;

  @override
  List<Object> get props => [pedido];
}

class AddProductoPedido extends ProductoPedidoEvent {
  const AddProductoPedido({required this.pedido});

  final Map<String, dynamic> pedido;

  @override
  List<Object> get props => [pedido];
}
