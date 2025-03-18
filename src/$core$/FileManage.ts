// @ts-ignore
import { makeReactive, subscribe } from "/externals/lib/object.js";
import { getDir, provide, useFS } from "./FileOps";
import { fileActions, STOCK_NAME } from "./FileAction";

// TODO: targeting support
export const preload = new Map<string, HTMLImageElement>();
export const preloadImage = (path, current?)=>{
    const file = current?.get?.(path);
    if (file && (file instanceof File || file instanceof Blob)) {
        const img = new Image();
        img.decoding = "async";
        img.src = URL.createObjectURL(file);
        preload.set(path, img);
    }
}


//
export class FileManagment {
    #current: any;
    #task: any;

    //
    static elementMap = new WeakMap();

    //
    constructor(task?: any) {
        this.#task = task;
        this.#current = makeReactive(new Map([]));
    }

    //
    async getFileList(dirname = "/user/images/", navigate?: any) {
        const path: any = getDir?.(dirname);
        if (path) {
            this.#current?.clear?.();

            // root directory (currently, not available, except "/user/")
            // root directories practically unsupported (just stub)
            if (path == "/") {
                this.#current.set("/user/", ()=>navigate?.("/user/"));
                this.#current.set("/assets/", ()=>navigate?.("/assets/"));
            } else {
                this.#current.set("..", ()=>navigate?.((path?.split?.("/")?.slice?.(0, -2)?.join?.("/") || "") + "/"));
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
                        this.#current.set(dir, ()=>navigate?.(dir));
                    }));

                    // file types
                    await Promise.all(entries.filter(({handle})=>(handle instanceof FileSystemFileHandle)).map(async ({path: fn, handle})=>{
                        const file = await handle.getFile();
                        this.#current.set(path + fn, file);
                    }));
                }
            } else

            // root directories (practically unsupported)
            if (path?.startsWith?.("/assets")) {
                // add stock image into registry
                this.#current.set(STOCK_NAME, await provide(STOCK_NAME));
            }
        }

        //
        return this.#current;
    }

    currentDir(val?: any|null) {
        if (this.#task) {
            if (val && this.#task.directory != val) { this.#task.directory = val; };
            return this.#task.directory || "/user/images/";
        } else {
            const manager = document.querySelector("#manager");
            const input: any = manager?.querySelector?.("ui-longtext input");
            if (val && input) { input.value = val; };
            return input?.value || val || "/user/images/";
        }
    }

    static getManager(element) {
        return this.elementMap.get(element?.closest?.(".ui-content") || element);
    }

    static fileOf(element?) {
        return ((element ?? document.querySelector("#manager"))?.querySelector?.(".adl-content input:checked") as HTMLInputElement)?.value||"";
    }

    static bindManager(element, manager) {
        this.elementMap.set(element, manager);
    }

    getCurrent() {
        return this.#current;
    }

    byType (path) {
        if (path?.endsWith?.("..")) {
            return this.currentDir()?.endsWith("user/") ? "shield-alert" : "arrow-left";
        }
        if (path?.endsWith?.("/")) {
            if (path == "/user/") return "folder-root";
            if (!path?.startsWith?.("/user/")) return "folder-lock";
            return "folder";
        }
        return "wallpaper";
    }

    navigate(path = "/", ev?: any) {
        if (!ev || ev?.type == "dblclick" || ev?.pointerType == "touch") {
            if (path?.startsWith?.("..")) { return this.navigate?.(this.currentDir()?.split?.("/")?.slice?.(0, -2)?.join?.("/") + "/" || ""); };
            return (path?.endsWith("/") ? this.getFileList(this.currentDir(path), this.navigate.bind(this)) : this.fileAction(path, ev));
        };
    };

    async fileAction(path, ev?: any) {
        // if directory (but action avoided indirectly)
        if (path?.endsWith?.("/") || path?.startsWith?.("..")) {
            const file = await (this.#current?.get(path) ?? provide(path));
            return typeof file == "string" ? this.navigate?.(file) : (typeof file == "function" ? file?.() : file);
        };

        // if regular file (currently, only wallpaper usage implemented)
        if (!ev || ev?.type == "dblclick") {
            return fileActions(path, {current: this.#current});
            //return useItemEv(path);
        };
    };
}
