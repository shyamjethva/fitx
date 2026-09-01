const fs = require('fs');
const files = [
  'c:/Error_Infotech/FitX/frontend/src/pages/FitXElite.tsx',
  'c:/Error_Infotech/FitX/frontend/src/pages/FitXPro.tsx',
  'c:/Error_Infotech/FitX/frontend/src/pages/FitXTransform.tsx',
  'c:/Error_Infotech/FitX/frontend/src/pages/FitXHome.tsx',
  'c:/Error_Infotech/FitX/frontend/src/pages/Fitness.tsx'
];
for (const fullPath of files) {
    if (!fs.existsSync(fullPath)) continue;
    let content = fs.readFileSync(fullPath, 'utf8');
    
    // Replace CanvasScrollBg bg-black with premium-bg
    content = content.replace(/className="fixed inset-0 -z-10 bg-black"/g, 'className="fixed inset-0 -z-10 premium-bg"');
    content = content.replace(/className="fixed inset-0 -z-10 bg-\\[#0A0F24\\]"/g, 'className="fixed inset-0 -z-10 premium-bg"');
    
    // Make hero transparent so the premium-bg shows through
    content = content.replace(/className="relative w-full overflow-hidden scroll-mt-32 bg-\\[#0A0F24\\]"/g, 'className="relative w-full overflow-hidden scroll-mt-32 bg-transparent"');
    content = content.replace(/className="relative w-full overflow-hidden scroll-mt-32 bg-\\[#111\\]"/g, 'className="relative w-full overflow-hidden scroll-mt-32 bg-transparent"');
    content = content.replace(/className="relative w-full min-h-\\[100dvh\\] overflow-hidden flex items-center pt-20 bg-\\[#0A0F24\\]"/g, 'className="relative w-full min-h-[100dvh] overflow-hidden flex items-center pt-20 bg-transparent"');
    
    // Also remove any hardcoded absolute background gradients on the hero
    content = content.replace(/<div className="absolute inset-0 bg-gradient-to-r from-\\[#111\\] via-transparent to-transparent lg:block hidden" \\/>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-gradient-to-t from-\\[#111\\]\\/80 via-transparent to-transparent lg:hidden block" \\/>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-gradient-to-r from-\\[#0A0F24\\] via-\\[#0A0F24\\]\\/80 to-transparent lg:block hidden" \\/>/g, '');
    content = content.replace(/<div className="absolute inset-0 bg-gradient-to-t from-\\[#0A0F24\\] via-\\[#0A0F24\\]\\/80 to-transparent lg:hidden block" \\/>/g, '');

    fs.writeFileSync(fullPath, content);
    console.log('Updated', fullPath);
}
