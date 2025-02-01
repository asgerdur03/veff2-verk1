import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * @param {string} filePath Skrá sem skal lesast
 * @returns {Promise<unknown | null>}  les skrá, eða skilar null JSON gagnagrunn
 */
export async function readJson(filePath) {
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