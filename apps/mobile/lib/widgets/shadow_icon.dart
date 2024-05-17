import 'package:flutter/material.dart';

class MyCircularIconButton extends StatelessWidget {
  final Icon icon;
  final Function? onTap;
  final Color backgroundColor;
  final bool hasBackground;
  const MyCircularIconButton({super.key, 
    required this.icon,
    this.onTap,
    this.backgroundColor = Colors.grey,
    this.hasBackground = true,
  });

  @override
  Widget build(BuildContext context) {
    return Material(
      borderRadius: BorderRadius.circular(30.0),
      color: hasBackground ? backgroundColor.withOpacity(0.3) : null ,
      child: InkWell(
        borderRadius: BorderRadius.circular(30.0),
        onTap: onTap != null ? () => onTap!() : null,
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(30.0),
            border: Border.all(color: backgroundColor),
          ),
          padding: const EdgeInsets.all(10.0),
          child: icon,
        ),
      ),
    );
  }
}
