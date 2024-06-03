import 'dart:convert';
import 'package:equatable/equatable.dart';

ProductoPedido productosPedidosFromJson(String str) =>
    ProductoPedido.fromJson(json.decode(str));

class ProductoPedido extends Equatable {
  final String id;
  final String pedido;
  final String producto;
  final int cantidad;
  final String nombre;
  final String descripcion;
  final String codigoDeBarras;
  int cantidadScaneada;

  ProductoPedido({
    required this.id,
    required this.pedido,
    required this.producto,
    required this.cantidad,
    required this.cantidadScaneada,
    this.nombre = '',
    this.descripcion = '',
    this.codigoDeBarras = '',
  });

  factory ProductoPedido.fromJson(Map<String, dynamic> json) => ProductoPedido(
        id: json["Id"],
        pedido: json["Pedido"],
        producto: json["Producto"],
        cantidad: json["Cantidad"],
        cantidadScaneada: json["CantidadScaneada"] ?? json["Cantidad"],
        nombre: json["Nombre"],
        descripcion: json["Descripcion"],
        codigoDeBarras: json["Codigo_de_barras"],
      );

  @override
  List<Object?> get props =>
      [id, pedido, producto, cantidad, nombre, descripcion, codigoDeBarras];
}
