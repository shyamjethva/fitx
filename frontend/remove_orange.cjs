const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/index.css', 'utf8');

const orangeOverride = `  /* Accent bullet items & small decorative dots */
  .bg-white\\/30,
  .bg-white\\/20,
  .bg-emerald-500,
  .bg-green-500,
  .bg-green-400\\/10 {
    background-color: #FF7200 !important;
  }`;

content = content.replace(orangeOverride, '');

// Also remove any rogue overrides for text-white/40 or others if they exist
content = content.replace(/\.bg-white\\\/30,/g, '');
content = content.replace(/\.bg-white\\\/20,/g, '');

fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/index.css', content);

console.log("Removed bg-white/30 orange override.");
