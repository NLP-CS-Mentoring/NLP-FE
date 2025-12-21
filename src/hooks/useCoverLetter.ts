import { useState } from "react";
import { generateBasic, generateWithStyle } from "../api/coverLetterApi";

export const useCoverLetter = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<string>("");
    const [error, setError] = useState<string>("");

    const createBasic = async (userFact: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await generateBasic(userFact);
            setResult(res.result);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_CONNECTION_REFUSED')) {
                setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
            } else {
                setError(err.response?.data?.detail || "자소서 생성에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    const createWithStyle = async (file: File, userFact: string) => {
        setLoading(true);
        setError("");
        try {
            const res = await generateWithStyle(file, userFact);
            setResult(res.result);
        } catch (err: any) {
            console.error(err);
            if (err.code === 'ERR_NETWORK' || err.message.includes('ERR_CONNECTION_REFUSED')) {
                setError("백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.");
            } else {
                setError(err.response?.data?.detail || "자소서 생성에 실패했습니다.");
            }
        } finally {
            setLoading(false);
        }
    };

    return { loading, result, error, createBasic, createWithStyle };
};
