import React, { useState, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

export function ScrollButtons() {
  const [isScrollable, setIsScrollable] = useState(false);
  const [activeTooltip, setActiveTooltip] = useState(null);

  useEffect(() => {
    const checkScrollable = () => {
      const scrollable = document.documentElement.scrollHeight > window.innerHeight + 100;
      setIsScrollable(scrollable);
    };

    checkScrollable();
    window.addEventListener("resize", checkScrollable);
    const interval = setInterval(checkScrollable, 1000);

    return () => {
      window.removeEventListener("resize", checkScrollable);
      clearInterval(interval);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth"
    });
  };

  if (!isScrollable) return null;

  return (
    <div className="fixed right-3 bottom-20 z-50 hidden flex-col gap-2.5 sm:flex sm:right-6 sm:bottom-24">
      {/* Scroll To Top Button */}
      <div className="relative flex items-center">
        {activeTooltip === "top" && (
          <div className="absolute right-14 whitespace-nowrap bg-zinc-950 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
            Cuộn lên đầu
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-950 rotate-45 border-r border-t border-zinc-800"></div>
          </div>
        )}
        <button
          onClick={scrollToTop}
          onMouseEnter={() => setActiveTooltip("top")}
          onMouseLeave={() => setActiveTooltip(null)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xl hover:shadow-orange-500/20 hover:border-orange-500/50 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Cuộn lên đầu trang"
        >
          <ChevronUp className="h-5 w-5 transition-transform duration-300 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Scroll To Bottom Button */}
      <div className="relative flex items-center">
        {activeTooltip === "bottom" && (
          <div className="absolute right-14 whitespace-nowrap bg-zinc-950 text-white text-[11px] font-extrabold px-3 py-1.5 rounded-xl shadow-xl border border-zinc-800 animate-in fade-in zoom-in-95 duration-150">
            Cuộn xuống cuối
            <div className="absolute right-[-4px] top-1/2 -translate-y-1/2 w-2 h-2 bg-zinc-950 rotate-45 border-r border-t border-zinc-800"></div>
          </div>
        )}
        <button
          onClick={scrollToBottom}
          onMouseEnter={() => setActiveTooltip("bottom")}
          onMouseLeave={() => setActiveTooltip(null)}
          className="group relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl border border-zinc-200/80 dark:border-zinc-800 text-zinc-800 dark:text-zinc-200 shadow-xl hover:shadow-orange-500/20 hover:border-orange-500/50 hover:bg-orange-600 hover:text-white dark:hover:bg-orange-600 dark:hover:text-white hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer"
          aria-label="Cuộn xuống cuối trang"
        >
          <ChevronDown className="h-5 w-5 transition-transform duration-300 group-hover:translate-y-0.5" />
        </button>
      </div>
    </div>
  );
}
