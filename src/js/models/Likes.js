export default class Likes {
    constructor() {
        this.likes = [];
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        this.likes.push(like);


        //Persist the data into the localStorage
        this.persistData();
        return like;
    }

    deleteLike(id) {

        const index = this.likes.findIndex(el => (el.id === id));
        this.likes.splice(index, 1);

        //Persist the data into the localStorage
        this.persistData();
    }
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
    }

    getNumLikes() {
        return this.likes.length;
    }

    persistData() {
        //To convert to string
        localStorage.setItem('likes', JSON.stringify(this.likes));

    }

    readStorage() {
        //To convert back to Javascript array
        const storage = JSON.parse(localStorage.getItem('likes'));

        //Restore from the localStorage
        if (storage) {
            this.likes = storage;

        }
    }




}
