import 'dart:convert';
import 'package:equatable/equatable.dart';

Cliente clienteFromJson(String str) => Cliente.fromJson(json.decode(str));

class Cliente extends Equatable {
  final String id;
  final String nombre;
  final String direccion;

  const Cliente({
    required this.id,
    required this.nombre,
    required this.direccion,
  });

  factory Cliente.fromJson(Map<String, dynamic> json) => Cliente(
        id: json["Id"],
        nombre: json["Nombre"],
        direccion: json["Direccion"],
      );

  @override
  List<Object?> get props => [id, nombre, direccion];
}
