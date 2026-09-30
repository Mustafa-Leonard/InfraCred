// Scan the frontend (and docs) for emoji / pictograph characters.
// Usage: node scan_emoji.cjs  -> writes emojis.txt
const fs = require('fs');
const path = require('path');

const roots = [
    path.join(__dirname, 'InfraCred', 'frontend', 'src'),
    path.join(__dirname, 'InfraCred', 'backend', 'apps'),
    path.join(__dirname, 'InfraCred', 'README.md'),
    path.join(__dirname, 'README.md'),
];

// Emoji / pictograph ranges. Deliberately excludes ordinary typography such as
// — (2014), – (2013), · (00B7), … (2026), “ ” (201C/201D) which are legitimate.
const EMOJI = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{2049}\u{203C}\u{24C2}\u{1F004}\u{1F0CF}]/gu;

const hits = [];
let files = 0;

const walk = (target) => {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
        for (const entry of fs.readdirSync(target)) {
            if (entry === 'node_modules' || entry === 'dist' || entry === '.venv' || entry === 'venv') continue;
            walk(path.join(target, entry));
        }
        return;
    }
    if (!/\.(tsx|ts|jsx|js|md|py|json|html)$/i.test(target)) return;
    files += 1;
    const lines = fs.readFileSync(target, 'utf8').split(/\r?\n/);
    lines.forEach((line, index) => {
        const found = line.match(EMOJI);
        if (found) {
            hits.push({
                file: path.relative(__dirname, target),
                line: index + 1,
                chars: [...new Set(found)].join(' '),
                text: line.trim().slice(0, 160),
            });
        }
    });
};

roots.forEach(walk);

const out = [`scanned files: ${files}`, `emoji lines: ${hits.length}`, ''];
const byFile = {};
for (const h of hits) {
    (byFile[h.file] = byFile[h.file] || []).push(h);
}
for (const [file, list] of Object.entries(byFile)) {
    out.push(`--- ${file} (${list.length}) ---`);
    for (const h of list) out.push(`  L${h.line} [${h.chars}]  ${h.text}`);
    out.push('');
}
fs.writeFileSync(path.join(__dirname, 'emojis.txt'), out.join('\n'), 'utf8');
console.log(`scanned ${files} files, ${hits.length} emoji lines -> emojis.txt`);
