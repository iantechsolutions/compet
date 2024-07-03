import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';

import '../../bloc/instalacion_bloc.dart';
import '../../screens/instalaciones_upload.dart'; // Ensure you have this package or any barcode scanner package

class BarcodeScannerComponent extends StatefulWidget {
  final Function(String) onBarcodeScanned;
  BarcodeScannerComponent({required this.onBarcodeScanned});

  @override
  _BarcodeScannerComponentState createState() =>
      _BarcodeScannerComponentState();
}

class _BarcodeScannerComponentState extends State<BarcodeScannerComponent> {
  String result = "";
  TextEditingController _controller = TextEditingController();
  Future<Position> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      showDialog(
        context: context,
        builder: (context) => AlertDialog(
          title: const Text('Ubicacion GPS desactivada'),
          content: const Text('Por favor encienda su Ubicacion GPS.'),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: const Text('Entendido'),
            ),
          ],
        ),
      );
      return Future.error('Por favor encienda su Ubicacion GPS.');
    }
    // When we reach here, permissions are granted and we can
    // continue accessing the position of the device.
    return await Geolocator.getCurrentPosition();
  }

  void changeTextFieldValue(String value) {
    _controller.text = value;
    widget.onBarcodeScanned(value);
  }

  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
    Future<void> checkBarCode(String scan) async {
      Position ubi = await _determinePosition();
      print("ubicacionPrint");
      print(ubi);
      instalacionBloc.stream.listen((state) {
        if (state is InstalacionFetched) {
          instalacionBloc.add(EditInstalacion(instalacion: {
            "Id": state.instalacion.id,
            "Pedido": state.instalacion.pedido,
            "Empalmista": state.instalacion.empalmista,
            "Producto_pedido": state.instalacion.producto_pedido,
            "Fecha_de_alta":
                state.instalacion.fechaDeAlta?.millisecondsSinceEpoch,
            "Estado": "En progreso",
            "Cliente": state.instalacion.cliente,
            "Codigo_de_barras": state.instalacion.Codigo_de_barras,
            "tipoInstalacion": state.instalacion.tipoInstalacion,
            "lat": ubi.latitude,
            "long": ubi.longitude,
          }));
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  InstalacionesUploadScreen(instalacion: state.instalacion),
            ),
          );
        } else {
          print("No Reconocido");
        }
      });
      instalacionBloc.add(DetailsInitial(barcode: scan));
    }

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
              checkBarCode(_controller.text);
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
