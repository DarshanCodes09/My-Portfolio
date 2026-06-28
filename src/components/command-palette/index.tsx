'use client';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '@/components/ui/command';
import { siteConfig } from '@/config/Site';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toast } from 'sonner';

export type CommandItemDef = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  shortcut?: string[];
  action?: () => void;
};

export type CommandGroupDef = {
  heading: string;
  items: CommandItemDef[];
};

type CommandPaletteContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openPalette: () => void;
  closePalette: () => void;
};

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(
  null,
);

export function useCommandPalette() {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx) {
    throw new Error(
      'useCommandPalette must be used within CommandPaletteProvider',
    );
  }
  return ctx;
}

export function CommandPaletteProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  const value = useMemo(
    () => ({
      open,
      setOpen,
      openPalette: () => setOpen(true),
      closePalette: () => setOpen(false),
    }),
    [open],
  );

  return (
    <CommandPaletteContext.Provider value={value}>
      {children}
    </CommandPaletteContext.Provider>
  );
}

function useDefaultCommandGroups(): CommandGroupDef[] {
  const router = useRouter();
  const { setTheme, resolvedTheme } = useTheme();

  return useMemo(
    () => [
      {
        heading: 'Navigation',
        items: [
          {
            id: 'home',
            label: 'Go to Home',
            shortcut: ['G', 'H'],
            action: () => router.push('/'),
          },
          {
            id: 'projects',
            label: 'View Projects',
            shortcut: ['G', 'P'],
            action: () => router.push('/projects'),
          },
          {
            id: 'blog',
            label: 'Read Blog',
            shortcut: ['G', 'B'],
            action: () => router.push('/blog'),
          },
          {
            id: 'about',
            label: 'About Me',
            shortcut: ['G', 'A'],
            action: () => router.push('/#about'),
          },
          {
            id: 'contact',
            label: 'Contact Page',
            action: () => router.push('/#contact'),
          },
        ],
      },
      {
        heading: 'Actions',
        items: [
          {
            id: 'theme',
            label: 'Toggle Dark Mode',
            shortcut: ['⌘', 'D'],
            action: () => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark'),
          },
          {
            id: 'copy',
            label: 'Copy Current URL',
            shortcut: ['⌘', 'C'],
            action: async () => {
              await navigator.clipboard.writeText(window.location.href);
              toast.success('URL copied to clipboard');
            },
          },
          {
            id: 'share',
            label: 'Share This Page',
            action: async () => {
              if (navigator.share) {
                await navigator.share({
                  title: siteConfig.name,
                  url: window.location.href,
                });
              } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
              }
            },
          },
        ],
      },
      {
        heading: 'Social',
        items: [
          {
            id: 'github',
            label: 'GitHub Profile',
            action: () => window.open(siteConfig.social.github, '_blank'),
          },
          {
            id: 'twitter',
            label: 'Twitter / X',
            action: () => window.open(siteConfig.social.twitter, '_blank'),
          },
          {
            id: 'linkedin',
            label: 'LinkedIn',
            action: () => window.open(siteConfig.social.linkedin, '_blank'),
          },
          {
            id: 'email',
            label: 'Send Email',
            action: () => {
              window.location.href = `mailto:${siteConfig.email}`;
            },
          },
        ],
      },
    ],
    [router, resolvedTheme, setTheme],
  );
}

export function CommandPalette({
  groups,
  placeholder = 'Type a command or search...',
}: {
  groups?: CommandGroupDef[];
  placeholder?: string;
}) {
  const { open, setOpen } = useCommandPalette();
  const defaultGroups = useDefaultCommandGroups();
  const commandGroups = groups ?? defaultGroups;

  const runCommand = useCallback(
    (item: CommandItemDef) => {
      setOpen(false);
      item.action?.();
    },
    [setOpen],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen(!open);
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open, setOpen]);

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder={placeholder} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        {commandGroups.map((group) => (
          <CommandGroup key={group.heading} heading={group.heading}>
            {group.items.map((item) => (
              <CommandItem
                key={item.id}
                value={item.label}
                onSelect={() => runCommand(item)}
              >
                {item.icon && (
                  <span className="text-muted-foreground mr-2 flex size-4 items-center justify-center">
                    {item.icon}
                  </span>
                )}
                <span>{item.label}</span>
                {item.shortcut && (
                  <CommandShortcut>{item.shortcut.join(' ')}</CommandShortcut>
                )}
              </CommandItem>
            ))}
          </CommandGroup>
        ))}
      </CommandList>
    </CommandDialog>
  );
}

function SearchIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function CommandPaletteMobileSearchTrigger() {
  const { openPalette } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={openPalette}
      className="text-muted hover:text-primary flex size-9 items-center justify-center rounded-md border border-zinc-200 transition-colors sm:hidden dark:border-zinc-800"
      aria-label="Open search"
    >
      <SearchIcon size={16} />
    </button>
  );
}

export function CommandPaletteSearchTrigger() {
  const { openPalette } = useCommandPalette();

  return (
    <button
      type="button"
      onClick={openPalette}
      className="text-muted hover:text-primary hidden items-center gap-2 rounded-md border border-zinc-200 px-3 py-1.5 text-sm transition-colors sm:flex dark:border-zinc-800"
      aria-label="Open command palette"
    >
      <SearchIcon />
      <span>Search</span>
      <kbd className="bg-muted pointer-events-none rounded px-1.5 py-0.5 text-[10px] font-medium">
        Ctrl K
      </kbd>
    </button>
  );
}
