// @ts-ignore
import { colorScheme } from "/externals/core/theme.js";

// @ts-ignore
import {observeBySelector} from "/externals/lib/dom.js";

//
export const STOCK_NAME = "/assets/wallpaper/stock.webp"

//
export const getDir = (dest)=>{
    if (typeof dest != "string") return dest;

    //
    dest = dest?.trim?.() || dest;
    if (!dest?.endsWith?.("/")) { dest = dest?.trim?.()?.split?.("/")?.slice(0, -1)?.join?.("/")?.trim?.() || dest; };
    const p1 = !dest?.trim()?.endsWith("/") ? (dest+"/") : dest;
    return (!p1?.startsWith("/") ? ("/"+p1) : p1);
}

//
const $useFS$ = async() => {
    // @ts-ignore
    const opfs = await import(/*@vite-ignore */ '/externals/vendor/happy-opfs.mjs').catch(console.warn.bind(console));

    // @ts-ignore
    const deno = typeof Deno != "undefined" ? Deno : null;

    /* @vite-ignore */
    const ignore = "" + "";
    /* @vite-ignore */
    let node = null;
    if (!opfs?.isOPFSSupported?.()) {
        try {
            node = await import(/*@vite-ignore */ ignore + "node:fs/promises").catch(console.warn.bind(console));
        } catch(e) {
            console.warn(e);
        }
    }

    //
    const fs = opfs?.isOPFSSupported?.() ? opfs : (deno ?? node ?? opfs);
    return fs;
}

//
let currentFS: any = null;
export const useFS = ()=>{ return (currentFS ??= $useFS$()); };
export const provide = async (req: string | Request = "", rw = false) => {
    const url: string = (req as Request)?.url ?? req;
    const path = getDir(url?.replace?.(location.origin, "")?.trim?.());
    const fn   = url?.split("/")?.at?.(-1);

    //
    if (!URL.canParse(url) && path?.trim()?.startsWith?.("/user")) {
        const fs = await useFS();
        const $path = path?.replace?.("/user/", "")?.trim?.();
        const clean = (($path?.split?.("/") || [$path])?.filter?.((p)=>!!p?.trim?.()) || [""])?.join?.("/") || "";
        const npt = ((clean && clean != "/") ? "/" + clean + "/" : clean) || "/";

        //
        if (npt && npt != "/") { await fs?.mkdir?.(npt); };
        if (rw) {
            return {
                write(data) {
                    return fs?.writeFile?.(npt + fn, data);
                }
            }
        }

        //
        const handle = await fs?.readFile?.(npt + fn, {encoding: "blob"});

        //
        let file = null;
        try { file = handle?.unwrap?.() ?? handle; } catch(e) {};
        return file;
    } else {
        return fetch(req).then(async (r) => {
            const blob = await r.blob();
            const lastModified = Date.parse(r.headers.get("Last-Modified") || "") || 0;
            return new File([blob], url.substring(url.lastIndexOf('/') + 1), {
                type: blob.type,
                lastModified
            });
        });
    }
    return null;
};

// Function to download data to a file
export const downloadImage = async (file) => {
    const filename = file.name || STOCK_NAME;

    //
    if ("msSaveOrOpenBlob" in self.navigator) {
        // IE10+
        // @ts-ignore
        window.navigator.msSaveOrOpenBlob(file, filename);
    }

    //
    // @ts-ignore
    const fx = await (self?.showOpenFilePicker
        ? new Promise((r) =>
            r({
                // @ts-ignore
                showOpenFilePicker: self?.showOpenFilePicker?.bind?.(window),
                // @ts-ignore
                showSaveFilePicker: self?.showSaveFilePicker?.bind?.(window),
                // @ts-ignore
            })
        )
        // @ts-ignore
        : import(/* @vite-ignore */ "/externals/polyfill/showOpenFilePicker.mjs"));

    //
    // @ts-ignore
    if (window?.showSaveFilePicker) {
        // @ts-ignore
        const fileHandle = await self?.showSaveFilePicker?.({
                suggestedName: filename
            })
            ?.catch?.(console.warn.bind(console));
        const writableFileStream = await fileHandle
            ?.createWritable?.({ keepExistingData: true })
            ?.catch?.(console.warn.bind(console));
        await writableFileStream
            ?.write?.(file)
            ?.catch?.(console.warn.bind(console));
        await writableFileStream?.close()?.catch?.(console.warn.bind(console));
    } else {
        // Others
        let url = "";
        const a = document.createElement("a");
        a.href = url = URL.createObjectURL(file);
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    }
};

