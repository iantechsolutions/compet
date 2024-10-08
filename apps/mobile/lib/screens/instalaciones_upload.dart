import 'dart:convert';
import 'dart:io';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:geolocator/geolocator.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/components/critic_steps/instalacion_masilla.dart';
import 'package:http/http.dart' as http;
import 'package:mplikelanding/components/critic_steps/tubo_campo.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter/widgets.dart';
import 'package:path/path.dart' show join;
import 'package:path_provider/path_provider.dart';
// ignore: depend_on_referenced_packages
import 'package:anadea_stepper/anadea_stepper.dart';
import 'package:shadcn_ui/shadcn_ui.dart';
import 'package:image_picker/image_picker.dart';
import '../Models/fotos.dart';
import '../Models/instalaciones.dart';
import '../components/critic_steps/qr_scan.dart';
import '../components/critic_steps/safety_measures.dart';
import '../components/critic_steps/dimensiones_cable.dart';
import '../components/critic_steps/corte_semiconductora.dart';
import '../constants.dart';

class InstalacionesUploadScreen extends StatefulWidget {
  final Instalacion instalacion;

  InstalacionesUploadScreen({Key? key, required this.instalacion})
      : super(key: key);

  @override
  _InstalacionesScreenState createState() => _InstalacionesScreenState();
}

class _InstalacionesScreenState extends State<InstalacionesUploadScreen> {
  final ImagePicker _picker = ImagePicker();
  List<XFile?> images = [];
  final String _baseUrl = Constants.BASE_URL; // replace with your API URL
  final storage = const FlutterSecureStorage();
  bool showPreview = false;
    
