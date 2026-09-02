import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Filter,
  Heart,
  RefreshCw,
  Search,
  Send,
  Sparkles,
  UserRound,
  X,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import MemberLayout from "../../shared/layouts/MemberLayout";
import PromptModal from "../../shared/components/PromptModal";
import ForwardProfileModal from "../../shared/components/ForwardProfileModal";

import {
  designClasses,
} from "../../shared/styles/designTokens";

import advertisementService from "../../services/advertisementService";
import creditService from "../../services/creditService";
import profileService from "../../services/profileService";

const PAGE_SIZE = 6;

const cleanText = (value) =>
  String(value || "")
    .replace(/\s+/g, " ")
    .trim();

const getAdvertisementText = (
  advertisement
) =>
  cleanText(
    advertisement
      ?.approved_advertisement_text ||
      advertisement
        ?.display_summary ||
      ""
  );

const getLookingFor = (
  advertisement
) => {
  const value =
    String(
      advertisement
        ?.looking_for ||
        ""
    )
      .trim()
      .toUpperCase();

  if (value === "BRIDE") {
    return {
      label:
        "Looking for Bride",
      className:
        "border-pink-100 bg-pink-50 text-pink-700",
    };
  }

  return {
    label:
      "Looking for Bridegroom",
    className:
      "border-blue-100 bg-blue-50 text-blue-700",
  };
};

const getAge = (value) => {
  const match =
    String(value || "")
      .match(/\d+/)?.[0];

  return match
    ? `${match} yrs`
    : "";
};

