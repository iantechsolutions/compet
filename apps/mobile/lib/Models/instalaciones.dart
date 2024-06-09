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
    this.tipoInstalacionData,
  });

  factory Instalacion.fromJson(Map<String, dynamic> json) {
    try {
      print('Parsing id...');
      final id = json["Id"];
      print(id);
      print('Parsing pedido...');
      final pedido = json["Pedido"];
      print(pedido);
      print('Parsing producto_pedido...');
      final producto_pedido = json["Producto_pedido"];
      print(producto_pedido);
      print('Parsing empalmista...');
      final empalmista = json["Empalmista"];
      print(empalmista);
      print('Parsing fechaDeInstalacion...');
      final fechaDeInstalacion = json["Fecha_de_instalacion"] != null
          ? DateTime.parse(json["Fecha_de_instalacion"])
          : null;
      print(fechaDeInstalacion);
      print('Parsing fechaDeVerificacion...');
      final fechaDeVerificacion = json["Fecha_de_verificacion"] != null
          ? DateTime.parse(json["Fecha_de_verificacion"])
          : null;
      print(fechaDeVerificacion);
      print('Parsing fechaDeAlta...');
      final fechaDeAlta = json["Fecha_de_alta"] != null
          ? DateTime.parse(json["Fecha_de_alta"])
          : DateTime.now();
      print(fechaDeAlta);
      print('Parsing estado...');
      final estado = json["Estado"];
      print(estado);
      print('Parsing cliente...');
      final cliente = json["Cliente"];
      print(cliente);
      print('Parsing tipoInstalacion...');
      final tipoInstalacion = json["tipoInstalacionId"];
      print(tipoInstalacion);
      print('Parsing Codigo_de_barras...');
      final Codigo_de_barras = json["Codigo_de_barras"];
      print(Codigo_de_barras);
      print('Parsing tipoInstalacionData...');
      final tipoInstalacionData = json["tipoInstalacion"] != null
          ? TipoInstalacion.fromJson(
              json["tipoInstalacion"] as Map<String, dynamic>)
          : null;
      print(tipoInstalacionData);
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
      ];
}
