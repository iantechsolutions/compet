import 'package:mplikelanding/bloc/pedido_bloc.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/screens/register_pedido_screen.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class PedidosScreen extends StatefulWidget {
  const PedidosScreen({super.key});
  @override
  PedidosScreenState createState() => PedidosScreenState();
}

class PedidosScreenState extends State<PedidosScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final pedidosBloc = BlocProvider.of<PedidoBloc>(context);
    pedidosBloc.add(Initial());

    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [Text("Listado Pedidos")]),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: BlocConsumer<PedidoBloc, PedidoState>(
        listener: (context, state) {},
        builder: (context, state) {
          if (state is PedidoInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is PedidosFetched) {
            if (state.pedidoes.isNotEmpty) {
              return ShadTable.list(
                  header: const [
                    ShadTableCell.header(
                        child: Text('Cliente',
                            style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.w700,
                            ))),
                    ShadTableCell.header(
                        child: Text('Estado',
                            style: TextStyle(color: Colors.black))),
                    ShadTableCell.header(
                        child: Text('', style: TextStyle(color: Colors.black)))
                  ],
                  columnSpanExtent: (index) {
                    if (index == 0) return const FixedTableSpanExtent(170);
                    if (index == 1) return const FixedTableSpanExtent(120);
                    if (index == 2) {
                      return const MaxTableSpanExtent(
                        FixedTableSpanExtent(50),
                        RemainingTableSpanExtent(),
                      );
                    }
                    // uses the default value
                    return null;
                  },
                  children: state.pedidoes
                      .where((element) => element?.estado != "Enviado")
                      .map((cliente) => [
                            ShadTableCell(
                                child: Text(
                                    cliente?.clienteObj?.nombre ??
                                        "Cliente no encontrado",
                                    style: const TextStyle(
                                      color: Colors.black,
                                      fontWeight: FontWeight.w700,
                                    ))),
                            ShadTableCell(
                                child: Text(cliente?.estado ?? "",
                                    style:
                                        const TextStyle(color: Colors.black))),
                            ShadTableCell(
                              child: IconButton(
                                icon: const Icon(Icons
                                    .barcode_reader), // replace with your barcode icon
                                color: Colors.black,
                                onPressed: () {
                                  Navigator.push(
                                    context,
                                    MaterialPageRoute(
                                      builder: (context) =>
                                          RegisterPedidoScreen(
                                        pedido: cliente,
                                        productos: cliente?.productos,
                                      ),
                                    ),
                                  );
                                },
                              ),
                            )
                          ]));
            } else {
              return Center(
                child: SizedBox(
                  width: 200,
                  child: ElevatedButton(
                      onPressed: () {
                        Navigator.of(context).pushNamed("/new-recipe");
                      },
                      child: const Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(Icons.restaurant),
                          SizedBox(
                            width: 8,
                          ),
                          Text("Add Cliente")
                        ],
                      )),
                ),
              );
            }
          }
          return Center(
            child: SizedBox(
              width: 200,
              child: ElevatedButton(
                  onPressed: () {
                    pedidosBloc.add(RefreshPedidos());
                  },
                  child: const Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Icon(Icons.refresh),
                      SizedBox(
                        width: 8,
                      ),
                      Text("Refresh!")
                    ],
                  )),
            ),
          );
        },
      ),
    );
  }
}
