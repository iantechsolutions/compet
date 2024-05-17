import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:mplikelanding/widgets/shadow_icon.dart';


class SecondRowWidget extends StatefulWidget {
  const SecondRowWidget({super.key});

  @override
  _SecondRowWidgetState createState() => _SecondRowWidgetState();
}

class _SecondRowWidgetState extends State<SecondRowWidget> {
  bool viewDetails = true;

  void setVisibility() {
    setState(() {
      viewDetails = !viewDetails;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(5.0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.start,
        children: [
          Text(
            viewDetails ? "\$22424" : "\$****",
            style: const TextStyle(fontSize: 30.0),
          ),
          IconButton(
            onPressed: setVisibility,
            icon: viewDetails
                ?  MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.eye,color: Colors.black,size: 20,
              ),
              onTap: setVisibility,
            )
                : MyCircularIconButton(
              icon: const Icon(
                CupertinoIcons.eye_slash,color: Colors.black,size: 20,
              ),
              onTap: setVisibility,
            ),
          )
        ],
      ),
    );
  }
}