//
export const useAsWallpaper = (f_path) => {
    const wallpaper = document.querySelector("canvas[is=\"ui-canvas\"]") as HTMLElement;
    if (wallpaper && f_path) {
        // if f_path is string
        if (typeof f_path == "string" && (URL.canParse(f_path) || f_path?.startsWith?.("/"))) {
            const path = getDir(f_path);
            const inUserSpace = path?.startsWith?.("/user");
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
};

//
export const loadFromStorage = async ()=>{
    const item = localStorage.getItem("@wallpaper");
    if (item) {
        useAsWallpaper(localStorage.getItem("@wallpaper") || "");
    }
}

//
addEventListener("storage", (ev)=>{
    if (ev?.key == "@wallpaper") {
        if (ev?.newValue) {
            useAsWallpaper(ev?.newValue || "");
        }
    }
});

//
export const useItemEv = (selectedFilename)=>{
    const url = (selectedFilename || STOCK_NAME);
    useAsWallpaper(url);
    localStorage.setItem("@wallpaper", url);
}

//
export const imageImportDesc = {
    types: [
        {
            description: "wallpaper",
            accept: {
                "image/*": [
                    ".png",
                    ".gif",
                    ".jpg",
                    ".jpeg",
                    ".webp",
                    ".jxl",
                ],
            },
        },
    ],
    startIn: "pictures",
    multiple: false,
};

//
export const dropItemEv = async (file, dest = "/user/images/", current?: any)=>{
    const fs = await useFS();
    const path = getDir(dest);

    //
    if (!path?.startsWith?.("/user")) return;
    const user = path?.replace?.("/user","");
    const fp = user + (file?.name || "wallpaper");

    //
    await fs?.mkdir?.(user);
    await fs?.writeFile?.(fp, file);

    // TODO! needs to fix same directory scope
    current?.set?.("/user" + fp, file);

    //
    return "/user" + fp;
}

//
export const addItemEv = async (dest = "/user/images/", current?: any)=>{
    const $e = "showOpenFilePicker";

    // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("/externals/polyfill/showOpenFilePicker.mjs"))?.[$e];
    return showOpenFilePicker(imageImportDesc)?.then?.(async ([handle] = [])=>{
        const file = await handle?.getFile?.();
        return dropItemEv(file, dest, current);
    });
}

//
export const removeItemEv = async (f_path = "", current?: any)=>{
    const path = getDir(f_path);

    // TODO: supports other file systems
    if (!path?.startsWith?.("/user")) return;
    const user = path?.replace?.("/user","");

    //
    const fn = f_path?.trim?.()?.split?.("/")?.at?.(-1);
    if (f_path) {
        const fs = await useFS();
        (async ()=>{
            if ((f_path || STOCK_NAME) != (localStorage.getItem("@wallpaper") || "")) {
                if (fn) {
                    await fs?.mkdir?.(user);
                    await fs?.remove?.(user + fn);
                } else {
                    await fs?.remove?.(user, {recursive: true});
                }

                //
                current?.delete?.(f_path);
            }
        })();
    }
}

//
export const downloadItemEv = async (f_path)=>{
    downloadImage(await provide(f_path));
};

//
requestIdleCallback(()=>{
    loadFromStorage();
});

//
observeBySelector(document.documentElement, "canvas[is=\"ui-canvas\"]", (mut)=>{
    loadFromStorage();
});
