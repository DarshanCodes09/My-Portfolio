import { siteConfig } from '@/config/Site';
import { spotifyConfig } from '@/config/Spotify';
import Image from 'next/image';

import Container from '../common/Container';
import FadeIn from '../common/FadeIn';
import BioText from './BioText';
import RotatingRoles from './RotatingRoles';
import SocialLinks from './SocialLinks';
import SpotifyNowPlaying from './SpotifyNowPlaying';

export default function Hero() {
  return (
    <Container id="about">
      <FadeIn>
        <div className="mb-7 flex items-center gap-4">
          <Image
            src={siteConfig.avatar}
            alt={siteConfig.name}
            width={64}
            height={64}
            className="h-15 w-15 shrink-0 rounded-xl border border-zinc-200 object-cover sm:h-16 sm:w-16 dark:border-zinc-800"
            priority
          />
          <div className="min-w-0 flex-1">
            <h1 className="text-primary text-2xl leading-tight font-semibold tracking-tight sm:text-3xl md:text-[2rem]">
              {siteConfig.name}
            </h1>
            <div className="mt-0.5">
              <RotatingRoles />
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.08}>
        <div className="mt-10 mb-6 flex flex-wrap items-start gap-x-6 gap-y-4 sm:gap-x-8">
          <div className="space-y-1">
            <div className="section-kicker">Location</div>
            <div className="text-primary flex items-center gap-2 text-[13.5px] font-medium sm:text-[15px]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-icon shrink-0"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {siteConfig.location}
            </div>
          </div>
          <div className="space-y-1">
            <div className="section-kicker">Email</div>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group text-primary flex items-center gap-2 text-[13.5px] font-medium transition-colors hover:text-zinc-700 sm:text-[15px] dark:hover:text-zinc-100"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-icon shrink-0"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              <span className="underline-offset-[2px] group-hover:underline">
                {siteConfig.email}
              </span>
            </a>
          </div>
          <div className="hidden space-y-1 sm:block">
            <div className="section-kicker">Pronouns</div>
            <div className="text-primary flex items-center gap-2 text-[13.5px] font-medium sm:text-[15px]">
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-icon shrink-0"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2" />
              </svg>
              {siteConfig.pronouns}
            </div>
          </div>
        </div>
      </FadeIn>

      <FadeIn delay={0.14}>
        <p className="text-secondary mb-8 text-[13.5px] leading-[1.85] font-[450] sm:text-[15px]">
          <BioText text={siteConfig.bio} />
        </p>
      </FadeIn>

      {spotifyConfig.enabled && (
        <FadeIn delay={0.2}>
          <SpotifyNowPlaying />
        </FadeIn>
      )}

      <FadeIn delay={0.26}>
        <SocialLinks />
      </FadeIn>
    </Container>
  );
}
