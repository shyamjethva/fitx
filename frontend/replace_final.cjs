const fs = require('fs');
let content = fs.readFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', 'utf8');

const replaceAll = (str, find, replace) => str.split(find).join(replace);

// MEMBERSHIP TIERS SECTION
content = replaceAll(content, 'text-4xl md:text-6xl font-black uppercase tracking-tighter text-white', 'text-4xl md:text-6xl font-black uppercase tracking-tighter text-gray-900');

// MEMBERSHIP CARDS
content = replaceAll(content, 'className={`membership-card relative p-8 rounded-[32px] border-2 cursor-pointer transition-all duration-500 overflow-hidden h-full flex flex-col ${selectedPackage?.id === pkg.id', 'className={`membership-card relative p-8 rounded-[32px] border cursor-pointer transition-all duration-500 overflow-hidden h-full flex flex-col bg-white/60 backdrop-blur-xl border-white/80 shadow-lg ${selectedPackage?.id === pkg.id');

content = replaceAll(content, 'bg-[#FF7200] text-[#0A0F24]', 'bg-[#FF7200] text-white');
content = replaceAll(content, 'bg-[#1F2328] border border-white/10', 'bg-white border border-gray-100 shadow-sm');
content = replaceAll(content, 'text-2xl font-black mb-2 tracking-tight uppercase force-text-white', 'text-2xl font-black mb-2 tracking-tight uppercase text-gray-900');
content = replaceAll(content, 'text-5xl font-black force-text-white', 'text-5xl font-black text-[#FF7200]');
content = replaceAll(content, 'force-text-white-muted opacity-60 font-black uppercase text-[10px] tracking-widest', 'text-gray-500 font-bold uppercase text-[10px] tracking-widest');
content = replaceAll(content, 'force-text-white-muted font-medium leading-relaxed mb-8 text-sm', 'text-gray-700 font-bold leading-relaxed mb-8 text-sm');

content = replaceAll(content, 'bg-[#FF7200] border-[#FF7200] text-[#0A0F24] hover:bg-white hover:text-black hover:border-white', 'bg-[#FF7200] text-white hover:bg-gray-900 shadow-xl border-none');
content = replaceAll(content, 'bg-transparent border-white/20 text-white hover:border-white', 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 hover:shadow-md');


// DEEP DETAILS SECTION
content = replaceAll(content, 'bg-[#16191d] rounded-[40px] border border-white/5', 'bg-white/60 backdrop-blur-xl rounded-[40px] border border-white/80 shadow-2xl');
content = replaceAll(content, 'text-white/80 font-bold text-lg tracking-tight group-hover:text-white', 'text-gray-700 font-bold text-lg tracking-tight group-hover:text-gray-900');
content = replaceAll(content, 'bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#FF7200] group-hover:text-[#0A0F24]', 'bg-white flex items-center justify-center border border-gray-200 shadow-sm group-hover:bg-[#FF7200] group-hover:text-white');
content = replaceAll(content, 'bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-[#FF7200]', 'bg-white flex items-center justify-center border border-gray-200 shadow-sm group-hover:border-[#FF7200]');

// BOOKING CARD & FORM
content = replaceAll(content, 'bg-[#16191d] rounded-[32px] border border-white/10 p-8 md:p-16 text-white', 'bg-white/60 backdrop-blur-xl rounded-[32px] border border-white/80 shadow-2xl p-8 md:p-16 text-gray-900');
content = replaceAll(content, 'uppercase text-white">{content.contact_title', 'uppercase text-gray-900">{content.contact_title');
content = replaceAll(content, 'text-white/50 font-medium text-base md:text-lg uppercase mb-12 tracking-tight', 'text-gray-500 font-medium text-base md:text-lg uppercase mb-12 tracking-tight');
content = replaceAll(content, 'bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white placeholder:text-white/20', 'bg-white/50 border border-gray-200 shadow-sm rounded-xl p-5 font-bold text-xs tracking-widest text-gray-900 placeholder:text-gray-400');
content = replaceAll(content, 'bg-[#121417] border border-white/10 rounded-xl p-5 font-bold text-xs tracking-widest text-white appearance-none', 'bg-white/50 border border-gray-200 shadow-sm rounded-xl p-5 font-bold text-xs tracking-widest text-gray-900 appearance-none');
content = replaceAll(content, 'className="bg-[#1a1d21]"', 'className="bg-white text-gray-900"');
content = replaceAll(content, 'bg-white text-black py-5 rounded-xl font-black text-[11px] tracking-[0.3em] uppercase hover:bg-[#FF7200] hover:text-[#0A0F24]', 'bg-[#FF7200] text-white py-5 rounded-xl font-black text-[11px] tracking-[0.3em] uppercase hover:bg-orange-600');

// INFO CARDS
content = replaceAll(content, 'bg-[#16191d] p-8 rounded-[24px] border border-white/10 flex items-center gap-6 group cursor-pointer hover:border-[#FF7200]/50 hover:bg-[#1F2328]', 'bg-white/60 backdrop-blur-xl p-8 rounded-[24px] border border-white/80 shadow-xl flex items-center gap-6 group cursor-pointer hover:border-[#FF7200]/50 hover:bg-white');
content = replaceAll(content, 'bg-[#121417] border border-white/5 flex items-center justify-center flex-shrink-0 transition-all group-hover:border-[#FF7200]', 'bg-white border border-gray-100 shadow-sm flex items-center justify-center flex-shrink-0 transition-all group-hover:border-[#FF7200]');
content = replaceAll(content, 'uppercase text-white tracking-tight', 'uppercase text-gray-900 tracking-tight');
content = replaceAll(content, 'text-white/40 font-bold text-[10px] tracking-wider uppercase leading-tight', 'text-gray-500 font-bold text-[10px] tracking-wider uppercase leading-tight');
content = replaceAll(content, 'text-white/20 group-hover:text-[#FF7200]', 'text-gray-400 group-hover:text-[#FF7200]');

fs.writeFileSync('d:/error_infotech/FitX/FitX/frontend/src/pages/Memberships.tsx', content);
