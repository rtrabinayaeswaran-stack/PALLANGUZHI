import { BookOpen, ChartNoAxesColumn, CircleHelp, Home, Info, Languages, Menu, Settings2, Volume2, VolumeX, X } from 'lucide-react';
import { type ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Lang, loadPrefs, savePrefs } from '@/lib/game';

const nav = [
  { href: '/', icon: Home, en: 'Courtyard', ta: 'முற்றம்' },
  { href: '/setup', icon: Settings2, en: 'New game', ta: 'புதிய ஆட்டம்' },
  { href: '/how-to-play', icon: BookOpen, en: 'How to play', ta: 'எப்படி விளையாடுவது' },
  { href: '/about', icon: Info, en: 'Our story', ta: 'நம் கதை' },
  { href: '/stats', icon: ChartNoAxesColumn, en: 'My keepsake', ta: 'என் பதிவு' },
];
export function AppShell({ children, lang, setLang, sound, setSound }: { children: ReactNode; lang: Lang; setLang: (v: Lang) => void; sound: boolean; setSound: (v: boolean) => void }) {
  const [open, setOpen] = useState(false); const [location] = useLocation();
  const text = (en: string, ta: string) => lang === 'ta' ? ta : en;
  const toggleLang = () => { const next = lang === 'en' ? 'ta' : 'en'; setLang(next); savePrefs({ lang: next, sound }); };
  const toggleSound = () => { setSound(!sound); savePrefs({ lang, sound: !sound }); };
  return <div className="grain shell-bg min-h-[100dvh]">
    <header className="sticky top-0 z-10 border-b border-[hsl(var(--border))]/70 bg-[hsl(var(--background))]/90 backdrop-blur-md">
      <div className="mx-auto flex h-[74px] max-w-7xl items-center justify-between px-5 lg:px-9">
        <Link href="/" className="flex items-center gap-3" data-testid="link-brand">
          <span className="relative flex h-11 w-11 items-center justify-center rounded-full border border-[#c48752] bg-[#f2d39c] text-[#7e3f25] shadow-sm"><span className="text-xl tamil">ப</span><span className="absolute inset-2 rounded-full border border-[#b36b3d]/50"/></span>
          <span><span className="display block text-xl font-semibold tracking-tight">Pazhakuzhi</span><span className="tamil block text-[11px] leading-3 text-[hsl(var(--muted-foreground))]">பழக்குழி · a game to keep</span></span>
        </Link>
        <nav className="hidden items-center gap-1 lg:flex">{nav.map(({ href, icon: Icon, en, ta }) => <Link key={href} href={href} data-testid={`link-nav-${en.toLowerCase().replaceAll(' ', '-')}`} className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm transition ${location === href ? 'bg-[#205c5a] text-[#fff6e6]' : 'text-[hsl(var(--muted-foreground))] hover:bg-[#ead1a5] hover:text-[#3d2417]'}`}><Icon size={16}/>{text(en, ta)}</Link>)}</nav>
        <div className="flex items-center gap-1.5">
          <button onClick={toggleSound} aria-label={sound ? 'Mute sound' : 'Turn sound on'} data-testid="button-toggle-sound" className="rounded-full p-2.5 text-[#6b4531] hover:bg-[#ead1a5]">{sound ? <Volume2 size={18}/> : <VolumeX size={18}/>}</button>
          <button onClick={toggleLang} data-testid="button-toggle-language" className="flex items-center gap-1 rounded-full border border-[#cda77b] px-3 py-2 text-xs font-semibold text-[#6b4531] hover:bg-[#ead1a5]"><Languages size={15}/><span>{lang === 'en' ? 'தமிழ்' : 'EN'}</span></button>
          <button onClick={() => setOpen(!open)} aria-label="Open navigation" data-testid="button-open-navigation" className="rounded-full p-2.5 lg:hidden">{open ? <X size={20}/> : <Menu size={20}/>}</button>
        </div>
      </div>
      {open && <nav className="border-t border-[#d7bb94] bg-[#f7e8ca] px-5 py-3 lg:hidden">{nav.map(({ href, icon: Icon, en, ta }) => <Link onClick={() => setOpen(false)} key={href} href={href} data-testid={`link-mobile-${en}`} className="flex items-center gap-3 border-b border-[#e2cda9] py-3 text-sm"><Icon size={17}/>{text(en, ta)}</Link>)}</nav>}
    </header>
    <main>{children}</main>
    <footer className="mx-auto max-w-7xl px-5 py-10 text-xs text-[hsl(var(--muted-foreground))] lg:px-9"><div className="flex flex-col justify-between gap-3 border-t border-[#d7bb94] pt-5 sm:flex-row"><span className="tamil">நம் பாரம்பரியம் – நம் விளையாட்டு</span><span>Made for slow afternoons, loud laughter, and one more round.</span></div></footer>
  </div>;
}
export function useLanguage() { return loadPrefs().lang; }