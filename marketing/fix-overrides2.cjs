const fs = require('fs');
let css = fs.readFileSync('src/overrides.css', 'utf8');

css = css.replace(/\.office-card\{top:140px;/g, '.office-card{top:80px;');
css = css.replace(/\.hero\{min-height:760px;/g, '.hero{min-height:600px;');

fs.writeFileSync('src/overrides.css', css);
console.log('Fixed overrides 2');

