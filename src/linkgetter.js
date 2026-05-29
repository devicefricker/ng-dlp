import * as cheerio from 'cheerio';
import { Heuristics } from './heuristics.js';
class LinkGetter {
    constructor(url, args) {
        this.url = url;
        this.args = args;
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
    
                    if(this.args.quality) {
                        linkArray.push(movieJson.sources[this.args.quality][0].src);
                        break;
                    }
                    linkArray.push(movieJson.sources[Object.keys(movieJson.sources)[0]][0].src);
                    break;
                case "audio":
                    linkArray.push($('meta[property="og:audio"]').attr('content'));
                    break;
                case "game":
                    console.log(`[linkgrabber]: Games are not implemented`);
                break;
                };
            if (linkArray.length < 1) {
                console.log(`[linkgrabber]: I couldn't get any links. This is probably because NG Guard has stepped in. Visit newgrounds.com in your web browser, and then try again.`)
                console.log(`If this continues, open a new issue on GitHub and state the URL and version of ng-dlp.`)
                console.log(`Exiting.`)
                process.exit(1);
            }
            console.log(`[linkgrabber]: Got ${linkArray.length} ${(linkArray.length < 2) ? "link" : "links"}`)
            resolve(linkArray);
        })
    }
}
export { LinkGetter };