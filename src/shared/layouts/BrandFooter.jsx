import footerBrand from "../../assets/branding/kalyana-sarvamoola-footer.png";

const BrandFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto bg-[#00264d]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <img
          src={footerBrand}
          alt="Kalyana Sakha - Sarvamoola Foundation"
          className="mx-auto max-h-40 w-full object-contain"
        />

        <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-4 text-xs text-slate-300 sm:flex-row">
          <p>
            © {currentYear} Sarvamoola Foundation. All rights reserved.
          </p>

          <p>Trusted Connections. Stronger Tomorrow.</p>
        </div>
      </div>
    </footer>
  );
};

export default BrandFooter;