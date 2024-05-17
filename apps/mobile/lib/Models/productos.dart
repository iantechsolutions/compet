import 'package:equatable/equatable.dart';
import 'dart:convert';

Producto productoFromJson(String str) => Producto.fromJson(json.decode(str));

class Producto extends Equatable {
  final int id;
  final String nombre;
  final String codigoDeBarras;
  final String descripcion;

  const Producto({
    required this.id,
    required this.nombre,
    required this.codigoDeBarras,
    required this.descripcion,
  });

  factory Producto.fromJson(Map<String, dynamic> json) => Producto(
        id: json["Id"],
        nombre: json["Nombre"],
        codigoDeBarras: json["BarCode"],
        descripcion: json["Descripcion"],
      );

  @override
  List<Object?> get props => [id, nombre, codigoDeBarras, descripcion];
}
