import sys

file_path = 'c:/Error_Infotech/FitX/frontend/src/pages/FitXHome.tsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

target = """        <div className="relative group">
          <div className="flex gap-6 overflow-x-auto pb-12 scrollbar-hide snap-x px-4">
            {classes.map((c, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10, scale: 1.02 }}
                className="min-w-[300px] md:min-w-[400px] relative rounded-[40px] overflow-hidden snap-center border border-white/10 group/card bg-[#0A0F24] flex flex-col shadow-2xl"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <img src={c.img} className="w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt={c.name} />
                </div>
                <div className="p-6 text-center flex flex-col items-center justify-center flex-grow">
                  <span className="text-4xl mb-4 bg-white/5 w-16 h-16 rounded-2xl flex items-center justify-center border border-white/10 shrink-0">{c.icon}</span>
                  <h3 className="text-white font-black text-3xl uppercase tracking-tighter mb-2 leading-none">{c.name}</h3>
                  <p className="text-white/40 font-bold text-[10px] tracking-[0.2em] uppercase">{c.tags}</p>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="absolute left-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all -translate-x-1/2">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button className="absolute right-0 top-1/2 -translate-y-1/2 z-30 w-14 h-14 bg-black/50 backdrop-blur-md border border-white/10 rounded-full hidden md:flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all translate-x-1/2">
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>"""

replacement = """        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {classes.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
              whileHover={{ y: -15, scale: 1.03 }}
              className="relative aspect-[4/3] rounded-[32px] overflow-hidden border border-white/10 group/card shadow-xl cursor-pointer bg-[#0A0F1C]"
            >
              <img src={c.img} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover/card:scale-110" alt={c.name} />
              
              {/* Glass effect panel for text content */}
              <div className="absolute inset-x-0 bottom-0 p-4 pt-6 text-center flex flex-col items-center bg-[#0A0F1C]/70 backdrop-blur-md border-t border-white/10 transition-transform duration-500">
                <span className="absolute -top-6 bg-[#0A0F1C]/90 w-12 h-12 rounded-xl flex items-center justify-center shadow-lg border border-[#E8864A]/40 transition-transform duration-500 group-hover/card:-translate-y-2">
                  {c.icon}
                </span>
                <h3 className="text-white font-black text-2xl uppercase tracking-tighter mb-1 mt-2 leading-none transition-transform duration-500 group-hover/card:-translate-y-1">{c.name}</h3>
                <p className="text-white/70 font-bold text-[9px] tracking-[0.2em] uppercase transition-transform duration-500">{c.tags}</p>
              </div>
            </motion.div>
          ))}
        </div>"""

if target in content:
    new_content = content.replace(target, replacement)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    print("Successfully applied changes")
else:
    print("Error: Target string not found in file")
