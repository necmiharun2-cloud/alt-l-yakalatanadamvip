const fs = require('fs');
const path = require('path');

const replacements = {
  '#00e5ff': '#ff0000',
  '#080d16': '#050505',
  '#0c121e': '#111111',
  '#151b27': '#1a1a1a',
  '#193256': '#222222',
  '#152846': '#1a1a1a',
  '#0b1b33': '#111111',
  '#071324': '#050505',
  '#0B1526': '#111111',
  '#050A14': '#000000',
  '#05090f': '#000000',
  '#081528': '#111111',
  '#59b1ff': '#ff0000'
};

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if ((fullPath.endsWith('.tsx') || fullPath.endsWith('.ts') || fullPath.endsWith('.css')) && !fullPath.includes('node_modules')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let changed = false;
            for (const [key, value] of Object.entries(replacements)) {
                const regex = new RegExp(key, 'gi');
                if (content.match(regex)) {
                    content = content.replace(regex, value);
                    changed = true;
                }
            }
            if (changed) {
                fs.writeFileSync(fullPath, content);
                console.log('Updated: ' + fullPath);
            }
        }
    }
}

walkDir('./src');
