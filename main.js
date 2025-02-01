import { mkdir } from 'node:fs';
import fs from 'node:fs/promises';
import path from 'node:path';


const INDEX_PATH = './data/index.json';

/**
 * @param {string} filePath Skrá sem skal lesast
 * @returns {Promise<unknown | null>}  les skrá, eða skilar null JSON gagnagrunn
 */
async function readJson(filePath) {
    console.log("reading: ", filePath);

    let data;

    try{
        data = await fs.readFile(path.resolve(filePath), 'utf-8');
    }catch (e) {
        console.error('Error reading file: ', e.message);
        return null;
    }

    try {
        const parsed = JSON.parse(data);
        return parsed;
    } catch (e) {
        console.error('Error parsing JSON: ', e.message);
        return null;
    }   
}

/**
 * @param {any} data Gögn til að skrifa
 * @returns {Promise<void>}
 */
async function writeHtml(data) {

    fs.mkdir('dist', { recursive: true });
    const htmlFilePath = 'dist/index.html';

    const html = data.map((item) => 
        `<li>${item.title} <a href="${item.file}">Skrá</a>

        </li>`).join('\n');

    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vef2-2025-v1</title>
    </head>
    <body>
        <h1>Vef2-2025-v1</h1>
        <ul>
            ${html}
        </ul>
    </body>
    </html>`;

    fs.writeFile(htmlFilePath, htmlContent, 'utf-8');

}

/**
 * @param {unknown} data 
 * @returns {any}
 */
function parseIndexJson(data) {
    return data;
}

/**
 * Keyrir forrit
 * 1. Sækir gögn
 * 2. Staðfestir gögn
 * 3. Skrifar HTML
 */
async function main() {
    const indexJson = await readJson(INDEX_PATH);
    const indexData = parseIndexJson(indexJson);

    writeHtml(indexData);

    console.log(indexData);


}

main();

