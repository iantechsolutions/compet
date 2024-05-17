import 'dart:convert';
import 'package:equatable/equatable.dart';

Pedido instalacionFromJson(String str) => Pedido.fromJson(json.decode(str));

class Pedido extends Equatable {
  final int id;
  final DateTime fechaDeCreacion;
  final DateTime? fechaDeAprobacion;
  final DateTime? fechaDeEnvio;
  final String estado;
  final int cliente;

  const Pedido({
    this.fechaDeAprobacion,
    this.fechaDeEnvio,
    required this.id,
    required this.fechaDeCreacion,
    required this.estado,
    required this.cliente,
  });

  factory Pedido.fromJson(Map<String, dynamic> json) => Pedido(
        id: json["Id"],
        fechaDeCreacion:
            DateTime.fromMillisecondsSinceEpoch(json["FechaCreacion"]),
        fechaDeAprobacion: json["FechaAprobacion"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaAprobacion"])
            : null,
        fechaDeEnvio: json["FechaEnvio"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaEnvio"])
            : null,
        estado: json["Estado"],
        cliente: json["Cliente"],
      );

  @override
  List<Object?> get props =>
      [id, fechaDeCreacion, fechaDeAprobacion, fechaDeEnvio, estado, cliente];
}
