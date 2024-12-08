export declare const useFS: () => any;
export declare const provide: (req?: string | Request, rw?: boolean) => Promise<any>;
export declare const downloadImage: (file: any) => Promise<void>;
export declare const getFileList: (exists: any, setFiles?: any, dirname?: string) => Promise<Map<unknown, unknown>>;
export declare const useAsWallpaper: (file: any) => void;
export declare const loadFromStorage: () => Promise<void>;
export declare const useItemEv: (selectedFilename: any, setFiles?: any) => Promise<void>;
export declare const imageImportDesc: {
    types: {
        description: string;
        accept: {
            "image/*": string[];
        };
    }[];
    startIn: string;
    multiple: boolean;
};
export declare const addItemEv: (setFiles?: any, dir?: string) => Promise<void>;
export declare const removeItemEv: (selectedFilename: any, setFiles?: any, dir?: string) => Promise<void>;
export declare const downloadItemEv: (selectedFilename: any, setFiles?: any) => Promise<void>;
