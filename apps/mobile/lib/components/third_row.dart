import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:mplikelanding/widgets/shadow_icon.dart';



class ThirdRow extends StatelessWidget {
  const ThirdRow({super.key});

  void do_nothing(){

  }
  @override
  
  Widget build(BuildContext context) {

    return
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.plus_circle,color: Colors.black,size: 24,
              ),
              onTap: do_nothing,
            ),
            MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.arrow_2_circlepath_circle,color: Colors.black,size: 24,
              ),
              onTap: do_nothing,
            ),
            MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.minus_circle,color: Colors.black,size: 24,
              ),
              onTap: do_nothing,
            ),
            MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.info_circle,color: Colors.black,size: 24,
              ),
              onTap: do_nothing,
            ),
        ]);
  }
}