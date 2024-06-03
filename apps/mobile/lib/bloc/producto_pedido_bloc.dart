import 'package:mplikelanding/Models/recipes.dart';

import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

import '../Models/producto_pedido.dart';

part 'producto_pedido_event.dart';
part 'producto_pedido_state.dart';

class RecipeBloc extends Bloc<ProductoPedidoEvent, ProductoPedidoState> {
  final TursoRepository _tursoRepository;
  RecipeBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(ProductoPedidoInitial()) {
    on<ProductoPedidoEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshProductoPedidos) {
        print('Fetching recipes...');
        List<ProductoPedido> recipes =
            await _tursoRepository.getProductosPedidos();
        print('Fetched ${recipes.length} recipes');
        emit(ProductoPedidosFetched(pedidoes: recipes));
      }
      if (event is DetailsInitial) {
        print('Fetching recipe details...');
        // Recipe? recipe = await _tursoRepository.getRecipe(id: event.pedidoId);
        ProductoPedido? recipe = ProductoPedido(
            id: "test",
            pedido: "test",
            producto: "test",
            cantidad: 2,
            cantidadScaneada: 0);
        print('Fetched recipe: ${recipe?.id}');
        emit(recipe != null
            ? ProductoPedidoFetched(pedido: recipe)
            : ProductoPedidoNotFound());
      }
      if (event is AddProductoPedido) {
        print('Adding recipe...');
        bool added = await tursoRepository.addRecipe(recipe: event.pedido);
        print('Recipe added: $added');
        emit(added
            ? ProductoPedidoAdditionSuccess()
            : ProductoPedidoAdditionFailure());
      }
      if (event is DeleteProductoPedido) {
        print('Deleting recipe...');
        // bool deleted = await tursoRepository.deleteRecipe(recipe: event.pedido);
        bool deleted = false;
        print('Recipe deleted: $deleted');
        emit(deleted
            ? ProductoPedidoDeletionSuccess()
            : ProductoPedidoDeletionFailure());
      }
    });
  }
}
