import 'package:flutter/material.dart';

class ContainerWidget extends StatefulWidget {
  final List<Widget> children;

  const ContainerWidget({super.key, required this.children});

  @override
  _ContainerWidgetState createState() => _ContainerWidgetState();
}

class _ContainerWidgetState extends State<ContainerWidget> {
  @override
  Widget build(BuildContext context) {
    return Container(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(4.0),
            boxShadow: [
              BoxShadow(
                color: Colors.black.withOpacity(0.2),
                spreadRadius: 5,
                blurRadius: 7,
                offset: const Offset(0, 3),
              ),
            ],
          ),
          margin: const EdgeInsets.only(
            top: 10.0,
            bottom: 5.0,
            left: 20.0,
            right: 20.0,
          ),
          padding: const EdgeInsets.only(
            top: 8.0,
            bottom: 2.0,
            left: 8.0,
            right: 8.0,
          ),
          child: Column(
            children: widget.children,
            // children: [
            //   SizedBox(height: 5),
            // ],
          ),
        );
  }
}
