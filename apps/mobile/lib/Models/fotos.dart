import 'package:equatable/equatable.dart';
import 'dart:convert';

Foto fotoFromJson(String str) => Foto.fromJson(json.decode(str));

class Foto extends Equatable {
  final String? id;
  final String? link;
  final String instalacion;
  final double? lat;
  final double? long;
  final String? pasoId;

  const Foto({
    this.id,
    this.link,
    required this.instalacion,
    required this.lat,
    required this.long,
    required this.pasoId,
  });

  factory Foto.fromJson(Map<String, dynamic> json) => Foto(
        id: json["Id"],
        link: json["Link"],
        instalacion: json["Instalacion"],
        lat: json["lat"],
        long: json["long"],
        pasoId: json["PasoId"],
      );

  // Added toJson method
  Map<String, dynamic> toJson() => {
        "Id": id,
        "Link": link,
        "Instalacion": instalacion,
        "lat": lat,
        "long": long,
      };

  @override
  List<Object?> get props => [id, link, instalacion, lat, long];
}
