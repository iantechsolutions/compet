import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:mplikelanding/Models/pedidos.dart';
import 'package:mplikelanding/Models/recipes.dart';
import 'package:uuid/v4.dart';

import '../Models/clientes.dart';
import '../Models/empalmistas.dart';
import '../Models/fotos.dart';
import '../Models/instalaciones.dart';
import '../Models/productos.dart';

/// Exception thrown when getRecipes fails.
class TursoHttpException implements Exception {
  final String message;

  TursoHttpException({required this.message});
}

///Exception thrown when the provided results are not found.
class ResultsNotFound implements Exception {}

class TursoRestAPIClient {
  static const String dbUrl = String.fromEnvironment(
      "https://compet-juli2kapo.turso.io",
      defaultValue: "https://compet-juli2kapo.turso.io");
  static const String authToken = String.fromEnvironment(
      "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTQ3MzkxMjYsImlkIjoiNTM3ODcwODUtNjlkMy00ZmU1LWFhOWEtYmQ0ZWNjODdmOWNmIn0.dKbvG_-K3heZB2GTrSfkcrtdCQB1LgChQGrLEb1EhlFk1F0Op_yV62oSKmmh89ZgGqrLdwIGRRvriP8NUsPBCA",
      defaultValue:
          "eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MTQ3MzkxMjYsImlkIjoiNTM3ODcwODUtNjlkMy00ZmU1LWFhOWEtYmQ0ZWNjODdmOWNmIn0.dKbvG_-K3heZB2GTrSfkcrtdCQB1LgChQGrLEb1EhlFk1F0Op_yV62oSKmmh89ZgGqrLdwIGRRvriP8NUsPBCA");

  /// Runs queries on the Turso database
  ///
  /// Takes a {sql} [SQL query] and a dynamic list of {arguments}
  ///
  /// Throws an Exception when the number of arguments doesn't
  /// match the number of placeholders within the query
  Future<http.Response> runQuery(
      {required dynamic sql,
      List<dynamic>? arguments,
      bool batch = false}) async {
    if (arguments != null) {
      RegExp placeholder = RegExp(r'[?]');
      Iterable<Match> matches = placeholder.allMatches(sql);

      if (matches.length == arguments.length) {
        return await http.post(Uri.parse(dbUrl),
            headers: {
              HttpHeaders.authorizationHeader: "Bearer $authToken",
              HttpHeaders.contentTypeHeader: "application/json"
            },
            body: json.encode({
              "statements": [
                {"q": sql, "params": arguments}
              ]
            }));
      }
      throw Exception("arguments do not match placeholder count");
    }

    return http.post(Uri.parse(dbUrl),
        headers: {
          HttpHeaders.authorizationHeader: "Bearer $authToken",
          HttpHeaders.contentTypeHeader: "application/json"
        },
        body: json.encode({
          "statements": batch ? sql : ["$sql"]
        }));
  }

