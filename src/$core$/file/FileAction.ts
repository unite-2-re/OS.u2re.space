//
import { taskManager } from "../Tasks";
import { provide, removeFile } from "./FileOps";
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
    return path?.split?.(".")?.[1];
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
