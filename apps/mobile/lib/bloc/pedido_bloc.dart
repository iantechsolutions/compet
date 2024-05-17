import 'package:mplikelanding/Models/pedidos.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'pedido_event.dart';
part 'pedido_state.dart';

class PedidoBloc extends Bloc<PedidoEvent, PedidoState> {
  final TursoRepository _tursoRepository;
  PedidoBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(PedidoInitial()) {
    on<PedidoEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshPedidos) {
        print('Fetching pedidos...');
        List<Pedido> pedidos = await _tursoRepository.getPedidos();
        print('Fetched ${pedidos.length} pedidos');
        emit(PedidosFetched(pedidoes: pedidos));
      }
      if (event is DetailsInitial) {
        print('Fetching pedido details...');
        Pedido? pedido = await _tursoRepository.getPedido(id: event.pedidoId);
        print('Fetched pedido: ${pedido?.id}');
        emit(pedido != null ? PedidoFetched(pedido: pedido) : PedidoNotFound());
      }
      // if (event is AddPedido) {
      //   print('Adding pedido...');
      //   bool added = await _tursoRepository.addPedido(pedido: event.pedido);
      //   print('Pedido added: $added');
      //   emit(added ? PedidoAdditionSuccess() : PedidoAdditionFailure());
      // }
      // if (event is DeletePedido) {
      //   print('Deleting pedido...');
      //   bool deleted =
      //       await _tursoRepository.deletePedido(pedido: event.pedido);
      //   print('Pedido deleted: $deleted');
      //   emit(deleted ? PedidoDeletionSuccess() : PedidoDeletionFailure());
      // }
    });
  }
}