  //RECIPES (EJEMPLOS)
  /// Fetches all recipes from the API
  Future<List<Recipe>> getRecipes() async {
    try {
      final recipesResponse = await runQuery(
          sql:
              "select id, name, nutrition_information, instructions from recipes");
      final recipesJson = jsonDecode(recipesResponse.body);

      if (!recipesJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = recipesJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          recipesJson[0]["results"]["rows"].map((dynamic recipe) => {
                "${columns[0]}": recipe[0],
                "${columns[1]}": recipe[1],
                "${columns[2]}": recipe[2],
                "${columns[3]}": recipe[3],
              }));

      if (results.isEmpty) return <Recipe>[];

      return List<Recipe>.from(
          results.map((result) => Recipe.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Recipe>[];
    }
  }

  /// Fetches recipe from the API
  Future<Recipe?> getRecipe({required String recipeId}) async {
    try {
      final recipeResponse = await runQuery(
          sql:
              "select recipes.id, recipes.name, recipes.nutrition_information, recipes.instructions, json_group_array(json_object('id', ingredients.id, 'name', ingredients.name, 'measurements', ingredients.measurements, 'recipe_id', ingredients.recipe_id)) as ingredients from recipes right join ingredients on ingredients.recipe_id = recipes.id where recipes.id = ?",
          arguments: [recipeId]);

      final recipeJson = jsonDecode(recipeResponse.body);

      if (!recipeJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = recipeJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          recipeJson[0]["results"]["rows"].map((dynamic recipe) {
        return {
          "${columns[0]}": recipe[0],
          "${columns[1]}": recipe[1],
          "${columns[2]}": recipe[2],
          "${columns[3]}": recipe[3],
        };
      }));

      return Recipe.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  /// Adds recipe to Turso database
  /// Requires uuid [id] and recipe
  Future<bool> addRecipe(String id,
      {required Map<String, dynamic> recipe}) async {
    try {
      final addResponse = await runQuery(
          sql:
              "insert into recipes(id, name, nutrition_information, instructions) values (?, ?, ?, ?)",
          arguments: [
            id,
            recipe["name"],
            recipe["nutrition_information"],
            recipe["instructions"],
          ]);
      if (addResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to add recipe");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Adds [ingredients] to the database
  Future<bool> addIngredients(
      {required List<Map<String, dynamic>> ingredients,
      required String recipeId}) async {
    List<Map<String, dynamic>> statements =
        List<Map<String, dynamic>>.from(ingredients.map((ingredient) => {
              "q":
                  "insert into ingredients(id, name, measurements, recipe_id) values (?, ?, ?, ?)",
              "params": [
                (const UuidV4().generate()),
                ingredient["name"],
                ingredient["measurements"],
                recipeId
              ]
            }));

    try {
      final addResponse = await runQuery(sql: statements, batch: true);
      if (addResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to add ingredients");
      }
      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Deletes the recipe with the given [id]
  Future<bool> deleteRecipe({required String id}) async {
    try {
      final deleteResponse = await runQuery(
          sql: "delete from recipes where id = ?", arguments: [id]);

      if (deleteResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to delete recipe");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  /// Deletes all ingredients with given [recipeId]
  Future<bool> deleteIngredients({required String recipeId}) async {
    try {
      final deleteResponse = await runQuery(
          sql: "delete from ingredients where recipe_id = ?",
          arguments: [recipeId]);

      if (deleteResponse.statusCode != 200) {
        throw TursoHttpException(message: "Failed to delete ingredients");
      }

      return true;
    } on Exception catch (e) {
      print(e.toString());
      return false;
    }
  }

  //CLIENTES

  Future<List<Cliente>> getClienteList() async {
    try {
      print("getClienteList");
      final response =
          await runQuery(sql: "SELECT * FROM web_Cliente", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic cliente) {
        return {
          "${columns[0]}": cliente[0],
          "${columns[1]}": cliente[1],
          "${columns[2]}": cliente[2],
        };
      }));

      return List<Cliente>.from(
          results.map((result) => Cliente.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Cliente>[];
    }
  }

  Future<Cliente?> getCliente({required String clienteId}) async {
    try {
      final clienteResponse = await runQuery(
          sql: "SELECT * FROM web_Cliente WHERE id = ?",
          arguments: [clienteId]);

      final clienteJson = jsonDecode(clienteResponse.body);

      if (!clienteJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = clienteJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          clienteJson[0]["results"]["rows"].map((dynamic cliente) {
        return {
          "${columns[0]}": cliente[0],
          "${columns[1]}": cliente[1],
          "${columns[2]}": cliente[2],
        };
      }));

      return Cliente.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  //EMPALMISTA

  Future<List<Empalmista>> getEmpalmistaList() async {
    try {
      final response =
          await runQuery(sql: "SELECT * FROM web_Empalmista", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic empalmista) {
        return {
          "${columns[0]}": empalmista[0],
          "${columns[1]}": empalmista[1],
        };
      }));

      return List<Empalmista>.from(
          results.map((result) => Empalmista.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Empalmista>[];
    }
  }

  Future<Empalmista?> getEmpalmista({required String empalmistaId}) async {
    try {
      final empalmistaResponse = await runQuery(
          sql: "SELECT * FROM web_Empalmista WHERE id = ?",
          arguments: [empalmistaId]);

      final empalmistaJson = jsonDecode(empalmistaResponse.body);

      if (!empalmistaJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = empalmistaJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          empalmistaJson[0]["results"]["rows"].map((dynamic empalmista) {
        return {
          "${columns[0]}": empalmista[0],
          "${columns[1]}": empalmista[1],
        };
      }));

      return Empalmista.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  //FOTO
  Future<List<Foto>> getFotoList() async {
    try {
      final response =
          await runQuery(sql: "SELECT * FROM web_Fotos", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic foto) {
        return {
          "${columns[0]}": foto[0],
          "${columns[1]}": foto[1],
          "${columns[2]}": foto[2],
        };
      }));

      return List<Foto>.from(results.map((result) => Foto.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Foto>[];
    }
  }

  Future<Foto?> getFoto({required String fotoId}) async {
    try {
      final fotoResponse = await runQuery(
          sql: "SELECT * FROM web_Fotos WHERE id = ?", arguments: [fotoId]);

      final fotoJson = jsonDecode(fotoResponse.body);

      if (!fotoJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = fotoJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          fotoJson[0]["results"]["rows"].map((dynamic foto) {
        return {
          "${columns[0]}": foto[0],
          "${columns[1]}": foto[1],
          "${columns[2]}": foto[2],
        };
      }));

      return Foto.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

//INSTALACION
  Future<List<Instalacion>> getInstalacionList() async {
    try {
      final response =
          await runQuery(sql: "SELECT * FROM web_Instalacion", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];
      print("aca");
      print(json[0]["results"]["rows"][0][4]);
      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic instalacion) {
        return {
          "${columns[0]}": instalacion[0],
          "${columns[1]}": instalacion[1],
          "${columns[2]}": instalacion[2],
          "${columns[3]}":
              DateTime.parse((instalacion)[3]).millisecondsSinceEpoch,
          "${columns[4]}": ((instalacion[4] != null)
              ? DateTime.parse(instalacion[4]).millisecondsSinceEpoch
              : null),
          "${columns[5]}": ((instalacion[5] != null)
              ? DateTime.parse(instalacion[5]).millisecondsSinceEpoch
              : null),
          "${columns[6]}": instalacion[6],
          "${columns[7]}": instalacion[7],
        };
      }));

      return List<Instalacion>.from(
          results.map((result) => Instalacion.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Instalacion>[];
    }
  }

  Future<Instalacion?> getInstalacion({required String instalacionId}) async {
    try {
      final instalacionResponse = await runQuery(
          sql: "SELECT * FROM web_Instalacion WHERE id = ?",
          arguments: [instalacionId]);

      final instalacionJson = jsonDecode(instalacionResponse.body);

      if (!instalacionJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = instalacionJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          instalacionJson[0]["results"]["rows"].map((dynamic instalacion) {
        return {
          "${columns[0]}": instalacion[0],
          "${columns[1]}": instalacion[1],
          "${columns[2]}": instalacion[2],
          "${columns[3]}": instalacion[3],
          "${columns[4]}": instalacion[4],
          "${columns[5]}": instalacion[5],
          "${columns[6]}": instalacion[6],
          "${columns[7]}": instalacion[7],
        };
      }));

      return Instalacion.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  //PRODUCTO
  Future<List<Producto>> getProductoList() async {
    try {
      final response =
          await runQuery(sql: "SELECT * FROM web_Producto", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic producto) {
        return {
          "${columns[0]}": producto[0],
          "${columns[1]}": producto[1],
          "${columns[2]}": producto[2],
          "${columns[3]}": producto[3],
        };
      }));

      return List<Producto>.from(
          results.map((result) => Producto.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Producto>[];
    }
  }

  Future<Producto?> getProducto({required String productoId}) async {
    try {
      final productoResponse = await runQuery(
          sql: "SELECT * FROM web_Producto WHERE id = ?",
          arguments: [productoId]);

      final productoJson = jsonDecode(productoResponse.body);

      if (!productoJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = productoJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          productoJson[0]["results"]["rows"].map((dynamic producto) {
        return {
          "${columns[0]}": producto[0],
          "${columns[1]}": producto[1],
          "${columns[2]}": producto[2],
          "${columns[3]}": producto[3],
        };
      }));

      return Producto.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }

  //FOR PEDIDOS

  Future<List<Pedido>> getPedidosList() async {
    try {
      final response =
          await runQuery(sql: "SELECT * FROM web_Pedidos", arguments: []);

      final json = jsonDecode(response.body);

      if (!json[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = json[0]["results"]["columns"];
      final results = List<Map<String, dynamic>>.from(
          json[0]["results"]["rows"].map((dynamic pedido) {
        return {
          "${columns[0]}": pedido[0],
          "${columns[1]}": DateTime.parse((pedido)[1]).millisecondsSinceEpoch,
          "${columns[2]}": ((pedido[2] != null)
              ? DateTime.parse(pedido[2]).millisecondsSinceEpoch
              : null),
          "${columns[3]}": ((pedido[3] != null)
              ? DateTime.parse(pedido[3]).millisecondsSinceEpoch
              : null),
          "${columns[4]}": pedido[4],
          "${columns[5]}": pedido[5],
        };
      }));

      return List<Pedido>.from(
          results.map((result) => Pedido.fromJson(result)));
    } on Exception catch (e) {
      print(e.toString());
      return <Pedido>[];
    }
  }

  Future<Pedido?> getPedido({required String pedidoId}) async {
    try {
      final pedidoResponse = await runQuery(
          sql: "SELECT * FROM web_Pedido WHERE id = ?", arguments: [pedidoId]);

      final pedidoJson = jsonDecode(pedidoResponse.body);

      if (!pedidoJson[0].containsKey("results")) throw ResultsNotFound();

      List<dynamic> columns = pedidoJson[0]["results"]["columns"];

      final results = List<Map<String, dynamic>>.from(
          pedidoJson[0]["results"]["rows"].map((dynamic pedido) {
        return {
          "${columns[0]}": pedido[0],
          "${columns[1]}": DateTime.parse((pedido)[1]).millisecondsSinceEpoch,
          "${columns[2]}": ((pedido[2] != null)
              ? DateTime.parse(pedido[2]).millisecondsSinceEpoch
              : null),
          "${columns[3]}": ((pedido[3] != null)
              ? DateTime.parse(pedido[3]).millisecondsSinceEpoch
              : null),
          "${columns[4]}": pedido[4],
          "${columns[5]}": pedido[5],
        };
      }));

      return Pedido.fromJson(results[0]);
    } on Exception catch (e) {
      print(e.toString());
      return null;
    }
  }
}
