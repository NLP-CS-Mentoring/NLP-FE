export interface BasicResponse {
    status: string;
    mode: "basic";
    result: string;
}

export interface StyleResponse {
    status: string;
    mode: "style_transfer";
    analyzed_style: Record<string, unknown>;
    result: string;
}
