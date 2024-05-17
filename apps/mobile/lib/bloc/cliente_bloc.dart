import 'package:mplikelanding/Models/clientes.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'cliente_event.dart';
part 'cliente_state.dart';

class ClienteBloc extends Bloc<ClienteEvent, ClienteState> {
  final TursoRepository _tursoRepository;
  ClienteBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(ClienteInitial()) {
    on<ClienteEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshClientes) {
        print('Fetching clientes...');
        List<Cliente> clientes = await _tursoRepository.getClientes();
        print('Fetched ${clientes.length} clientes');
        emit(ClientesFetched(clientes: clientes));
      }
      if (event is DetailsInitial) {
        print('Fetching cliente details...');
        Cliente? cliente =
            await _tursoRepository.getCliente(id: event.clienteId);
        print('Fetched cliente: ${cliente?.nombre}');
        emit(cliente != null
            ? ClienteFetched(cliente: cliente)
            : ClienteNotFound());
      }
      // if (event is AddCliente) {
      //   print('Adding cliente...');
      //   bool added = await _tursoRepository.addCliente(cliente: event.cliente);
      //   print('Cliente added: $added');
      //   emit(added ? ClienteAdditionSuccess() : ClienteAdditionFailure());
      // }
      // if (event is DeleteCliente) {
      //   print('Deleting cliente...');
      //   bool deleted =
      //       await _tursoRepository.deleteCliente(cliente: event.cliente);
      //   print('Cliente deleted: $deleted');
      //   emit(deleted ? ClienteDeletionSuccess() : ClienteDeletionFailure());
      // }
    });
  }
}
