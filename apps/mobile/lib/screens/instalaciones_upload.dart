import 'dart:io';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import 'package:flutter/material.dart';
import 'package:camera/camera.dart';
import 'package:flutter/widgets.dart';
import 'package:path/path.dart' show join;
import 'package:path_provider/path_provider.dart';
// ignore: depend_on_referenced_packages
import 'package:anadea_stepper/anadea_stepper.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class InstalacionesUploadScreen extends StatefulWidget {
  final String idInstalacion;

  InstalacionesUploadScreen({Key? key, required this.idInstalacion})
      : super(key: key);

  @override
  _InstalacionesScreenState createState() => _InstalacionesScreenState();
}

final TextEditingController _controller = TextEditingController();
void changeTextFieldValue(String newValue) {
  // Update the value of the TextField
  _controller.text = newValue;
}

class _InstalacionesScreenState extends State<InstalacionesUploadScreen> {
  CameraController? controller;
  List<XFile> images = [];
  bool showPreview = false;

  @override
  void initState() {
    super.initState();
    initCamera();
    _controller.text = "Codigo de barras";
  }

  Future<void> initCamera() async {
    final cameras = await availableCameras();
    final firstCamera = cameras.first;

    controller = CameraController(
      firstCamera,
      ResolutionPreset.medium,
    );

    controller!.initialize().then((_) {
      if (!mounted) {
        return;
      }
      setState(() {});
    });
  }

  Future<void> takePicture() async {
    if (controller == null || !controller!.value.isInitialized) {
      return;
    }

    final XFile file = await controller!.takePicture();

    setState(() {
      images.add(file);
      showPreview = true;
    });
  }

  Future<void> toggleCameraPreview() async {
    if (controller == null || !controller!.value.isInitialized) {
      return;
    }

    setState(() {
      showPreview = !showPreview;
    });
  }

  String result = "";
  int currentStep = 0;

  @override
  Widget build(BuildContext context) {
    if (controller == null || !controller!.value.isInitialized) {
      return Container();
    }
    return Scaffold(
        appBar: AppBar(
          title: const Text('Subir imagenes'),
          foregroundColor: Colors.black,
          backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        ),
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
        body:
            // COLUMN
            AStepper(
          type: AStepperType.horizontal,
          physics: const ClampingScrollPhysics(),
          steps: getSteps(),
          currentStep: currentStep,
          onStepContinue: () {
            final isLastStep = currentStep == getSteps().length - 1;
            if (isLastStep) {
              print("Completed");
            } else {
              images.clear();
              setState(() => currentStep += 1);
            }
          },
          onStepCancel: (() =>
              {currentStep == 0 ? null : setState(() => currentStep -= 1)}),
        ));
  }

  List<AStep> getSteps() => [
        AStep(
          isActive: currentStep >= 0,
          title: const Text("Scaneo del codigo de barras"),
          content: Container(
            child: Column(
              children: <Widget>[
                const Text("Escanea el codigo de barras del equipo a instalar"),
                ShadButton(
                  onPressed: () async {
                    var res = await Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (context) =>
                              const SimpleBarcodeScannerPage(),
                        ));
                    print(res);
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
                // Row(children: <Widget>[
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
                // ])
              ],
            ),
          ),
        ),
        AStep(
            isActive: currentStep >= 1,
            title: const Text("Medidas de seguridad"),
            content: Container(
              child: const Column(
                children: <Widget>[
                  Text(
                      "Asegurese de que los cables esten desconectados de la fuente de energia"),
                  Text(
                      "Asegurese de tener las herramientas necesarias para realizar el empalme"),
                  Text(
                      "Asegurese de que los cables esten en buen estado y no presenten cortes o deterioro"),
                ],
              ),
            )),
        AStep(
            isActive: currentStep >= 2,
            title: const Text("Registro de cables"),
            content: Container(
              height: 100,
              child: ListView(
                children: <Widget>[
                  Container(
                    child: showPreview
                        ? Container(
                            width: 100.0,
                            height: 150.0,
                            child: CameraPreview(controller!),
                          )
                        : GridView.builder(
                            gridDelegate:
                                const SliverGridDelegateWithFixedCrossAxisCount(
                              crossAxisCount:
                                  3, // change this number to modify the number of items in a row
                              mainAxisSpacing: 10.0,
                              crossAxisSpacing: 10.0,
                            ),
                            itemCount: images.length,
                            itemBuilder: (context, index) {
                              return Image.file(File(images[index].path),
                                  width: 100.0,
                                  height: 100.0,
                                  fit: BoxFit.fill);
                            },
                          ),
                  ),
                  Text("Tome una imagen de los cables a unir, ya pelados"),
                  ShadButton(
                    text: Icon(showPreview ? Icons.camera : Icons.camera_alt),
                    onPressed: () {
                      if (showPreview) {
                        toggleCameraPreview();
                      } else {
                        takePicture();
                      }
                    },
                  ),
                ],
              ),
            )),
        AStep(
            isActive: currentStep >= 3,
            title: const Text("Registro de union"),
            content:
                Container(child: Text("Saque foto de la union de piezas"))),
        AStep(
            isActive: currentStep >= 4,
            title: const Text("Resultado Final"),
            content: Container(child: Text("Saque foto del resultado final"))),
      ];

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
