import 'package:mplikelanding/Models/instalaciones.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'instalacion_event.dart';
part 'instalacion_state.dart';

class InstalacionBloc extends Bloc<InstalacionEvent, InstalacionState> {
  final TursoRepository _tursoRepository;
  InstalacionBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(InstalacionInitial()) {
    on<InstalacionEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshInstalacions) {
        print('Fetching instalacions...');
        List<Instalacion> instalacions =
            await _tursoRepository.getInstalaciones();
        print('Fetched ${instalacions.length} instalacions');
        emit(InstalacionsFetched(instalaciones: instalacions));
      }
      if (event is DetailsInitial) {
        print('Fetching instalacion details...');
        Instalacion? instalacion =
            await _tursoRepository.getInstalacion(id: event.instalacionId);
        print('Fetched instalacion: ${instalacion?.id}');
        emit(instalacion != null
            ? InstalacionFetched(instalacion: instalacion)
            : InstalacionNotFound());
      }
      // if (event is AddInstalacion) {
      //   print('Adding instalacion...');
      //   bool added = await _tursoRepository.addInstalacion(instalacion: event.instalacion);
      //   print('Instalacion added: $added');
      //   emit(added ? InstalacionAdditionSuccess() : InstalacionAdditionFailure());
      // }
      // if (event is DeleteInstalacion) {
      //   print('Deleting instalacion...');
      //   bool deleted =
      //       await _tursoRepository.deleteInstalacion(instalacion: event.instalacion);
      //   print('Instalacion deleted: $deleted');
      //   emit(deleted ? InstalacionDeletionSuccess() : InstalacionDeletionFailure());
      // }
    });
  }
}
