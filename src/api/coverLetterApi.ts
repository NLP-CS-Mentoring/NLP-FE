import axios from "axios";

import type { BasicResponse, StyleResponse } from "../types/CoverLetter";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000",
});

export const generateBasic = async (userFact: string): Promise<BasicResponse> => {
    const res = await api.post("/cover-letter/generate/basic", { 
        user_fact: userFact 
    });
    return res.data;
};

export const generateWithStyle = async (file: File, userFact: string): Promise<StyleResponse> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_fact", userFact);

    const res = await api.post("/cover-letter/generate/with-style", formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
};
