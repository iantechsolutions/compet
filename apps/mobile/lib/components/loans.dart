import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:mplikelanding/widgets/container.dart';

class Loans extends StatelessWidget{
  const Loans({super.key});

@override
  Widget build(BuildContext context){
  const row1 =
        Row(
          children: [
            Text("\$ Préstamos",style: TextStyle(fontSize: 20))
          ],
    );
  const row2=
      Row(
        children: [
          Text("Pedí hasta "),
          Text("\$ 23.343 ", style: TextStyle(fontWeight: FontWeight.bold),),
          Text("con un Prestamo Personal")
        ],
      );
  return const ContainerWidget(children:
  [
    SizedBox(height: 14.0),
    row1,
    SizedBox(height: 10.0),
    row2,
    SizedBox(height: 14.0),
  ]
  );
  }
}



