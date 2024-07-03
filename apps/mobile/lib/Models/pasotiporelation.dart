import 'dart:convert';
import 'package:equatable/equatable.dart';

import 'pasoCritico.dart';

pasoTipoRelation pasoTipoRelationFromJson(String str) =>
    pasoTipoRelation.fromJson(json.decode(str));

class pasoTipoRelation extends Equatable {
  final String? id;
  final String? TipoInstalacion;
  final String? pasoCriticoId;
  pasoCritico? pasoCriticoData;

  pasoTipoRelation({
    required this.id,
    required this.TipoInstalacion,
    required this.pasoCriticoId,
    this.pasoCriticoData,
  });

  factory pasoTipoRelation.fromJson(Map<String, dynamic> json) {
    try {
      final id = json["id"];
      final tipoInstalacion = json["tipoInstalacion"];
      final pasoCriticoId = json["pasoCritico"];
      final pasoCriticoData = json["pasoCriticoData"] != null
          ? pasoCritico
              .fromJson(json["pasoCriticoData"] as Map<String, dynamic>)
          : null;
      return pasoTipoRelation(
          id: id,
          TipoInstalacion: tipoInstalacion,
          pasoCriticoId: pasoCriticoId,
          pasoCriticoData: pasoCriticoData);
    } catch (e) {
      print('Error occurred while parsing JSON: $e');
      print('JSON data: $json');
      throw e;
    }
  }

  @override
  List<Object?> get props => [
        id,
        TipoInstalacion,
        pasoCriticoId,
        pasoCriticoData,
      ];
}
