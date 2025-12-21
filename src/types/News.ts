export interface ArticleResponse {
    title: string;
    link: string;
    preview: string;
    pubDate: string;
}

export interface NewsReportResponse {
    report: {
        summary: string;
        keywords: string;
        atmosphere_status: string;
        atmosphere_percent: number;
        atmosphere_reason: string;
    };
}

export interface NewsRequest {
    interest: string;
}

export interface CareerRequest {
    query: string;
}

export interface CareerResponse {
    advice: string;
}
