import 'dart:convert';
import 'package:equatable/equatable.dart';

Empalmista empalmistaFromJson(String str) =>
    Empalmista.fromJson(json.decode(str));

class Empalmista extends Equatable {
  final int id;
  final String nombre;

  const Empalmista({
    required this.id,
    required this.nombre,
  });

  factory Empalmista.fromJson(Map<String, dynamic> json) => Empalmista(
        id: json["Id"],
        nombre: json["Nombre"],
      );

  @override
  List<Object?> get props => [id, nombre];
}
