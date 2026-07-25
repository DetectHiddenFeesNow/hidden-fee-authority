#!/usr/bin/env node
// Batch Producer v1.0 - Accelerated authority asset generation
// Reads from content/queue/topics.md, generates markdown + HTML in batch
const fs = require('fs'), path = require('path');
const base = 'C:/vhub';

// Load queue
const queue = fs.readFileSync(base + '/content/queue/topics.md', 'utf8').split('\n').filter(l => l.match(/^\d+\./));
const topics = queue.map(l => {
  const m = l.match(/^\d+\.\s+(.+?)(?:\s*-\s*(.+))?$/);
  return m ? { title: m[1].trim(), focus: (m[2]||'').trim() } : null;
}).filter(Boolean);

console.log('=== BATCH PRODUCER ===');
console.log('Queue items:', topics.length);
console.log('');

// Find which reports are already built
const existing = fs.readdirSync(base).filter(d => d.startsWith('the-hidden-'));
topics.forEach(t => {
  const slug = t.title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'');
  const built = existing.some(e => e.includes(slug));
  console.log((built ? '[DONE]' : '[TODO]'), t.title);
});