/*
 * GitHub Contribution Configuration
 *
 * This file contains the configuration for the GitHub contribution graph.
 * Update the username to match your GitHub profile.
 */

export const githubConfig = {
  username: 'DarshanCodes09',
  apiUrl: 'https://github-contributions-api.deno.dev',

  // Display settings
  title: '',
  subtitle: '',

  // Chart settings
  blockSize: 11,
  blockMargin: 3,
  fontSize: 12,
  maxLevel: 4,

  // Month labels
  months: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ],

  // Weekday labels (empty for weekends, M for Monday, etc.)
  weekdays: ['', 'M', '', 'W', '', 'F', ''],

  // Total count label template
  totalCountLabel: '{{count}} Contributions · 2025–26',

  // Monochrome theme matching siddz.com reference
  theme: {
    dark: [
      'rgb(22, 22, 24)',
      'rgb(48, 48, 52)',
      'rgb(88, 88, 94)',
      'rgb(140, 140, 148)',
      'rgb(220, 220, 226)',
    ],
    light: [
      'rgb(235, 237, 240)',
      'rgb(210, 212, 216)',
      'rgb(170, 172, 178)',
      'rgb(120, 122, 128)',
      'rgb(50, 52, 58)',
    ],
  },

  // Error state configuration
  errorState: {
    title: 'Unable to load GitHub contributions',
    description: 'Check out my profile directly for the latest activity',
    buttonText: 'View on GitHub',
  },

  // Loading state configuration
  loadingState: {
    title: 'Loading contributions...',
    description: 'Fetching your GitHub activity data',
  },
};
