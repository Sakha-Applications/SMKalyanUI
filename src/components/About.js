import React from "react";

import BrandHeader from "../shared/layouts/BrandHeader";
import BrandFooter from "../shared/layouts/BrandFooter";

import {
  designClasses,
} from "../shared/styles/designTokens";

function About() {
  return (
    <div
      className={`flex min-h-screen flex-col ${designClasses.page}`}
    >
      <BrandHeader />

      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
        <section
          className={`${designClasses.card} p-6 sm:p-8`}
        >
          <div className="mx-auto max-w-3xl">
            <p
              className={`text-sm font-semibold uppercase tracking-[0.16em] ${designClasses.textAccent}`}
            >
              About Kalyana Sakha
            </p>

            <h1
              className={`mt-2 text-3xl font-bold ${designClasses.textPrimary}`}
            >
              A community-focused
              matrimonial platform
            </h1>

            <p
              className={`mt-5 text-base leading-7 ${designClasses.textSecondary}`}
            >
              Inspired by the values of
              devotion, service and trust,
              Kalyana Sakha is designed to
              help members find suitable life
              partners within a community
              built around shared values and
              family involvement.
            </p>

            <p
              className={`mt-4 text-base leading-7 ${designClasses.textSecondary}`}
            >
              Our aim is to provide a
              respectful and secure platform
              where members can create
              meaningful profiles, express
              partner expectations, discover
              relevant matches and connect in
              a thoughtful manner.
            </p>

            <div
              className={`mt-7 rounded-xl p-5 ${designClasses.surfaceMuted}`}
            >
              <h2
                className={`text-lg font-semibold ${designClasses.textPrimary}`}
              >
                Our approach
              </h2>

              <p
                className={`mt-2 text-sm leading-6 ${designClasses.textSecondary}`}
              >
                Kalyana Sakha focuses on
                genuine matrimonial
                connections, clear member
                information, family-oriented
                participation and responsible
                use of the platform.
              </p>
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}

export default About;