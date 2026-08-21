const RegistrationSection = ({
  number,
  title,
  description,
  children,
}) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-7">
      <div className="mb-6 flex items-start gap-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
          {number}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-slate-900 md:text-xl">
            {title}
          </h2>

          {description && (
            <p className="mt-1 text-sm leading-6 text-slate-500">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

export default RegistrationSection;