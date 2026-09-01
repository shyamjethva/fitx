const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', 'utf8');

const replaceAll = (str, find, replace) => str.split(find).join(replace);

content = replaceAll(content, 'bg-white/30 backdrop-blur-2xl border-white/60', 'bg-white/60 backdrop-blur-xl border-white/80');

fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', content);
