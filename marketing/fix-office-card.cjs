const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');
css = css.replace(/box-shadow:18px 18px #c9a6482b/g, '');
css = css.replace(/\.button\{[^}]+\}/g, function(m) { return m.replace(/border-radius:[^;]+;/g, 'border-radius:0;'); });
fs.writeFileSync('src/style.css', css);
console.log('Fixed office-card shadow');

