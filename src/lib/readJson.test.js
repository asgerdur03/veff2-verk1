import { readJson } from "./readJson.js";

import {test} from 'node:test';
import assert from 'node:assert';


test('readJson', async () => {
    assert.equal(await readJson('./data/nothing.json'), null);
});


test('readJson', async () => {
    assert.deepStrictEqual(await readJson('./data/corrupt.json'), {"title": "Ógild gögn","questions": null});
});