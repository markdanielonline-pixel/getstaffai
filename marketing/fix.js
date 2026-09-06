const fs = require('fs');
let l = fs.readFileSync('src/legal.js', 'utf8');
l = l.replace(
  'const title=names[location.pathname.split(\'/\').pop()]',
  'let path=location.pathname.split(\'/\').pop()||\\'index.html\\'; if (path && !path.endsWith(\'.html\') && path.indexOf(\'.\') === -1) path += \'.html\'; const title=names[path]'
);
fs.writeFileSync('src/legal.js', l);
console.log('Fixed legal.js');

