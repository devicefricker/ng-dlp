class InfoJson {
    constructor(score, author, categoryname, category) {
        this.score = score;
        this.author = author;
        this.categoryname = categoryname;
        this.category = category;
    }
    async getJSONString() {
        return new Promise((resolve, reject) => {
            var json = JSON.stringify({
                "score": this.score,
                "author": this.author,
                "categoryname": this.categoryname,
                "category": this.category
            });
            resolve(json);
        });
    }
}
export { InfoJson };