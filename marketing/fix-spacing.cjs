const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Hero padding
css = css.replace(/\.hero\{padding:140px 5\.5% 100px;/g, '.hero{padding:60px 5.5% 80px;');

// Inner hero padding
css = css.replace(/\.inner-hero\{min-height:480px;padding:118px max\(7vw,42px\) 90px;/g, '.inner-hero{min-height:400px;padding:60px max(7vw,42px) 60px;');

// Section padding
css = css.replace(/\.section\{max-width:1260px;margin:auto;padding:110px 5\.5%\}/g, '.section{max-width:1260px;margin:auto;padding:60px 5.5%}');

// .two gap
css = css.replace(/\.two\{display:grid;grid-template-columns:1fr 1fr;gap:120px\}/g, '.two{display:grid;grid-template-columns:1fr 1fr;gap:60px}');

// .head margin
css = css.replace(/\.head\{max-width:1150px;margin:0 auto 50px;/g, '.head{max-width:1150px;margin:0 auto 30px;');

// .dark.teams padding
css = css.replace(/\.dark\.teams\{padding-top:100px;padding-bottom:110px\}/g, '.dark.teams{padding-top:60px;padding-bottom:60px}');

// .final padding
css = css.replace(/\.final\{background:var\(--blue\);padding-top:100px;padding-bottom:100px\}/g, '.final{background:var(--blue);padding-top:60px;padding-bottom:60px}');

// .principles margin
css = css.replace(/\.principles\{display:grid;grid-template-columns:repeat\(3,1fr\);margin-top:62px!important;/g, '.principles{display:grid;grid-template-columns:repeat(3,1fr);margin-top:40px!important;');

fs.writeFileSync('src/style.css', css);
console.log('Fixed spacing in style.css');

