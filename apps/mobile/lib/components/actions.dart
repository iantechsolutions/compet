import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:mplikelanding/widgets/container.dart';
import 'package:mplikelanding/widgets/shadow_icon.dart';

class ActionButtons extends StatelessWidget {
  const ActionButtons({super.key});

  @override
  Widget build(BuildContext context){
    const row1 = Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,
      children: [
        MyCircularIconButton(
          icon: Icon(
            CupertinoIcons.piano,
            color: Colors.black,
            size: 24,
          ),
          hasBackground: false,
        ),
        MyCircularIconButton(
          icon: Icon(
            CupertinoIcons.ant,
            color: Colors.black,
            size: 24,
          ),
          hasBackground: false,
        ),
        MyCircularIconButton(
          icon: Icon(
            CupertinoIcons.at,
            color: Colors.black,
            size: 24,
          ),
          hasBackground: false,
        ),MyCircularIconButton(
          icon: Icon(
            CupertinoIcons.bag_badge_plus,
            color: Colors.black,
            size: 24,
          ),
          hasBackground: false,
        ),
    ]);


    const row2 = Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,

      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // SizedBox(width: 0.0,),
        Flexible(

         child:
            Text(
              "Play the piano",
              textAlign: TextAlign.center,
              overflow: TextOverflow.visible,
            ),
        ),

        Flexible(
          child:
          Text(
            "Open ant farm",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
          ),
        Flexible(
          child:
          Text(
            "Send email",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        Flexible(
          child:
          Text(
            "Go shopping",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        // SizedBox(width: 10.0,),
      ],
    );






    const row3 = Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          MyCircularIconButton(
            icon: Icon(
              CupertinoIcons.power,
              color: Colors.black,
              size: 24,
            ),
            hasBackground: false,
          ),
          MyCircularIconButton(
            icon: Icon(
              CupertinoIcons.printer,
              color: Colors.black,
              size: 24,
            ),
            hasBackground: false,
          ),
          MyCircularIconButton(
            icon: Icon(
              CupertinoIcons.rocket,
              color: Colors.black,
              size: 24,
            ),
            hasBackground: false,
          ),MyCircularIconButton(
            icon: Icon(
              CupertinoIcons.plus,
              color: Colors.black,
              size: 24,
            ),
            hasBackground: false,
          ),
        ]);


    const row4 = Row(
      mainAxisAlignment: MainAxisAlignment.spaceEvenly,

      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // SizedBox(width: 6.0,),
        Flexible(

          child:
          Text(
            "Turn off computer",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),

        Flexible(
          child:
          Text(
            "Print file",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        Flexible(
          child:
          Text(
            "Check progress",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        Flexible(
          child:
          Text(
            "More options",
            textAlign: TextAlign.center,
            overflow: TextOverflow.visible,
          ),
        ),
        // SizedBox(width: 10.0,),
      ],
    );


  final container = const ContainerWidget(
    children: [
      Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          SizedBox(height: 18.0),
          row1,
          SizedBox(height:8.0),
          row2,
          SizedBox(height: 22.0),
          row3,
          SizedBox(height:8.0),
          row4,
          SizedBox(height:18.0),
        ],
      )

    ],
  );

    return
      container;
  }
}
