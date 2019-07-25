
import uniqid from "uniqid";
export default class list {
    constructor() {
        this.items = [];
    }

    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(),
            count,
            unit,
            ingredient
        };
        this.items.push(item);
        console.log(this.items);
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => (el.id === id));
        /*Splice and slice Difference
        *[4,5,6] splice(1,1) => mutates original array and returns 5 and now array is [4,6] here(1,1) means start index and no.of elemeents
        *[4,5,6] slice(1,1) => does not mutate original array and returns 5 and now array is [4,5,6] here (1,1) means start index and end index 
        */
        this.items.splice(index, 1);
    }

    updateCount(id, newCount) {
        this.items.find(el => el.id === id).count = newCount;
    }

}; 