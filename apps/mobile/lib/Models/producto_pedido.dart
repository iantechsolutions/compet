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
  final String tipoInstalacion;
  int cantidadScaneada;

  ProductoPedido({
    required this.id,
    required this.pedido,
    required this.producto,
    required this.cantidad,
    required this.cantidadScaneada,
    this.nombre = '',
    this.descripcion = '',
    this.tipoInstalacion = '',
  });

  factory ProductoPedido.fromJson(Map<String, dynamic> json) {
    try {
      return ProductoPedido(
        id: json["Id"],
        pedido: json["Pedido"],
        producto: json["Producto"],
        cantidad: json["Cantidad"],
        cantidadScaneada: json["CantidadScaneada"] ?? 0,
        nombre: json["Nombre"],
        descripcion: json["Descripcion"],
        tipoInstalacion: json["tipoInstalacion"],
      );
    } catch (e) {
      try {
        return ProductoPedido(
          id: json["Id"],
          pedido: json["Pedido"],
          producto: json["Producto"],
          cantidad: json["Cantidad"],
          cantidadScaneada: 0,
          nombre: json["Nombre"],
          descripcion: json["Descripcion"],
          tipoInstalacion: json["tipoInstalacion"],
        );
      } catch (e) {
        print('Error occurred while parsing ProductoPedido from JSON: $json');
        throw e;
      }
    }
  }

  @override
  List<Object?> get props =>
      [id, pedido, producto, cantidad, nombre, descripcion, tipoInstalacion];
}
