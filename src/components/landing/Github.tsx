'use client';

import { githubConfig } from '@/config/Github';
import { useTheme } from 'next-themes';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, {
  type ReactElement,
  cloneElement,
  useEffect,
  useState,
} from 'react';
import type { Activity } from 'react-activity-calendar';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import GithubIcon from '../svgs/Github';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';

const ActivityCalendar = dynamic(
  () => import('react-activity-calendar').then((mod) => mod.default),
  { ssr: false },
);

type ContributionItem = {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
};

type GitHubContributionResponse = {
  date: string;
  contributionCount: number;
  contributionLevel:
    | 'NONE'
    | 'FIRST_QUARTILE'
    | 'SECOND_QUARTILE'
    | 'THIRD_QUARTILE'
    | 'FOURTH_QUARTILE';
};

function filterLastYear(contributions: ContributionItem[]): ContributionItem[] {
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  return contributions.filter((item) => new Date(item.date) >= oneYearAgo);
}

function formatContributionLabel(date: string, count: number) {
  const formatted = new Date(`${date}T00:00:00`).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  if (count === 0) return `No contributions on ${formatted}`;

  const word = count === 1 ? 'contribution' : 'contributions';
  return `${count} ${word} on ${formatted}`;
}

function ContributionBlock({
  block,
  activity,
}: {
  block: ReactElement<{ style?: React.CSSProperties }>;
  activity: Activity;
}) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        {cloneElement(block, {
          style: {
            ...block.props.style,
            cursor: 'pointer',
          },
        })}
      </TooltipTrigger>
      <TooltipContent
        side="top"
        sideOffset={6}
        className="animate-in fade-in-0 zoom-in-95 border-0 bg-[#1f2328] px-2.5 py-1.5 text-[11px] font-normal text-white shadow-lg duration-150 [&_[data-slot=tooltip-content]>svg]:fill-[#1f2328]"
      >
        {formatContributionLabel(activity.date, activity.count)}
      </TooltipContent>
    </Tooltip>
  );
}

export default function Github() {
  const [contributions, setContributions] = useState<ContributionItem[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    async function fetchContributions() {
      try {
        const response = await fetch(
          `${githubConfig.apiUrl}/${githubConfig.username}.json`,
        );
        const data: { contributions?: unknown[] } = await response.json();

        if (data?.contributions && Array.isArray(data.contributions)) {
          const flattenedContributions = data.contributions.flat();
          const contributionLevelMap = {
            NONE: 0,
            FIRST_QUARTILE: 1,
            SECOND_QUARTILE: 2,
            THIRD_QUARTILE: 3,
            FOURTH_QUARTILE: 4,
          };

          const validContributions = flattenedContributions
            .filter(
              (item: unknown): item is GitHubContributionResponse =>
                typeof item === 'object' &&
                item !== null &&
                'date' in item &&
                'contributionCount' in item &&
                'contributionLevel' in item,
            )
            .map((item) => ({
              date: String(item.date),
              count: Number(item.contributionCount || 0),
              level: (contributionLevelMap[
                item.contributionLevel as keyof typeof contributionLevelMap
              ] || 0) as ContributionItem['level'],
            }));

          if (validContributions.length > 0) {
            const total = validContributions.reduce(
              (sum, item) => sum + item.count,
              0,
            );
            setTotalContributions(total);
            setContributions(filterLastYear(validContributions));
          } else {
            setHasError(true);
          }
        } else {
          setHasError(true);
        }
      } catch {
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchContributions();
  }, []);

  return (
    <Container className="mt-13">
      <FadeIn>
        {isLoading ? (
          <div className="text-muted py-8 text-sm">
            Loading contributions...
          </div>
        ) : hasError || contributions.length === 0 ? (
          <Link
            href={`https://github.com/${githubConfig.username}`}
            target="_blank"
            className="text-muted hover:text-primary inline-flex items-center gap-2 text-sm transition-colors"
          >
            <GithubIcon className="size-4" />
            View GitHub profile
          </Link>
        ) : (
          <TooltipProvider delayDuration={0}>
            <div className="overflow-x-auto">
              <ActivityCalendar
                data={contributions}
                blockSize={11}
                blockMargin={3}
                fontSize={12}
                colorScheme={theme === 'dark' ? 'dark' : 'light'}
                maxLevel={4}
                hideTotalCount={false}
                theme={githubConfig.theme}
                renderBlock={(block, activity) => (
                  <ContributionBlock
                    key={activity.date}
                    block={block}
                    activity={activity}
                  />
                )}
                labels={{
                  months: githubConfig.months,
                  weekdays: githubConfig.weekdays,
                  totalCount: githubConfig.totalCountLabel.replace(
                    '{{count}}',
                    String(totalContributions),
                  ),
                }}
              />
            </div>
          </TooltipProvider>
        )}
      </FadeIn>
    </Container>
  );
}
