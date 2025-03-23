//
import { taskManager } from "../Tasks";
import { getFileExtension, provide, removeFile } from "./FileOps";
import { useFileAs } from "./Wallpaper";
import { makeReactive } from "/externals/lib/object.js";

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
export const openMarkdown = ({label, icon, href})=>{
    const taskId = "#" + "TASK-" + Array.from({ length: 8 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
    const task = makeReactive({
        taskId, active: true, //type: "iframe",
        desc: makeReactive({ label, icon }),
        args: makeReactive({ href: href?.trim?.(), type: "markdown" })
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
    ["markdown", async (path, args?)=>{
        const file = await provide(path?.name || path) as File;
        return openMarkdown({label: file?.name || "", icon: "letter-text", href: URL.createObjectURL(file)});
    }],
    ["view", async (path, args?)=>{
        const file = (path instanceof File || path instanceof Blob) ? path : (await provide(path?.name || path) as File);
        return openImage({label: (file as any)?.name || "", icon: "image", href: URL.createObjectURL(file)});
    }],
    ["use", async (path, args?)=>{ return useFileAs(path?.name || path); }],
    ["text", async (path, args?)=>{ console.error("Not implemented!"); }],
    ["error", async (path, args?)=>{ console.error(args?.reason || "Not implemented!"); }],
    ["delete", async(path, args?)=>{ return removeFile(path, args); }],

    //
    ["to-clipboard", async (path, args?)=>{
        const file = (path instanceof File || path instanceof Blob) ? path : (await provide(path?.name || path) as File);
        if (ClipboardItem.supports(file?.type)) {
            const clipboardItem = new ClipboardItem({
                [file?.type || "text/plain"]: file,
            });
            return navigator.clipboard.write([clipboardItem]);
        }
        return null;
    }],
]);


//
export const imageTypes = new Set(["png", "gif", "jpg", "jpeg", "webp"]);
export const fileTypeAction = new Map([
    ["md", "markdown"],
    ["png", "view"],
    ["jpg", "view"],
    ["gif", "view"],
    ["webp", "view"],
    ["jng", "error"],
    ["jpeg", "view"],
    ["txt", "text"],
    ["plain", "text"],
]);




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
