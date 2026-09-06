const fs = require('fs');
let css = fs.readFileSync('src/style.css', 'utf8');

// 1. Kill box shadows globally (except maybe subtle ones on strict UI elements, but let's strip them all to be safe)
css = css.replace(/box-shadow:[^;}]+[;}]/g, function(match) { return match.endsWith('}') ? '}' : ''; });

// 2. Square off rounded corners
css = css.replace(/border-radius:[^;}]+[;}]/g, function(match) { return match.endsWith('}') ? 'border-radius:0;}' : 'border-radius:0;'; });

// 3. Remove backgrounds from generic cards (like .price-card, .team-grid article, etc.) to enforce whitespace
css = css.replace(/\.price-card\{[^}]+\}/g, '.price-card{border:none;border-top:4px solid var(--ink);background:transparent;padding:40px 0}');
css = css.replace(/\.team-grid article\{[^}]+\}/g, '.team-grid article{border:none;border-top:2px solid #3c5c78;padding:40px 0;background:transparent}');
css = css.replace(/\.role-card\{[^}]+\}/g, '.role-card{min-height:0;padding:40px 0;border:none;border-top:2px solid var(--ink)}');
css = css.replace(/\.role-card:nth-child[^}]+\}/g, ''); // Remove side borders

// 4. Update centered heroes (e.g. .hero)
css = css.replace(/\.hero\{[^}]+\}/g, '.hero{padding:140px 5.5% 100px;text-align:left;display:flex;flex-direction:column;align-items:flex-start;max-width:1400px;margin:0 auto}');
css = css.replace(/\.hero h1\{[^}]+\}/g, '.hero h1{font-size:clamp(60px,7vw,96px);max-width:980px;line-height:1;letter-spacing:-0.03em;font-weight:700}');
css = css.replace(/\.hero-copy\{[^}]+\}/g, '.hero-copy{text-align:left;max-width:600px;margin-left:0}');

fs.writeFileSync('src/style.css', css);
console.log('Purged style.css');

