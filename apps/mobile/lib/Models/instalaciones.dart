import 'dart:convert';
import 'package:equatable/equatable.dart';

import 'tipoinstalacion.dart';

Instalacion instalacionFromJson(String str) =>
    Instalacion.fromJson(json.decode(str));

class Instalacion extends Equatable {
  final String? id;
  final String? pedido;
  final String? producto_pedido;
  final String? empalmista;
  final DateTime? fechaDeAlta;
  final DateTime? fechaDeInstalacion;
  final DateTime? fechaDeVerificacion;
  final String? estado;
  final String? cliente;
  final String? tipoInstalacion;
  final String? Codigo_de_barras;
  final double? lat;
  final double? long;
  TipoInstalacion? tipoInstalacionData;

  Instalacion({
    required this.id,
    required this.pedido,
    required this.producto_pedido,
    required this.empalmista,
    required this.fechaDeAlta,
    required this.fechaDeInstalacion,
    required this.fechaDeVerificacion,
    required this.estado,
    required this.cliente,
    required this.tipoInstalacion,
    required this.Codigo_de_barras,
    required this.lat,
    required this.long,
    this.tipoInstalacionData,
  });

  factory Instalacion.fromJson(Map<String, dynamic> json) {
    try {
      final id = json["Id"];
      final pedido = json["Pedido"];
      final producto_pedido = json["Producto_pedido"];
      final empalmista = json["Empalmista"];
      final fechaDeInstalacion = json["Fecha_de_instalacion"] != null
          ? DateTime.parse(json["Fecha_de_instalacion"])
          : null;
      final fechaDeVerificacion = json["Fecha_de_verificacion"] != null
          ? DateTime.parse(json["Fecha_de_verificacion"])
          : null;
      final fechaDeAlta = json["Fecha_de_alta"] != null
          ? DateTime.parse(json["Fecha_de_alta"])
          : DateTime.now();
      final estado = json["Estado"];
      final cliente = json["Cliente"];
      final tipoInstalacion = json["tipoInstalacionId"];
      final Codigo_de_barras = json["Codigo_de_barras"];
      final tipoInstalacionData = json["tipoInstalacion"] != null
          ? TipoInstalacion.fromJson(
              json["tipoInstalacion"] as Map<String, dynamic>)
          : null;
      final lat = json["lat"];
      final long = json["long"];
      return Instalacion(
        id: id,
        pedido: pedido,
        producto_pedido: producto_pedido,
        empalmista: empalmista,
        fechaDeInstalacion: fechaDeInstalacion,
        fechaDeVerificacion: fechaDeVerificacion,
        fechaDeAlta: fechaDeAlta,
        estado: estado,
        cliente: cliente,
        tipoInstalacion: tipoInstalacion,
        Codigo_de_barras: Codigo_de_barras,
        tipoInstalacionData: tipoInstalacionData,
        lat: lat,
        long: long,
      );
    } catch (e) {
      print('Error occurred while parsing JSON: $e');
      print('JSON data: $json');
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
        cliente,
        tipoInstalacion,
        Codigo_de_barras,
        tipoInstalacionData,
        lat,
        long,
      ];
}
