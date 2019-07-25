import axios from "axios";
import { key, proxy } from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;

    }

    async getRecipe() {

        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/get?key=${key}&rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.ingredients = res.data.recipe.ingredients;
            this.url = res.data.recipe.source_url;


        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }


    }

    calcTime() {
        //Assuming we need 10 mins for each 3 set of Ingredients Preparation
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 10;


    }

    calcServings() {
        this.servings = 4;

    }

    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients && this.ingredients.map(el => {
            //1) Uniform units

            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, units[i]);

            });

            // 2) Remove Parentheses
            ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");


            //3)Parse ingredients into count, unit and ingredient
            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let objIng;
            if (unitIndex > -1) {
                //There is a unit
                const arrCount = arrIng.slice(0, unitIndex); //Ex : 4 1/2 cups means arrCount = [4,1/2] --> eval("4+1/2")---> 4.5
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                objIng = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(unitIndex + 1).join(' ')
                };

            } else if (parseInt(arrIng[0], 10)) {
                //There is no unit , but the first element is a number e.g 1 bread
                objIng = {
                    count: (parseInt(arrIng[0], 10)),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')

                };
            } else if (unitIndex === -1) {
                //There is no unit and no number in 1st position
                objIng = {
                    count: 1,
                    unit: '',
                    ingredient // in ES6, we can simply say the outside variable ingredient as a property if they have same names

                };

            }

            return objIng;

        });

        this.ingredients = newIngredients;

    }


    //Update Servings and ingredients
    updateServings(type) {
        //Servings  
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;


        //Ingredients
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);

        });
        this.servings = newServings;
    }

}


