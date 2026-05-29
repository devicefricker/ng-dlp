import path from 'path';
class Heuristics {
    constructor($, url) {
        this.$ = $;
        this.url = url;
    }
    async test() {
        return new Promise((resolve, reject) => {
            const skin = this.$('#outer-skin'),
                artTest = skin.find('.art-images'),
                genreTest = skin.find('[id^="genre-view"]'),
                isArt = (artTest.length > 0) ? true : false,
                hasGenre = (genreTest.length > 0) ? true : false,
                profileTest = (new URL(this.url).hostname.split(".")[0] != "www") ? true : false;
            if(profileTest) {
                console.log(`[heuristics]: Detected profile link`);
                resolve("profile");
            } 
            if(isArt) {
                console.log(`[heuristics]: Detected art link`);
                resolve("art");
            } else if(hasGenre) {
                console.log(`[heuristics]: Detected genre link`);
                const audioTest = (path.dirname(this.url).includes("audio")) ? true : false;
                const portalTest = (path.dirname(this.url).includes("portal")) ? true : false;
                if(audioTest) {
                    console.log(`[heuristics]: Narrowed down to audio`);
                    resolve("audio");
                } else if(portalTest) {
                    console.log(`[heuristics]: Narrowed down to portal`);
                    const gameTest = skin.find('meta[itemprop="applicationCategory"]');
                    const isGame = (gameTest.length > 0) ? true : false;
                    if(isGame) {
                        console.log(`[heuristics]: Sub-narrowed down to game`);
                        resolve("game");
                    } else {
                        console.log(`[heuristics]: Sub-narrowed down to movie`);
                        resolve("movie");
                    }
                }
            }
            reject("unknown");
        });
    }
}
export { Heuristics };
