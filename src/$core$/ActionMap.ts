import { UIState } from "../$state$/UIState.ts";
import { getItem, removeItem, addItem } from "../$state$/GridState.ts";

// @ts-ignore
import { initTaskManager } from "/externals/wcomp/ui.js";
import { exportSettings, importSettings, pickBinaryFromFS, saveBinaryToFS } from "../$state$/ImportExport.ts";

// redundant from core
import { navigate } from "./FileManage.ts";
import { fileActions } from "./FileAction";

//
export const taskManager = initTaskManager();

//
const UUIDv4 = () => {
    return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
};

//
const isSameOrigin = (a)=>{
    const urlA = a instanceof URL ? a : (URL.canParse(a) ? new URL(a) : null);
    return !a || (a.startsWith("./") || a.startsWith("/")) || (urlA?.origin == location?.origin) || a?.trim()?.startsWith?.("#");
};

//
const linkViewer = ({title, icon, href})=>{
    const id = "#" + "TASK-" + Array.from({ length: 8 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
    const task = { title, icon, href: href?.trim?.(), id, active: true };

    // @ts-ignore
    const module = import("../$solid$/$maps$/Tasks.tsx")?.then?.(({tasks, setTasks})=>{
        taskManager?.addTask?.(task, true);
        requestIdleCallback?.(()=>{
            taskManager?.focus?.(id);
        })
    });
};

//
export const actionMap = new Map<any, any>([
    ["close-task", (id)=>{
        taskManager?.removeTask?.(id);
    }],

    ["manager", (goTo = "")=>{
        taskManager?.focus?.("#manager");
        requestAnimationFrame(()=>{
            if (goTo) { navigate?.(goTo); };
        });
    }],

    ["settings", ()=>{
        taskManager?.focus?.("#settings");
    }],

    ["fullscreen", ()=>{
        //
        if (!document.fullscreenElement) {
            document.documentElement?.requestFullscreen?.({
                navigationUI: "hide", screen
            })?.catch?.(console.warn.bind(console));
        } else
        if (document.exitFullscreen) {
            document?.exitFullscreen?.();
        }
    }],

    ["item-edit", (id)=>{
        const item = getItem(id);
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    //
    ["item-add", ()=>{
        const item = addItem(UUIDv4(), {});
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    //
    ["item-delete", (id)=>{
        removeItem(id);
    }],

    // "open-link" works as "_blank" if external domain, and "_self" if internal domain or same origin
    ["open-link", (href: any, takeAction?: any|null)=>{
        const desc = typeof href == "object" ? href : null;
        if (desc) href = desc?.href?.trim?.();
        const openLink = (href)=> { return (desc ? linkViewer(desc) : window.open(href, isSameOrigin(href||"") ? "_self" : "_blank")); };
        if (typeof href == "string") {
            // TODO:: external files support, custom mounts of FS
            if ((href = href?.trim?.())?.startsWith?.("/user")) {
                if (href?.endsWith?.("/") && !takeAction) { return actionMap?.get?.("manager")?.(href); };
                return (takeAction ?? fileActions(href, {actionMap}) ?? openLink)?.(href);
            } else
            if (href?.trim?.()?.startsWith?.("#")) {
                return taskManager?.focus?.(href?.trim?.());
            } else {
                return (takeAction ?? openLink)?.(href);
            }
        }
    }],

    //
    ["export-settings", ()=>{ saveBinaryToFS?.(exportSettings()); }],
    ["import-settings", ()=>{ pickBinaryFromFS()?.then?.(importSettings); }]
]);
