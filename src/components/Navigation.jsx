import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CalendarRange, Code, Rocket, Menu, X, ChevronDown,
  MapPin, MessageCircle, GraduationCap, Wrench, Tag, Bot,
  Trophy, Coins, CalendarClock, BookOpen, ArrowUpRight,
  Image as ImageIcon,
} from 'lucide-react';

const TOPMATE = 'https://topmate.io/sagarjethi';

// Top-level: kept to 3 high-traffic destinations.
const PRIMARY = [
  { to: '/events', label: 'Events', icon: CalendarRange },
  { to: '/accelerators', label: 'Accelerators', icon: Rocket },
];

// Discover dropdown — grouped for clarity.
// All links rendered in DOM so SEO crawlers see them; just visually collapsed.
const DISCOVER_GROUPS = [
  {
    label: 'Browse',
    items: [
      { to: '/map', label: 'Event map', icon: MapPin, desc: 'All venues on a Leaflet map' },
      { to: '/social', label: 'Social buzz', icon: MessageCircle, desc: 'X / LinkedIn posts and creators' },
      { to: '/cards', label: 'Shareable cards', icon: ImageIcon, desc: 'Weekly + monthly cards for X / LinkedIn / IG' },
    ],
  },
  {
    label: 'By topic',
    items: [
      { to: '/free-tech-events-mumbai', label: 'Free tech events', icon: Tag, desc: 'No ticket cost' },
      { to: '/ai-events-mumbai-2026', label: 'AI events 2026', icon: Bot, desc: 'GenAI · LLMs · agents' },
      { to: '/conferences-mumbai-2026', label: 'Tech conferences', icon: BookOpen, desc: 'GIDS · AWS · Rust India' },
      { to: '/web3-events-mumbai-2026', label: 'Web3 events', icon: Coins, desc: 'Blockchain · DeFi · NFT' },
      { to: '/tech-events-this-weekend-mumbai', label: 'This weekend', icon: CalendarClock, desc: 'Refreshes daily' },
      { to: '/college-fests-mumbai-2026', label: 'College fests', icon: GraduationCap, desc: 'IISc · RVCE · PES · Christ' },
    ],
  },
  {
    label: 'About',
    items: [
      { to: '/about', label: 'About the curator', icon: BookOpen, desc: 'Who runs this & why' },
      { to: '/editorial', label: 'Editorial standards', icon: BookOpen, desc: 'Sourcing, verification, corrections' },
    ],
  },
];

const ALL_DISCOVER_ROUTES = DISCOVER_GROUPS.flatMap((g) => g.items.map((i) => i.to));

