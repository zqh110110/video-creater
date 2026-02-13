export declare class WorkingMCPClient {
    private client;
    constructor();
    testTextToVideo(prompt?: string): Promise<{
        success: boolean;
        task_id: string;
        data: import("../index.js").TaskResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        task_id?: undefined;
        data?: undefined;
    }>;
    testTextToImage(prompt?: string): Promise<{
        success: boolean;
        task_id: string;
        data: import("../index.js").TaskResponse;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        task_id?: undefined;
        data?: undefined;
    }>;
}
//# sourceMappingURL=working-mcp-client.d.ts.map