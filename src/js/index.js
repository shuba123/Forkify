import Search from './models/Search';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base';
import Recipe from './models/Recipe';



/* Global State of the App
* - Search Object
* - Current recipe object
* - Shopping List object
* - Liked Recipes
*/
const state = {};

/**
 * SEARCH CONTROLLER
 */
const controlSearch = async () => {
    //1) Get Query from view

    const query = searchView.getInput();

    if (query) {
        //2) New search object and Add to state
        state.search = new Search(query);

        //3) Prepare UI for Results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);

        try {
            //4) Search for Recipes
            await state.search.getResults();

            //5) Render Resuts on UI 
            clearLoader();
            searchView.renderResults(state.search.result);

        } catch (error) {
            console.log(error);
            alert('Something went wrong with the search :(');
            clearLoader();
        }
    }
}
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();


});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);//To The base 10 to get a decimal number between 0-9
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }

});



/**
 * RECIPE CONTROLLER
 */

const controlRecipe = async () => {
    //Get ID from URL 
    const id = window.location.hash.replace('#', ''); //window.location is the entire URL so now it is a string
    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Highlight selected search item
        if (state.search) {
            searchView.highlightSelected(id);
        }
        //Create a new Recipe object
        state.recipe = new Recipe(id);


        try {

            //Get Recipe Data and Parse Ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();
            //Calculate Servings and Time
            state.recipe.calcServings();
            state.recipe.calcTime();
            //Render Recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe,
                state.likes.isLiked(id));

        } catch (error) {
            console.log(error);
            alert('Something went wrong with processing the recipe :(');
        }
    }

};
/*
* Instead of two lines of code below a single line to show same event listeners for different actions
* window.addEventListener('hashchange', controlRecipe);
* window.addEventListener('load',controlRecipe); // This happens whenever a page is reloaded
 */

['hashchange', 'load'].forEach(e => window.addEventListener(e, controlRecipe));



/**
* LIST CONTROLLER
*/

const controlList = () => {
    //Create a new list if there is none yet

    if (!state.list) {
        state.list = new List();
    }

    //Add each ingredients to the list

    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });


};




//Handle delete and update list item events

elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    //handle the delete button 
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        //Delete from state
        state.list.deleteItem(id);

        //Delete from UI
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);

    }
});


/**
* LIKE CONTROLLER
*/


const controlLike = () => {
    if (!state.likes) {
        state.likes = new Likes();
    }
    const currentID = state.recipe.id;
    //USER has not yet liked the current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add Like to the state    
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button

        likesView.togglelikeBtn(true);

        //Add like to the UI list
        likesView.renderLike(newLike);


    } // USER has liked the current recipe
    else {
        // Remove Like from the state    
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.togglelikeBtn(false);


        //Remove like to the UI list
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());

};

//Restore Liked recipes on page Loading

window.addEventListener('load', () => {

    state.likes = new Likes();

    // Restore Likes
    state.likes.readStorage();

    //Toggle Like Menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));


});


//Handling Recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //Decrease button is clicked
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add * ')) {
        //Add Ingredients to shopping List
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        //Like Controller
        controlLike();
    }
});