  bool isUploading = false;
  Future<void> takePicture() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      setState(() {
        images.add(image);
      });
    }
  }

  @override
  void initState() {
    super.initState();
  }

  final ImagePicker picker = ImagePicker();

  String result = "";
  int currentStep = 0;

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

  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro de Instalación'),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: AStepper(
        type: AStepperType.horizontal,
        physics: const ClampingScrollPhysics(),
        controlsBuilder: (BuildContext context, AControlsDetails details) {
          return Row(
            children: <Widget>[
              ShadButton.outline(
                onPressed: details.onStepContinue,
                text: const Text('Continuar',style: TextStyle(color: Colors.black),),
                enabled: !isUploading,
                icon: isUploading
                ? LoadingAnimationWidget.fourRotatingDots(
                    color: Colors.black,
                    size: 20,
                  )
                : null,
              ),
              ShadButton.outline(
                onPressed: () => Navigator.of(context).pop(),
                text: const Text('Cancelar',style: TextStyle(color: Colors.black),),
                enabled: !isUploading,
              ),
            ],
          );
        },
        steps: getcosos(),
        currentStep: currentStep,
        onStepContinue: () async {
          setState(() {
            isUploading = true;
          });
          print(isUploading);
          isUploading = true;
          Position ubi = await _determinePosition();
          print("se activa");
          print(currentStep);
          print(widget.instalacion.tipoInstalacionData
              ?.pasoCriticoTotipoInstalacion);
          final isLastStep = currentStep == getcosos().length - 1;
          // final isLastStep = false;
          String? accessToken = await storage.read(key: "credenciales");
          List<Future> futures = images.map((e) async {
            List<int> bytes = await e!.readAsBytes();
            String base64 = base64Encode(bytes);
            print("paso ahora");
            print(currentStep);
            print(widget.instalacion.tipoInstalacionData
                  ?.pasoCriticoTotipoInstalacion?[currentStep]);
            Foto foto = Foto(
              link: base64,
              instalacion: widget.instalacion.id ?? "",
              id: "",
              lat: ubi.latitude,
              long: ubi.longitude,
              pasoId: widget.instalacion.tipoInstalacionData
                  ?.pasoCriticoTotipoInstalacion?[currentStep].pasoCriticoId,
            );
            Foto fotoTemp = Foto(
              link: "base64",
              instalacion: widget.instalacion.id ?? "",
              id: "",
              lat: ubi.latitude,
              long: ubi.longitude,
              pasoId: widget.instalacion.tipoInstalacionData
                  ?.pasoCriticoTotipoInstalacion?[currentStep].pasoCriticoId,
            );
            print("instalacionId");
            print(widget.instalacion.id);
            print("fototemp");
            print(fotoTemp.toJson());
            // print(base64.substring(0, 100) + "...");

            final response = await http.post(
              Uri.parse('$_baseUrl/instalaciones/upload'),
              headers: <String, String>{'Authorization': "Bearer $accessToken"},
              body: jsonEncode(foto.toJson()),
            );
          }).toList();
          await Future.wait(futures);
          if (isLastStep) {
            instalacionBloc.add(EditInstalacion(instalacion: {
              "Id": widget.instalacion.id,
              "Pedido": widget.instalacion.pedido,
              "Empalmista": widget.instalacion.empalmista,
              "Producto_pedido": widget.instalacion.producto_pedido,
              "Fecha_de_alta":
                  widget.instalacion.fechaDeAlta?.millisecondsSinceEpoch,
              "Fecha_de_instalacion": DateTime.now().millisecondsSinceEpoch,
              "Estado": "Completada",
              "Cliente": widget.instalacion.cliente,
              "Codigo_de_barras": widget.instalacion.Codigo_de_barras,
              "tipoInstalacion": widget.instalacion.tipoInstalacion,
              "lat": ubi.latitude,
              "long": ubi.longitude,
            }));
            print("Completed");
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => InstalacionCompletadaScreen(),
              ),
            );
          } else {
            images.clear();
            setState(() => currentStep += 1);
            setState(() {
              isUploading = false;
            });
          }
        },
        onStepCancel: (() =>
            {currentStep == 0 ? null : setState(() => currentStep -= 1)}),
      ),
    );
  }

  List<AStep> getcosos() {
    print("aca");
    print(widget.instalacion);
    print(widget.instalacion.tipoInstalacionData);
    widget.instalacion.tipoInstalacionData?.pasoCriticoTotipoInstalacion
        ?.sort((a, b) => (a.number?.compareTo(b.number ?? 0)) ?? 0);
    List<AStep>? steps = widget
        .instalacion.tipoInstalacionData?.pasoCriticoTotipoInstalacion
        ?.map((pasocritico) {
      print(pasocritico);
      int? index = widget
          .instalacion.tipoInstalacionData?.pasoCriticoTotipoInstalacion
          ?.indexOf(pasocritico);
      if (pasocritico.pasoCriticoData != null &&
          pasocritico.pasoCriticoData?.usesCamera == true) {
        return AStep(
          title: Text(pasocritico.pasoCriticoData?.description ??
              "Paso ${(index ?? 0) + 1}"),
          content: Container(
            height: 500,
            child: Column(
              children: [
                Text(pasocritico.pasoCriticoData?.detalle ?? ""),
                ElevatedButton(
                  onPressed: takePicture,
                  child: const Text('Tomar una foto'),
                ),
                const SizedBox(height: 8.0),
                Expanded(
                  flex: 3,
                  child: images.isEmpty
                      ? const Center(
                          child: Text('Ninguna imagen tomada todavía'))
                      : GridView.builder(
                          gridDelegate:
                              const SliverGridDelegateWithFixedCrossAxisCount(
                            crossAxisCount: 2,
                            mainAxisSpacing: 8.0,
                            crossAxisSpacing: 8.0,
                          ),
                          itemCount: images.length,
                          itemBuilder: (context, index) {
                            return Image.file(
                              File(images[index]!.path),
                              width: 100.0,
                              height: 100.0,
                              fit: BoxFit.fill,
                            );
                          },
                        ),
                ),
              ],
            ),
          ),
        );
      } else {
        return AStep(
          title: Text(pasocritico.pasoCriticoData?.description ??
              "Paso ${(index ?? 0) + 1}"),
          content: Container(
            height: 500,
            child: Column(
              children: [
                Text(pasocritico.pasoCriticoData?.detalle ?? ""),
              ],
            ),
          ),
        );
      }
    }).toList();
    if (steps != null) {
      return steps;
    } else {
      return [];
    }
  }

  @override
  void dispose() {
    super.dispose();
  }
}

class InstalacionCompletadaScreen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Instalación Completada'),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Instalación Completada',
              style: TextStyle(fontSize: 24),
            ),
            const SizedBox(height: 20),
            ElevatedButton(
              onPressed: () {
                Navigator.popUntil(context, (route) => route.isFirst);
              },
              child: const Text('Volver al menú'),
            ),
            ElevatedButton(
              onPressed: () {
                Navigator.popUntil(context, (route) => route.isFirst);
                Navigator.pushNamed(context, "/uploadScreen");
              },
              child: const Text('Registrar otra'),
            ),
          ],
        ),
      ),
    );
  }
}
