import 'dart:convert';
import 'dart:io';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        appBar: AppBar(
          title: const Text('Registro de Instalación'),
          foregroundColor: Colors.black,
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        body:
            // COLUMN
            AStepper(
          type: AStepperType.horizontal,
          physics: const ClampingScrollPhysics(),
          steps: getcosos(),
          currentStep: currentStep,
          onStepContinue: () async {
            print("se activa");
            final isLastStep = currentStep == getcosos().length - 1;
            String? accessToken = await storage.read(key: "credenciales");
            images.map((e) async {
              List<int> bytes = await e!.readAsBytes();
              String base64 = base64Encode(bytes);
              Foto foto = Foto(
                  link: base64,
                  instalacion: widget.instalacion.id ?? "",
                  id: "");
              print("instalacionId");
              print(widget.instalacion.id);
              print("base64");
              print(base64.substring(0, 100) + "...");
              final response = await http.post(
                  Uri.parse('$_baseUrl/instalaciones/upload'),
                  headers: <String, String>{
                    'Authorization': "Bearer $accessToken"
                  },
                  body: jsonEncode(foto.toJson()));
            }).toList();
            if (isLastStep) {
              print("Completed");
              Navigator.pop(context); // Go back to the previous screen
            } else {
              images.clear();
              setState(() => currentStep += 1);
            }
          },
          onStepCancel: (() =>
              {currentStep == 0 ? null : setState(() => currentStep -= 1)}),
        ));
  }

  List<AStep> getcosos() {
    List<AStep>? steps = widget
        .instalacion.tipoInstalacionData?.pasoCriticoTotipoInstalacion
        ?.map((pasocritico) {
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
                            child: Text('Ninguna imagen tomada todavia'))
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
            ));
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
            ));
      }
    }).toList();
    if (steps != null) {
      return steps;
    } else {
      return [];
    }
  }

  List<AStep> getSteps() => [
        AStep(
            isActive: currentStep >= 0,
            title: const Text("Paso 1"),
            content: SafetyInstructionsComponent()),
        AStep(
            isActive: currentStep >= 1,
            title: const Text("Paso 2"),
            content: DimensionesCaptureComponent()),
        AStep(
            isActive: currentStep >= 2,
            title: const Text("Paso 3"),
            content: SemiconductoraCaptureComponent()),
        AStep(
            isActive: currentStep >= 3,
            title: const Text("Paso 4"),
            content: MasillaCaptureComponent()),
        AStep(
            isActive: currentStep >= 4,
            title: const Text("Paso 5"),
            content: TuboCampoCaptureComponent()),
        AStep(
            isActive: currentStep >= 5,
            title: const Text("Paso 6"),
            content: MasillaCaptureComponent()),
      ];

  @override
  void dispose() {
    super.dispose();
  }
}
