import Gifting from '@/Gifting/Gifting.tsx';
import PaleRaven from '@/PaleRaven/PaleRaven.tsx';
import { Link, Tabs, cx, text } from '@/design.tsx';
import { useStoredState } from '@/useStoredState.ts';

type Screen = 'gifting' | 'raven';

const SCREEN_OPTIONS = [
  { value: 'gifting', label: 'Gifting' },
  { value: 'raven', label: 'Pale Raven' },
] as const;

const App = () => {
  const [screen, setScreen] = useStoredState<Screen>('screenState', 'gifting', (v) =>
    ['gifting', 'raven'].includes(v as string),
  );
  const [showNames, setShowNames] = useStoredState('nameState', true);

  return (
    <div className={'app-bg'}>
      <div className={'mx-auto flex h-full min-h-screen max-w-[1280px] flex-col bg-amber-50 bg-opacity-85 p-4 md:p-5'}>
        <header className={'mb-5'}>
          <Tabs options={SCREEN_OPTIONS} value={screen} onChange={setScreen} />
        </header>

        <main>
          {screen === 'gifting' && <Gifting showName={showNames} setShowName={setShowNames} />}
          {screen === 'raven' && <PaleRaven showName={showNames} setShowName={setShowNames} />}
        </main>

        <footer className={cx(text.small, 'ml-auto mt-auto pt-10 text-right text-amber-900')}>
          Portraits &amp; recruitment info courtesy of{' '}
          <Link href={'https://fireemblemwiki.org/wiki/List_of_characters_in_Fire_Emblem:_Fortune%27s_Weave'}>
            Fire Emblem Wiki
          </Link>
          . Gift data from <Link href={'https://game8.co/games/Fire-Emblem-Fortunes-Weave/archives/623690'}>Game8</Link>.
          Pale Raven answers compiled from{' '}
          <Link href={'https://raiderking.com/fire-emblem-fortunes-weave-feed-pale-raven-all-characters-perfect-bird-time/'}>
            RaiderKing
          </Link>
          ,{' '}
          <Link href={'https://www.keengamer.com/articles/guides/fire-emblem-fortunes-weave-perfect-bird-time-answers-for-every-character/'}>
            KeenGamer
          </Link>{' '}
          &amp;{' '}
          <Link href={'https://gamerant.com/fire-emblem-fortunes-weave-feed-the-pale-raven-correct-answers/'}>
            Game Rant
          </Link>
          .
        </footer>
      </div>
    </div>
  );
};

export default App;
