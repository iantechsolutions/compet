import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/bloc/pedido_bloc.dart';
import 'package:simple_barcode_scanner/simple_barcode_scanner.dart';
import '../Models/instalaciones.dart';
import '../Models/pedidos.dart';
import '../Models/producto_pedido.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RegisterPedidoScreen extends StatefulWidget {
  final Pedido? pedido;
  final List<ProductoPedido>? productos;

  // ignore: use_super_parameters
  const RegisterPedidoScreen({Key? key, this.pedido, this.productos})
      : super(key: key);
  @override
  _RegisterPedidoScreenState createState() => _RegisterPedidoScreenState();
}

class _RegisterPedidoScreenState extends State<RegisterPedidoScreen> {
  String result = "";

  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);
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
          Fluttertoast.showToast(
              msg:
                  "Este codigo de barras no pertenece a uno generado desde la pagina",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.BOTTOM,
              timeInSecForIosWeb: 1,
              backgroundColor: Colors.red,
              textColor: Colors.white,
              fontSize: 16.0);
          // if (res != -1 && res != result) {
          //   instalacionBloc.add(AddInstalacion(instalacion: {
          //     "Pedido": widget.pedido?.id,
          //     "Empalmista": "FqA4-9Og9feIcUiGJpNGd",
          //     "Producto_pedido": product?.id,
          //     "Fecha_de_alta": DateTime.now().toIso8601String(),
          //     "Estado": "pendiente",
          //     "Cliente": widget.pedido?.cliente,
          //     "Codigo_de_barras": res,
          //     "tipoInstalacion": product?.tipoInstalacion,
          //   }));
          //   Fluttertoast.showToast(
          //       msg: "Scan completado correctamente",
          //       toastLength: Toast.LENGTH_SHORT,
          //       gravity: ToastGravity.BOTTOM,
          //       timeInSecForIosWeb: 1,
          //       backgroundColor: Colors.green,
          //       textColor: Colors.white,
          //       fontSize: 16.0);
          // } else {
          //   Fluttertoast.showToast(
          //       msg: "Codigo de barra ya scaneado",
          //       toastLength: Toast.LENGTH_SHORT,
          //       gravity: ToastGravity.BOTTOM,
          //       timeInSecForIosWeb: 1,
          //       backgroundColor: Colors.red,
          //       textColor: Colors.white,
          //       fontSize: 16.0);
          // }
        }
        result = res;
      });
    }

    void showProductDetails(ProductoPedido? product) {
      if (product!.cantidad <= (product.cantidadScaneada - product!.cantidad)) {
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

    final pedidoBloc = BlocProvider.of<PedidoBloc>(context);
    var productos = widget.productos;

    return Scaffold(
      appBar: AppBar(
        title: const Text('Registro de pedido'),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: (productos == null || productos.isEmpty)
          ? Center(child: Text("No figuran productos para este pedido"))
          : ListView.builder(
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
