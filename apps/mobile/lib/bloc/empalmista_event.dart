part of 'empalmista_bloc.dart';

abstract class EmpalmistaEvent extends Equatable {
  const EmpalmistaEvent();

  @override
  List<Object> get props => [];
}

class Initial extends EmpalmistaEvent {}

class DetailsInitial extends EmpalmistaEvent {
  const DetailsInitial({required this.empalmistaId});

  final String empalmistaId;

  @override
  List<Object> get props => [empalmistaId];
}

class RefreshEmpalmistas extends EmpalmistaEvent {}

class DeleteEmpalmista extends EmpalmistaEvent {
  const DeleteEmpalmista({required this.empalmista});

  final Empalmista empalmista;

  @override
  List<Object> get props => [empalmista];
}

class AddEmpalmista extends EmpalmistaEvent {
  const AddEmpalmista({required this.empalmista});

  final Map<String, dynamic> empalmista;

  @override
  List<Object> get props => [empalmista];
}
