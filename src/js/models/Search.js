// Search data model
import axios from "axios";
import { key, proxy } from '../config';
export default class Search {
    constructor(query) {
        this.quer = query;

    }

    async getResults() {

        try {
            const res = await axios(`${proxy}https://www.food2fork.com/api/search?key=${key}&q=${this.quer}`);
            this.result = res.data.recipes;

        } catch (error) {
            alert(error);
        }
    }
}
