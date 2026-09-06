const fs = require('fs');
let css = fs.readFileSync('src/overrides.css', 'utf8');

// Hero copy padding
css = css.replace(/\.hero-copy\{padding:145px 6\.5%;max-width:1400px\}/g, '.hero-copy{padding:50px 6.5%;max-width:1400px}');
css = css.replace(/\.hero-copy\{padding:90px 22px\}/g, '.hero-copy{padding:40px 22px}'); // mobile

// Section padding
css = css.replace(/\.section\{padding-top:140px;padding-bottom:140px\}/g, '.section{padding-top:60px;padding-bottom:60px}');
css = css.replace(/\.section\{padding-top:90px;padding-bottom:90px\}/g, '.section{padding-top:40px;padding-bottom:40px}'); // mobile

// Inner hero
css = css.replace(/\.inner-hero\{min-height:520px;padding:145px 7%;background:linear-gradient\(120deg,#0b1f33,#123d5f\)\}/g, '.inner-hero{min-height:400px;padding:60px 7%;background:#0b1f33}');
css = css.replace(/\.inner-hero\{padding:90px 22px\}/g, '.inner-hero{padding:50px 22px}'); // mobile

// Inner content
css = css.replace(/\.inner-content\{padding-top:125px;padding-bottom:145px\}/g, '.inner-content{padding-top:60px;padding-bottom:60px}');

// Office card drop shadow kill again just in case
css = css.replace(/box-shadow:22px 22px 0 rgba\(196,161,90,\.25\)/g, 'box-shadow:none');

// Footer padding
css = css.replace(/footer\{max-width:1400px;padding:80px 6\.5%;border-top:1px solid var\(--line\)\}/g, 'footer{max-width:1400px;padding:40px 6.5%;border-top:1px solid var(--line)}');

fs.writeFileSync('src/overrides.css', css);
console.log('Fixed overrides.css');

