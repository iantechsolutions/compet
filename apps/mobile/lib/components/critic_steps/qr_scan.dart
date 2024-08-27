import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:geolocator/geolocator.dart';
import 'package:shadcn_ui/shadcn_ui.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
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
  bool isLoading = false;
  bool hasNavigated = false;

  @override
  void initState() {
    super.initState();
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
    instalacionBloc.stream.listen((state) {
      if (state is InstalacionFetched && !hasNavigated) {
        hasNavigated = true;
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
          "lat": state.instalacion.lat,
          "long": state.instalacion.long,
        }));
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) =>
                InstalacionesUploadScreen(instalacion: state.instalacion),
          ),
        ).then((_) {
          setState(() {
            isLoading = false;
            hasNavigated = false;
          });
        });
      } else if (state is InstalacionNotFound) {
        Fluttertoast.showToast(
            msg: "No se reconocio el codigo de barras",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0);
        setState(() {
          isLoading = false;
        });
      }
    });
  }

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
    return await Geolocator.getCurrentPosition();
  }

  void changeTextFieldValue(String value) {
    _controller.text = value;
    widget.onBarcodeScanned(value);
  }

  Future<void> checkBarCode(String scan) async {
    setState(() {
      isLoading = true;
    });
    Position ubi = await _determinePosition();
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
    instalacionBloc.add(DetailsInitial(barcode: scan));
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      child: Column(
        children: <Widget>[
          const Text("Escanea el codigo de barras del equipo a instalar"),
          ShadButton.outline(
            backgroundColor: Colors.white,
            borderRadius: BorderRadius.circular(15.0),
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
            text: const Text(
              'Abrir scanner',
              style: TextStyle(color: Colors.black),
            ),
          ),
          const Text("O ingresalo a mano si no puedes escanearlo"),
          TextField(
            decoration: const InputDecoration(
              hintText: "Codigo de barras",
            ),
            enabled: !isLoading,
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
          ShadButton.outline(
            onPressed: () async {
              if (isLoading) return;
              setState(() {
                isLoading = true;
              });
              await checkBarCode(_controller.text);
            },
            borderRadius: BorderRadius.circular(15.0),
            backgroundColor: Colors.white,
            text: const Text(
              'Comprobar',
              style: TextStyle(color: Colors.black),
            ),
            enabled: !isLoading,
            icon: isLoading
                ? LoadingAnimationWidget.fourRotatingDots(
                    color: Colors.black,
                    size: 20,
                  )
                : null,
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
