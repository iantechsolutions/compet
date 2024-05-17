import 'package:mplikelanding/Models/recipes.dart';
import 'package:mplikelanding/repositories/turso_repository.dart';
import 'package:bloc/bloc.dart';
import 'package:equatable/equatable.dart';

part 'recipe_event.dart';
part 'recipe_state.dart';

class RecipeBloc extends Bloc<RecipeEvent, RecipeState> {
  final TursoRepository _tursoRepository;
  RecipeBloc(TursoRepository tursoRepository)
      : _tursoRepository = tursoRepository,
        super(RecipeInitial()) {
    on<RecipeEvent>((event, emit) async {
      emit(Loading());
      if (event is Initial || event is RefreshRecipes) {
        print('Fetching recipes...');
        List<Recipe> recipes = await _tursoRepository.getRecipes();
        print('Fetched ${recipes.length} recipes');
        emit(RecipesFetched(recipes: recipes));
      }
      if (event is DetailsInitial) {
        print('Fetching recipe details...');
        Recipe? recipe = await _tursoRepository.getRecipe(id: event.recipeId);
        print('Fetched recipe: ${recipe?.name}');
        emit(recipe != null ? RecipeFetched(recipe: recipe) : RecipeNotFound());
      }
      if (event is AddRecipe) {
        print('Adding recipe...');
        bool added = await tursoRepository.addRecipe(recipe: event.recipe);
        print('Recipe added: $added');
        emit(added ? RecipeAdditionSuccess() : RecipeAdditionFailure());
      }
      if (event is DeleteRecipe) {
        print('Deleting recipe...');
        bool deleted = await tursoRepository.deleteRecipe(recipe: event.recipe);
        print('Recipe deleted: $deleted');
        emit(deleted ? RecipeDeletionSuccess() : RecipeDeletionFailure());
      }
    });
  }
}