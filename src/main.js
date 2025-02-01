import { mkdir, write } from 'node:fs';
import fs from 'node:fs/promises';

import {readJson} from './lib/readJson.js';
import { parse } from 'node:path';




const INDEX_PATH = './data/index.json';

/**
 * @param {any} data Gögn til að skrifa
 * @returns {Promise<void>}
 */
async function writeHtml(data) {
    await fs.mkdir('dist', { recursive: true });

    const htmlFilePath = 'dist/index.html';

    // gögn út json, nafn og linkur
    
    const html = data.map((item) => 
        `<li>${item.title} <strong><a href="${item.file.replace('.json', '.html')}">${item.file}</a></strong></li>`).join('\n');

    // html fyrir index.json
    const htmlContent = /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vef2-2025-v1</title>
    </head>
    <body>
        <h1>Vef2-2025-v1</h1>
        <p>Hér eru spurningar um efni. Veldu það efni sem þú vilt skoða</p>
        <ul>
            ${html}
        </ul>
    </body>
    </html>`;

    await fs.writeFile(htmlFilePath, htmlContent, 'utf-8');



    // gera HTML fyrir hvert efni? kalla svo á parseContent til að fjarlægja data þaðan?

    for (const item of data) {
        const contentJson = await readJson(`./data/${item.file}`);
        if (!contentJson) {
            console.warn(`No content found, skipping ${item.file}`);
            continue;
        }
        const link = `./dist/${item.file.replace('.json', '.html')}`
        //console.log(contentJson);
        
        await fs.writeFile(link, contentHTML(contentJson), 'utf-8');
    }

}

function contentHTML(data) {
    parseContentJson(data);
    return /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vef2-2025-v1</title>
    </head>
    <body>
        <h1>aukasíða fyrir prófun</h1>
        <h2>${data.title}</h2>
    
    </body>
    </html>`

}


/**
 * @param {unknown} data 
 * @returns {any}
 */
function parseIndexJson(data) {
    // remove illegal data, where json data does not have a title or file
    data = data.filter((item) => {
        if (!item.title || !item.file) {
            console.log('Illegal data in index.json: ', item);
            return false;
    }
    return  true;
        
    });

    // remove data that leeds to nowhere
    // all cases where file does not exist in /data directory

    return data;
}

function parseContentJson(data) {
    // remove illegal content, title, questions, question, answers or answer
    if (!data && !data.title) {
        return "<h1>Error</h1>";
    }
    
}
    // remove from the content pages, 

/**
 * Keyrir forrit
 * 1. Sækir gögn
 * 2. Staðfestir gögn
 * 3. Skrifar HTML
 */
async function main() {
    // sækjum gögn fyrir index síðu
    const indexJson = await readJson(INDEX_PATH);
    const indexData = parseIndexJson(indexJson);

    writeHtml(indexData);

}

main();

