const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// Section padding mobile
css = css.replace(/\.section\{padding:80px 22px\}/g, '.section{padding:40px 22px}');

// .two gap mobile
css = css.replace(/\.two,\.price-layout\{grid-template-columns:1fr;gap:45px\}/g, '.two,.price-layout{grid-template-columns:1fr;gap:30px}');

// .hero padding mobile
css = css.replace(/\.hero-copy\{padding:70px 22px\}/g, '.hero-copy{padding:30px 22px}'); // Wait, is there .hero-copy padding?
css = css.replace(/\.hero\{padding-bottom:50px\}/g, '.hero{padding-bottom:30px}');

fs.writeFileSync('src/style.css', css);
console.log('Fixed mobile spacing in style.css');

