export declare const ctxMenuMap: Map<string, {
    icon: any;
    content: string;
    callback(initiator: any): void;
}[]>;
export declare const initCtxMenu: (root?: HTMLElement) => void;
export default initCtxMenu;
