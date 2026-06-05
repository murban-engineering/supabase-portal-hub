import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import Logo from "./Logo";
import BrandWordmark from "./BrandWordmark";

const Navigation = () => {
  const location = useLocation();
  const navRef = useRef<HTMLDivElement>(null);
  const [gliderStyle, setGliderStyle] = useState<React.CSSProperties>({});
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/portal", label: "Portal" },
    { path: "/contact", label: "Contact Us" },
  ];
  
  const activeIndex = navItems.findIndex(item => item.path === location.pathname);

  const updateGlider = () => {
    if (navRef.current && activeIndex >= 0) {
      const inner = navRef.current.querySelector('.glass-nav-inner') as HTMLElement;
      const buttons = navRef.current.querySelectorAll<HTMLAnchorElement>('.glass-nav-item');
      const activeBtn = buttons[activeIndex];
      if (activeBtn && inner) {
        const innerRect = inner.getBoundingClientRect();
        const btnRect = activeBtn.getBoundingClientRect();
        setGliderStyle({
          width: btnRect.width,
          transform: `translateX(${btnRect.left - innerRect.left - 4}px)`,
        });
      }
    }
  };

  useEffect(() => {
    updateGlider();
  }, [activeIndex]);

  useEffect(() => {
    window.addEventListener('resize', updateGlider);
    return () => window.removeEventListener('resize', updateGlider);
  }, [activeIndex]);
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-2 md:px-6 py-1 md:py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 px-3 md:px-0 py-1 md:py-0">
        <Link to="/" className="flex items-center gap-2 md:gap-3 min-w-0">
          <Logo />
          <BrandWordmark
            murbanClassName="text-[18px] md:text-2xl tracking-[0.02em]"
            engineeringClassName="text-[6px] md:text-[9px] tracking-[0.18em] md:tracking-[0.26em] mt-0.5"
          />
        </Link>
        
        <div ref={navRef}>
          <nav className="glass-nav-inner relative flex items-center gap-0 rounded-2xl px-1 py-1 overflow-hidden bg-secondary/60 backdrop-blur-md">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`glass-nav-item relative z-[2] px-4 md:px-7 py-2 md:py-2.5 rounded-2xl text-xs md:text-sm font-semibold tracking-wide text-center transition-colors duration-300 whitespace-nowrap ${
                  location.pathname === item.path ? 'text-white' : 'text-muted-foreground hover:text-white'
                }`}
              >
                {item.path === "/contact" ? (
                  <>
                    <span className="md:hidden leading-none text-center">
                      Contact<br />Us
                    </span>
                    <span className="hidden md:inline">{item.label}</span>
                  </>
                ) : (
                  item.label
                )}
              </Link>
            ))}
            {/* Glider */}
            <div
              className="absolute top-1 bottom-1 rounded-2xl z-[1] transition-all duration-500"
              style={{
                ...gliderStyle,
                background: 'hsl(var(--nav-active))',
                boxShadow: '0 0 12px rgba(180,180,180,0.2)',
                transitionTimingFunction: 'cubic-bezier(0.37, 1.95, 0.66, 0.56)',
              }}
            />
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navigation;
