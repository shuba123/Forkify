import { elements } from './base';

//get Input from Search field
export const getInput = () => elements.searchInput.value;

//Clear results from previous search
export const clearResults = () => {

    elements.searchResList.innerHTML = ' ';
    elements.searchResPages.innerHTML = ' ';
};

//Highlight selected search item 
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*= "${id}"]`).classList.add('results__link--active');


};

//Clear search field
export const clearInput = () => {
    elements.searchInput.value = '';

};

/*To limit the recipe title to appear
*Pasta With Tomato and Spinach
    *acc:0/ acc+cur.length 5 <= limit /newTitle =['Pasta']
    *acc:5 /acc+cur.length 9 = <=limit / newTitle = ['Pasta', 'With']
    *acc:9 /acc+cur.length 15 <=limit / newTitle = ['Pasta', 'With','Tomato']
    *acc:15 /acc+ cur.length 18 >=limit / newTitle = ['Pasta', 'With', 'Tomato']
    *acc:18 /acc+ cur.length 24 >=limit / newTitle = ['Pasta', 'With','Tomato']
*/


export const limitRecipeTitle = (title, limit = 17) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);
            }
            return acc + cur.length;

        }, 0);
        // return the result
        return `${newTitle.join(' ')}...`;
    }
    return title;
}

const renderRecipe = recipe => {
    const markup = `<li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li>
`;
    elements.searchResList.insertAdjacentHTML('beforeend', markup);
};

const createButton = (page, type) => `
    <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg> 
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;

const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);
    let button;
    if (page === 1 && pages > 1) {
        // Only Button to go to next page
        button = createButton(page, 'next');
    }
    else if (page === pages && pages > 1) {
        // Only Button to go to previous page
        button = createButton(page, 'prev');

    } else if (page < pages) {
        //Both buttons
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
            `;

    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //console.log(recipes);
    //render results of current page
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe); //since slice will cut only till last but one element of the array

    //render pagination buttons
    renderButtons(page, recipes.length, resPerPage);
};

