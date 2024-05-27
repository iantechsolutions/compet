import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'dart:io';

class SemiconductoraCaptureComponent extends StatefulWidget {
  @override
  _SemiconductoraCaptureComponentState createState() =>
      _SemiconductoraCaptureComponentState();
}

class _SemiconductoraCaptureComponentState
    extends State<SemiconductoraCaptureComponent> {
  final ImagePicker _picker = ImagePicker();
  List<XFile?> images = [];

  Future<void> takePicture() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.camera);
    if (image != null) {
      setState(() {
        images.add(image);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 500,
      child: Column(
        children: [
          const Text(
              "·Tome 2 fotos (ambos lados del cable) de la zona de corte de la pantalla semiconductora"),
          const SizedBox(height: 8.0),
          Expanded(
            flex: 3,
            child: images.isEmpty
                ? const Center(child: Text('Ninguna imagen tomada todavia'))
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
          ElevatedButton(
            onPressed: takePicture,
            child: const Text('Tomar una foto'),
          ),
        ],
      ),
    );
  }
}
