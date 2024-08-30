import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/bloc/pedido_bloc.dart';
import 'package:mplikelanding/components/critic_steps/qr_scan.dart';
import 'package:shadcn_ui/shadcn_ui.dart';
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
  updateCantScaneada(ProductoPedido product) {
    print("updatea");
    setState(() {
      product.cantidadScaneada = product.cantidadScaneada + 1;
    });
    return product;
  }

  @override
  Widget build(BuildContext context) {
    final instalacionBloc = BlocProvider.of<InstalacionBloc>(context);

    openScanner(ProductoPedido? product) async {
      var productUpdateado = product;
      var res = await Navigator.push(
        context,
        MaterialPageRoute(
          builder: (context) => const SimpleBarcodeScannerPage(),
        ),
      );

      if (res is String && res != "-1" ) {
        TextEditingController loteController = TextEditingController();
        String result = "";

        if (true) {
          showDialog(
            context: context,
            builder: (BuildContext context) {
              return AlertDialog(
                title: const Text('Ingresar Nro de Lote'),
                content: TextField(
                  controller: loteController,
                  onChanged: (value) {
                    result = value;
                  },
                ),
                actions: <Widget>[
                  TextButton(
                    child: const Text('Cancelar'),
                    onPressed: () {
                      Navigator.of(context).pop();
                    },
                  ),
                  TextButton(
                    child: const Text('Guardar'),
                    onPressed: () {
                      try{
                      instalacionBloc.add(AddInstalacion(instalacion: {
                        "Pedido": widget.pedido?.id,
                        "Empalmista": "RVYm3m9OoStGnokd6Tt5P",
                        "Producto_pedido": product?.id,
                        "Fecha_de_alta": DateTime.now().millisecondsSinceEpoch,
                        "Estado": "Pendiente",
                        "Cliente": widget.pedido?.cliente,
                        "Codigo_de_barras": res,
                        "tipoInstalacion": product?.tipoInstalacion,
                        "NroLoteArticulo": result,
                      }));
                      }
                      catch(e){
                        print(e);
                      }
                      productUpdateado = updateCantScaneada(product!);

                      Fluttertoast.showToast(
                          msg: "Scan completado correctamente",
                          toastLength: Toast.LENGTH_SHORT,
                          gravity: ToastGravity.BOTTOM,
                          timeInSecForIosWeb: 1,
                          backgroundColor: Colors.green,
                          textColor: Colors.white,
                          fontSize: 16.0);
                      Navigator.of(context).pop();
                    },
                  ),
                ],
              );
            },
          );
        } else {
          Fluttertoast.showToast(
              msg:
                  "Este codigo de barras no pertenece a uno generado desde la pagina",
              toastLength: Toast.LENGTH_SHORT,
              gravity: ToastGravity.BOTTOM,
              timeInSecForIosWeb: 1,
              backgroundColor: Colors.red,
              textColor: Colors.white,
              fontSize: 16.0);
        }
      } else {
        Fluttertoast.showToast(
            msg: "Codigo de barra ya scaneado",
            toastLength: Toast.LENGTH_SHORT,
            gravity: ToastGravity.BOTTOM,
            timeInSecForIosWeb: 1,
            backgroundColor: Colors.red,
            textColor: Colors.white,
            fontSize: 16.0);
      }

      setState(() {
        result = res;
      });
      return productUpdateado;
    }

    void showProductDetails(ProductoPedido? product) {
      var productUpdateado = product;
      if (productUpdateado!.cantidad <= productUpdateado.cantidadScaneada) {
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
      String texto =
          ("Cantidad restante: ${productUpdateado!.cantidad - (productUpdateado!.cantidadScaneada)}");
      print("ACAAAAAA");
      print(texto);

      showDialog(
        context: context,
        builder: (BuildContext context) {
          return StatefulBuilder(
            builder: (context, setState) {
              return AlertDialog(
                title: Text(productUpdateado!.nombre),
                content: Text(texto),
                actions: <Widget>[
                  TextButton(
                    child: const Text('Abrir scanner'),
                    onPressed: () async {
                      productUpdateado = await openScanner(product);
                      setState(() {
                        texto =
                            "Cantidad restante: ${productUpdateado!.cantidad - productUpdateado!.cantidadScaneada - 1}";
                        print("cambio");
                        print(texto);
                      });
                    },
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
      floatingActionButton: ShadButton.outline(
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.circular(15.0),
        onPressed: () {
          pedidoBloc.add(EditPedido(pedido: {
            "Id": widget.pedido?.id,
            "Estado": "Enviado",
            "Cliente": widget.pedido?.cliente,
            "Fecha_de_aprobacion":
                widget.pedido?.fechaDeAprobacion?.millisecondsSinceEpoch,
            "Fecha_de_creacion":
                widget.pedido?.fechaDeCreacion?.millisecondsSinceEpoch,
            "Fecha_de_envio": DateTime.now().millisecondsSinceEpoch,
          }));
          Fluttertoast.showToast(
                  msg: "Pedido enviado correctamente",
                  toastLength: Toast.LENGTH_SHORT,
                  gravity: ToastGravity.BOTTOM,
                  timeInSecForIosWeb: 1,
                  backgroundColor: Colors.green,
                  textColor: Colors.white,
                  fontSize: 16.0)
              .then((_) {
            // Wait for the toast message to be closed
            Future.delayed(Duration(seconds: 1), () {
              // Navigate back to the list of pedidos
              Navigator.of(context).pop();
            });
          });
        },
        text: const Text(
          'Enviar Pedido',
          style: TextStyle(color: Colors.black),
        ),
      ),
    );
  }
}
