const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', 'utf8');

const replaceAll = (str, find, replace) => str.split(find).join(replace);

content = replaceAll(content, 'bg-white/60 backdrop-blur-xl border-white/80', 'bg-white/30 backdrop-blur-2xl border-white/60');
content = replaceAll(content, 'bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/80', 'bg-white/30 backdrop-blur-2xl rounded-[40px] border border-white/60');
content = replaceAll(content, 'bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/80', 'bg-white/30 backdrop-blur-2xl rounded-[32px] border border-white/60');
content = replaceAll(content, 'bg-white/60 backdrop-blur-xl p-8 rounded-[24px] border border-white/80', 'bg-white/30 backdrop-blur-2xl p-8 rounded-[24px] border border-white/60');

fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', content);
