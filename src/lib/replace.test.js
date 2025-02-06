
import { escapeHtml } from './replace.js';

import {test} from 'node:test';
import assert from 'node:assert';


test('escapeHtml', () => {
    assert.equal(escapeHtml('<script>alert("xss")</script>'), '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
});

test('escapeHtml', () => {
    assert.equal(escapeHtml(), '');
        
});




