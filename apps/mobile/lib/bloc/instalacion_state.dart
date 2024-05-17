part of 'instalacion_bloc.dart';

abstract class InstalacionState extends Equatable {
  const InstalacionState();

  @override
  List<Object> get props => [];
}

class InstalacionInitial extends InstalacionState {}

class Loading extends InstalacionState {}

class InstalacionsFetched extends InstalacionState {
  const InstalacionsFetched({required this.instalaciones});

  final List<Instalacion> instalaciones;

  @override
  List<Object> get props => [instalaciones];
}

class InstalacionFetched extends InstalacionState {
  const InstalacionFetched({required this.instalacion});

  final Instalacion instalacion;

  @override
  List<Object> get props => [instalacion];
}

class InstalacionNotFound extends InstalacionState {}

class InstalacionDeletionFailure extends InstalacionState {}

class InstalacionDeletionSuccess extends InstalacionState {}

class InstalacionAdditionSuccess extends InstalacionState {}

class InstalacionAdditionFailure extends InstalacionState {}
