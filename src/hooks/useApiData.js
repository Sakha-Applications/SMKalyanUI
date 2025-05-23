import { useState, useEffect } from "react";
import axios from "axios";
import config from './config';

const useApiData = (endpoint) => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [data, setData] = useState([]);
    // Keep the original state variables for backward compatibility
    const [gotraOptions, setGotraOptions] = useState([]);
    const [rashiOptions, setRashiOptions] = useState([]);
    const [nakshatraOptions, setNakshatraOptions] = useState([]);
    // Add professionOptions state
    const [professionOptions, setProfessionOptions] = useState([]);

    useEffect(() => {
        if (endpoint) {
            // If an endpoint is provided, fetch just that specific data
            const fetchEndpointData = async () => {
                try {
                    const response = await axios.get(`${config.apiUrl}${endpoint}`);
                    if (Array.isArray(response.data)) {
                        setData(response.data);
                    } else {
                        console.error(`Unexpected response format from ${endpoint}:`, response.data);
                        setError(`Invalid data format received from ${endpoint}`);
                    }
                } catch (error) {
                    console.error(`Error fetching data from ${endpoint}:`, error);
                    setError(`Failed to load data from ${endpoint}. Please try again later.`);
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchEndpointData();
        } else {
            // Original behavior - fetch all data types
            const fetchAllData = async () => {
                try {
                    // Fetch gotras
                    const gotrasResponse = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/gotras`);
                    if (Array.isArray(gotrasResponse.data)) {
                        setGotraOptions(gotrasResponse.data);
                    } else {
                        console.error("Unexpected gotra response format:", gotrasResponse.data);
                        setError("Invalid gotra data format received.");
                    }
                    
                    // Fetch rashis
                    const rashisResponse = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/rashis`);
                    if (Array.isArray(rashisResponse.data)) {
                        setRashiOptions(rashisResponse.data);
                    } else {
                        console.error("Unexpected Rashi response format:", rashisResponse.data);
                        setError("Invalid Rashi data format received.");
                    }
                    
                    // Fetch nakshatras
                    const nakshatrasResponse = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/nakshatras`);
                    if (Array.isArray(nakshatrasResponse.data)) {
                        setNakshatraOptions(nakshatrasResponse.data);
                    } else {
                        console.error("Unexpected Nakshatra response format:", nakshatrasResponse.data);
                        setError("Invalid Nakshatra data format received.");
                    }
                    
                    // Fetch professions
                    const professionsResponse = await axios.get(`https://sakhasvc-agfcdyb7bjarbtdw.centralus-01.azurewebsites.net/api/profession`);
                    if (Array.isArray(professionsResponse.data)) {
                        setProfessionOptions(professionsResponse.data);
                    } else {
                        console.error("Unexpected Profession response format:", professionsResponse.data);
                        setError("Invalid Profession data format received.");
                    }
                    
                } catch (error) {
                    console.error("Error fetching data:", error);
                    setError("Failed to load data. Please try again later.");
                } finally {
                    setIsLoading(false);
                }
            };
            
            fetchAllData();
        }
    }, [endpoint]);

    return {
        isLoading,
        error,
        data,
        gotraOptions,
        rashiOptions,
        nakshatraOptions,
        professionOptions // Add professionOptions to the returned object
    };
};

export default useApiData;