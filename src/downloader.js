import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';

class Downloader {
    constructor(links) {
        this.links = links;
    }
    async dl(outputfolder, isCompiled) {
        if(!outputfolder) outputfolder = "output"
        const __filename = fileURLToPath(import.meta.url),
              __dirname = path.dirname(__filename);
        return new Promise(async (resolve, reject) => {
            for(let i = 0; i < this.links.length; i++) {
                const req = await fetch(this.links[i]),
                      bytesT = parseInt(req.headers.get('content-length')),
                      reader = req.body.getReader(),
                      chunks = [],
                      root = isCompiled ? path.join(__dirname, '..') : process.cwd(),
                      folder = path.join(root, outputfolder),
                      filename = path.join(folder, path.basename(this.links[i]).split("?")[0]);
                let bytesR = 0,
                    blob,
                    buffer,
                    ar;
                // bytesR = bytes RECEIVED

                while(true) {
                    const { done, value } = await reader.read();

                    if(done) break;
                    chunks.push(value);
                    bytesR += value.length;
                    console.log(`[download progress]: ${((bytesT - bytesR) / 1048576).toFixed(2)} left out of ${((bytesT) / 1048576).toFixed(2)} MiB left`);
                }
                blob = new Blob(chunks);
                ar = await blob.arrayBuffer();
                buffer = Buffer.from(ar);

                try {
                    await fs.mkdir(folder, { recursive: true });
                    await fs.writeFile(filename, buffer);
                    console.log(`[downloader]: Written to disk as ${filename}`)
                } catch (err) {
                    reject(err);
                }
            }
            resolve("ok");
        })
    }
}
export { Downloader };