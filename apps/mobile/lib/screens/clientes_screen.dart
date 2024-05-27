import 'package:mplikelanding/Models/clientes.dart';
import 'package:mplikelanding/bloc/cliente_bloc.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class ClientesScreen extends StatefulWidget {
  const ClientesScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<ClientesScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final recipesBloc = BlocProvider.of<ClienteBloc>(context);

    recipesBloc.add(Initial());
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [
          Text(
            "Listado Clientes",
          )
        ]),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: BlocConsumer<ClienteBloc, ClienteState>(
        listener: (context, state) {},
        builder: (context, state) {
          if (state is ClienteInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is ClientesFetched) {
            if (state.clientes.isNotEmpty) {
              return ShadTable.list(
                  header: const [
                    ShadTableCell.header(
                        child: Text('Nombre',
                            style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.w700,
                            ))),
                    ShadTableCell.header(
                        child: Text('Direccion',
                            style: TextStyle(color: Colors.black)))
                  ],
                  columnSpanExtent: (index) {
                    if (index == 0) return const FixedTableSpanExtent(150);
                    if (index == 1) {
                      return const MaxTableSpanExtent(
                        FixedTableSpanExtent(150),
                        RemainingTableSpanExtent(),
                      );
                    }
                    // uses the default value
                    return null;
                  },
                  children: state.clientes.map((cliente) => [
                        ShadTableCell(
                            child: Text(
                          cliente.nombre,
                          style: const TextStyle(
                              fontWeight: FontWeight.w500, color: Colors.black),
                        )),
                        ShadTableCell(
                            child: Text(cliente.direccion,
                                style: const TextStyle(color: Colors.black)))
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
                    recipesBloc.add(RefreshClientes());
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
