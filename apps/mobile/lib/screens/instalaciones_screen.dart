import 'package:mplikelanding/Models/instalaciones.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/screens/instalaciones_upload.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class InstalacionsScreen extends StatefulWidget {
  const InstalacionsScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<InstalacionsScreen> {
  @override
  void initState() {
    super.initState();
  }

  String formatDate(DateTime? dateTime) {
    if (dateTime == null) return "";
    return ("${dateTime.day}/${dateTime.month}/${dateTime.year} ${dateTime.hour}:${dateTime.minute}");
  }

  @override
  Widget build(BuildContext context) {
    final recipesBloc = BlocProvider.of<InstalacionBloc>(context);
    recipesBloc.add(Initial());
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [Text("Listado Instalaciones")]),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: BlocConsumer<InstalacionBloc, InstalacionState>(
        listener: (context, state) {},
        builder: (context, state) {
          if (state is InstalacionInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is InstalacionsFetched) {
            if (state.instalaciones.isNotEmpty) {
              return ShadTable.list(
                  header: const [
                    ShadTableCell.header(
                        child:
                            Text('Id', style: TextStyle(color: Colors.black))),
                    ShadTableCell.header(
                        child: Text('Fecha de alta',
                            style: TextStyle(color: Colors.black))),
                  ],
                  columnSpanExtent: (index) {
                    if (index == 0) return const FixedTableSpanExtent(150);
                    if (index == 1) {
                      return const MaxTableSpanExtent(
                        FixedTableSpanExtent(80),
                        RemainingTableSpanExtent(),
                      );
                    }
                    // uses the default value
                    return null;
                  },
                  children: state.instalaciones.map((instalacion) => [
                        ShadTableCell(
                            child: Text("1",
                                style: const TextStyle(
                                  color: Colors.black,
                                  fontWeight: FontWeight.w700,
                                ))),
                        ShadTableCell(
                            child: Text(formatDate(instalacion.fechaDeAlta),
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
                          Text("Add Instalacion")
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
                    recipesBloc.add(RefreshInstalacions());
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
