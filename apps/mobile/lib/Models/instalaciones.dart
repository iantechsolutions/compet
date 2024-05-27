import 'dart:convert';
import 'package:equatable/equatable.dart';

Instalacion instalacionFromJson(String str) =>
    Instalacion.fromJson(json.decode(str));

class Instalacion extends Equatable {
  final String? id;
  final String? pedido;
  final String? empalmista;
  final DateTime? fechaDeAlta;
  final DateTime? fechaDeInstalacion;
  final DateTime? fechaDeVerificacion;
  final String? estado;
  final String? cliente;

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

  factory Instalacion.fromJson(Map<String, dynamic> json) {
    try {
      print("id");
      print(json["id"]);
      print(json["id"].runtimeType);
      return Instalacion(
        id: json["id"],
        pedido: json["Pedido"],
        empalmista: json["Empalmista"],
        fechaDeInstalacion: json["FechaInstal"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaInstal"])
            : null,
        fechaDeVerificacion: json["FechaVeri"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaVeri"])
            : DateTime.now(),
        fechaDeAlta: json["FechaAlta"] != null
            ? DateTime.fromMillisecondsSinceEpoch(json["FechaAlta"])
            : DateTime.now(),
        // fechaDeInstalacion: null,
        // fechaDeVerificacion: null,
        // fechaDeAlta: null,
        estado: json["Estado"],
        cliente: json["Cliente"],
      );
    } catch (e) {
      print('Error occurred while parsing JSON: $e');
      print('JSON data: $json');
      print("tipo:");
      print(json["FechaAlta"].runtimeType);
      print(json["FechaAlta"] != null);
      print(json["FechaVeri"] != null);
      print(json["FechaInstal"] != null);
      throw e;
    }
  }

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
