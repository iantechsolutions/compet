import 'dart:convert';
import 'package:equatable/equatable.dart';
import 'package:mplikelanding/Models/clientes.dart';
import 'package:mplikelanding/Models/producto_pedido.dart';
import 'package:mplikelanding/Models/productos.dart';

Pedido instalacionFromJson(String str) => Pedido.fromJson(json.decode(str));

class Pedido extends Equatable {
  final String id;
  final DateTime fechaDeCreacion;
  final DateTime? fechaDeAprobacion;
  final DateTime? fechaDeEnvio;
  final String estado;
  final String cliente;
  int? numero;
  Cliente? clienteObj;
  List<ProductoPedido>? productos;

  Pedido({
    this.fechaDeAprobacion,
    this.fechaDeEnvio,
    required this.id,
    required this.fechaDeCreacion,
    required this.estado,
    required this.cliente,
    this.numero,
    this.clienteObj,
    this.productos,
  });

  factory Pedido.fromJson(Map<String, dynamic> json) => Pedido(
        id: json["Id"],
        fechaDeCreacion: DateTime.parse(json["Fecha_de_creacion"]),
        fechaDeAprobacion: json["Fecha_de_aprobacion"] != null
            ? DateTime.parse(json["Fecha_de_aprobacion"])
            : null,
        fechaDeEnvio: json["Fecha_de_envio"] != null
            ? DateTime.parse(json["Fecha_de_envio"])
            : null,
        estado: json["Estado"],
        cliente: json["Cliente"],
        numero: json["Numero"],
        clienteObj:
            json["cliente"] != null ? Cliente.fromJson(json["cliente"]) : null,
        productos: json["productos"] != null && json["productos"].length > 0
            ? List<ProductoPedido>.from(
                json["productos"].map((x) => ProductoPedido.fromJson(x)))
            : [],
      );

  @override
  List<Object?> get props =>
      [id, fechaDeCreacion, fechaDeAprobacion, fechaDeEnvio, estado, cliente];
}
