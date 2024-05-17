import 'package:mplikelanding/Models/empalmistas.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'empalmista_event.dart';
part 'empalmista_state.dart';

class EmpalmistaBloc extends Bloc<EmpalmistaEvent, EmpalmistaState> {
  final TursoRepository _tursoRepository;
  EmpalmistaBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(EmpalmistaInitial()) {
    on<EmpalmistaEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshEmpalmistas) {
        print('Fetching empalmistas...');
        List<Empalmista> empalmistas = await _tursoRepository.getEmpalmistas();
        print('Fetched ${empalmistas.length} empalmistas');
        emit(EmpalmistasFetched(empalmistas: empalmistas));
      }
      if (event is DetailsInitial) {
        print('Fetching empalmista details...');
        Empalmista? empalmista =
            await _tursoRepository.getEmpalmista(id: event.empalmistaId);
        print('Fetched empalmista: ${empalmista?.nombre}');
        emit(empalmista != null
            ? EmpalmistaFetched(empalmista: empalmista)
            : EmpalmistaNotFound());
      }
      // if (event is AddEmpalmista) {
      //   print('Adding empalmista...');
      //   bool added = await _tursoRepository.addEmpalmista(empalmista: event.empalmista);
      //   print('Empalmista added: $added');
      //   emit(added ? EmpalmistaAdditionSuccess() : EmpalmistaAdditionFailure());
      // }
      // if (event is DeleteEmpalmista) {
      //   print('Deleting empalmista...');
      //   bool deleted =
      //       await _tursoRepository.deleteEmpalmista(empalmista: event.empalmista);
      //   print('Empalmista deleted: $deleted');
      //   emit(deleted ? EmpalmistaDeletionSuccess() : EmpalmistaDeletionFailure());
      // }
    });
  }
}
