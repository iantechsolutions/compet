import 'package:mplikelanding/Models/empalmistas.dart';
import 'package:mplikelanding/bloc/empalmista_bloc.dart';

import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

class EmpalmistasScreen extends StatefulWidget {
  const EmpalmistasScreen({super.key});

  @override
  HomeScreenState createState() => HomeScreenState();
}

class HomeScreenState extends State<EmpalmistasScreen> {
  @override
  void initState() {
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    final recipesBloc = BlocProvider.of<EmpalmistaBloc>(context);
    recipesBloc.add(Initial());
    return Scaffold(
      appBar: AppBar(
        title: const Row(children: [Text("Listado Empalmistas")]),
        foregroundColor: Colors.black,
        backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      ),
      backgroundColor: Theme.of(context).colorScheme.inversePrimary,
      body: BlocConsumer<EmpalmistaBloc, EmpalmistaState>(
        listener: (context, state) {},
        builder: (context, state) {
          if (state is EmpalmistaInitial || state is Loading) {
            return const Center(
              child: CircularProgressIndicator(),
            );
          }
          if (state is EmpalmistasFetched) {
            if (state.empalmistas.isNotEmpty) {
              return ShadTable.list(
                  header: const [
                    ShadTableCell.header(
                        child: Text('Id',
                            style: TextStyle(
                              color: Colors.black,
                              fontWeight: FontWeight.w700,
                            ))),
                    ShadTableCell.header(
                        child: Text('Nombre',
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
                  children: state.empalmistas.map((empalmista) => [
                        ShadTableCell(
                            child: Text(
                          empalmista.id.toString(),
                          style: const TextStyle(
                              fontWeight: FontWeight.w500, color: Colors.black),
                        )),
                        ShadTableCell(
                            child: Text(empalmista.nombre,
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
                          Text("Add Empalmista")
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
                    recipesBloc.add(RefreshEmpalmistas());
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
