//
//import { pickWallpaperImage } from "@adl/PreInit/ActionMap.ts";

//
export const useFS = async() => {
    const opfs = await import('happy-opfs/dist/main.mjs').catch(console.warn.bind(console));

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
export const provide = async (req: string | Request = "", rw = false) => {
    const fs = await useFS();

    //
    const path: string = (req as Request)?.url ?? req;
    const relPath = path.replace(location.origin, "");
    if (relPath.startsWith("/opfs")) {
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
export const getFileList = async (exists, state, dirname = "/images/")=>{
    const fs  = await useFS(); await fs?.mkdir?.(dirname);
    const dir = await fs.readDir(dirname);
    const entries: any[] = await (Array.fromAsync(await (dir?.unwrap?.() ?? dir)) || exists);
    if (entries) {
        await Promise.all(entries.filter(({handle})=>(handle instanceof FileSystemFileHandle)).map(async ({path, handle})=>{
            files.set(path, await handle.getFile());
        }));
        if (state) { state.fileList = files; };
    }
    return files;
}

//
export const selectFileEv = (ev, state)=>{
    /*document.querySelectorAll("#manager .file").forEach((el)=>{
        el.classList.remove("selected");
    });

    //
    ev.target.classList.add("selected");*/

    //
    state.selectedFilename = ev.target.dataset.filename;
}

//
export const useItemEv = (ev, state)=>{
    return getFileList(null, state).then(()=>{
        const {selectedFilename} = state;
        if (selectedFilename && files.has(selectedFilename)) {
            const file = files.get(selectedFilename);
            if (file != null) {
                const wallpaper = document.querySelector("canvas[is=\"ui-canvas\"]") as HTMLElement;
                if (wallpaper) {
                    wallpaper.dataset.src = URL.createObjectURL(file as File);
                }

                //
                files.set(selectedFilename, file);
                state.fileList = files;
            }
        }
    });
}

//
export const addItemEv = async (ev, state)=>{
    const fs = await useFS();

    //
    /*pickWallpaperImage()
        .catch(console.warn.bind(console))
        .then(async (blob) => {
            if (blob) {
                const fn = (blob?.name || "wallpaper");
                await fs.mkdir("/images/");
                await fs.writeFile("/images/" + fn, blob);

                //
                files.set(fn, blob);

                //
                state.selectedFilename = fn;
                state.fileList = files;

                //
                await getFileList(fs, state);
            }
        });*/
}

//
export const removeItemEv = async (ev, state)=>{
    const fs = await useFS();
    const {selectedFilename} = state;
    if (selectedFilename) {
        (async ()=>{
            if (("/opfs?path=images/" + (selectedFilename || "wallpaper")) != localStorage.getItem("@wallpaper")) {
                await fs.mkdir("/images/");
                await fs.remove("/images/" + selectedFilename);

                //
                files.delete(selectedFilename);
                state.selectedFilename = null;
                state.fileList = files;

                //
                await getFileList(fs, state);
            }
        })();
    }
}

//
export const downloadItemEv = (ev, state)=>{
    const {selectedFilename} = state;
    return getFileList(null, state).then(()=>{
        if (selectedFilename && files.has(selectedFilename)) {
            downloadImage(files.get(selectedFilename));
        }
    });
}
