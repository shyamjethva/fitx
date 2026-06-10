import React from 'react';

export default function BackgroundGlows() {
  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0 overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-[#FF7200]/20 rounded-full blur-[140px] opacity-40" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-[#FF9942]/15 rounded-full blur-[120px] opacity-30" />
      <div className="absolute top-[40%] right-[-10%] w-[40%] h-[40%] bg-[#FF8B10]/10 rounded-full blur-[100px] opacity-20" />
      <div className="absolute bottom-[20%] left-[-5%] w-[35%] h-[35%] bg-[#FF7200]/8 rounded-full blur-[90px] opacity-15" />
    </div>
  );
}
