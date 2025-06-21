// useApiData.js
import { useState, useEffect } from "react";
import axios from "axios";
import getBaseUrl from '../utils/GetUrl';


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

    // 🔍 Search professions with enhanced error handling and caching
    const searchProfessions = async (searchText) => {
        if (!searchText || searchText.length < 2) return [];

        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/profession?search=${encodeURIComponent(searchText)}`);
            
            if (Array.isArray(response.data)) {
                return response.data.map((item) => ({ 
                    label: item.ProfessionName || item.name || item.profession_name, 
                    value: item.id 
                }));
            } else {
                console.warn('Unexpected profession search response format:', response.data);
                return [];
            }
        } catch (error) {
            console.error('Error searching professions:', error);
            return [];
        }
    };

    // 📥 Get profession by ID with enhanced error handling
    const getProfessionById = async (professionId) => {
        if (!professionId) return null;
        
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/profession`);
            
            if (Array.isArray(response.data)) {
                const profession = response.data.find(p => p.id === parseInt(professionId));
                return profession ? { 
                    label: profession.ProfessionName || profession.name || profession.profession_name, 
                    value: profession.id 
                } : null;
            } else {
                console.warn('Unexpected profession response format:', response.data);
                return null;
            }
        } catch (error) {
            console.error('Error fetching profession by ID:', error);
            return null;
        }
    };

    // 🔍 Search education
const searchEducation = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
        const baseUrl = getBaseUrl();
        const response = await axios.get(`${baseUrl}/api/education?search=${encodeURIComponent(searchText)}`);
        if (Array.isArray(response.data)) {
            return response.data.map(item => ({
                label: item.EducationName || item.name,
                value: item.id
            }));
        } else {
            console.warn("Unexpected education response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error searching education:", error);
        return [];
    }
};

