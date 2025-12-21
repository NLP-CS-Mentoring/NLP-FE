import { useState } from "react";
import { generateBasic, generateWithStyle } from "../api/coverLetterApi";
import { extractErrorMessage } from "../utils/error";

export interface UseCoverLetterResult {
    loading: boolean;
    result: string | null;
    error: string | null;
    createBasic: (userFact: string) => Promise<void>;
    createWithStyle: (file: File, userFact: string) => Promise<void>;
}

export const useCoverLetter = (): UseCoverLetterResult => {
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>('');
    const [error, setError] = useState<string>('');

    const createBasic = async (userFact: string) => {
        try {
            setLoading(true);
            setError('');
            const data = await generateBasic(userFact);
            setResult(data.result);
        } catch (e: unknown) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    const createWithStyle = async (file: File, userFact: string) => {
        try {
            setLoading(true);
            setResult('');
            const data = await generateWithStyle(file, userFact);
            setResult(data.result);
        } catch (e: unknown) {
            setError(extractErrorMessage(e));
        } finally {
            setLoading(false);
        }
    };

    return { loading, result, error, createBasic, createWithStyle };
};
