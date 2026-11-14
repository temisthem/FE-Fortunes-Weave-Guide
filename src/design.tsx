/**
 * Design system primitives. Every screen builds on these, so spacing, type,
 * colour and interaction states stay consistent. Change a token here and it
 * updates everywhere.
 */
import { type ReactNode, useEffect, useRef, useState } from 'react';

// ---- tokens --------------------------------------------------------------

export const cx = (...classes: (string | false | null | undefined)[]) => classes.filter(Boolean).join(' ');

/** Type scale: the only text styles the app uses. */
export const text = {
  title: 'text-lg font-bold text-amber-950 md:text-2xl',
  heading: 'text-lg font-bold text-amber-950 md:text-xl',
  section: 'text-sm font-bold uppercase tracking-wide text-amber-900 md:text-base',
  label: 'text-xs font-bold uppercase tracking-wide text-amber-900 md:text-sm',
  body: 'text-sm text-amber-950 md:text-base',
  small: 'text-xs text-amber-950 md:text-sm',
  caption: 'text-[10px] leading-tight text-amber-950 md:text-xs',
};

/** Shared interaction states for anything selectable (portraits, tiles). */
export const state = {
  selected: 'ring-2 ring-amber-600 ring-offset-2 ring-offset-amber-50',
  unselected: 'filter grayscale-[50%] opacity-90 hover:grayscale-0 hover:opacity-100',
  /** Units that are guest-only or can't be recruited on the selected path (full grayscale). */
  dimmed: 'filter grayscale',
  focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-600',
};

export const radius = 'rounded-md';
export const border = 'border-2 border-amber-900';

// ---- buttons -------------------------------------------------------------

type ButtonVariant = 'solid' | 'toggle';
type ButtonSize = 'md' | 'sm';

const buttonSize: Record<ButtonSize, string> = {
  md: 'px-3 py-1 text-sm md:text-base',
  sm: 'px-2 py-0.5 text-xs md:text-sm',
};

/**
 * `solid` is for actions. `toggle` is for a choice in a group: it looks
 * solid when active and muted when not.
 */
export const Button = ({
  children,
  onClick,
  variant = 'solid',
  size = 'md',
  active = false,
}: {
  children: ReactNode;
  onClick: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
}) => {
  const filled = variant === 'solid' || active;
  return (
    <button
      type={'button'}
      onClick={onClick}
      aria-pressed={variant === 'toggle' ? active : undefined}
      className={cx(
        radius,
        buttonSize[size],
        state.focus,
        'whitespace-nowrap font-semibold transition-colors',
        filled ? 'bg-amber-400 text-amber-950 hover:bg-amber-500' : 'bg-amber-200/70 text-amber-900 hover:bg-amber-300',
      )}
    >
      {children}
    </button>
  );
};

/** A labelled group of controls. Every toolbar item uses this. */
export const ControlGroup = ({ label, children }: { label?: string; children: ReactNode }) => (
  <div className={'flex flex-wrap items-center gap-2'}>
    {label && <span className={text.label}>{label}</span>}
    <div className={'flex flex-wrap items-center gap-1'}>{children}</div>
  </div>
);

/** Single-choice group of toggle buttons. */
export const ToggleGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
}: {
  label?: string;
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  size?: ButtonSize;
}) => (
  <ControlGroup label={label}>
    {options.map((o) => (
      <Button key={o.value} variant={'toggle'} size={size} active={o.value === value} onClick={() => onChange(o.value)}>
        {o.label}
      </Button>
    ))}
  </ControlGroup>
);

/**
 * Top-level navigation between the app's screens. Styled as underlined tabs so
 * it reads differently from the in-screen toggle buttons. `aside` sits at the
 * right end of the bar (e.g. the settings menu).
 */