// 🔍 Search designations
const searchDesignations = async (searchText) => {
    if (!searchText || searchText.length < 2) return [];

    try {
        const baseUrl = getBaseUrl();
        const response = await axios.get(`${baseUrl}/api/designation?search=${encodeURIComponent(searchText)}`);
        if (Array.isArray(response.data)) {
            return response.data.map(item => ({
                label: item.DesignationName || item.name,
                value: item.id
            }));
        } else {
            console.warn("Unexpected designation response format:", response.data);
            return [];
        }
    } catch (error) {
        console.error("Error searching designation:", error);
        return [];
    }
};

    // 🔍 Search mother tongues
    const searchMotherTongues = async (searchText) => {
        if (!searchText || searchText.length < 2) return [];

        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/mother-tongues`);
            console.log("DEBUG: Full list fetched for mother tongues:", response.data);

            if (Array.isArray(response.data)) {
                return response.data
                    .filter(item => item.mother_tongue?.toLowerCase().includes(searchText.toLowerCase()))
                    .map(item => ({
                        label: item.mother_tongue,
                        value: item.mother_tongue,
                        id: item.id
                    }));
            } else {
                console.warn("Unexpected response format:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error in searchMotherTongues:", error);
            return [];
        }
    };

    // 📥 Get mother tongue by ID
    const getMotherTongueById = async (id) => {
        if (!id) return null;
        
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/languages`);
            if (Array.isArray(response.data)) {
                const lang = response.data.find(l => l.id === parseInt(id));
                if (lang) {
                    return {
                        label: lang.LanguageName || lang.name,
                        value: lang.LanguageName || lang.name,
                        id: lang.id
                    };
                }
            }
        } catch (error) {
            console.error('Error fetching mother tongue by ID:', error);
        }
        return null;
    };

    // 🔍 Search native/residing places (shared API)
    const searchPlaces = async (searchText) => {
        if (!searchText || searchText.length < 2) return [];
        
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/native-places`);
            if (Array.isArray(response.data)) {
                return response.data
                    .filter(item =>
                        item.nativeplace?.toLowerCase().includes(searchText.toLowerCase())
                    )
                    .map(item => ({
                        label: item.nativeplace,
                        value: item.nativeplace,
                        id: item.id
                    }));
            } else {
                console.warn("Unexpected places response format:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error searching native/residing places:", error);
            return [];
        }
    };

    // 🔍 Search Guru Matha
    const searchGuruMatha = async (searchText) => {
        if (!searchText || searchText.length < 2) return [];

        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/guru-matha?search=${encodeURIComponent(searchText)}`);
            if (Array.isArray(response.data)) {
                return response.data.map(item => ({
                    label: item.GuruMathaName,
                    value: item.GuruMathaName,
                    id: item.id
                }));
            } else {
                console.warn("Unexpected guru matha response format:", response.data);
                return [];
            }
        } catch (error) {
            console.error("Error searching guru matha:", error);
            return [];
        }
    };

    // 📥 Get place by ID
    const getPlaceById = async (id) => {
        if (!id) return null;
        
        try {
            const baseUrl = getBaseUrl();
            const response = await axios.get(`${baseUrl}/api/native-places`);
            if (Array.isArray(response.data)) {
                const place = response.data.find(p => p.id === parseInt(id));
                return place
                    ? { label: place.nativeplace, value: place.nativeplace, id: place.id }
                    : null;
            }
        } catch (error) {
            console.error("Error fetching place by ID:", error);
        }
        return null;
    };

    // 🔁 Auto-fetch master data
    useEffect(() => {
        if (endpoint) {
            const fetchData = async () => {
                try {
                    const baseUrl = getBaseUrl();
                    const response = await axios.get(`${baseUrl}${endpoint}`);
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
                    const baseUrl = getBaseUrl();
                    const apiCalls = [
                        {
                            url: `${baseUrl}/api/gotras`,
                            setter: setGotraOptions,
                            name: 'gotras',
                            transformer: data => data.map(i => ({
                                label: i.gotraname || i.GotraName || i.name,
                                value: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/rashis`,
                            setter: setRashiOptions,
                            name: 'rashis',
                            transformer: data => data.map(i => ({
                                label: i.rashiname || i.RashiName || i.name,
                                value: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/nakshatras`,
                            setter: setNakshatraOptions,
                            name: 'nakshatras',
                            transformer: data => data.map(i => ({
                                label: i.nakshatraname || i.NakshatraName || i.name,
                                value: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/profession`,
                            setter: setProfessionOptions,
                            name: 'professions',
                            transformer: data => data.map(i => ({
                                label: i.ProfessionName || i.name || i.profession_name,
                                value: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/languages`,
                            setter: setMotherTongueOptions,
                            name: 'languages',
                            transformer: data => data.map(i => ({
                                label: i.LanguageName || i.name,
                                value: i.LanguageName || i.name,
                                id: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/cities`,
                            setter: setCityOptions,
                            name: 'cities',
                            transformer: data => data.map(i => ({
                                label: i.CityName || i.name,
                                value: i.CityName || i.name,
                                id: i.id
                            }))
                        },
                        {
                            url: `${baseUrl}/api/places`,
                            setter: setNativePlaceOptions,
                            name: 'places',
                            transformer: data => data.map(i => ({
                                label: i.PlaceName || i.name,
                                value: i.PlaceName || i.name,
                                id: i.id
                            }))
                        }
                    ];

                    await Promise.allSettled(apiCalls.map(async ({ url, setter, name, transformer }) => {
                        try {
                            const res = await axios.get(url);
                            if (Array.isArray(res.data)) {
                                const transformed = transformer(res.data);
                                setter(transformed);
                                console.log(`✓ Loaded ${name}:`, transformed.length, 'items');
                            } else {
                                console.warn(`Invalid ${name} response format:`, res.data);
                            }
                        } catch (error) {
                            console.warn(`Failed to fetch ${name}:`, error.message);
                        }
                    }));
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
const checkProfileExists = async (profileId) => {
  if (!profileId) return false;

  try {
    const baseUrl = getBaseUrl();
    const response = await axios.get(`${baseUrl}/api/profile/${profileId}`);
    return response?.data?.profileId ? true : false;
  } catch (error) {
    console.error("❌ Error checking if profile exists:", error);
    return false;
  }
};

    return {
        // Loading states
        isLoading,
        error,
        data,
        
        // Master data options
        gotraOptions,
        rashiOptions,
        nakshatraOptions,
        professionOptions,
        motherTongueOptions,
        cityOptions,
        nativePlaceOptions,

        checkProfileExists,

        
        // Search functions
        searchProfessions,          // 🔍 Profession search
        getProfessionById,          // 📥 Get profession by ID
        searchMotherTongues,        // 🔍 Mother tongue search
        getMotherTongueById,        // 📥 Get mother tongue by ID
        searchPlaces,               // 🔍 Places search
        getPlaceById,               // 📥 Get place by ID
        searchGuruMatha,             // 🔍 Guru Matha search
         // 👇 Newly added
  searchEducation,
  searchDesignations
    };
};

export default useApiData;