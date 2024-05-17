part of 'instalacion_bloc.dart';

abstract class InstalacionEvent extends Equatable {
  const InstalacionEvent();

  @override
  List<Object> get props => [];
}

class Initial extends InstalacionEvent {}

class DetailsInitial extends InstalacionEvent {
  const DetailsInitial({required this.instalacionId});

  final String instalacionId;

  @override
  List<Object> get props => [instalacionId];
}

class RefreshInstalacions extends InstalacionEvent {}

class DeleteInstalacion extends InstalacionEvent {
  const DeleteInstalacion({required this.instalacion});

  final Instalacion instalacion;

  @override
  List<Object> get props => [instalacion];
}

class AddInstalacion extends InstalacionEvent {
  const AddInstalacion({required this.instalacion});

  final Map<String, dynamic> instalacion;

  @override
  List<Object> get props => [instalacion];
}
