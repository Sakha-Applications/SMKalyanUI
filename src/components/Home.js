import React from "react";
import {
  Link,
} from "react-router-dom";

import {
  ArrowRight,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";

import BrandHeader from "../shared/layouts/BrandHeader";
import BrandFooter from "../shared/layouts/BrandFooter";

import {
  designClasses,
} from "../shared/styles/designTokens";

import backgroundImage from "../assets/Image/kalayan_bg_img.png";

const JourneyCard = ({
  icon: Icon,
  step,
  title,
  description,
}) => (
  <div
    className={`${designClasses.card} relative p-5 sm:p-6`}
  >
    <div className="flex items-start gap-4">
      <div
        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${designClasses.bgAccentSoft}`}
      >
        <Icon
          className={`h-5 w-5 ${designClasses.textAccent}`}
        />
      </div>

      <div>
        <div
          className={`text-xs font-semibold uppercase tracking-[0.14em] ${designClasses.textAccent}`}
        >
          Step {step}
        </div>

        <h3
          className={`mt-1 text-base font-semibold ${designClasses.textPrimary}`}
        >
          {title}
        </h3>

        <p
          className={`mt-2 text-sm leading-6 ${designClasses.textSecondary}`}
        >
          {description}
        </p>
      </div>
    </div>
  </div>
);

const TrustItem = ({
  icon: Icon,
  title,
  description,
}) => (
  <div className="flex items-start gap-3">
    <div
      className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${designClasses.bgAccentSoft}`}
    >
      <Icon
        className={`h-4 w-4 ${designClasses.textAccent}`}
      />
    </div>

    <div>
      <h3
        className={`text-sm font-semibold ${designClasses.textPrimary}`}
      >
        {title}
      </h3>

      <p
        className={`mt-1 text-sm leading-6 ${designClasses.textSecondary}`}
      >
        {description}
      </p>
    </div>
  </div>
);

export default function Home() {
  return (
    <div
      className={`min-h-screen ${designClasses.page}`}
    >
      <BrandHeader />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-7xl px-4 pt-5 sm:px-6 lg:px-8">
          <div
            className="relative min-h-[470px] overflow-hidden rounded-[24px] border border-[#E4E1D9] bg-white shadow-sm"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/95 to-white/45" />

            <div className="relative z-10 flex min-h-[470px] items-center px-6 py-12 sm:px-10 lg:px-14">
              <div className="max-w-2xl">
                <div
                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${designClasses.bgAccentSoft} ${designClasses.textAccent}`}
                >
                  <Sparkles className="h-4 w-4" />
                  A trusted matrimonial community
                </div>

                <h1
                  className={`mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-[54px] ${designClasses.textPrimary}`}
                >
                  Meaningful connections.
                  <span
                    className={`mt-1 block ${designClasses.textAccent}`}
                  >
                    Rooted in shared values.
                  </span>
                </h1>

                <p
                  className={`mt-5 max-w-xl text-base leading-7 sm:text-lg ${designClasses.textSecondary}`}
                >
                  Kalyana Sakha brings families
                  and individuals together through
                  thoughtfully created profiles,
                  partner preferences and a
                  community-focused matrimonial
                  experience.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <Link
                    to="/profile-register"
                    className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold ${designClasses.primaryButton}`}
                  >
                    <UserPlus className="h-4 w-4" />
                    Create Your Profile
                    <ArrowRight className="h-4 w-4" />
                  </Link>

                  <Link
                    to="/login"
                    className={`inline-flex items-center justify-center rounded-lg px-5 py-3 text-sm font-semibold ${designClasses.secondaryButton}`}
                  >
                    Member Login
                  </Link>
                </div>

                <div
                  className={`mt-7 flex flex-wrap gap-x-6 gap-y-2 text-sm ${designClasses.textSecondary}`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShieldCheck
                      className={`h-4 w-4 ${designClasses.textSuccess}`}
                    />
                    Profile-focused community
                  </span>

                  <span className="inline-flex items-center gap-2">
                    <Heart
                      className={`h-4 w-4 ${designClasses.textAccent}`}
                    />
                    Family-oriented connections
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Introduction */}
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div
                className={`text-sm font-semibold uppercase tracking-[0.16em] ${designClasses.textAccent}`}
              >
                Kalyana Sakha
              </div>

              <h2
                className={`mt-2 text-3xl font-bold tracking-tight ${designClasses.textPrimary}`}
              >
                A simpler way to begin
                a meaningful search
              </h2>

              <p
                className={`mt-4 max-w-xl text-base leading-7 ${designClasses.textSecondary}`}
              >
                Create a complete profile,
                describe what matters to you,
                and discover compatible members
                through a clear and respectful
                matrimonial journey.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <TrustItem
                icon={ShieldCheck}
                title="Thoughtful profiles"
                description="Profiles bring together personal, family, cultural and professional information in one place."
              />

              <TrustItem
                icon={Search}
                title="Focused discovery"
                description="Search and partner preferences help members concentrate on relevant matrimonial profiles."
              />

              <TrustItem
                icon={Users}
                title="Community centred"
                description="Designed around genuine matrimonial connections within the Kalyana Sakha community."
              />

              <TrustItem
                icon={Heart}
                title="Respectful interaction"
                description="A structured member journey keeps profile discovery and communication simple and purposeful."
              />
            </div>
          </div>
        </section>

        {/* Journey */}
        <section
          className={`border-y ${designClasses.border} ${designClasses.surfaceMuted}`}
        >
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            <div className="text-center">
              <div
                className={`text-sm font-semibold uppercase tracking-[0.16em] ${designClasses.textAccent}`}
              >
                Getting Started
              </div>

              <h2
                className={`mt-2 text-2xl font-bold sm:text-3xl ${designClasses.textPrimary}`}
              >
                Your matrimonial journey,
                made simple
              </h2>

              <p
                className={`mx-auto mt-3 max-w-2xl text-sm leading-6 ${designClasses.textSecondary}`}
              >
                Start with your profile and
                preferences, then discover
                members who may be compatible
                with you.
              </p>
            </div>

            <div className="mt-7 grid gap-4 md:grid-cols-3">
              <JourneyCard
                icon={UserPlus}
                step="1"
                title="Create your profile"
                description="Share your personal, family, cultural and professional details."
              />

              <JourneyCard
                icon={Heart}
                step="2"
                title="Set partner preferences"
                description="Tell us the qualities and preferences that matter in your search."
              />

              <JourneyCard
                icon={Search}
                step="3"
                title="Discover profiles"
                description="Explore relevant profiles and take the next step when you find a meaningful connection."
              />
            </div>

            <div className="mt-7 text-center">
              <Link
                to="/profile-register"
                className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.primaryButton}`}
              >
                Start Your Profile
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mx-auto max-w-7xl px-4 pb-12 sm:px-6 lg:px-8">
          <div
            className={`${designClasses.card} overflow-hidden`}
          >
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h2
                  className={`text-2xl font-bold ${designClasses.textPrimary}`}
                >
                  Ready to begin your search?
                </h2>

                <p
                  className={`mt-2 max-w-2xl text-sm leading-6 ${designClasses.textSecondary}`}
                >
                  Create your Kalyana Sakha
                  profile and take the first
                  step toward finding a
                  compatible life partner.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  to="/profile-register"
                  className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.primaryButton}`}
                >
                  Register Now
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <Link
                  to="/login"
                  className={`inline-flex items-center rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.secondaryButton}`}
                >
                  Member Login
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <BrandFooter />
    </div>
  );
}