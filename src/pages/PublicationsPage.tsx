import React from 'react';

export const PublicationsPage: React.FC = () => (
  <div className="relative min-h-[75vh] w-full overflow-hidden bg-transparent text-[#15191f] dark:bg-transparent dark:text-white">
    <div className="relative mx-auto max-w-[1200px] px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:px-14">
      <header className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-semibold tracking-[-0.055em] text-[#a30000] sm:text-6xl lg:text-7xl">
          Publications.
        </h1>
        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#a30000]">
          Publication updates coming soon
        </p>
      </header>
    </div>
  </div>
);
