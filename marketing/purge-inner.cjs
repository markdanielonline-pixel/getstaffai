const fs = require('fs');
let css = fs.readFileSync('src/inner.css', 'utf8');

// 1. Remove border-radius everywhere
css = css.replace(/border-radius:[^;]+;/g, 'border-radius:0;');

// 2. Kill source-sections generic card borders and backgrounds
css = css.replace(/\.source-sections article\{background:var\(--cream\);padding:34px 36px;border:1px solid #e2e1d9;min-height:190px;position:relative\}/g, '.source-sections article{background:transparent;padding:40px 0;border:none;border-top:2px solid var(--ink);min-height:0;position:relative}');

// 3. Remove the generic floating icon
css = css.replace(/\.source-sections article:before\{[^}]+\}/g, '.source-sections article:before{display:none}');

fs.writeFileSync('src/inner.css', css);
console.log('Purged inner.css');

