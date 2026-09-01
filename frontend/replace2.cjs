const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', 'utf8');

const replaceAll = (str, find, replace) => str.split(find).join(replace);

content = replaceAll(content, 'uppercase text-white">{content.contact_title', 'uppercase text-gray-900">{content.contact_title');
content = replaceAll(content, 'bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white appearance-none', 'bg-white/50 border border-gray-200 shadow-sm rounded-xl p-5 font-bold text-xs tracking-widest text-gray-900 appearance-none');
content = replaceAll(content, 'uppercase text-white tracking-tight">{item.title}', 'uppercase text-gray-900 tracking-tight">{item.title}');
content = replaceAll(content, 'text-white/20 group-hover:text-[#FF7200]', 'text-gray-400 group-hover:text-[#FF7200]');
content = replaceAll(content, 'bg-[#121417] border border-white/5 flex items-center justify-center flex-shrink-0 transition-all group-hover:border-[#FF7200]', 'bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 transition-all group-hover:border-[#FF7200]');

fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', content);
