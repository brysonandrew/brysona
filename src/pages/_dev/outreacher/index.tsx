import type { FC } from 'react';
import { useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import { withProviders } from '@shell/providers/withProviders';

import { OutreacherToast } from '@pages/_dev/outreacher/toast';
import { BusinessSearchPanel } from '@pages/_dev/outreacher/business-search-panel';
import { BusinessSearchResults } from '@pages/_dev/outreacher/business-search-results';
import { TimezoneTimeline } from '@pages/_dev/outreacher/timezone-timeline';
import { EmailPreviewSidebar } from '@pages/_dev/outreacher/email-preview-sidebar';
import { UrlForm } from '@pages/_dev/outreacher/url-form';
import { OUTREACH_COUNTRIES } from '@pages/_dev/outreacher/timezone-timeline/constants';
import { TimezoneTimelineSearchResults } from '@pages/_dev/outreacher/timezone-timeline/search/results';
import type { TSearchTown } from '@pages/_dev/outreacher/timezone-timeline/types';
import { AnimatedTitle } from '@pages/_dev/outreacher/animated-title';
import { useGoogleMapsLoader } from '@pages/_dev/outreacher/google-maps-loader';
import {
  OutreacherProvider,
  useOutreacher,
} from './context';
import styled from '@emotion/styled';

const Root = styled.div`
  .pac-container {
    z-index: 99999 !important;
  }
`;

const OutreacherContent: FC = () => {
  const {
    businessFinderLocation,
    setBusinessFinderLocation,
    businessGenerateButtonProps,
    businessSearchResults,
    timezoneGenerateButtonProps,
    townSearchResults,
    setUrl,
  } = useOutreacher();

  const isLoaded = useGoogleMapsLoader();
  const townResultsRef = useRef<HTMLElement>(null);
  const businessResultsRef = useRef<HTMLElement>(null);
  const businessSearchPanelRef = useRef<HTMLDivElement>(null);

  if (!isLoaded) return null;

  return (
    <Root className="min-h-screen w-full bg-gradient-to-br from-black via-dark to-black text-white-8">
      {/* Soft radial accents using primary / accent */}
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,_rgba(45,212,191,0.18),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(113,174,225,0.22),_transparent_55%)]" />
      <div className="column-stretch gap-8 px-4 py-10 md:px-6 lg:px-8">
        <AnimatedTitle />

        {/* Timezone → Town finder */}
        <div className="relative z-10 flex items-start justify-center">
          <div className="flex items-start justify-center max-w-6xl mx-auto w-full">
            <div className="w-full flex flex-col">
              <TimezoneTimeline />

              {timezoneGenerateButtonProps && (
                <>
                  <div className="border-t border-white-04" />
                  <section
                    ref={townResultsRef}
                    className="flex flex-col gap-4 w-full rounded-b-2xl border-b border-l border-r border-white-02 bg-dark-07 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-4 md:p-6"
                  >
                    {townSearchResults && (
                      <TimezoneTimelineSearchResults
                        towns={townSearchResults.towns}
                        isLoading={
                          townSearchResults.isLoading
                        }
                        statusMessage={
                          townSearchResults.statusMessage
                        }
                        onSelectTown={(
                          town: TSearchTown,
                        ) => {
                          const countryEntry =
                            OUTREACH_COUNTRIES.find(
                              (c) =>
                                c.city === town.baseCity,
                            );
                          const country =
                            countryEntry?.country || '';

                          const location = `${town.name}, ${town.baseCity}${
                            country ? `, ${country}` : ''
                          }`;
                          setBusinessFinderLocation(
                            location,
                          );
                          
                          // Scroll to business search panel
                          setTimeout(() => {
                            businessSearchPanelRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                      />
                    )}

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          timezoneGenerateButtonProps.handleGenerate();
                          setTimeout(() => {
                            townResultsRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-08 text-black text-sm font-semibold transition-all shadow-[0_0_18px_rgba(56,189,248,0.55)] hover:shadow-[0_0_26px_rgba(56,189,248,0.8)] disabled:opacity-60 disabled:shadow-none"
                        disabled={
                          timezoneGenerateButtonProps.isLoading ||
                          timezoneGenerateButtonProps.disabled
                        }
                      >
                        {timezoneGenerateButtonProps.isLoading
                          ? 'Searching…'
                          : 'Find towns'}
                      </button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Business finder */}
        <div className="relative z-10 flex items-start justify-center">
          <div className="flex items-start justify-center max-w-6xl mx-auto w-full gap-8">
            <div ref={businessSearchPanelRef} className="w-full flex flex-col">
              <BusinessSearchPanel />

              {businessGenerateButtonProps && (
                <>
                  <div className="border-t border-white-04" />
                  <section
                    ref={businessResultsRef}
                    className="flex flex-col gap-4 w-full rounded-b-2xl border-b border-l border-r border-white-02 bg-dark-07 shadow-[0_18px_60px_rgba(0,0,0,0.7)] backdrop-blur-2xl p-4 md:p-6"
                  >
                    {businessSearchResults && (
                      <BusinessSearchResults
                        businesses={
                          businessSearchResults.businesses
                        }
                        isLoading={
                          businessSearchResults.isLoading
                        }
                        statusMessage={
                          businessSearchResults.statusMessage
                        }
                      />
                    )}

                    <div className="flex justify-center">
                      <button
                        type="button"
                        onClick={() => {
                          businessGenerateButtonProps.handleGenerate();
                          setTimeout(() => {
                            businessResultsRef.current?.scrollIntoView({
                              behavior: 'smooth',
                              block: 'start',
                            });
                          }, 100);
                        }}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-08 text-black text-sm font-semibold transition-all shadow-[0_0_18px_rgba(56,189,248,0.55)] hover:shadow-[0_0_26px_rgba(56,189,248,0.8)] disabled:opacity-60 disabled:shadow-none"
                        disabled={
                          businessGenerateButtonProps.isLoading ||
                          businessGenerateButtonProps.disabled
                        }
                      >
                        {businessGenerateButtonProps.isLoading
                          ? 'Searching…'
                          : 'Find businesses'}
                      </button>
                    </div>
                  </section>
                </>
              )}
            </div>
          </div>
        </div>

        {/* URL → Email preview */}
        <div className="relative z-10 flex items-start justify-center">
          <div className="flex items-start justify-center max-w-6xl mx-auto w-full gap-8 lg:grid lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.4fr)]">
            <UrlForm />
            <EmailPreviewSidebar />
          </div>
        </div>
      </div>

      <AnimatePresence>
        <OutreacherToastWrapper />
      </AnimatePresence>
    </Root>
  );
};

const OutreacherToastWrapper: FC = () => {
  const { toast } = useOutreacher();
  return toast ? <OutreacherToast toast={toast} /> : null;
};

export const Outreacher: FC = withProviders(() => {
  return (
    <OutreacherProvider>
      <OutreacherContent />
    </OutreacherProvider>
  );
});
