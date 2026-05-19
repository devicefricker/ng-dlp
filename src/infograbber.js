import { InfoJson } from './infojson.js';
class InfoGrabber {
    constructor($, type) {
        this.$ = $;
        this.type = type;
    }
    async get() {
        return new Promise((resolve, reject) => {
            const sidestats = this.$('.sidestats .single-row');
            const stats = sidestats.find('dt');
            console.log(stats.length);
        });
    }
}
export { InfoGrabber };