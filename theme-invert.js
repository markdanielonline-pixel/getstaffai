const fs = require('fs');
const path = require('path');

const directories = [
  'app',
  'components',
  'app/pricing',
  'app/how-it-works',
  'app/industries',
  'app/why-staffai',
  'app/qa',
  'app/contact',
  'app/compliance',
  'app/portal/login',
  'app/portal/signup',
  'app/portal/dashboard'
];

function scanAndReplace(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      scanAndReplace(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Invert hardcoded inline color strings to CSS variables to support light mode
      let newContent = content
        .replace(/'#fff'/g, "'var(--text-primary)'")
        .replace(/'#ffffff'/g, "'var(--text-primary)'")
        .replace(/"#fff"/g, '"var(--text-primary)"')
        .replace(/"#ffffff"/g, '"var(--text-primary)"')
        .replace(/'#e2e8f0'/g, "'var(--text-secondary)'")
        .replace(/"#e2e8f0"/g, '"var(--text-secondary)"')
        // Swap light white borders/bgs for dark counterparts in inline styles
        .replace(/rgba\(255,255,255,/g, "rgba(0,0,0,")
        .replace(/rgba\(255, 255, 255,/g, "rgba(0, 0, 0,")
        // Except for the hero text gradient we want to keep it vibrant
        // So we will leave gradients alone, mostly just standard rgba
      ;
      
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent);
        console.log(`Updated theme targets in: ${fullPath}`);
      }
    }
  }
}

scanAndReplace('app');
scanAndReplace('components');
console.log("Done.");
