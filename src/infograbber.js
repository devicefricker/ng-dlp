import * as cheerio from 'cheerio';
class InfoGrabber {
    constructor($, verbose) {
        /** @type {import('cheerio').CheerioAPI} */
        this.$ = $;
        /** @type {boolean} */
        this.verbose = verbose;
    }
    async get() {
        return new Promise((resolve, reject) => {
            this.$('script, style').remove();
            const sidestats = this.$('div #sidestats dt');
            var obj = {
                    "views": null,
                    "favs": null,
                    "votes": null,
                    "score": null,
                    "date": null,
                    "genre": null
            };
            sidestats.each((i, el) => {
                const key = this.$(el).text().trim();
                const value = this.$(el).nextUntil('dt').clone().text().replace(/\s+/g, ' ').trim();

                if(this.verbose) console.log("Key: " + key)
                switch(key) {
                    case "Views":
                        obj.views = value.replaceAll(',', '');
                    break;
                    case "Faves":
                        obj.favs = value.replaceAll(',', '');
                    break;
                    case "Votes":
                        obj.votes = value.replaceAll(',', '');
                    break;
                    case "Score":
                        obj.score = value.substr(0, 4);
                    break;
                    case "Uploaded":
                        // Vibe-coded solution but I genuinely couldn't give less of a shit about learning Regex
                        obj.date = value.replace(/(\d{4})(?=\d)/, '$1 ');
                    break;
                    case "Genre":
                        obj.genre = value;
                    break;
                    case "Category":
                        obj.genre = value;
                    break;
                    case "Listens":
                        obj.views = value.replaceAll(',', '');
                    break;
                }
                if(this.verbose) console.log("Value: " + value)
            })
            if(this.verbose) console.log(obj)
            resolve(obj);
        });
    }
}
export { InfoGrabber };