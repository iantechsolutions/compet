import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mplikelanding/Models/empalmistas.dart';
import 'package:mplikelanding/Models/pedidos.dart';
import 'package:mplikelanding/bloc/cliente_bloc.dart';
import 'package:mplikelanding/bloc/empalmista_bloc.dart';
import 'package:mplikelanding/bloc/instalacion_bloc.dart';
import 'package:mplikelanding/bloc/pedido_bloc.dart';
import 'package:mplikelanding/bloc/recipe_bloc.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:mplikelanding/screens/empalmista_screen.dart';
import 'package:mplikelanding/screens/instalaciones_upload.dart';
import 'package:mplikelanding/screens/listado_empalmista_screen.dart';
import 'package:mplikelanding/screens/instalaciones_screen.dart';
import 'package:mplikelanding/screens/login_screen.dart';
import 'package:mplikelanding/screens/new_recipe_screen.dart';
import 'package:mplikelanding/screens/recipe_details.dart';
import 'package:mplikelanding/screens/recipe_screen.dart';
import 'package:mplikelanding/screens/clientes_screen.dart';
import 'package:shadcn_ui/shadcn_ui.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return RepositoryProvider(
      create: (context) {
        return TursoRepository();
      },
      child: MultiBlocProvider(
        providers: [
          BlocProvider<RecipeBloc>(create: (context) {
            final tursoRepository =
                RepositoryProvider.of<TursoRepository>(context);
            return RecipeBloc(tursoRepository);
          }),
          BlocProvider<ClienteBloc>(create: (context) {
            return ClienteBloc();
          }),
          BlocProvider<EmpalmistaBloc>(create: (context) {
            final tursoRepository =
                RepositoryProvider.of<TursoRepository>(context);
            return EmpalmistaBloc(tursoRepository);
          }),
          BlocProvider<InstalacionBloc>(create: (context) {
            final tursoRepository =
                RepositoryProvider.of<TursoRepository>(context);
            return InstalacionBloc(tursoRepository);
          }),
          BlocProvider<PedidoBloc>(create: (context) {
            final tursoRepository =
                RepositoryProvider.of<TursoRepository>(context);
            return PedidoBloc(tursoRepository);
          }),
        ],
        child: ShadApp.material(
          theme: ShadThemeData(
              brightness: Brightness.dark,
              colorScheme: const ShadSlateColorScheme.light()),
          darkTheme: ShadThemeData(
              brightness: Brightness.dark,
              colorScheme: const ShadSlateColorScheme.light()),
          // theme: ThemeData(useMaterial3: true, colorScheme: ColorScheme.dark()),
          // Start the app with the LoginScreen
          initialRoute: '/',
          routes: {
            '/': (context) => const LoginScreen(),
            '/adminScreen': (context) =>
                const HomeScreen(), // This should be your admin home screen
            '/clientes': (context) =>
                const ClientesScreen(), // This should be your admin home screen
            '/empalmistasLista': (context) =>
                const EmpalmistasScreen(), // This should be your admin home screen
            '/instalaciones': (context) =>
                const InstalacionsScreen(), // This should be your admin home screen
            '/empalmistaUser': (context) => const EmpalmistaUserScreen(),
            '/uploadScreen': (context) => InstalacionesUploadScreen(),
            '/new-recipe': (context) =>
                const NewRecipeScreen(), //New recipe screen

            '/instalaciones/:idInstalacion': (context) =>
                InstalacionesUploadScreen(),
            RecipeDetailsScreen.routeName: (context) => //Recipe details screen
                const RecipeDetailsScreen(),
          },
        ),
      ),
    );
  }
}
