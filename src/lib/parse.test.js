import { parseIndexJson } from "./parse.js";

import {test} from 'node:test';
import assert from 'node:assert';


test('parseIndexJson', () => {
    assert.deepEqual(parseIndexJson([]), []);
});

test('parseIndexJson', () => {
    assert.deepEqual(parseIndexJson([{ title: 'foo', file: 'bar'}]),[{ title: 'foo', file: 'bar'}] );
});

test('parseIndexJson', () => {
    assert.deepEqual(parseIndexJson([{ title: 'foo', file: 'bar'}, { file: 'slay'}]),[{ title: 'foo', file: 'bar'}] );
});