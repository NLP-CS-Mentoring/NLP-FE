import { AxiosError } from "axios";

interface ApiErrorResponse {
    detail?: string;
}

export const extractErrorMessage = (error: unknown): string => {
    // api 에러
    if (error instanceof AxiosError) {
        const data = error.response?.data as ApiErrorResponse | undefined;
        return data?.detail ?? error.message;
    }

    // 일반 어레
    if (error instanceof Error) {
        return error.message;
    }
    return "extractErrorMessage => 오류가 발생";
};
