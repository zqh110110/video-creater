export { HttpClient } from './client/http-client';
import { TianmuClient } from './client/tianmu-client';
export { TianmuClient } from './client/tianmu-client';
export * from './types';
export * from './utils';
export declare function createTianmuClient(config: {
    app_key: string;
    app_secret: string;
    baseURL?: string;
    timeout?: number;
}): TianmuClient;
export default TianmuClient;
//# sourceMappingURL=index.d.ts.map