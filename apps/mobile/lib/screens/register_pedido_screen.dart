import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/bloc/pedido_bloc.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import '../Models/producto_pedido.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RegisterPedidoScreen extends StatefulWidget {
  final String idPedido;
  final List<ProductoPedido>? productos;

  // ignore: use_super_parameters
  const RegisterPedidoScreen({Key? key, this.idPedido = "", this.productos})
      : super(key: key);
  @override
  _RegisterPedidoScreenState createState() => _RegisterPedidoScreenState();
}

class _RegisterPedidoScreenState extends State<RegisterPedidoScreen> {
  String result = "";
  void openScanner(ProductoPedido? product) async {
    var res = await Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => const SimpleBarcodeScannerPage(),
      ),
    );

    product?.cantidadScaneada = product.cantidadScaneada + 1;

    setState(() {
      if (res is String) {
        result = res;
        Fluttertoast.showToast(
            msg: "Scan completado correctamente",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.green,
            textColor: Colors.white,
            fontSize: 16.0);
      }
    });
  }

  void showProductDetails(ProductoPedido? product) {
    print("producto");
    print(product?.cantidadScaneada);
    if (product!.cantidad <= (product.cantidadScaneada)) {
      print(product);
      Fluttertoast.showToast(
          msg: "Ya se escanearon todas las unidades de este producto",
          toastLength: Toast.LENGTH_SHORT,
          gravity: ToastGravity.BOTTOM,
          timeInSecForIosWeb: 1,
          backgroundColor: Colors.red,
          textColor: Colors.white,
          fontSize: 16.0);
      return;
    }
    showDialog(
      context: context,
      builder: (BuildContext context) {
        return AlertDialog(
          title: Text(product?.nombre ?? ""),
          content: Text(
              'Cantidad restante: ${(product!.cantidad - (product?.cantidadScaneada ?? 0))}'),
          actions: <Widget>[
            TextButton(
              child: const Text('Abrir scanner'),
              onPressed: () => openScanner(product),
            ),
            TextButton(
              child: const Text('Cerrar'),
              onPressed: () {
                Navigator.of(context).pop();
              },
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
    final pedidoBloc = BlocProvider.of<PedidoBloc>(context);
    var productos = widget.productos;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro de pedido'),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: ListView.builder(
        itemCount: productos?.length,
        itemBuilder: (context, index) {
          return ListTile(
            title: Text(productos?[index].nombre ?? ""),
            subtitle: Text('Cantidad: ${productos?[index].cantidad}'),
            onTap: () => showProductDetails(productos?[index]),
          );
        },
      ),
    );
  }
}
