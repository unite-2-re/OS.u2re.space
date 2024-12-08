export declare const targetItem: any, setTargetItem: any;
export declare const defaultLists: string[][];
export declare const defaultItems: ({
    id: string;
    icon: string;
    label: string;
    href: string;
    action?: undefined;
} | {
    id: string;
    icon: string;
    label: string;
    href: string;
    action: string;
})[];
export declare const wrapItemToReactive: (item: any) => any;
export declare const unwrap: (items: any[] | Set<any>) => any;
export declare const mergeByKey: (items: any[] | Set<any>, key?: string) => unknown[];
export declare const gridState: any;
export declare const saveToStorage: (ev?: any) => void;
export declare const getItem: (id: any) => unknown;
export declare const addItem: (id: any, structure: any) => any;
export declare const removeItem: (id: any) => unknown;
