import { type ReactNode, useEffect, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import { AppShell } from '@/components/AppShell';
import { loadPrefs, Lang } from '@/lib/game';
import Home from '@/pages/Home';
import Setup from '@/pages/Setup';
import Play from '@/pages/Play';
import HowToPlay, { About, Stats } from '@/pages/InfoPages';

const queryClient = new QueryClient();
function RoutedErrorBoundary({ children }: { children: ReactNode }) { const [location] = useLocation(); return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>; }
function Router() {
  const initial = loadPrefs(); const [lang, setLang] = useState<Lang>(initial.lang); const [sound, setSound] = useState(initial.sound);
  useEffect(() => { document.documentElement.lang = lang === 'ta' ? 'ta' : 'en'; }, [lang]);
  return <AppShell lang={lang} setLang={setLang} sound={sound} setSound={setSound}><RoutedErrorBoundary><Switch>
    <Route path="/" component={() => <Home lang={lang} />} />
    <Route path="/setup" component={() => <Setup lang={lang} />} />
    <Route path="/play" component={() => <Play lang={lang} sound={sound} />} />
    <Route path="/how-to-play" component={() => <HowToPlay lang={lang} />} />
    <Route path="/about" component={() => <About lang={lang} />} />
    <Route path="/stats" component={() => <Stats lang={lang} />} />
    <Route component={NotFound} />
  </Switch></RoutedErrorBoundary></AppShell>;
}
function App() { return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><Router /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>; }
export default App;
