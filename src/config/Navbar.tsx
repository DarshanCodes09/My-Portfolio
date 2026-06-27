export interface NavItem {
  label: string;
  href: string;
}

export const navbarConfig = {
  navItems: [
    { label: 'Home', href: '/' },
    { label: 'Projects', href: '/projects' },
    { label: 'Blogs', href: '/blog' },
  ] as NavItem[],
};
