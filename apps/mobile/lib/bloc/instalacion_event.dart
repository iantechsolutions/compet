part of 'instalacion_bloc.dart';

abstract class InstalacionEvent extends Equatable {
  const InstalacionEvent();

  @override
  List<Object> get props => [];
}

class Initial extends InstalacionEvent {}

class DetailsInitial extends InstalacionEvent {
  const DetailsInitial({required this.barcode});

  final String barcode;

  @override
  List<Object> get props => [barcode];
}

class RefreshInstalacions extends InstalacionEvent {}

class StandByInstalacion extends InstalacionEvent {}

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

class EditInstalacion extends InstalacionEvent {
  const EditInstalacion({required this.instalacion});

  final Map<String, dynamic> instalacion;

  @override
  List<Object> get props => [instalacion];
}
