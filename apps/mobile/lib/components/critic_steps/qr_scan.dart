import 'package:flutter/material.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart'; // Ensure you have this package or any barcode scanner package

class BarcodeScannerComponent extends StatefulWidget {
  @override
  _BarcodeScannerComponentState createState() =>
      _BarcodeScannerComponentState();
}

class _BarcodeScannerComponentState extends State<BarcodeScannerComponent> {
  String result = "";
  TextEditingController _controller = TextEditingController();

  void changeTextFieldValue(String value) {
    _controller.text = value;
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          const Text("Escanea el codigo de barras del equipo a instalar"),
          ShadButton(
            onPressed: () async {
              var res = await Navigator.push(
                context,
                MaterialPageRoute(
                  builder: (context) => const SimpleBarcodeScannerPage(),
                ),
              );
              setState(() {
                if (res is String) {
                  result = res;
                  changeTextFieldValue(res);
                }
              });
            },
            text: const Text('Abrir scanner'),
          ),
          const Text("O ingresalo a mano si no puedes escanearlo"),
          TextField(
            decoration: const InputDecoration(
              hintText: "Codigo de barras",
            ),
            controller: _controller,
            onChanged: (value) {
              setState(() {
                result = value;
              });
            },
            onTap: () {
              _controller.text = "";
            },
          ),
          ShadButton(
            onPressed: () {
              print("comprobacion");
            },
            text: const Text('Comprobar'),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }
}

// ShadButton widget should be defined somewhere in your project
class ShadButton extends StatelessWidget {
  final VoidCallback onPressed;
  final Widget text;

  const ShadButton({required this.onPressed, required this.text});

  @override
  Widget build(BuildContext context) {
    return ElevatedButton(
      onPressed: onPressed,
      child: text,
    );
  }
}
