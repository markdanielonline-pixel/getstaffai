const fs = require('fs');
let css = fs.readFileSync('src/premium-pages.css', 'utf8');

// 1. Purge Inner Hero Slop
css = css.replace(/background:linear-gradient\([^)]+\)/g, 'background:#071d3c'); // Solid ink
css = css.replace(/\.inner-hero:after\{[^}]+\}/, '.inner-hero:after{display:none}'); // Kill orb

// 2. Purge Card Slop
css = css.replace(/box-shadow:[^;]+;/g, ''); // Kill all box-shadows
css = css.replace(/transition:[^;]+;/g, ''); // Kill transitions
css = css.replace(/transform:[^;]+;/g, ''); // Kill transforms
css = css.replace(/\.source-sections article:hover\{[^}]+\}/g, ''); // Kill card hover effects

// 3. De-Card Backgrounds (Make them transparent / remove pill coloring)
css = css.replace(/background:#f0eee6/g, 'background:transparent;border-top:1px solid #d5d9dd');
css = css.replace(/background:#173e6b/g, 'background:#0b1f33'); // Solid dark if needed
css = css.replace(/background:#fffdf8/g, 'background:transparent;border-top:1px solid #d5d9dd');
css = css.replace(/background:#e6eee9/g, 'background:transparent');
css = css.replace(/background:#f3eee2/g, 'background:transparent');
css = css.replace(/background:#e8edf0/g, 'background:transparent');
css = css.replace(/background:#f3f0e8/g, 'background:transparent');

// 4. Tighten Typography and spacing in generic articles
css = css.replace(/\.source-sections article\{padding:40px 42px;min-height:230px;/g, '.source-sections article{padding:60px 0;min-height:0;border-top:2px solid #071d3c;'); // Editorial separators

fs.writeFileSync('src/premium-pages.css', css);
console.log('Purged premium-pages.css');

