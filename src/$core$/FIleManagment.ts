//
//import { pickWallpaperImage } from "@adl/PreInit/ActionMap.ts";

// @ts-ignore
import {colorScheme} from "/externals/core/theme.js";

// @ts-ignore
import {observeBySelector} from "/externals/lib/dom.js";

//
const $useFS$ = async() => {
    // @ts-ignore
    const opfs = await import('/externals/vendor/happy-opfs.mjs').catch(console.warn.bind(console));

    // @ts-ignore
    const deno = typeof Deno != "undefined" ? Deno : null;

    /* @vite-ignore */
    const ignore = "" + "";
    /* @vite-ignore */
    let node = null;
    if (!opfs?.isOPFSSupported()) {
        try {
            node = await import(/*@vite-ignore */ ignore + "node:fs/promises").catch(console.warn.bind(console));
        } catch(e) {
            console.warn(e);
        }
    }

    //
    const fs = opfs?.isOPFSSupported() ? opfs : (deno ?? node);
    return fs;
}

//
let currentFS: any = null;
export const useFS = ()=>{
    return (currentFS ??= $useFS$());
}

//
export const provide = async (req: string | Request = "", rw = false) => {
    const path: string = (req as Request)?.url ?? req;
    const relPath = path.replace(location.origin, "");
    if (relPath.startsWith("/opfs")) {
        const fs = await useFS();
        const params = relPath.split(/\?/i)?.[1] || relPath;
        const $path = new URLSearchParams(params).get("path");
        const parts = $path?.split?.("/") || [$path] || [""];

        //
        await fs.mkdir("/" + parts.slice(0, parts.length-1)?.join("/"));
        if (rw) {
            return {
                write(data) {
                    return fs.writeFile("/" + $path, data);
                }
            }
        }

        //
        const handle = await fs.readFile("/" + $path, {encoding: "blob"});
        const file = handle?.unwrap?.() ?? handle;
        return file;
    } else {
        return fetch(path).then(async (r) => {
            const blob = await r.blob();
            const lastModified = Date.parse(r.headers.get("Last-Modified") || "") || 0;
            return new File([blob], relPath.substring(relPath.lastIndexOf('/') + 1), {
                type: blob.type,
                lastModified
            });
        });
    }
    return null;
};

// Function to download data to a file
export const downloadImage = async (file) => {
    const filename = file.name || "wallpaper";

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
const files = new Map([]);
export const getFileList = async (exists, setFiles?, dirname = "images/")=>{
    const fs  = await useFS(); await fs?.mkdir?.("/" + dirname);
    const dir = await fs.readDir("/" + dirname);
    const entries: any[] = await (Array.fromAsync(await (dir?.unwrap?.() ?? dir)) || exists);
    if (entries) {
        await Promise.all(entries.filter(({handle})=>(handle instanceof FileSystemFileHandle)).map(async ({path, handle})=>{
            files.set(path, await handle.getFile());
        }));
        setFiles?.(files);
    }
    return files;
}

//
export const useAsWallpaper = (file)=>{
    //provide
    const wallpaper = document.querySelector("canvas[is=\"ui-canvas\"]") as HTMLElement;
    if (wallpaper) {
        wallpaper.dataset.src = URL.createObjectURL(file as File);
        colorScheme(file);
    }
}

//
export const loadFromStorage = async ()=>{
    const item = localStorage.getItem("@wallpaper");
    if (item) {
        provide(localStorage.getItem("@wallpaper") || "/assets/wallpaper/h.webp").then(useAsWallpaper);
    }
}

//
addEventListener("storage", (ev)=>{
    if (ev?.key == "@wallpaper") {
        if (ev?.newValue) {
            provide(ev?.newValue || "").then(useAsWallpaper);
        }
    }
});

//
export const useItemEv = (selectedFilename, setFiles?)=>{
    return getFileList(null, setFiles).then(()=>{
        console.log(selectedFilename);
        if (selectedFilename && files.has(selectedFilename)) {
            const file = files.get(selectedFilename);
            if (file != null) {
                useAsWallpaper(file);
                localStorage.setItem("@wallpaper", "/opfs?path=" + "/images/" + (selectedFilename || "wallpaper"));
                files.set(selectedFilename, file);
                setFiles?.(files);
            }
        }
    });
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
export const addItemEv = async (setFiles?, dir = "images/")=>{
    const fs = await useFS();
    const $e = "showOpenFilePicker";

    // @ts-ignore
    const showOpenFilePicker = window?.[$e]?.bind?.(window) ?? (await import("/externals/polyfill/showOpenFilePicker.mjs"))?.[$e];
    showOpenFilePicker(imageImportDesc)?.then?.(async ([handle] = [])=>{
        const file = await handle?.getFile?.();
        const fn   = (file?.name || "wallpaper");

        //
        await fs.mkdir("/" + dir);
        await fs.writeFile("/" + dir + fn, file);

        //
        files.set(fn, file);
        setFiles?.(files);
        await getFileList(fs, setFiles);
    });
}

//
export const removeItemEv = async (selectedFilename, setFiles?, dir = "images/")=>{
    const fs = await useFS();
    if (selectedFilename) {
        (async ()=>{
            if (("/opfs?path=" + dir + (selectedFilename || "wallpaper")) != localStorage.getItem("@wallpaper")) {
                await fs.mkdir("/" + dir);
                await fs.remove("/" + dir + selectedFilename);

                //
                files.delete(selectedFilename);

                //
                setFiles?.(files);
                await getFileList(fs, setFiles);
            }
        })();
    }
}

//
export const downloadItemEv = (selectedFilename, setFiles?)=>{
    return getFileList(null, setFiles).then(()=>{
        if (selectedFilename && files.has(selectedFilename)) {
            downloadImage(files.get(selectedFilename));
        }
    });
}

//
requestIdleCallback(()=>{
    loadFromStorage();
});

//
observeBySelector(document.documentElement, "canvas[is=\"ui-canvas\"]", (mut)=>{
    loadFromStorage();
});
