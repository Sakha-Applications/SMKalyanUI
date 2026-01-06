// src/hooks/useApiData.js
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import getBaseUrl from "../utils/GetUrl";

const useApiData = (endpoint) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const [gotraOptions, setGotraOptions] = useState([]);
  const [rashiOptions, setRashiOptions] = useState([]);
  const [nakshatraOptions, setNakshatraOptions] = useState([]);
  const [professionOptions, setProfessionOptions] = useState([]);

  const [motherTongueOptions, setMotherTongueOptions] = useState([]);
  const [cityOptions, setCityOptions] = useState([]);
  const [nativePlaceOptions, setNativePlaceOptions] = useState([]);

  // ✅ Normalize API base so we always call <host>/api/...
  const getApiBaseUrl = () => {
    const base = String(getBaseUrl() || "").replace(/\/+$/, "");
    if (!base) return "";
    if (base.endsWith("/api")) return base;
    return `${base}/api`;
  };

  // 🔍 Search professions
  const searchProfessions = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(
        `${apiBaseUrl}/profession?search=${encodeURIComponent(searchText)}`
      );

      if (Array.isArray(response.data)) {
        return response.data.map((item) => ({
          label: item.ProfessionName || item.name || item.profession_name,
          value: item.id,
        }));
      } else {
        console.warn("Unexpected profession search response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error searching professions:", error);
      return [];
    }
  }, []);

  // 📥 Get profession by ID
  const getProfessionById = useCallback(async (professionId) => {
    if (!professionId) return null;

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/profession`);

      if (Array.isArray(response.data)) {
        const profession = response.data.find((p) => p.id === parseInt(professionId));
        return profession
          ? {
              label:
                profession.ProfessionName ||
                profession.name ||
                profession.profession_name,
              value: profession.id,
            }
          : null;
      } else {
        console.warn("Unexpected profession response format:", response.data);
        return null;
      }
    } catch (error) {
      console.error("Error fetching profession by ID:", error);
      return null;
    }
  }, []);

  // 🔍 Search education
  const searchEducation = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(
        `${apiBaseUrl}/education?search=${encodeURIComponent(searchText)}`
      );
      if (Array.isArray(response.data)) {
        return response.data.map((item) => ({
          label: item.EducationName || item.name,
          value: item.id,
        }));
      } else {
        console.warn("Unexpected education response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error searching education:", error);
      return [];
    }
  }, []);

  // 🔍 Search designations
  const searchDesignations = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(
        `${apiBaseUrl}/designation?search=${encodeURIComponent(searchText)}`
      );
      if (Array.isArray(response.data)) {
        return response.data.map((item) => ({
          label: item.DesignationName || item.name,
          value: item.id,
        }));
      } else {
        console.warn("Unexpected designation response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error searching designation:", error);
      return [];
    }
  }, []);

  // 🔍 Search mother tongues
  const searchMotherTongues = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/mother-tongues`);
      console.log("DEBUG: Full list fetched for mother tongues:", response.data);

      if (Array.isArray(response.data)) {
        return response.data
          .filter((item) =>
            item.mother_tongue?.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((item) => ({
            label: item.mother_tongue,
            value: item.mother_tongue,
            id: item.id,
          }));
      } else {
        console.warn("Unexpected response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error in searchMotherTongues:", error);
      return [];
    }
  }, []);

  // 📥 Get mother tongue by ID
  // ✅ FIX: do NOT call /api/languages (unused/404). Use /api/mother-tongues instead.
  const getMotherTongueById = useCallback(async (id) => {
    if (!id) return null;

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/mother-tongues`);
      if (Array.isArray(response.data)) {
        const mt = response.data.find((x) => x.id === parseInt(id));
        if (mt) {
          return {
            label: mt.mother_tongue,
            value: mt.mother_tongue,
            id: mt.id,
          };
        }
      } else {
        console.warn("Unexpected mother-tongues response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching mother tongue by ID:", error);
    }
    return null;
  }, []);

  // 🔍 Search native/residing places (shared API)
  const searchPlaces = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/native-places`);
      if (Array.isArray(response.data)) {
        return response.data
          .filter((item) =>
            item.nativeplace?.toLowerCase().includes(searchText.toLowerCase())
          )
          .map((item) => ({
            label: item.nativeplace,
            value: item.nativeplace,
            id: item.id,
          }));
      } else {
        console.warn("Unexpected places response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error searching native/residing places:", error);
      return [];
    }
  }, []);

  // 🔍 Search Guru Matha
  const searchGuruMatha = useCallback(async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(
        `${apiBaseUrl}/guru-matha?search=${encodeURIComponent(searchText)}`
      );
      if (Array.isArray(response.data)) {
        return response.data.map((item) => ({
          label: item.GuruMathaName,
          value: item.GuruMathaName,
          id: item.id,
        }));
      } else {
        console.warn("Unexpected guru matha response format:", response.data);
        return [];
      }
    } catch (error) {
      console.error("Error searching guru matha:", error);
      return [];
    }
  }, []);

  // 📥 Get place by ID
  const getPlaceById = useCallback(async (id) => {
    if (!id) return null;

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/native-places`);
      if (Array.isArray(response.data)) {
        const place = response.data.find((p) => p.id === parseInt(id));
        return place
          ? { label: place.nativeplace, value: place.nativeplace, id: place.id }
          : null;
      } else {
        console.warn("Unexpected native-places response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching place by ID:", error);
    }
    return null;
  }, []);

  // 🔁 Auto-fetch master data
  useEffect(() => {
    if (endpoint) {
      const fetchData = async () => {
        try {
          const apiBaseUrl = getApiBaseUrl();
          const response = await axios.get(`${apiBaseUrl}${endpoint}`);
          if (Array.isArray(response.data)) {
            setData(response.data);
          } else {
            setError(`Invalid format from ${endpoint}`);
          }
        } catch (error) {
          console.error(`Error loading ${endpoint}:`, error);
          setError(`Failed to load data from ${endpoint}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    } else {
      const fetchAllData = async () => {
        try {
          const apiBaseUrl = getApiBaseUrl();
          const apiCalls = [
            {
              url: `${apiBaseUrl}/gotras`,
              setter: setGotraOptions,
              name: "gotras",
              transformer: (data) =>
                data.map((i) => ({
                  label: i.gotraname || i.GotraName || i.name,
                  value: i.id,
                })),
            },
            {
              url: `${apiBaseUrl}/rashis`,
              setter: setRashiOptions,
              name: "rashis",
              transformer: (data) =>
                data.map((i) => ({
                  label: i.rashiname || i.RashiName || i.name,
                  value: i.id,
                })),
            },
            {
              url: `${apiBaseUrl}/nakshatras`,
              setter: setNakshatraOptions,
              name: "nakshatras",
              transformer: (data) =>
                data.map((i) => ({
                  label: i.nakshatraname || i.NakshatraName || i.name,
                  value: i.id,
                })),
            },
            {
              url: `${apiBaseUrl}/profession`,
              setter: setProfessionOptions,
              name: "professions",
              transformer: (data) =>
                data.map((i) => ({
                  label: i.ProfessionName || i.name || i.profession_name,
                  value: i.id,
                })),
            },

            // ✅ Unused APIs removed / kept disabled:
            // /api/languages
            // /api/cities
            // /api/places
          ];

          await Promise.allSettled(
            apiCalls.map(async ({ url, setter, name, transformer }) => {
              try {
                const res = await axios.get(url);
                if (Array.isArray(res.data)) {
                  const transformed = transformer(res.data);
                  setter(transformed);
                  console.log(`✓ Loaded ${name}:`, transformed.length, "items");
                } else {
                  console.warn(`Invalid ${name} response format:`, res.data);
                }
              } catch (error) {
                console.warn(`Failed to fetch ${name}:`, error.message);
              }
            })
          );
        } catch (error) {
          console.error("Error in fetchAllData:", error);
          setError("Failed to load master data.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchAllData();
    }
  }, [endpoint]);

  // ✅ Check if profile exists by profileId
  const checkProfileExists = useCallback(async (profileId) => {
    if (!profileId) return false;

    try {
      const apiBaseUrl = getApiBaseUrl();
      const response = await axios.get(`${apiBaseUrl}/profile/${profileId}`);
      return response?.data?.profileId ? true : false;
    } catch (error) {
      console.error("❌ Error checking if profile exists:", error);
      return false;
    }
  }, []);

  return {
    isLoading,
    error,
    data,

    gotraOptions,
    rashiOptions,
    nakshatraOptions,
    professionOptions,
    motherTongueOptions,
    nativePlaceOptions,

    checkProfileExists,

    searchProfessions,
    getProfessionById,
    searchMotherTongues,
    getMotherTongueById,

    // ✅ IMPORTANT: these are used by BasicSearchForm/CountryStateCitySelector
    searchPlaces,
    getPlaceById,

    searchGuruMatha,
    searchEducation,
    searchDesignations,
  };
};

export default useApiData;
