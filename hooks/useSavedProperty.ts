import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function useSavedProperty(propertyId: string, onUnSve?: () => void) {
    const {accessToken} = useAuth();
    const [isSaved, setIsSaved] = useState(false);
    const [saveLoading, setSaveLoading] = useState(false);

    const headers = {
        'accept': '*/*',
        'Authorization': `Bearer ${accessToken}`
    };

    const checkIfSaved = async () => {
        if(!accessToken) return;
        try {
            const res = await fetch(`${API_URL}/Saved/check/${propertyId}`, {headers});
            if(!res.ok) return;
            const data = await res.json();
            setIsSaved(data.isSaved);
        } catch (error) {
            console.error('checkIfSaved error', error);
        }
    };
    
    // Call API CheckIfSaved
    useEffect(() => {
        checkIfSaved();
    }, [propertyId, accessToken])



    const save = async () => {
        const res = await fetch(`${API_URL}/Saved/${propertyId}`, {
            method: 'POST',
            headers,
        });
        if(res.ok) setIsSaved(true);
    };

    const unsave = async () => {
        const res = await fetch(`${API_URL}/Saved/${propertyId}`, {
            method:"DELETE",
            headers
        });
        if(res.ok) {
            setIsSaved(false);
            onUnSve?.();
        }
    };

    const toggleSave = async () => {
        if(!accessToken || saveLoading) return;
        setSaveLoading(true);
        try {
            isSaved ? await unsave() : await save();
        } catch (error) {
            console.error('toggleSave error', error);
        } finally {
            setSaveLoading(false);
        }
    }

    return {isSaved, saveLoading, toggleSave}
}