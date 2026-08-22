import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  TextField,
} from "@mui/material";

import {
  handleSearchProfile,
  handlePhotoChange,
  handleUploadPhotos,
  getUploadedPhotos,
  fetchDefaultPhoto,
  deletePhoto,
} from "./photoUploadUtils";

import MemberLayout from "../../shared/layouts/MemberLayout";

import {
  designClasses,
} from "../../shared/styles/designTokens";

const DEFAULT_PLACEHOLDER =
  "/assets/placeholder-image.png";

const ERROR_PLACEHOLDER =
  "/assets/image-error.png";

const PhotoManagementPage = () => {
   const [
     searchCriteria,
     setSearchCriteria,
   ] = useState({
     profileId: "",
     email: "",
     phone: "",
   });

  const [
    profileData,
    setProfileData,
  ] = useState(null);

  const [photos, setPhotos] =
    useState([]);

  const [
    photoPreviews,
    setPhotoPreviews,
  ] = useState([]);

  const [
    uploading,
    setUploading,
  ] = useState(false);

  const [
    uploadError,
    setUploadError,
  ] = useState(null);

  const [
    fetchError,
    setFetchError,
  ] = useState(null);

  const [
    searching,
    setSearching,
  ] = useState(false);

  const [
    uploadedPhotos,
    setUploadedPhotos,
  ] = useState([]);

  const [
    gettingPhotos,
    setGettingPhotos,
  ] = useState(false);

  const [
    isDefaultPhoto,
    setIsDefaultPhoto,
  ] = useState(false);

  const [
    defaultPhoto,
    setDefaultPhoto,
  ] = useState(null);

  const [
    isFileInputDisabled,
    setFileInputDisabled,
  ] = useState(true);

  const [
    deletingPhoto,
    setDeletingPhoto,
  ] = useState(false);

  const [
    deleteError,
    setDeleteError,
  ] = useState(null);

  const [
    failedImages,
    setFailedImages,
  ] = useState(new Set());

  const isMounted = useRef(false);

  useEffect(() => {
    isMounted.current = true;

    return () => {
      isMounted.current = false;
    };
  }, []);

   useEffect(() => {
     const emailFromStorage =
       sessionStorage.getItem(
         "userEmail"
       );

     if (!emailFromStorage) {
       return;
     }

     setSearchCriteria(
       (previous) => ({
         ...previous,
         email: emailFromStorage,
       })
     );
   }, []);

  const resetProfileState = () => {
    setProfileData(null);
    setPhotos([]);
    setPhotoPreviews([]);
    setFetchError(null);
    setUploadedPhotos([]);
    setDefaultPhoto(null);
    setUploadError(null);
    setFileInputDisabled(true);
    setFailedImages(new Set());
  };

   const handleSearchCriteriaChangeLocal =
     (event) => {
       const {
         name,
         value,
       } = event.target;

       setSearchCriteria(
         (previous) => ({
           ...previous,
           [name]: value,
         })
       );

       resetProfileState();
     };

  const handleSearchProfileLocal =
    async () => {
      setSearching(true);
      setFetchError(null);
      setUploadedPhotos([]);
      setDefaultPhoto(null);
      setFileInputDisabled(true);
      setUploadError(null);
      setFailedImages(new Set());

      try {
        await handleSearchProfile(
          searchCriteria,
          setProfileData,
          setFetchError,
          setSearching,
          setUploadedPhotos,
          setDefaultPhoto,
          setUploadError,
          (
            profileId,
            uploadedPhotosSetter,
            fetchErrorSetter
          ) =>
            getUploadedPhotos(
              profileId,
              uploadedPhotosSetter,
              fetchErrorSetter,
              setGettingPhotos
            ),
          fetchDefaultPhoto
        );
      } finally {
        if (isMounted.current) {
          setSearching(false);
        }
      }
    };

  const handlePhotoChangeLocal =
    (event) => {
      handlePhotoChange(
        event,
        setPhotos,
        setPhotoPreviews,
        setUploadError,
        uploadedPhotos.length
      );
    };

  const handleUploadPhotosLocal =
    async () => {
      setUploading(true);
      setUploadError(null);

      try {
        await handleUploadPhotos(
          profileData,
          photos,
          isDefaultPhoto,
          setUploading,
          setUploadError,
          setPhotos,
          setPhotoPreviews,
          setIsDefaultPhoto,
          getUploadedPhotos,
          fetchDefaultPhoto,
          setUploadedPhotos,
          setDefaultPhoto,
          setGettingPhotos,
          setFetchError
        );

        if (isMounted.current) {
          setFailedImages(
            new Set()
          );
        }
      } finally {
        if (isMounted.current) {
          setUploading(false);
        }
      }
    };

  const handleDeletePhoto =
    async (
      photoId,
      blobName
    ) => {
      setDeletingPhoto(true);
      setDeleteError(null);

      try {
        await deletePhoto(
          photoId,
          blobName,
          setDeleteError,
          setDeletingPhoto,
          async () => {
            if (
              !isMounted.current ||
              !profileData?.id
            ) {
              return;
            }

            setFailedImages(
              new Set()
            );

            await getUploadedPhotos(
              profileData.id,
              setUploadedPhotos,
              setFetchError,
              setGettingPhotos
            );

            await fetchDefaultPhoto(
              profileData.id,
              setDefaultPhoto,
              setFetchError
            );
          }
        );
      } catch (error) {
        console.error(
          "Unable to delete photo:",
          error
        );
      } finally {
        if (isMounted.current) {
          setDeletingPhoto(false);
        }
      }
    };

  const getValidImageUrl = (
    url
  ) => {
    if (!url) {
      return DEFAULT_PLACEHOLDER;
    }

    if (
      failedImages.has(url)
    ) {
      return ERROR_PLACEHOLDER;
    }

    try {
      const cacheBuster =
        Math.floor(
          Date.now() / 60000
        );

      if (
        url.startsWith("http")
      ) {
        const imageUrl =
          new URL(url);

        imageUrl.searchParams.set(
          "_cb",
          cacheBuster
        );

        return imageUrl.toString();
      }

      return url.includes("?")
        ? `${url}&_cb=${cacheBuster}`
        : `${url}?_cb=${cacheBuster}`;
    } catch (error) {
      console.error(
        "Unable to prepare photo URL:",
        error
      );

      return url;
    }
  };

  const SafeImage = ({
    src,
    alt,
    className = "",
  }) => {
    const [
      imgSrc,
      setImgSrc,
    ] = useState(
      src ||
        DEFAULT_PLACEHOLDER
    );

    const [
      hasErrored,
      setHasErrored,
    ] = useState(false);

    useEffect(() => {
      if (
        src &&
        failedImages.has(src)
      ) {
        setImgSrc(
          ERROR_PLACEHOLDER
        );

        setHasErrored(true);
        return;
      }

      setImgSrc(
        src ||
          DEFAULT_PLACEHOLDER
      );

       setHasErrored(false);
     }, [src]);

    const handleError = () => {
      if (
        !isMounted.current ||
        hasErrored ||
        !src
      ) {
        return;
      }

      setFailedImages(
        (previous) => {
          const next =
            new Set(previous);

          next.add(src);

          return next;
        }
      );

      setHasErrored(true);

      setImgSrc(
        ERROR_PLACEHOLDER
      );
    };

    return (
      <img
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
      />
    );
  };

  useEffect(() => {
    if (
      profileData &&
      !searching
    ) {
      if (
        uploadedPhotos.length >=
        5
      ) {
        setFileInputDisabled(
          true
        );

        setUploadError(
          "You have already uploaded the maximum of 5 photos."
        );
      } else {
        setFileInputDisabled(
          false
        );

        setUploadError(null);
      }

      return;
    }

    setFileInputDisabled(true);
    setUploadError(null);
  }, [
    profileData,
    searching,
    uploadedPhotos.length,
  ]);

  const searchDisabled =
    searching ||
    !(
      searchCriteria.profileId ||
      searchCriteria.email ||
      searchCriteria.phone
    );

  return (
    <MemberLayout>
      <div className="space-y-4">
        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <h1
            className={`text-xl font-semibold ${designClasses.textPrimary}`}
          >
            Photo Management
          </h1>

          <p
            className={`mt-1 text-sm ${designClasses.textSecondary}`}
          >
            Upload and manage up
            to five profile photos
            and choose the primary
            photo displayed to other
            members.
          </p>
        </section>

        <section
          className={`${designClasses.card} p-5 sm:p-6`}
        >
          <div className="mb-4">
            <h2
              className={`text-base font-semibold ${designClasses.textDark}`}
            >
              Find Profile
            </h2>

            <p
              className={`mt-1 text-sm ${designClasses.textSecondary}`}
            >
              Search using Profile
              ID, email or phone
              number.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <TextField
              fullWidth
              label="Profile ID"
              name="profileId"
              value={
                searchCriteria.profileId
              }
              onChange={
                handleSearchCriteriaChangeLocal
              }
              size="small"
            />

            <TextField
              fullWidth
              label="Email"
              name="email"
              value={
                searchCriteria.email
              }
              onChange={
                handleSearchCriteriaChangeLocal
              }
              size="small"
            />

            <TextField
              fullWidth
              label="Phone Number"
              name="phone"
              value={
                searchCriteria.phone
              }
              onChange={
                handleSearchCriteriaChangeLocal
              }
              size="small"
            />
          </div>

          <div className="mt-4">
            <button
              type="button"
              onClick={
                handleSearchProfileLocal
              }
              disabled={
                searchDisabled
              }
              className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
            >
              {searching
                ? "Searching..."
                : "Search Profile"}
            </button>
          </div>

          {fetchError && (
            <div
              className={`mt-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
              role="alert"
            >
              {fetchError}
            </div>
          )}
        </section>

        {profileData && (
          <>
            <section
              className={`${designClasses.card} p-5 sm:p-6`}
            >
              <h2
                className={`text-base font-semibold ${designClasses.textDark}`}
              >
                Profile Details
              </h2>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                <div>
                  <p
                    className={`text-xs ${designClasses.textSecondary}`}
                  >
                    Name
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${designClasses.textDark}`}
                  >
                    {profileData.name ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs ${designClasses.textSecondary}`}
                  >
                    Current Age
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${designClasses.textDark}`}
                  >
                    {profileData.current_age ||
                      profileData.currentAge ||
                      "-"}
                  </p>
                </div>

                <div>
                  <p
                    className={`text-xs ${designClasses.textSecondary}`}
                  >
                    Gotra
                  </p>

                  <p
                    className={`mt-1 text-sm font-medium ${designClasses.textDark}`}
                  >
                    {profileData.gotra ||
                      "-"}
                  </p>
                </div>
              </div>
            </section>

            <section
              className={`${designClasses.card} p-5 sm:p-6`}
            >
              <div>
                <h2
                  className={`text-base font-semibold ${designClasses.textDark}`}
                >
                  Upload Photos
                </h2>

                <p
                  className={`mt-1 text-sm ${designClasses.textSecondary}`}
                >
                  Maximum five photos
                  per profile.
                </p>
              </div>

              <div
                className={`mt-4 rounded-xl border p-4 ${designClasses.border} ${designClasses.surfaceMuted}`}
              >
                <input
                  type="file"
                  name="photos"
                  multiple
                  accept="image/*"
                  onChange={
                    handlePhotoChangeLocal
                  }
                  disabled={
                    isFileInputDisabled ||
                    uploading
                  }
                  className={`block w-full text-sm ${designClasses.textSecondary}`}
                />
              </div>

              {uploadError && (
                <div
                  className={`mt-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
                  role="alert"
                >
                  {uploadError}
                </div>
              )}

              {photoPreviews.length >
                0 && (
                <div className="mt-4">
                  <p
                    className={`mb-2 text-sm font-medium ${designClasses.textDark}`}
                  >
                    New Photos to
                    Upload
                  </p>

                  <div className="flex flex-wrap gap-3">
                    {photoPreviews.map(
                      (
                        preview,
                        index
                      ) => (
                        <div
                          key={
                            preview
                          }
                          className={`overflow-hidden rounded-xl border p-1 ${designClasses.border} ${designClasses.surface}`}
                        >
                          <SafeImage
                            src={
                              preview
                            }
                            alt={`Preview ${
                              index +
                              1
                            }`}
                            className="h-24 w-24 rounded-lg object-cover"
                          />
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}

              <FormControlLabel
                sx={{
                  mt: 2,
                }}
                control={
                  <Checkbox
                    checked={
                      isDefaultPhoto
                    }
                    onChange={(
                      event
                    ) =>
                      setIsDefaultPhoto(
                        event.target
                          .checked
                      )
                    }
                    disabled={
                      uploading
                    }
                  />
                }
                label="Set the first selected photo as the default profile photo"
              />

              <div className="mt-3">
                <button
                  type="button"
                  onClick={
                    handleUploadPhotosLocal
                  }
                  disabled={
                    photos.length ===
                      0 ||
                    uploading ||
                    isFileInputDisabled
                  }
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${designClasses.primaryButton}`}
                >
                  {uploading
                    ? "Uploading..."
                    : "Upload Photos"}
                </button>
              </div>
            </section>

            <section
              className={`${designClasses.card} p-5 sm:p-6`}
            >
              <h2
                className={`text-base font-semibold ${designClasses.textDark}`}
              >
                Uploaded Photos
              </h2>

              {gettingPhotos ? (
                <div className="flex justify-center py-8">
                  <CircularProgress
                    size={28}
                  />
                </div>
              ) : uploadedPhotos.length >
                0 ? (
                <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                  {uploadedPhotos.map(
                    (
                      photo,
                      index
                    ) => (
                      <div
                        key={
                          photo.id
                        }
                        className={`relative overflow-hidden rounded-xl border p-2 ${designClasses.border} ${designClasses.surface}`}
                      >
                        <SafeImage
                          src={getValidImageUrl(
                            photo.fullUrl
                          )}
                          alt={`Profile ${
                            index +
                            1
                          }`}
                          className="h-32 w-full rounded-lg object-cover"
                        />

                        {photo.isDefault && (
                          <span
                            className={`absolute right-3 top-3 rounded-full px-2 py-1 text-xs font-semibold text-white ${designClasses.bgAccent}`}
                          >
                            Default
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            handleDeletePhoto(
                              photo.id,
                              photo.blobName
                            )
                          }
                          disabled={
                            deletingPhoto
                          }
                          className="mt-2 w-full rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingPhoto
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </div>
                    )
                  )}
                </div>
              ) : (
                <div
                  className={`mt-4 rounded-xl p-5 text-center text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
                >
                  No photos uploaded
                  yet for this profile.
                </div>
              )}

              {deleteError && (
                <div
                  className={`mt-4 rounded-xl p-3 text-sm ${designClasses.statusError}`}
                  role="alert"
                >
                  {deleteError}
                </div>
              )}
            </section>

            <section
              className={`${designClasses.card} p-5 sm:p-6`}
            >
              <h2
                className={`text-base font-semibold ${designClasses.textDark}`}
              >
                Default Profile Photo
              </h2>

              {defaultPhoto ? (
                <div className="mt-4">
                  <div
                    className={`inline-block overflow-hidden rounded-xl border p-2 ${designClasses.border} ${designClasses.surface}`}
                  >
                    <SafeImage
                      src={getValidImageUrl(
                        defaultPhoto.fullUrl
                      )}
                      alt="Default profile"
                      className="h-44 w-44 rounded-lg object-cover"
                    />
                  </div>

                  <p
                    className={`mt-2 text-xs ${designClasses.textSecondary}`}
                  >
                    This is the primary
                    photo displayed to
                    other members.
                  </p>
                </div>
              ) : (
                <div
                  className={`mt-4 rounded-xl p-5 text-sm ${designClasses.surfaceMuted} ${designClasses.textSecondary}`}
                >
                  No default photo has
                  been set for this
                  profile.
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </MemberLayout>
  );
};

export default PhotoManagementPage;