import { useState, useEffect } from "react";
import axios from "axios";

const useApiData = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [gotraOptions, setGotraOptions] = useState([]);
    const [rashiOptions, setRashiOptions] = useState([]);
    const [nakshatraOptions, setNakshatraOptions] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch gotras
                const gotrasResponse = await axios.get("http://localhost:3001/api/gotras");
                if (Array.isArray(gotrasResponse.data)) {
                    setGotraOptions(gotrasResponse.data);
                } else {
                    console.error("Unexpected gotra response format:", gotrasResponse.data);
                    setError("Invalid gotra data format received.");
                }
                
                // Fetch rashis
                const rashisResponse = await axios.get("http://localhost:3001/api/rashis");
                if (Array.isArray(rashisResponse.data)) {
                    setRashiOptions(rashisResponse.data);
                } else {
                    console.error("Unexpected Rashi response format:", rashisResponse.data);
                    setError("Invalid Rashi data format received.");
                }
                
                // Fetch nakshatras
                const nakshatrasResponse = await axios.get("http://localhost:3001/api/nakshatras");
                if (Array.isArray(nakshatrasResponse.data)) {
                    setNakshatraOptions(nakshatrasResponse.data);
                } else {
                    console.error("Unexpected Nakshatra response format:", nakshatrasResponse.data);
                    setError("Invalid Nakshatra data format received.");
                }
                
            } catch (error) {
                console.error("Error fetching data:", error);
                setError("Failed to load data. Please try again later.");
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchData();
    }, []);

    return {
        isLoading,
        error,
        gotraOptions,
        rashiOptions,
        nakshatraOptions
    };
};

export default useApiData;