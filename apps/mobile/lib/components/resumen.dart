import 'package:flutter/material.dart';
import 'package:mplikelanding/widgets/container.dart';
import 'package:mplikelanding/components/second_row.dart';
import 'package:mplikelanding/components/third_row.dart';

class Resumen extends StatelessWidget{
  const Resumen({super.key});

  @override
  Widget build(BuildContext context){

    final firstRow = Container(
        padding: const EdgeInsets.all(5.0),
        child:
        Row(mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text("Disponible", style: TextStyle(fontWeight: FontWeight.bold,fontSize: 18)),
              Container(child: const Row(
                children: [
                  Text("Ir a movimientos",style: TextStyle(color: Colors.blue,fontSize: 16),),
                  Icon(Icons.arrow_forward, color: Colors.blue,)
                ],
              ), )
            ])
    );

    const row4 = Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,

      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // SizedBox(width: 6.0,),
        Flexible(

          child:
          Text(
            "Ingresar dinero",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),

        Flexible(
          child:
          Text(
            "Transferir dinero",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        Flexible(
          child:
          Text(
            "Retirar dinero",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        Flexible(
          child:
          Text(
            "Informacion de cuenta",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        // SizedBox(width: 10.0,),
      ],
    );



    final container2 = ContainerWidget(
        children:[
          const SizedBox(height: 5),
          firstRow,
          const SecondRowWidget(),
          const SizedBox(height: 10),
          const ThirdRow(),
          const SizedBox(height: 2.0),
          row4,
          const SizedBox(height: 30),
        ]
    );
    return container2;
  }
}