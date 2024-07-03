import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:geolocator/geolocator.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/components/critic_steps/qr_scan.dart';

import '../Models/instalaciones.dart';

class InstalacionScannerScreen extends StatefulWidget {
  const InstalacionScannerScreen({Key? key}) : super(key: key);

  @override
  _InstalacionScannerScreenState createState() =>
      _InstalacionScannerScreenState();
}

class _InstalacionScannerScreenState extends State<InstalacionScannerScreen> {
  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);

    Future<Position> _determinePosition() async {
      bool serviceEnabled;
      LocationPermission permission;

      serviceEnabled = await Geolocator.isLocationServiceEnabled();
      print("serviceEnabled");
      print(serviceEnabled);
      if (!serviceEnabled) {
        showDialog(
          context: context,
          builder: (context) => AlertDialog(
            title: const Text('Ubicacion GPS desactivada'),
            content: const Text('Por favor encienda su Ubicacion GPS.'),
            actions: [
              TextButton(
                onPressed: () => Navigator.of(context).pop(),
                child: const Text('Activado'),
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

    Future<void> getInstalacionFromScan(String scan) async {
      Position ubi = await _determinePosition();
      print("ubicacionPrint");
      print(ubi);
      if (ubi != null) {
        print("scan");
        print(scan);
        instalacionBloc.add(DetailsInitial(barcode: scan));
        if (instalacionBloc.state is InstalacionFetched) {
          InstalacionFetched inst = instalacionBloc.state as InstalacionFetched;
          instalacionBloc.add(EditInstalacion(instalacion: {
            "Id": inst.instalacion.id,
            "Pedido": inst.instalacion.pedido,
            "Empalmista": inst.instalacion.empalmista,
            "Producto_pedido": inst.instalacion.producto_pedido,
            "Fecha_de_alta":
                inst.instalacion.fechaDeAlta?.millisecondsSinceEpoch,
            "Estado": "En curso",
            "Cliente": inst.instalacion.cliente,
            "Codigo_de_barras": inst.instalacion.Codigo_de_barras,
            "tipoInstalacion": inst.instalacion.tipoInstalacion,
          }));

          Navigator.pushNamed(context,
              '/instalaciones/${(instalacionBloc.state as InstalacionFetched).instalacion.id}');
        } else {
          print("No Reconocido");
        }
      }
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text('Scaneo para Instalacion'),
      ),
      body: BarcodeScannerComponent(onBarcodeScanned: getInstalacionFromScan),
    );
  }
}
