import * as cheerio from 'cheerio';
import { Heuristics } from './heuristics.js';
class LinkGetter {
    constructor(url) {
        this.url = url;
    }
    async get() {
        return new Promise(async (resolve, reject) => {

            const req = await fetch(this.url),
                html = await req.text(),
                $ = cheerio.load(html),
                skin = $('#outer-skin');
            const heuristic = new Heuristics($, this.url);


            const result = await heuristic.test();

            const linkArray = [];
            switch (result) {
                case "art":
                    const artImageDiv = skin.find('.art-images'),
                        links = artImageDiv.find('a');
                    for (let i = 0; i < links.length; i++) {
                        if (!links[i].attribs.href) continue;

                        linkArray.push(links[i].attribs.href);
                    }
                    break;
                case "movie":
                    const id = this.url.split("/")[5],
                        movieReq = await fetch(`https://www.newgrounds.com/portal/video/${id}`, {
                            headers: {
                                "X-Requested-With": "XMLHttpRequest"
                            }
                        }),
                        movieJson = await movieReq.json();
                    // A really gross one-liner, but it will do for now.
                    linkArray.push(movieJson.sources[Object.keys(movieJson.sources)[0]][0].src);
                    break;
                case "audio":
                    linkArray.push($('meta[property="og:audio"]').attr('content'));
                    break;
                case "game":
                    console.log(`[linkgrabber]: Games are not implemented`);
                break;
                };
            if (linkArray.length < 1) reject("nolinks");
            console.log(`[linkgrabber]: Got ${linkArray.length} ${(linkArray.length < 2) ? "link" : "links"}`)
            resolve(linkArray);
        })
    }
}
export { LinkGetter };