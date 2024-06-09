import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
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
    void getInstalacionFromScan(String scan) {
      print("scan");
      print(scan);
      instalacionBloc.add(DetailsInitial(barcode: scan));
      if (instalacionBloc.state is InstalacionFetched) {
        Navigator.pushNamed(context,
            '/instalaciones/${(instalacionBloc.state as InstalacionFetched).instalacion.id}');
      } else {
        print("No Reconocido");
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
