import 'dart:convert';
import 'package:equatable/equatable.dart';

Instalacion instalacionFromJson(String str) =>
    Instalacion.fromJson(json.decode(str));

class Instalacion extends Equatable {
  final int id;
  final int pedido;
  final int empalmista;
  final DateTime fechaDeAlta;
  final DateTime? fechaDeInstalacion;
  final DateTime? fechaDeVerificacion;
  final int estado;
  final int cliente;

  const Instalacion({
    required this.id,
    required this.pedido,
    required this.empalmista,
    required this.fechaDeAlta,
    required this.fechaDeInstalacion,
    required this.fechaDeVerificacion,
    required this.estado,
    required this.cliente,
  });

  factory Instalacion.fromJson(Map<String, dynamic> json) => Instalacion(
        id: json["Id"],
        pedido: json["Pedido"],
        empalmista: json["Empalmista"],
        // fechaDeAlta: DateTime.now(),
        fechaDeInstalacion: json["FechaInstal"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaInstal"])
            : null,
        fechaDeVerificacion: json["FechaVeri"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaVeri"])
            : null,
        fechaDeAlta: DateTime.fromMillisecondsSinceEpoch(json["FechaAlta"]),
        // fechaDeInstalacion:
        //     DateTime.fromMillisecondsSinceEpoch(json["FechaInstal"]),
        // fechaDeVerificacion:
        //     DateTime.fromMillisecondsSinceEpoch(json["FechaVeri"]),
        estado: json["Estado"],
        cliente: json["Cliente"],
      );

  @override
  List<Object?> get props => [
        id,
        pedido,
        empalmista,
        fechaDeAlta,
        fechaDeInstalacion,
        fechaDeVerificacion,
        estado,
        cliente
      ];
}
