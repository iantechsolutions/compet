library turso_repository;

import 'package:mplikelanding/Models/pedidos.dart';
import 'package:mplikelanding/Models/recipes.dart';
import 'package:uuid/v4.dart';
import 'package:mplikelanding/data_sources/turso_rest_api_client.dart';

import '../Models/clientes.dart';
import '../Models/empalmistas.dart';
import '../Models/fotos.dart';
import '../Models/instalaciones.dart';
import '../Models/productos.dart';

/// Turso repository
/// Provides an interface that abstracts the data provider
class TursoRepository {
  TursoRepository({TursoRestAPIClient? tursoRestAPIClient})
      : _tursoRestAPIClient = tursoRestAPIClient ?? TursoRestAPIClient();

  final TursoRestAPIClient _tursoRestAPIClient;

  //List fetches

  /// Fetches a List<Recipe>
  Future<List<Recipe>> getRecipes() async {
    final recipes = await _tursoRestAPIClient.getRecipes();
    return recipes;
  }

  // For Cliente
  Future<List<Cliente>> getClientes() async {
    print("repositorio Clientes");
    final clientes = await _tursoRestAPIClient.getClienteList();
    return clientes;
  }

// For Empalmista
  Future<List<Empalmista>> getEmpalmistas() async {
    final empalmistas = await _tursoRestAPIClient.getEmpalmistaList();
    return empalmistas;
  }

// For Foto
  Future<List<Foto>> getFotos() async {
    final fotos = await _tursoRestAPIClient.getFotoList();
    return fotos;
  }

// For Instalacion
  Future<List<Instalacion>> getInstalaciones() async {
    final instalaciones = await _tursoRestAPIClient.getInstalacionList();
    return instalaciones;
  }

// For Producto
  Future<List<Producto>> getProductos() async {
    final productos = await _tursoRestAPIClient.getProductoList();
    return productos;
  }

  // For Pedidos
  Future<List<Pedido>> getPedidos() async {
    final pedidos = await _tursoRestAPIClient.getPedidosList();
    return pedidos;
  }

  /// Fetches a single of element
  Future<Recipe?> getRecipe({required String id}) async {
    final recipe = await _tursoRestAPIClient.getRecipe(recipeId: id);
    return recipe;
  }

// For Cliente
  Future<Cliente?> getCliente({required String id}) async {
    final cliente = await _tursoRestAPIClient.getCliente(clienteId: id);
    return cliente;
  }

// For Empalmista
  Future<Empalmista?> getEmpalmista({required String id}) async {
    final empalmista =
        await _tursoRestAPIClient.getEmpalmista(empalmistaId: id);
    return empalmista;
  }

// For Foto
  Future<Foto?> getFoto({required String id}) async {
    final foto = await _tursoRestAPIClient.getFoto(fotoId: id);
    return foto;
  }

// For Instalacion
  Future<Instalacion?> getInstalacion({required String id}) async {
    final instalacion =
        await _tursoRestAPIClient.getInstalacion(instalacionId: id);
    return instalacion;
  }

// For Producto
  Future<Producto?> getProducto({required String id}) async {
    final producto = await _tursoRestAPIClient.getProducto(productoId: id);
    return producto;
  }

// For Pedido
  Future<Pedido?> getPedido({required String id}) async {
    final pedido = await _tursoRestAPIClient.getPedido(pedidoId: id);
    return pedido;
  }

  /// Adds a new recipe from the provided [recipe] data
  Future<bool> addRecipe({required Map<String, dynamic> recipe}) async {
    String recipeId = (const UuidV4().generate());
    final addedRecipe =
        await _tursoRestAPIClient.addRecipe(recipeId, recipe: recipe);
    final addedNutrients = await _tursoRestAPIClient.addIngredients(
        ingredients: recipe["ingredients"], recipeId: recipeId.toString());

    return addedRecipe && addedNutrients;
  }

  /// Deletes the passed [recipe]
  Future<bool> deleteRecipe({required Recipe recipe}) async {
    final deletedIngredients =
        await _tursoRestAPIClient.deleteIngredients(recipeId: recipe.id);
    final deletedRecipes =
        await _tursoRestAPIClient.deleteRecipe(id: recipe.id);
    return deletedIngredients && deletedRecipes;
  }
}