export default function Navigation() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [discoverOpen, setDiscoverOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setDiscoverOpen(false);
    setMobileOpen(false);
  }, [location.pathname]);

  // Click-outside / escape
  useEffect(() => {
    if (!discoverOpen) return;
    const onClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDiscoverOpen(false);
    };
    const onEsc = (e) => { if (e.key === 'Escape') setDiscoverOpen(false); };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onEsc);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onEsc);
    };
  }, [discoverOpen]);

  const onDiscoverEnter = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setDiscoverOpen(true);
  };
  const onDiscoverLeave = () => {
    closeTimer.current = setTimeout(() => setDiscoverOpen(false), 150);
  };

  const isPrimaryActive = (to) => {
    if (to === '/events') return location.pathname.startsWith('/events');
    if (to === '/hackathons') return location.pathname === '/hackathons' || location.pathname.startsWith('/hackathons/');
    if (to === '/accelerators') return location.pathname.startsWith('/accelerators');
    return location.pathname === to;
  };
  const discoverActive = ALL_DISCOVER_ROUTES.includes(location.pathname);

  return (
    <nav
      aria-label="Primary"
      className={`sticky top-0 z-50 transition-all duration-200 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200'
          : 'bg-white/80 backdrop-blur-sm border-b border-slate-200/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" aria-label="Mumbai Tech Events home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 text-white">
              <CalendarRange className="w-5 h-5" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-base font-extrabold tracking-tight text-slate-900">Mumbai Tech Events</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-400">June 2026</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {PRIMARY.map(({ to, label, icon: Icon }) => {
              const active = isPrimaryActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors font-medium',
                    active ? 'text-primary-700 bg-primary-50' : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            {/* Discover dropdown */}
            <div
              ref={dropdownRef}
              className="relative"
              onMouseEnter={onDiscoverEnter}
              onMouseLeave={onDiscoverLeave}
            >
              <button
                type="button"
                aria-haspopup="true"
                aria-expanded={discoverOpen}
                onClick={() => setDiscoverOpen((v) => !v)}
                className={[
                  'inline-flex items-center gap-1.5 px-3 py-2 text-sm rounded-md transition-colors font-medium',
                  discoverActive || discoverOpen
                    ? 'text-primary-700 bg-primary-50'
                    : 'text-slate-600 hover:text-primary-700 hover:bg-primary-50',
                ].join(' ')}
              >
                Discover
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${discoverOpen ? 'rotate-180' : ''}`} />
              </button>

              {discoverOpen && (
                <div
                  role="menu"
                  className="absolute right-0 top-full mt-1 w-[480px] rounded-2xl border border-slate-200 bg-white shadow-xl ring-1 ring-black/5 overflow-hidden"
                >
                  <div className="grid grid-cols-2 divide-x divide-slate-100">
                    {DISCOVER_GROUPS.map((group, gi) => (
                      <div key={group.label} className={`p-3 ${gi === 0 ? 'bg-slate-50/40' : ''}`}>
                        <div className="px-2 pb-1.5 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                          {group.label}
                        </div>
                        <ul className="space-y-0.5">
                          {group.items.map((item) => {
                            const Icon = item.icon;
                            const active = location.pathname === item.to;
                            return (
                              <li key={item.to}>
                                <Link
                                  to={item.to}
                                  role="menuitem"
                                  className={[
                                    'flex items-start gap-2.5 rounded-lg px-2 py-2 transition-colors',
                                    active ? 'bg-primary-50' : 'hover:bg-slate-100',
                                  ].join(' ')}
                                >
                                  <Icon className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                                  <span className="min-w-0 flex-1">
                                    <span className={`block text-sm font-semibold ${active ? 'text-primary-700' : 'text-slate-900'}`}>
                                      {item.label}
                                    </span>
                                    {item.desc && (
                                      <span className="block text-[11px] text-slate-500 mt-0.5 leading-snug">
                                        {item.desc}
                                      </span>
                                    )}
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Single primary action — Book 1:1 with curator */}
            <a
              href={TOPMATE}
              target="_blank"
              rel="noopener noreferrer"
              data-source="navbar"
              className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-1.5 transition-all hover:shadow-md hover:-translate-y-px"
            >
              Book 1:1
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Mobile burger */}
          <button
            type="button"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 text-slate-600"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu — full list, accordion-style for Discover groups */}
        {mobileOpen && (
          <div className="md:hidden pb-3 pt-1 space-y-0.5 border-t border-slate-100">
            <a
              href={TOPMATE}
              target="_blank"
              rel="noopener noreferrer"
              data-source="navbar-mobile"
              className="flex items-center justify-center gap-1.5 mx-1 my-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-sm font-semibold px-4 py-2"
            >
              Book 1:1
              <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
            {PRIMARY.map(({ to, label, icon: Icon }) => {
              const active = isPrimaryActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={[
                    'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                    active ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-slate-700 hover:text-primary-700 hover:bg-primary-50',
                  ].join(' ')}
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              );
            })}

            {DISCOVER_GROUPS.map((group) => (
              <div key={group.label} className="pt-2">
                <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-400">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const active = location.pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={[
                        'flex items-center gap-2 px-3 py-2 text-sm rounded-md transition-colors',
                        active ? 'text-primary-700 bg-primary-50 font-semibold' : 'text-slate-700 hover:bg-slate-100',
                      ].join(' ')}
                    >
                      <Icon className="w-4 h-4 text-slate-500" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
