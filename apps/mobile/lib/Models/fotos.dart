import 'package:equatable/equatable.dart';
import 'dart:convert';

Foto fotoFromJson(String str) => Foto.fromJson(json.decode(str));

class Foto extends Equatable {
  final int id;
  final String? link;
  final int instalacion;

  const Foto({
    required this.id,
    this.link,
    required this.instalacion,
  });

  factory Foto.fromJson(Map<String, dynamic> json) => Foto(
        id: json["Id"],
        link: json["Link"],
        instalacion: json["Instalacion"],
      );

  @override
  List<Object?> get props => [id, link, instalacion];
}
