import 'dart:io';
import 'package:mplikelanding/components/critic_steps/instalacion_masilla.dart';
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
import '../components/critic_steps/qr_scan.dart';
import '../components/critic_steps/safety_measures.dart';
import '../components/critic_steps/dimensiones_cable.dart';
import '../components/critic_steps/corte_semiconductora.dart';

class InstalacionesUploadScreen extends StatefulWidget {
  InstalacionesUploadScreen({Key? key, String idInstalacion = ""})
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
  List<XFile?> images = [];
  bool showPreview = false;

  @override
  void initState() {
    super.initState();
    initCamera();
    _controller.text = "Codigo de barras";
  }

  final ImagePicker picker = ImagePicker();

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

    final XFile? image = await picker.pickImage(source: ImageSource.camera);

    setState(() {
      images.add(image);
      showPreview = true;
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
          title: const Text("Paso 1"),
          content: BarcodeScannerComponent(),
        ),
        AStep(
            isActive: currentStep >= 1,
            title: const Text("Paso 2"),
            content: SafetyInstructionsComponent()),
        AStep(
            isActive: currentStep >= 2,
            title: const Text("Paso 3"),
            content: DimensionesCaptureComponent()),
        AStep(
            isActive: currentStep >= 3,
            title: const Text("Paso 4"),
            content: SemiconductoraCaptureComponent()),
        AStep(
            isActive: currentStep >= 4,
            title: const Text("Paso 5"),
            content: MasillaCaptureComponent()),
        AStep(
            isActive: currentStep >= 5,
            title: const Text("Paso 6"),
            content: TuboCampoCaptureComponent()),
        AStep(
            isActive: currentStep >= 6,
            title: const Text("Paso 7"),
            content: MasillaCaptureComponent()),
      ];

  @override
  void dispose() {
    controller?.dispose();
    super.dispose();
  }
}
