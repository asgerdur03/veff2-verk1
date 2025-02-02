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
        <meta charset="UTF-8">
        <link rel="stylesheet" href="style.css">
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
        await fs.writeFile(link, contentHTML(contentJson), 'utf-8');
    }

}

function contentHTML(data) {
    if (!data || typeof data !== "object") {
        console.error('Illegal content in content.json: ', data);
        return "<h1>Error</h1>";
    }

    if (!data.questions || !Array.isArray(data.questions)) {
        console.warn("Warning: No valid questions found in:", data.title);
        return ` 
        <!DOCTYPE html>
        <html lang="is">
        <head>
            <meta charset="UTF-8">
            <title>${data.title}</title>
            <link rel="stylesheet" href="style.css">
        </head>
        <body>
            <h1>${data.title}</h1>
            <p>Error: No questions available</p>
            <a href="./index.html">Til baka</a>
        </body>
        </html>`;
    }

    const content = data.questions.map((q) => `
    <div class="question">
        <p><strong>Spurning:</strong> ${escapeHtml(q.question)}</p>
        <ul>
            ${
                Array.isArray(q.answers) 
                    ? q.answers.map(a => 
                        `<li>
                            <label>
                                <input type="checkbox">
                                ${escapeHtml(a.answer)}
                                <p class="hidden">${a.correct ? "✅" : ""}</p>
                            </label>
                        </li>`).join("\n")
                    : "<li>Error: No answers available</li>"
            }
        </ul>
        <button type="submit">Skoða svar</button>
        <button type="submit">Fela svar</button>
    </div>
    
`)
.join("\n");
        

    return /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <title>${data.title}</title>
        <link rel="stylesheet" href="style.css">
    </head>
    <body>
        <h1>${data.title}</h1>
        <div>${content}</div>

        <a href="./index.html">Til baka</a>
    
    </body>
    </html>`

}

function escapeHtml(text) {
    // svo að html í spurningum byrtist sem texti en ekki html, chat
    if (typeof text !== "string") {
        return String(text || ""); // Convert undefined/null to empty string
    }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
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

