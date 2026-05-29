import * as cheerio from 'cheerio';
export async function GetAsCheerio(url) {
    const req = await fetch(url);
    const text = await req.text();
    const $ = await cheerio.load(text);
    return $; 
}