import 'package:flutter/material.dart';

class SafetyInstructionsComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      child: const Column(
        children: <Widget>[
          Text(
              "\u2022 Asegurese de que los cables esten desconectados de la fuente de energia"),
          Text(
              "\u2022 Asegurese de tener las herramientas necesarias para realizar el empalme"),
          Text(
              "\u2022 Asegurese de que los cables esten en buen estado y no presenten cortes o deterioro"),
        ],
      ),
    );
  }
}
