import 'dart:convert';
import 'package:equatable/equatable.dart';

import 'pasotiporelation.dart';

TipoInstalacion TipoInstalacionFromJson(String str) =>
    TipoInstalacion.fromJson(json.decode(str));

class TipoInstalacion extends Equatable {
  final String? id;
  final String? description;
  List<pasoTipoRelation>? pasoCriticoTotipoInstalacion;

  TipoInstalacion({
    required this.id,
    required this.description,
    this.pasoCriticoTotipoInstalacion,
  });

  factory TipoInstalacion.fromJson(Map<String, dynamic> json) {
    try {
      print('Parsing id...');
      final id = json["id"];
      print(id);
      print('Parsing description...');
      final description = json["description"];
      print(description);
      print('Parsing pasoCriticoTotipoInstalacion...');
      var pasoList = json['pasoCriticoTotipoInstalacion'] as List;
      List<pasoTipoRelation>? pasoCriticoTotipoInstalacionList =
          pasoList.map((i) => pasoTipoRelation.fromJson(i)).toList();
      print(pasoCriticoTotipoInstalacionList);
      return TipoInstalacion(
          id: id,
          description: description,
          pasoCriticoTotipoInstalacion: pasoCriticoTotipoInstalacionList);
    } catch (e) {
      print('Error occurred while parsing JSON: $e');
      print('JSON data: $json');
      throw e;
    }
  }
  @override
  List<Object?> get props => [
        id,
        description,
        pasoCriticoTotipoInstalacion,
      ];
}
