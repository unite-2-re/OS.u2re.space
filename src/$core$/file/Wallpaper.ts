import { downloadFile, getDir, provide } from "./FileOps";
import { colorScheme } from "/externals/core/theme.js";

//
export const downloadImage = async (f_path)=>{ downloadFile(f_path); };
export const useAsWallpaper = (f_path) => {
    const wallpaper = document.querySelector("canvas[is=\"ui-canvas\"]") as HTMLElement;
    if (wallpaper && f_path) {
        // if f_path is string
        if (typeof f_path == "string" && (URL.canParse(f_path) || f_path?.startsWith?.("/"))) {
            const inUserSpace = getDir(f_path)?.startsWith?.("/user");
            if (!inUserSpace) { wallpaper.dataset.src = f_path; };
            // @ts-ignore
            Promise.try(provide, f_path)?.then?.((F: any) => {
                try { wallpaper.dataset.src = inUserSpace ? URL.createObjectURL(F) : f_path; } catch(e) { wallpaper.dataset.src = f_path; };
                if (F) { colorScheme(F); };
            })?.catch?.(()=>{
                wallpaper.dataset.src = f_path;
            });
        } else

        // if f_path is not string
        if (f_path instanceof Blob || f_path instanceof File) {
            try { wallpaper.dataset.src = URL.createObjectURL(f_path as File); } catch(e) { console.warn(e); };
            colorScheme(f_path);
        }
    }
    return f_path?.name || f_path;
};
