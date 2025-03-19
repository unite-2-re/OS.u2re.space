//
import { taskManager } from "../Tasks";
import { getDir, provide, removeFile } from "./FileOps";

// @ts-ignore
import { colorScheme } from "/externals/core/theme.js";
import { makeReactive } from "/externals/lib/object";

//
export const STOCK_NAME = "/assets/wallpaper/stock.webp"

//
export const openImage = ({label, icon, href})=>{
    const taskId = "#" + "TASK-" + Array.from({ length: 8 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
    const task = makeReactive({
        taskId, active: true, //type: "iframe",
        desc: makeReactive({ label, icon }),
        args: makeReactive({ href: href?.trim?.(), type: "image" })
    });

    {
        taskManager?.addTask?.(task, true);
        requestIdleCallback?.(()=>{
            taskManager?.focus?.(taskId);
        })
    }
};

//
export const fileActionMap = new Map([
    ["view", async (path, args?)=>{
        const file = await provide(path?.name || path) as File;
        return openImage({label: file?.name || "", icon: "image", href: URL.createObjectURL(file)});
    }],
    ["use", async (path, args?)=>{ return useFileAs(path?.name || path); }],
    ["text", async (path, args?)=>{ console.error("Not implemented!"); }],
    ["error", async (path, args?)=>{ console.error(args?.reason || "Not implemented!"); }],
    ["delete", async(path, args?)=>{ return removeFile(path, args); }]
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
export const useFileAs = (selectedFilename)=>{
    const url = (selectedFilename || STOCK_NAME);
    localStorage.setItem("@wallpaper", useAsWallpaper(url));
}
