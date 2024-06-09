import 'dart:convert';
import 'package:equatable/equatable.dart';

pasoCritico pasoCriticoFromJson(String str) =>
    pasoCritico.fromJson(json.decode(str));

class pasoCritico extends Equatable {
  final String? id;
  final String? detalle;
  final String? description;
  final bool usesCamera;

  pasoCritico({
    required this.id,
    required this.detalle,
    required this.description,
    required this.usesCamera,
  });

  factory pasoCritico.fromJson(Map<String, dynamic> json) {
    try {
      print('Parsing id...');
      final id = json["id"];
      print(id);
      print('Parsing detalle...');
      final detalle = json['detalle'];
      print(detalle);
      print('Parsing description...');
      final description = json["description"];
      print(description);
      print('Parsing usesCamera...');
      final usesCamera = json["useCamera"];
      print(usesCamera);
      return pasoCritico(
          id: id,
          detalle: detalle,
          description: description,
          usesCamera: usesCamera);
    } catch (e) {
      print('Error occurred while parsing JSON: $e');
      print('JSON data: $json');
      throw e;
    }
  }

  @override
  List<Object?> get props => [
        id,
        detalle,
        description,
        usesCamera,
      ];
}
