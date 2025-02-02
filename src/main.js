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

    let links = [];

    // gera HTML fyrir hvert efni? kalla svo á parseContent til að fjarlægja data þaðan?
    for (const item of data) {
        const contentJson = await readJson(`./data/${item.file}`);
        if (!contentJson) {
            console.warn(`No content found, skipping ${item.file}`);
            
            continue;
        }else{
            //links.push(`${item.file.replace('.json', '.html')}`) 
            links[item.title] = `${item.file.replace('.json', '.html')}`

        }
        const link = `./dist/${item.file.replace('.json', '.html')}`
        await fs.writeFile(link, contentHTML(contentJson), 'utf-8');
    }

    const html = Object.entries(links).map(([title, link]) => 
        `<li>${title} <strong><a href="${link}">${link}</a></strong></li>`).join('\n');


    // html fyrir index.json

    const htmlContent = /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Vef2-2025-v1</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="../public/style.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body>
        <h1>Vef2-2025-v1</h1>
        <p>Hér eru spurningar um efni. Veldu það efni sem þú vilt skoða</p>
        <div>
            <ul>
                ${html}
            </ul>
        </div>
    </body>
    </html>`;

    await fs.writeFile(htmlFilePath, htmlContent, 'utf-8');

    
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
            <link rel="stylesheet" href="../public/style.css">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                                <p class="hidden">${a.correct ? "✅ Rétt" : ""}</p>
                            </label>
                        </li>`).join("\n")
                    : "<li>Error: No answers available</li>"
            }
            <button type="submit" onclick="show(this)">Skoða svar</button>
            <button type="submit" onclick="hide(this)">Fela svar</button>
        </ul>
    
    </div>
    <script>
    function show(button) {
        const answers = button.parentElement.querySelectorAll("p.hidden");
        answers.forEach(answer => answer.classList.remove("hidden"));
        console.log("show");
    }

    function hide(button) {
        const answers = button.parentElement.querySelectorAll("p");
        answers.forEach(answer => answer.classList.add("hidden"));
        console.log("hide");
    }
</script>
    
`)
.join("\n");
        

    return /*html*/`
    <!DOCTYPE html>
    <html>
    <head>
        <title>${data.title}</title>
        <link rel="stylesheet" href="../public/style.css">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
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

