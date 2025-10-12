import { createContext, useEffect, useCallback, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import axios from "../../node_modules/axios/index";
import { apiEndpoints } from "../util/apiendpoints";
import toast from "../../node_modules/react-hot-toast/dist/index";

export const UserCreditsContext = createContext();

export const UserCreditsProvider = ({ children }) => {
    const [credits,setCredits]= useState(5);
    const [loading,setLoading]= useState(false);
    const {getToken,isSignedIn}= useAuth();

    //Functions to fetch and update credits can be added here

    const fetchCredits = useCallback(async() => {
        if(!isSignedIn) return;
        setLoading(true);
        try{
            const token = await getToken();
            const response = await axios.get(apiEndpoints.GET_CREDITS,{headers: {Authorization: `Bearer ${token}`}});
            if(response.status === 200){
                setCredits(response.data.credits);
            }else{
                toast.error("Failed to fetch credits");
            }
        }catch(error){
            console.error("Error fetching credits:",error);
        }finally{
            setLoading(false);
        }
    }, [getToken,isSignedIn]);

    useEffect(() => {
        if(isSignedIn) {
            fetchCredits();
        }
    }, [fetchCredits, isSignedIn]);

    const updateCredits = useCallback(newCredits => {
        console.log("Updating credits to:", newCredits);
        setCredits(newCredits);
    },[]);

    const contextValue={
        credits,
        setCredits,
        fetchCredits,
        updateCredits
    }
    
    return(
        <UserCreditsContext.Provider value={contextValue}>
            {children}
        </UserCreditsContext.Provider>
    )
}