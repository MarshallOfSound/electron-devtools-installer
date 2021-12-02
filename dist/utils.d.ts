export declare const getPath: () => string;
export declare const downloadFile: (from: string, to: string) => Promise<void>;
export declare const changePermissions: (dir: string, mode: string | number) => void;
