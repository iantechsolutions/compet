import 'package:flutter/material.dart';

class SafetyInstructionsComponent extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(8.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          RichText(
            text: TextSpan(
              style: DefaultTextStyle.of(context).style,
              children: <TextSpan>[
                TextSpan(
                    text: '\u2022 ',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                TextSpan(
                    text:
                        'Asegurese de que los cables esten desconectados de la fuente de energia'),
              ],
            ),
          ),
          SizedBox(height: 10),
          RichText(
            text: TextSpan(
              style: DefaultTextStyle.of(context).style,
              children: <TextSpan>[
                TextSpan(
                    text: '\u2022 ',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                TextSpan(
                    text:
                        'Asegurese de tener las herramientas necesarias para realizar el empalme'),
              ],
            ),
          ),
          SizedBox(height: 10),
          RichText(
            text: TextSpan(
              style: DefaultTextStyle.of(context).style,
              children: <TextSpan>[
                TextSpan(
                    text: '\u2022 ',
                    style: TextStyle(fontWeight: FontWeight.bold)),
                TextSpan(
                    text:
                        'Asegurese de que los cables esten en buen estado y no presenten cortes o deterioro'),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
