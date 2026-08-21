const CollapsibleSection = ({
  number,
  title,
  description,
  open,
  onToggle,
  completed = false,
  children,
}) => {
  return (
    <section className="relative overflow-visible rounded-2xl border border-slate-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left transition hover:bg-slate-50 sm:px-7"
      >
        <div className="flex min-w-0 items-start gap-4">
          <div
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
              completed
                ? "bg-amber-500 text-[#00264d]"
                : "bg-[#071226] text-white"
            }`}
          >
            {completed ? "✓" : number}
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-semibold text-[#071226]">
                {title}
              </h2>

              {completed && (
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                  Complete
                </span>
              )}
            </div>

            <p className="mt-1 text-sm leading-5 text-slate-500">
              {description}
            </p>
          </div>
        </div>

        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {open && (
        <div className="border-t border-slate-100 px-5 py-6 sm:px-7">
          {children}
        </div>
      )}
    </section>
  );
};

export default CollapsibleSection;