//
import { getDir, provide } from "./FileOps";

// @ts-ignore
import { colorScheme } from "/externals/core/theme.js";

//
export const STOCK_NAME = "/assets/wallpaper/stock.webp"

//
export const fileActionMap = new Map([
    ["view", async (path, args?)=>{
        console.warn("Image View Not Implemented!");
        useItemEv(path?.name || path);
    }],
    ["use", async (path, args?)=>{
        useItemEv(path?.name || path);
    }],
    ["text", async (path, args?)=>{
        console.error("Not implemented!");
    }],
    ["error", async (path, args?)=>{
        console.error(args?.reason || "Not implemented!");
    }],
]);

//
export const fileTypeAction = new Map([
    ["png", "view"],
    ["jpg", "view"],
    ["gif", "view"],
    ["webp", "view"],
    ["jng", "error"],
]);

//
export const getFileExtension = (path)=>{
    return path.split(".")?.[1];
}

//
export const actionByType = (ext)=>{
    return fileTypeAction.get(ext) || "error";
}

//
export const fileActions = (path, args?)=>{
    if (path) {
        fileActionMap.get(actionByType(getFileExtension(path)) || "error")?.(path, args);
    }
}

//
export const useAsWallpaper = (f_path) => {
    const wallpaper = document.querySelector("canvas[is=\"ui-canvas\"]") as HTMLElement;
    if (wallpaper && f_path) {
        // if f_path is string
        if (typeof f_path == "string" && (URL.canParse(f_path) || f_path?.startsWith?.("/"))) {
            const inUserSpace = getDir(f_path)?.startsWith?.("/user");
            if (!inUserSpace) { wallpaper.dataset.src = f_path; };
            // @ts-ignore
            Promise.try(provide, f_path)?.then?.((F: any) => {
                wallpaper.dataset.src = inUserSpace ? URL.createObjectURL(F) : f_path;
                if (F) { colorScheme(F); };
            })?.catch?.(()=>{
                wallpaper.dataset.src = f_path;
            });
        } else

        // if f_path is not string
        if (f_path instanceof Blob || f_path instanceof File) {
            wallpaper.dataset.src = URL.createObjectURL(f_path as File);
            colorScheme(f_path);
        }
    }
    return f_path?.name || f_path;
};

//
export const useItemEv = (selectedFilename)=>{
    const url = (selectedFilename || STOCK_NAME);
    localStorage.setItem("@wallpaper", useAsWallpaper(url));
}
