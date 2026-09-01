const fs = require('fs');
const path = require('path');

const newComponent = `const AtHomeWorkouts = ({ data }: { data: PageHeroData | null }) => {
  const content = data?.contentBlocks || {};
  const { isLoggedIn, setIsLoginModalOpen } = useUI();
  const workouts = [
    {
      trainer: 'Nandini Shetty',
      title: 'Dance Fitness Xtreme',
      type: 'DANCE • INTERMEDIATE • 47 Min',
      img: '/athome1.jpeg',
      live: '26+ LIVE'
    },
    {
      trainer: 'Rahul Shetty',
      title: 'Cardio HIIT',
      type: 'CARDIO • BEGINNER • 30 Min',
      img: '/athome2.jpeg',
    },
    {
      trainer: 'Isheeta Ray',
      title: 'Dance Fitness Xpress',
      type: 'DANCE • BEGINNER • 33 Min',
      img: '/athome3.jpeg',
    }
  ];

  return (
    <section className="py-20 px-6 md:px-24 bg-transparent relative z-10">
      <div className="max-w-6xl mx-auto relative">
        <div className="text-center mb-16 relative z-10">
          <p className="text-[#FFA040] font-black text-sm tracking-[0.2em] uppercase mb-4 drop-shadow-md">
            {content.athome_subtitle || 'AT-HOME'}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter drop-shadow-lg uppercase">
            {content.athome_title || 'Unlimited home workouts with calorie tracking'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {workouts.map((w, idx) => (
            <motion.div
              key={w.title}
              initial="initial"
              whileHover="hover"
              className="relative aspect-[3/4.5] rounded-[32px] overflow-hidden group cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/5"
            >
              <motion.img
                src={w.img}
                alt={w.title}
                variants={{
                  initial: { scale: 1 },
                  hover: { scale: 1.05 }
                }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {w.live && (
                <div className="absolute top-6 left-6 bg-black/80 px-3 py-1.5 rounded-lg text-[10px] font-black text-white z-10 tracking-wider shadow-lg">
                  {w.live}
                </div>
              )}

              {/* Dark semi-transparent box at the bottom */}
              <div
                className="absolute bottom-0 left-0 right-0 pt-8 pb-6 px-6 bg-gradient-to-b from-[#2a3038]/90 to-[#1a1e24]/95 rounded-t-[32px] flex flex-col items-center text-center transition-transform duration-500 transform translate-y-2 group-hover:translate-y-0"
              >
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                <p className="text-[#FFA040] text-[10px] font-black uppercase mb-1.5 tracking-[0.2em]">{w.trainer}</p>
                <h3 className="text-white font-black text-2xl md:text-3xl mb-2 tracking-tighter leading-tight">{w.title}</h3>
                <p className="text-white/60 text-[9px] font-bold tracking-[0.2em] uppercase mb-6">{w.type}</p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isLoggedIn) {
                      setIsLoginModalOpen(true);
                    }
                  }}
                  className="w-full bg-[#FFA040] text-[#0A0F1C] py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-white transition-colors duration-300 shadow-lg"
                >
                  <div className="w-2 h-2 rounded-full bg-[#0A0F1C] animate-pulse" />
                  <span className="font-black text-[11px] tracking-widest uppercase">JOIN CLASS</span>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};`;

const dir = 'c:/Error_Infotech/FitX/frontend/src/pages';
const files = fs.readdirSync(dir);

for (const file of files) {
  if ((file.startsWith('FitX') || file === 'Fitness.tsx') && file.endsWith('.tsx')) {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    const startIndex = content.indexOf('const AtHomeWorkouts = ({ data }');
    if (startIndex > -1) {
      let searchArea = content.substring(startIndex + 100);
      let nextConst = searchArea.indexOf('\nconst ');
      let nextExport = searchArea.indexOf('\nexport default');
      
      let endOffset = -1;
      if (nextConst > -1 && nextExport > -1) {
        endOffset = Math.min(nextConst, nextExport);
      } else if (nextConst > -1) {
        endOffset = nextConst;
      } else if (nextExport > -1) {
        endOffset = nextExport;
      }
      
      if (endOffset > -1) {
        const endIndex = startIndex + 100 + endOffset;
        const before = content.substring(0, startIndex);
        const after = content.substring(endIndex);
        fs.writeFileSync(filePath, before + newComponent + '\n' + after);
        console.log('Successfully updated ' + file);
      }
    }
  }
}