export const Tabs = <T extends string>({
  options,
  value,
  onChange,
  aside,
}: {
  options: readonly { value: T; label: ReactNode }[];
  value: T;
  onChange: (v: T) => void;
  aside?: ReactNode;
}) => (
  <div className={'flex items-center gap-2'}>
    <nav className={'flex flex-1 border-b-2 border-amber-900/25'} role={'tablist'}>
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            type={'button'}
            role={'tab'}
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={cx(
              '-mb-0.5 flex-1 border-b-[3px] px-3 py-1 text-sm font-bold transition-colors md:py-1.5 md:text-base',
              'rounded-t-md focus-visible:bg-amber-200/60 focus-visible:outline-none',
              active
                ? 'border-amber-600 text-amber-950'
                : 'border-transparent text-amber-900/60 hover:border-amber-300 hover:text-amber-900',
            )}
          >
            {o.label}
          </button>
        );
      })}
    </nav>
    {/* Outside the underlined bar so it doesn't read as another tab. */}
    {aside && <div className={'shrink-0'}>{aside}</div>}
  </div>
);

/** One on/off row in a settings menu. */
export type SettingItem = { label: string; checked: boolean; onChange: (v: boolean) => void };

/** Gear button that opens a small dropdown of on/off settings. Closes on outside click or Escape. */
export const SettingsMenu = ({ items }: { items: SettingItem[] }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className={'relative'}>
      <button
        type={'button'}
        aria-label={'Settings'}
        title={'Settings'}
        aria-expanded={open}
        aria-haspopup={'true'}
        onClick={() => setOpen(!open)}
        className={cx(
          radius,
          state.focus,
          'flex h-8 w-8 items-center justify-center text-amber-900 transition-colors hover:bg-amber-200/70',
          open && 'bg-amber-200/70',
        )}
      >
        <svg
          viewBox={'0 0 24 24'}
          className={'h-5 w-5'}
          fill={'none'}
          stroke={'currentColor'}
          strokeWidth={2}
          aria-hidden
        >
          <path
            strokeLinecap={'round'}
            strokeLinejoin={'round'}
            d={
              'M10.3 4.3c.4-1.7 2.9-1.7 3.4 0a1.7 1.7 0 0 0 2.6 1.1c1.5-.9 3.3.8 2.4 2.4a1.7 1.7 0 0 0 1 2.5c1.8.5 1.8 3 0 3.4a1.7 1.7 0 0 0-1 2.6c.9 1.5-.9 3.3-2.4 2.4a1.7 1.7 0 0 0-2.6 1c-.4 1.8-3 1.8-3.4 0a1.7 1.7 0 0 0-2.5-1c-1.6.9-3.3-.9-2.4-2.4a1.7 1.7 0 0 0-1.1-2.6c-1.7-.4-1.7-2.9 0-3.4a1.7 1.7 0 0 0 1.1-2.5c-.9-1.6.8-3.3 2.4-2.4a1.7 1.7 0 0 0 2.5-1.1z'
            }
          />
          <circle cx={12} cy={12} r={3} />
        </svg>
      </button>
      {open && (
        <div
          className={cx(
            radius,
            'absolute right-0 top-full z-20 mt-1 w-60 border-2 border-amber-900/40 bg-amber-50 p-1.5 shadow-lg',
          )}
        >
          {items.map((i) => (
            <label
              key={i.label}
              className={cx(
                text.small,
                'flex cursor-pointer items-center justify-between gap-3 rounded px-2 py-1.5 hover:bg-amber-100',
              )}
            >
              {i.label}
              <input
                type={'checkbox'}
                className={'h-4 w-4 cursor-pointer accent-amber-600'}
                checked={i.checked}
                onChange={(e) => i.onChange(e.target.checked)}
              />
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

/** Row of control groups at the top of a screen. */
export const Toolbar = ({ children }: { children: ReactNode }) => (
  <div className={'flex flex-wrap items-center justify-center gap-x-8 gap-y-3'}>{children}</div>
);

// ---- inputs --------------------------------------------------------------

export const Input = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) => (
  <input
    className={cx(
      radius,
      border,
      text.small,
      'w-44 bg-amber-50 px-2 py-1 placeholder:text-amber-900/50 sm:w-56',
      state.focus,
    )}
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
  />
);

// ---- layout & text -------------------------------------------------------

/** A titled block of content. Sections are spaced the same everywhere. */
export const Section = ({ title, children }: { title?: ReactNode; children: ReactNode }) => (
  <section className={'mt-6'}>
    {title && <h3 className={cx(text.section, 'mb-2 text-center')}>{title}</h3>}
    {children}
  </section>
);

/** Portrait + name header for whatever is selected (character or gift). */
export const DetailHeader = ({
  image,
  title,
  children,
  aside,
}: {
  image?: string;
  title: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) => (
  <div className={'mx-auto flex max-w-4xl flex-wrap items-center gap-3'}>
    {image && <img className={cx(radius, border, 'w-16 md:w-20')} src={image} alt={''} />}
    <div className={'min-w-0 flex-1'}>
      <h2 className={text.heading}>{title}</h2>
      {children && <div className={cx(text.small, 'space-y-0.5')}>{children}</div>}
    </div>
    {aside}
  </div>
);

/** "Label: value" line used in detail headers. */
export const Fact = ({ label, children }: { label: string; children: ReactNode }) => (
  <p>
    <span className={'font-bold'}>{label}:</span> {children}
  </p>
);

export const EmptyState = ({ children }: { children: ReactNode }) => (
  <p className={cx(text.heading, 'mx-auto mt-8 w-fit text-center')}>{children}</p>
);

/** Inset, scrollable surface (for long pickers). */
export const Panel = ({ children }: { children: ReactNode }) => (
  <div className={cx(radius, 'mt-3 max-h-[45vh] overflow-y-auto border-2 border-amber-900/40 bg-amber-100/40 p-2')}>
    {children}
  </div>
);

// ---- tables --------------------------------------------------------------

/** Soft inner dividers; the rounded outer border comes from the Table wrapper. Tighter on phones. */
const cellBase = 'border-b border-r border-amber-900/20 px-1.5 py-1.5 align-middle last:border-r-0 sm:px-3 sm:py-2';

/**
 * Rounded card around a table. Uses separate borders so the corners can be
 * rounded, alternates row shading, and drops the divider under the last row.
 */
export const Table = ({ children }: { children: ReactNode }) => (
  <div
    className={cx(
      radius,
      'mx-auto w-full max-w-4xl overflow-hidden border-2 border-amber-900/70 bg-amber-50/80 shadow-sm',
    )}
  >
    <table
      className={cx(
        text.small,
        'w-full table-fixed border-separate border-spacing-0',
        '[&_tbody_tr:last-child_td]:border-b-0',
        '[&_tbody_tr:nth-child(even)]:bg-amber-100/60',
        '[&_tbody_tr]:transition-colors [&_tbody_tr:hover]:bg-amber-200/50',
      )}
    >
      {children}
    </table>
  </div>
);

/**
 * Header cell. Labels wrap instead of overflowing narrow columns. Set the
 * width with Tailwind classes via `className` so it can change by breakpoint.
 */
export const Th = ({ children, className }: { children: ReactNode; className?: string }) => (
  <th
    className={cx(
      cellBase,
      'border-b-2 border-b-amber-900/40 bg-amber-200 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-amber-900 [overflow-wrap:anywhere] md:text-sm',
      className,
    )}
  >
    {children}
  </th>
);

type TdTone = 'default' | 'center' | 'strong' | 'muted';
const tdTone: Record<TdTone, string> = {
  default: '',
  center: 'text-center font-semibold',
  strong: 'font-semibold',
  muted: 'text-amber-900',
};

export const Td = ({
  children,
  tone = 'default',
  className,
}: {
  children: ReactNode;
  tone?: TdTone;
  className?: string;
}) => <td className={cx(cellBase, tdTone[tone], className)}>{children}</td>;

// ---- links ---------------------------------------------------------------

export const Link = ({ href, children }: { href: string; children: ReactNode }) => (
  <a className={'text-blue-700 underline-offset-2 hover:underline'} href={href} target={'_blank'} rel={'noreferrer'}>
    {children}
  </a>
);
