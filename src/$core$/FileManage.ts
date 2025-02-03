// @ts-ignore
import { makeReactive, subscribe } from "/externals/lib/object.js";
import { getDir, provide, STOCK_NAME, useFS, useItemEv } from "./FileOps";

// TODO: targeting support
export const preload = new Map<string, HTMLImageElement>();
export const current = makeReactive(new Map([]));

//
export const preloadImage = (path)=>{
    const file = current?.get?.(path);
    if (file && (file instanceof File || file instanceof Blob)) {
        const img = new Image();
        img.decoding = "async";
        img.src = URL.createObjectURL(file);
        preload.set(path, img);
    }
}

//
export const getFileList = async (dirname = "/user/images/", navigate?: any)=>{
    const path: any = getDir?.(dirname);
    if (path) {
        current?.clear?.();

        // root directory (currently, not available, except "/user/")
        // root directories practically unsupported (just stub)
        if (path == "/") {
            current.set("/user/", ()=>navigate?.("/user/"));
            current.set("/assets/", ()=>navigate?.("/assets/"));
        } else {
            current.set("..", ()=>navigate?.((path?.split?.("/")?.slice?.(0, -2)?.join?.("/") || "") + "/"));
        }

        // user-space OPFS
        if (path?.startsWith?.("/user")) {
            const user = path?.replace?.("/user","");
            const fs   = await useFS(); await fs?.mkdir?.(user);
            const dir  = await fs?.readDir?.(user);
            const entries: null|any[] = await (dir ? Array.fromAsync(await (dir?.unwrap?.() ?? dir)) : null);
            if (entries) {
                // directory types
                await Promise.all(entries.filter(({handle})=>(handle instanceof FileSystemDirectoryHandle)).map(async ({path: fn})=>{
                    const dir = path + fn + "/";
                    current.set(dir, ()=>navigate?.(dir));
                }));

                // file types
                await Promise.all(entries.filter(({handle})=>(handle instanceof FileSystemFileHandle)).map(async ({path: fn, handle})=>{
                    const file = await handle.getFile();
                    current.set(path + fn, file);
                }));
            }
        } else

        // root directories (practically unsupported)
        if (path?.startsWith?.("/assets")) {
            // add stock image into registry
            current.set(STOCK_NAME, await provide(STOCK_NAME));
        }
    }

    //
    return current;
};

// fileOf - under selection, currentDir - under path field
export const fileOf = ()=>((document.querySelector("#manager .adl-content input:checked") as HTMLInputElement)?.value||"");
export const currentDir = (val?: any|null)=>{ 
    const manager = document.querySelector("#manager");
    const input: any = manager?.querySelector?.("ui-longtext input");
    if (val && input) { input.value = val; };
    return input?.value || val || "/user/images/";
};

// dynamic icon by type
export const byType = (path)=>{
    if (path?.endsWith?.("..")) {
        return currentDir()?.endsWith("user/") ? "shield-alert" : "arrow-left";
    }
    if (path?.endsWith?.("/")) {
        if (path == "/user/") return "folder-root";
        if (!path?.startsWith?.("/user/")) return "folder-lock";
        return "folder";
    }
    return "wallpaper";
};

//
export const navigate = (path = "/", ev?: any)=>{
    if (!ev || ev?.type == "dblclick" || ev?.pointerType == "touch") {
        if (path?.startsWith?.("..")) { return navigate?.(currentDir()?.split?.("/")?.slice?.(0, -2)?.join?.("/") + "/" || ""); };
        return (path?.endsWith("/") ? getFileList(currentDir(path), navigate) : fileAction(path, ev));
    };
};

//
export const fileAction = (path, ev?: any)=>{
    // if directory (but action avoided indirectly)
    if (path?.endsWith?.("/") || path?.startsWith?.("..")) {
        const file = current?.get(path);
        return typeof file == "string" ? navigate?.(file) : (typeof file == "function" ? file?.() : file);
    };

    // if regular file (currently, only wallpaper usage implemented)
    if (!ev || ev?.type == "dblclick") { return useItemEv(path); };
};

//
getFileList("/user/images/");
