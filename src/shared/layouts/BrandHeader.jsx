import kalyanaLogo from "../../assets/branding/kalyana-sakha-logo.png";
import sarvamoolaLogo from "../../assets/branding/sarvamoola-foundation-logo.png";

import AdvertisementSpotlight from "../components/AdvertisementSpotlight";

const BrandHeader = ({ compact = false }) => {
  return (
    <>
      <header className="border-b border-amber-400/20 bg-[#00264d]">
      <div
        className={`mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8 ${
          compact ? "py-3" : "py-4"
        }`}
      >
        <img
          src={kalyanaLogo}
          alt="Kalyana Sakha"
          className={`w-auto object-contain ${
            compact ? "h-14" : "h-16 md:h-20"
          }`}
        />

        <div className="hidden items-center gap-4 sm:flex">
<span className="text-xs font-medium italic uppercase tracking-[0.16em] text-amber-200/80">
  An initiative of
</span>

          <img
            src={sarvamoolaLogo}
            alt="Sarvamoola Foundation"
            className={`w-auto object-contain ${
              compact ? "h-11" : "h-12 md:h-16"
            }`}
          />
        </div>
      </div>
      </header>

      <AdvertisementSpotlight />
    </>
  );
};

export default BrandHeader;