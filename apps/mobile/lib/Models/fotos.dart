import 'package:equatable/equatable.dart';
import 'dart:convert';

Foto fotoFromJson(String str) => Foto.fromJson(json.decode(str));

class Foto extends Equatable {
  final String? id;
  final String? link;
  final String instalacion;

  const Foto({
    this.id,
    this.link,
    required this.instalacion,
  });

  factory Foto.fromJson(Map<String, dynamic> json) => Foto(
        id: json["Id"],
        link: json["Link"],
        instalacion: json["Instalacion"],
      );

  // Added toJson method
  Map<String, dynamic> toJson() => {
        "Id": id,
        "Link": link,
        "Instalacion": instalacion,
      };

  @override
  List<Object?> get props => [id, link, instalacion];
}
