part of 'empalmista_bloc.dart';

abstract class EmpalmistaState extends Equatable {
  const EmpalmistaState();

  @override
  List<Object> get props => [];
}

class EmpalmistaInitial extends EmpalmistaState {}

class Loading extends EmpalmistaState {}

class EmpalmistasFetched extends EmpalmistaState {
  const EmpalmistasFetched({required this.empalmistas});

  final List<Empalmista> empalmistas;

  @override
  List<Object> get props => [empalmistas];
}

class EmpalmistaFetched extends EmpalmistaState {
  const EmpalmistaFetched({required this.empalmista});

  final Empalmista empalmista;

  @override
  List<Object> get props => [empalmista];
}

class EmpalmistaNotFound extends EmpalmistaState {}

class EmpalmistaDeletionFailure extends EmpalmistaState {}

class EmpalmistaDeletionSuccess extends EmpalmistaState {}

class EmpalmistaAdditionSuccess extends EmpalmistaState {}

class EmpalmistaAdditionFailure extends EmpalmistaState {}
