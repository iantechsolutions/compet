part of 'pedido_bloc.dart';

abstract class PedidoEvent extends Equatable {
  const PedidoEvent();

  @override
  List<Object> get props => [];
}

class Initial extends PedidoEvent {}

class DetailsInitial extends PedidoEvent {
  const DetailsInitial({required this.pedidoId});

  final String pedidoId;

  @override
  List<Object> get props => [pedidoId];
}

class RefreshPedidos extends PedidoEvent {}

class DeletePedido extends PedidoEvent {
  const DeletePedido({required this.pedido});

  final Pedido pedido;

  @override
  List<Object> get props => [pedido];
}

class AddPedido extends PedidoEvent {
  const AddPedido({required this.pedido});

  final Map<String, dynamic> pedido;

  @override
  List<Object> get props => [pedido];
}

class EditPedido extends PedidoEvent {
  const EditPedido({required this.pedido});

  final Map<String, dynamic> pedido;

  @override
  List<Object> get props => [pedido];
}