const AdvertisementBrowsePage =
  () => {
    const navigate =
      useNavigate();

    const location =
      useLocation();

    const [
      searchParams,
      setSearchParams,
    ] = useSearchParams();

    const [
      advertisements,
      setAdvertisements,
    ] = useState([]);

    const [
      meta,
      setMeta,
    ] = useState({
      page: 1,
      limit:
        PAGE_SIZE,
      count: 0,
      total: 0,
      totalPages: 0,
    });

    const [
      loading,
      setLoading,
    ] = useState(true);

    const [
      loadError,
      setLoadError,
    ] = useState("");

    const [
      actionMessage,
      setActionMessage,
    ] = useState("");

    const [
      responseSubmittingId,
      setResponseSubmittingId,
    ] = useState(null);

    const [
      creditSummary,
      setCreditSummary,
    ] = useState(null);

    const [
      photoByProfileId,
      setPhotoByProfileId,
    ] = useState({});

    const [
      filtersOpen,
      setFiltersOpen,
    ] = useState(false);

    const [
      forwardTarget,
      setForwardTarget,
    ] = useState(null);

    const [
      forwarding,
      setForwarding,
    ] = useState(false);

    const [
      promptModal,
      setPromptModal,
    ] = useState({
      open: false,
      title: "",
      description: "",
      label: "Remarks",
      placeholder: "",
      confirmLabel: "Submit",
      required: false,
      actionCost: 0,
      onConfirm: null,
    });

    const urlFilters =
      useMemo(
        () => ({
          lookingFor:
            searchParams.get(
              "lookingFor"
            ) || "",
          minAge:
            searchParams.get(
              "minAge"
            ) || "",
          maxAge:
            searchParams.get(
              "maxAge"
            ) || "",
          location:
            searchParams.get(
              "location"
            ) || "",
          qualification:
            searchParams.get(
              "qualification"
            ) || "",
          profession:
            searchParams.get(
              "profession"
            ) || "",
          excludeGotra:
            searchParams.get(
              "excludeGotra"
            ) || "",
          page:
            Math.max(
              parseInt(
                searchParams.get(
                  "page"
                ),
                10
              ) || 1,
              1
            ),
        }),
        [searchParams]
      );

    const [
      draftFilters,
      setDraftFilters,
    ] = useState(
      urlFilters
    );

    useEffect(() => {
      setDraftFilters(
        urlFilters
      );
    }, [urlFilters]);

    const activeFilterCount =
      useMemo(
        () =>
          [
            urlFilters.lookingFor,
            urlFilters.minAge,
            urlFilters.maxAge,
            urlFilters.location,
            urlFilters.qualification,
            urlFilters.profession,
            urlFilters.excludeGotra,
          ].filter(
            (value) =>
              String(value || "")
                .trim()
          ).length,
        [urlFilters]
      );

    const loadCreditSummary =
      async () => {
        try {
          const summary =
            await creditService
              .getMyCreditSummary();

          setCreditSummary(
            summary
          );
        } catch (error) {
          console.error(
            "Unable to load credit summary:",
            error
          );

          setCreditSummary(
            null
          );
        }
      };

    useEffect(() => {
      loadCreditSummary();
    }, []);

    useEffect(() => {
      let active = true;

      const load =
        async () => {
          try {
            setLoading(true);
            setLoadError("");

            const result =
              await advertisementService
                .browseAdvertisements({
                  ...urlFilters,
                  limit:
                    PAGE_SIZE,
                });

            if (!active) {
              return;
            }

            setAdvertisements(
              result.advertisements
            );

            setMeta(
              result.meta
            );
          } catch (error) {
            console.error(
              "Unable to browse advertisements:",
              error
            );

            if (active) {
              setAdvertisements(
                []
              );

              setLoadError(
                error?.response
                  ?.data
                  ?.message ||
                  "Unable to load matrimonial advertisements."
              );
            }
          } finally {
            if (active) {
              setLoading(
                false
              );
            }
          }
        };

      load();

      return () => {
        active = false;
      };
    }, [urlFilters]);

    useEffect(() => {
      if (
        advertisements.length ===
        0
      ) {
        return;
      }

      let active = true;

      const loadPhotos =
        async () => {
          const profileIds =
            [
              ...new Set(
                advertisements
                  .map(
                    (item) =>
                      item
                        ?.profile_id
                  )
                  .filter(Boolean)
                  .map(String)
              ),
            ];

          const missing =
            profileIds.filter(
              (profileId) =>
                !Object.prototype
                  .hasOwnProperty
                  .call(
                    photoByProfileId,
                    profileId
                  )
            );

          if (
            missing.length === 0
          ) {
            return;
          }

          const results =
            await Promise.allSettled(
              missing.map(
                async (
                  profileId
                ) => {
                  const photo =
                    await profileService
                      .getDefaultPhoto(
                        profileId
                      );

                  return {
                    profileId,
                    photoUrl:
                      photo
                        ?.fullUrl ||
                      "",
                  };
                }
              )
            );

          if (!active) {
            return;
          }

          setPhotoByProfileId(
            (current) => {
              const next = {
                ...current,
              };

              results.forEach(
                (result) => {
                  if (
                    result.status ===
                    "fulfilled"
                  ) {
                    next[
                      result.value
                        .profileId
                    ] =
                      result.value
                        .photoUrl;
                  }
                }
              );

              return next;
            }
          );
        };

      loadPhotos();

      return () => {
        active = false;
      };
    }, [
      advertisements,
      photoByProfileId,
    ]);

    const applyFilters =
      () => {
        const next =
          new URLSearchParams();

        [
          "lookingFor",
          "minAge",
          "maxAge",
          "location",
          "qualification",
          "profession",
          "excludeGotra",
        ].forEach(
          (key) => {
            const value =
              String(
                draftFilters[
                  key
                ] || ""
              ).trim();

            if (value) {
              next.set(
                key,
                value
              );
            }
          }
        );

        next.set(
          "page",
          "1"
        );

        setSearchParams(
          next
        );

        setFiltersOpen(
          false
        );
      };

    const clearFilters =
      () => {
        setDraftFilters({
          lookingFor: "",
          minAge: "",
          maxAge: "",
          location: "",
          qualification: "",
          profession: "",
          excludeGotra: "",
          page: 1,
        });

        setSearchParams({
          page: "1",
        });
      };

    const goToPage =
      (page) => {
        const safePage =
          Math.max(
            1,
            Math.min(
              page,
              meta.totalPages ||
                1
            )
          );

        const next =
          new URLSearchParams(
            searchParams
          );

        next.set(
          "page",
          String(
            safePage
          )
        );

        setSearchParams(
          next
        );

        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      };

    const currentReturnTo =
      `${location.pathname}${
        location.search || ""
      }`;

    const handleViewProfile =
      (item) => {
        const profileId =
          item?.profile_id;

        if (!profileId) {
          return;
        }

        const query =
          new URLSearchParams();

        query.set(
          "source",
          "advertisement"
        );

        if (item?.id) {
          query.set(
            "advertisementId",
            String(
              item.id
            )
          );
        }

        query.set(
          "returnTo",
          currentReturnTo
        );

        navigate(
          `/view-profile/${profileId}?${query.toString()}`
        );
      };

    const handleViewResponses =
      (item) => {
        if (!item?.id) {
          return;
        }

        navigate(
          `/inbox?advertisementId=${encodeURIComponent(
            item.id
          )}`
        );
      };

    const closePrompt =
      () => {
        setPromptModal(
          (current) => ({
            ...current,
            open: false,
            onConfirm: null,
          })
        );
      };

    const openResponse =
      (
        item,
        responseType
      ) => {
        if (!item?.id) {
          setActionMessage(
            "Advertisement reference is unavailable."
          );
          return;
        }

        const normalized =
          String(
            responseType || ""
          ).toUpperCase();

        const cost =
          normalized ===
          "APPLY"
            ? Number(
                creditSummary
                  ?.actionCosts
                  ?.directApply ||
                  0
              )
            : Number(
                creditSummary
                  ?.actionCosts
                  ?.showInterest ||
                  0
              );

        setPromptModal({
          open: true,
          title:
            normalized ===
            "APPLY"
              ? "Apply for this Profile"
              : "Show Interest",
          description:
            normalized ===
            "APPLY"
              ? "Please provide a genuine reason for applying to this matrimonial profile."
              : "This profile appears potentially suitable, but you need clarification or additional information before applying.",
          label:
            normalized ===
            "APPLY"
              ? "Reason for Applying"
              : "Reason / Clarification Required",
          placeholder:
            normalized ===
            "APPLY"
              ? "Explain why you believe the profiles may be suitable..."
              : "Example: We would like to understand willingness to relocate before applying...",
          confirmLabel:
            normalized ===
            "APPLY"
              ? "Submit Application"
              : "Send Interest",
          required: true,
          actionCost:
            cost,
          onConfirm:
            async (
              remarks
            ) => {
              closePrompt();

              try {
                setResponseSubmittingId(
                  item.id
                );

                setActionMessage(
                  ""
                );

                const result =
                  await advertisementService
                    .respondToAdvertisement({
                      advertisementId:
                        item.id,
                      responseType:
                        normalized,
                      remarks,
                    });

                setActionMessage(
                  result?.message ||
                    "Response submitted successfully."
                );

                await loadCreditSummary();
              } catch (error) {
                setActionMessage(
                  error?.response
                    ?.data
                    ?.message ||
                    "Unable to submit response."
                );
              } finally {
                setResponseSubmittingId(
                  null
                );
              }
            },
        });
      };

    const handleForward =
      async ({
        recipientEmail,
        senderMessage,
      }) => {
        const profileId =
          forwardTarget
            ?.profile_id;

        if (!profileId) {
          return;
        }

        try {
          setForwarding(
            true
          );

          const result =
            await profileService
              .forwardProfileByEmail({
                targetProfileId:
                  profileId,
                recipientEmail,
                senderMessage,
                advertisementId:
                  forwardTarget?.id ||
                  null,
                advertisementText:
                  getAdvertisementText(
                    forwardTarget
                  ),
              });

          setForwardTarget(
            null
          );

          setActionMessage(
            result?.message ||
              "Advertisement forwarded successfully."
          );
        } catch (error) {
          setActionMessage(
            error?.response
              ?.data
              ?.message ||
              "Unable to forward advertisement."
          );
        } finally {
          setForwarding(
            false
          );
        }
      };

    const start =
      meta.total > 0
        ? (meta.page - 1) *
            meta.limit +
          1
        : 0;

    const end =
      meta.total > 0
        ? start +
          meta.count -
          1
        : 0;

    const loggedInProfileId =
      String(
        sessionStorage.getItem(
          "profileId"
        ) || ""
      ).trim();

    return (
      <MemberLayout>
        <main
          className={`flex-1 ${designClasses.page}`}
        >
          <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div
              className={`overflow-hidden rounded-2xl border shadow-sm ${designClasses.border} ${designClasses.surface}`}
            >
              <div
                className={`border-b px-5 py-5 md:px-6 ${designClasses.border} ${designClasses.bgAccentSoft}`}
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          "/dashboard"
                        )
                      }
                      className={`mb-3 inline-flex items-center gap-2 text-sm font-semibold ${designClasses.textPrimary}`}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Back to Dashboard
                    </button>

                    <div className="flex items-center gap-2">
                      <Sparkles
                        className={`h-5 w-5 ${designClasses.textAccent}`}
                      />
                      <span
                        className={`text-xs font-semibold uppercase tracking-[0.16em] ${designClasses.textSecondary}`}
                      >
                        Matrimonial Spotlight
                      </span>
                    </div>

                    <h1
                      className={`mt-1 text-2xl font-bold md:text-3xl ${designClasses.textPrimary}`}
                    >
                      Matrimonial Advertisements
                    </h1>

                    <p
                      className={`mt-2 max-w-3xl text-sm leading-6 ${designClasses.textSecondary}`}
                    >
                      Discover currently published member
                      advertisements and continue through the
                      governed Interest, Apply and Mutual journey.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div
                      className={`rounded-xl border px-4 py-2.5 ${designClasses.border} ${designClasses.surface}`}
                    >
                      <div
                        className={`text-[10px] font-semibold uppercase tracking-wide ${designClasses.textSecondary}`}
                      >
                        Published
                      </div>
                      <div
                        className={`text-lg font-bold ${designClasses.textPrimary}`}
                      >
                        {meta.total}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setFiltersOpen(
                          (current) =>
                            !current
                        )
                      }
                      className={`inline-flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold ${designClasses.secondaryButton}`}
                    >
                      <Filter className="h-4 w-4" />
                      Filters
                      {activeFilterCount >
                      0 ? (
                        <span
                          className={`rounded-full px-2 py-0.5 text-xs ${designClasses.bgAccentSoft} ${designClasses.textPrimary}`}
                        >
                          {activeFilterCount}
                        </span>
                      ) : null}
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-5 md:p-6">
                <section
                  className={`mb-6 overflow-hidden rounded-xl border ${designClasses.border} ${
                    filtersOpen
                      ? "block"
                      : "hidden lg:block"
                  }`}
                >
                  <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
                    <label>
                      <span
                        className={
                          designClasses.fieldLabel
                        }
                      >
                        Looking For
                      </span>
                      <select
                        value={
                          draftFilters
                            .lookingFor
                        }
                        onChange={(
                          event
                        ) =>
                          setDraftFilters(
                            (
                              current
                            ) => ({
                              ...current,
                              lookingFor:
                                event
                                  .target
                                  .value,
                            })
                          )
                        }
                        className={`w-full rounded-lg border bg-white px-3 py-2.5 text-sm ${designClasses.border}`}
                      >
                        <option value="">
                          All
                        </option>
                        <option value="BRIDE">
                          Bride
                        </option>
                        <option value="BRIDEGROOM">
                          Bridegroom
                        </option>
                      </select>
                    </label>

                    <div>
                      <span
                        className={
                          designClasses.fieldLabel
                        }
                      >
                        Age Range
                      </span>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="number"
                          min="18"
                          max="99"
                          value={
                            draftFilters
                              .minAge
                          }
                          onChange={(
                            event
                          ) =>
                            setDraftFilters(
                              (
                                current
                              ) => ({
                                ...current,
                                minAge:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          placeholder="From"
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm ${designClasses.border}`}
                        />
                        <input
                          type="number"
                          min="18"
                          max="99"
                          value={
                            draftFilters
                              .maxAge
                          }
                          onChange={(
                            event
                          ) =>
                            setDraftFilters(
                              (
                                current
                              ) => ({
                                ...current,
                                maxAge:
                                  event
                                    .target
                                    .value,
                              })
                            )
                          }
                          placeholder="To"
                          className={`w-full rounded-lg border px-3 py-2.5 text-sm ${designClasses.border}`}
                        />
                      </div>
                    </div>

                    {[
                      [
                        "location",
                        "Location",
                        "City / location",
                      ],
                      [
                        "qualification",
                        "Qualification",
                        "Qualification",
                      ],
                      [
                        "profession",
                        "Profession",
                        "Profession / area",
                      ],
                      [
                        "excludeGotra",
                        "Exclude Gotra",
                        "Gotra to exclude",
                      ],
                    ].map(
                      ([
                        key,
                        label,
                        placeholder,
                      ]) => (
                        <label
                          key={key}
                        >
                          <span
                            className={
                              designClasses.fieldLabel
                            }
                          >
                            {label}
                          </span>
                          <input
                            type="text"
                            value={
                              draftFilters[
                                key
                              ]
                            }
                            onChange={(
                              event
                            ) =>
                              setDraftFilters(
                                (
                                  current
                                ) => ({
                                  ...current,
                                  [key]:
                                    event
                                      .target
                                      .value,
                                })
                              )
                            }
                            placeholder={
                              placeholder
                            }
                            className={`w-full rounded-lg border px-3 py-2.5 text-sm ${designClasses.border}`}
                          />
                        </label>
                      )
                    )}
                  </div>

                  <div
                    className={`flex flex-wrap justify-end gap-2 border-t px-4 py-3 ${designClasses.border} ${designClasses.surfaceMuted}`}
                  >
                    <button
                      type="button"
                      onClick={
                        clearFilters
                      }
                      className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton}`}
                    >
                      <X className="h-4 w-4" />
                      Clear All
                    </button>

                    <button
                      type="button"
                      onClick={
                        applyFilters
                      }
                      className={`inline-flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold ${designClasses.primaryButton}`}
                    >
                      <Search className="h-4 w-4" />
                      Apply Filters
                    </button>
                  </div>
                </section>

                {actionMessage ? (
                  <div
                    className={`mb-5 rounded-xl border px-4 py-3 text-sm ${designClasses.border} ${designClasses.bgAccentSoft} ${designClasses.textDark}`}
                  >
                    {actionMessage}
                  </div>
                ) : null}

                <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div
                    className={`text-sm font-semibold ${designClasses.textDark}`}
                  >
                    {loading
                      ? "Loading advertisements..."
                      : meta.total > 0
                      ? `Showing ${start}–${end} of ${meta.total} advertisements`
                      : "No advertisements to show"}
                  </div>

                  {activeFilterCount >
                  0 ? (
                    <div
                      className={`text-xs ${designClasses.textSecondary}`}
                    >
                      {activeFilterCount} active filter
                      {activeFilterCount ===
                      1
                        ? ""
                        : "s"}
                    </div>
                  ) : null}
                </div>

                {loadError ? (
                  <div
                    className={`rounded-xl border p-8 text-center ${designClasses.border} ${designClasses.surfaceMuted}`}
                  >
                    <div
                      className={`font-semibold ${designClasses.textDark}`}
                    >
                      We could not load the advertisements.
                    </div>
                    <p
                      className={`mt-2 text-sm ${designClasses.textSecondary}`}
                    >
                      {loadError}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        window.location.reload()
                      }
                      className={`mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.primaryButton}`}
                    >
                      <RefreshCw className="h-4 w-4" />
                      Try Again
                    </button>
                  </div>
                ) : loading ? (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {Array.from({
                      length:
                        PAGE_SIZE,
                    }).map(
                      (_, index) => (
                        <div
                          key={
                            index
                          }
                          className={`h-64 animate-pulse rounded-2xl border ${designClasses.border} ${designClasses.surfaceMuted}`}
                        />
                      )
                    )}
                  </div>
                ) : advertisements.length ===
                  0 ? (
                  <div
                    className={`rounded-2xl border p-10 text-center ${designClasses.border} ${designClasses.surfaceMuted}`}
                  >
                    <Filter
                      className={`mx-auto h-8 w-8 ${designClasses.textAccent}`}
                    />
                    <h2
                      className={`mt-3 text-lg font-semibold ${designClasses.textPrimary}`}
                    >
                      {activeFilterCount >
                      0
                        ? "No advertisements match your filters"
                        : "No published advertisements are currently available"}
                    </h2>
                    <p
                      className={`mx-auto mt-2 max-w-xl text-sm ${designClasses.textSecondary}`}
                    >
                      {activeFilterCount >
                      0
                        ? "Adjust or clear the filters to discover more matrimonial advertisements."
                        : "Please check again later for newly published member advertisements."}
                    </p>

                    {activeFilterCount >
                    0 ? (
                      <button
                        type="button"
                        onClick={
                          clearFilters
                        }
                        className={`mt-5 rounded-lg px-5 py-2.5 text-sm font-semibold ${designClasses.primaryButton}`}
                      >
                        Clear Filters
                      </button>
                    ) : null}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {advertisements.map(
                      (
                        item,
                        index
                      ) => {
                        const profileId =
                          String(
                            item
                              ?.profile_id ||
                              ""
                          );

                        const own =
                          Boolean(
                            loggedInProfileId &&
                              profileId &&
                              loggedInProfileId ===
                                profileId
                          );

                        const badge =
                          getLookingFor(
                            item
                          );

                        const details =
                          [
                            getAge(
                              item
                                ?.current_age
                            ),
                            item?.gotra &&
                            item.gotra !==
                              "Not specified"
                              ? `${item.gotra} Gotra`
                              : "",
                            item?.profession &&
                            item.profession !==
                              "Not specified"
                              ? item.profession
                              : "",
                            item?.city &&
                            item.city !==
                              "Not specified"
                              ? item.city
                              : "",
                          ].filter(
                            Boolean
                          );

                        const ordinal =
                          start +
                          index;

                        const photoUrl =
                          photoByProfileId[
                            profileId
                          ] || "";

                        const busy =
                          responseSubmittingId ===
                          item.id;

                        return (
                          <article
                            key={
                              item.id
                            }
                            className={`group overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${designClasses.border} ${designClasses.surface}`}
                          >
                            <div className="flex gap-4 p-4 sm:p-5">
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewProfile(
                                    item
                                  )
                                }
                                className="shrink-0"
                                aria-label={`View ${item.name || "profile"}`}
                              >
                                {photoUrl ? (
                                  <img
                                    src={
                                      photoUrl
                                    }
                                    alt=""
                                    className={`h-32 w-24 rounded-xl border object-cover sm:h-36 sm:w-28 ${designClasses.border}`}
                                    onError={() =>
                                      setPhotoByProfileId(
                                        (
                                          current
                                        ) => ({
                                          ...current,
                                          [profileId]:
                                            "",
                                        })
                                      )
                                    }
                                  />
                                ) : (
                                  <div
                                    className={`flex h-32 w-24 items-center justify-center rounded-xl border sm:h-36 sm:w-28 ${designClasses.border} ${designClasses.bgAccentSoft}`}
                                  >
                                    <UserRound
                                      className={`h-8 w-8 ${designClasses.textAccent}`}
                                    />
                                  </div>
                                )}
                              </button>

                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-2">
                                  <span
                                    className={`rounded-full border px-3 py-1 text-xs font-bold ${badge.className}`}
                                  >
                                    {badge.label}
                                  </span>

                                  <span
                                    className={`text-xs font-semibold ${designClasses.textSecondary}`}
                                  >
                                    {ordinal} of{" "}
                                    {meta.total}
                                  </span>
                                </div>

                                <h2
                                  className={`mt-3 truncate text-lg font-bold ${designClasses.textPrimary}`}
                                >
                                  {item.name ||
                                    "Matrimonial Profile"}
                                </h2>

                                {details.length >
                                0 ? (
                                  <div
                                    className={`mt-1 text-sm leading-6 ${designClasses.textSecondary}`}
                                  >
                                    {details.join(
                                      " • "
                                    )}
                                  </div>
                                ) : null}

                                {item?.education &&
                                item.education !==
                                  "Not specified" ? (
                                  <div
                                    className={`mt-1 text-xs ${designClasses.textSecondary}`}
                                  >
                                    {
                                      item.education
                                    }
                                  </div>
                                ) : null}

                                <p
                                  className={`mt-3 line-clamp-3 text-sm leading-6 ${designClasses.textDark}`}
                                >
                                  {getAdvertisementText(
                                    item
                                  )}
                                </p>
                              </div>
                            </div>

                            <div
                              className={`flex flex-wrap items-center gap-2 border-t px-4 py-3 sm:px-5 ${designClasses.border} ${designClasses.surfaceMuted}`}
                            >
                              <button
                                type="button"
                                onClick={() =>
                                  handleViewProfile(
                                    item
                                  )
                                }
                                className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.primaryButton}`}
                              >
                                View Profile
                              </button>

                              {own ? (
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleViewResponses(
                                      item
                                    )
                                  }
                                  className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton}`}
                                >
                                  View Responses
                                </button>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      openResponse(
                                        item,
                                        "INTEREST"
                                      )
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton} ${
                                      busy
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                    }`}
                                  >
                                    <Heart className="h-3.5 w-3.5" />
                                    Show Interest
                                  </button>

                                  <button
                                    type="button"
                                    disabled={
                                      busy
                                    }
                                    onClick={() =>
                                      openResponse(
                                        item,
                                        "APPLY"
                                      )
                                    }
                                    className={`rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton} ${
                                      busy
                                        ? "cursor-not-allowed opacity-50"
                                        : ""
                                    }`}
                                  >
                                    Apply
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() =>
                                      setForwardTarget(
                                        item
                                      )
                                    }
                                    className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold ${designClasses.secondaryButton}`}
                                  >
                                    <Send className="h-3.5 w-3.5" />
                                    Forward
                                  </button>
                                </>
                              )}
                            </div>
                          </article>
                        );
                      }
                    )}
                  </div>
                )}

                {!loading &&
                meta.totalPages > 1 ? (
                  <div
                    className={`mt-6 flex flex-col gap-3 border-t pt-5 sm:flex-row sm:items-center sm:justify-between ${designClasses.border}`}
                  >
                    <button
                      type="button"
                      disabled={
                        meta.page <= 1
                      }
                      onClick={() =>
                        goToPage(
                          meta.page -
                            1
                        )
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton} ${
                        meta.page <= 1
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }`}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </button>

                    <div
                      className={`text-center text-sm font-semibold ${designClasses.textDark}`}
                    >
                      Page {meta.page} of{" "}
                      {
                        meta.totalPages
                      }
                    </div>

                    <button
                      type="button"
                      disabled={
                        meta.page >=
                        meta.totalPages
                      }
                      onClick={() =>
                        goToPage(
                          meta.page +
                            1
                        )
                      }
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold ${designClasses.secondaryButton} ${
                        meta.page >=
                        meta.totalPages
                          ? "cursor-not-allowed opacity-40"
                          : ""
                      }`}
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </main>

        <ForwardProfileModal
          open={
            Boolean(
              forwardTarget
            )
          }
          title="Forward Advertisement"
          description="Share this matrimonial advertisement securely by email."
          submitLabel="Forward Advertisement"
          profileName={
            forwardTarget?.name ||
            "Matrimonial Profile"
          }
          profileId={
            forwardTarget
              ?.profile_id ||
            ""
          }
          submitting={
            forwarding
          }
          onClose={() => {
            if (!forwarding) {
              setForwardTarget(
                null
              );
            }
          }}
          onSubmit={
            handleForward
          }
        />

        <PromptModal
          open={
            promptModal.open
          }
          title={
            promptModal.title
          }
          description={
            promptModal.description
          }
          label={
            promptModal.label
          }
          placeholder={
            promptModal.placeholder
          }
          required={
            promptModal.required
          }
          confirmLabel={
            promptModal.confirmLabel
          }
          showCreditSummary
          actionCost={
            promptModal.actionCost
          }
          creditSummary={
            creditSummary
          }
          onRecharge={() => {
            closePrompt();
            navigate(
              "/renew-profile"
            );
          }}
          onCancel={
            closePrompt
          }
          onConfirm={(
            value
          ) =>
            promptModal
              .onConfirm?.(
                value
              )
          }
        />
      </MemberLayout>
    );
  };

export default AdvertisementBrowsePage;
