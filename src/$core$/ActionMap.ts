import { UIState } from "./state/UIState.ts";
import { workspace } from "./state/GridState.ts";
import { exportSettings, importSettings, pickBinaryFromFS, saveBinaryToFS } from "./state/ImportExport.ts";

//
import { makeReactive } from "/externals/lib/object.js";

// redundant from core
import { fileActions } from "./file/FileAction";
import { FileManagment } from "./file/FileManage";
import { managerTask, settingsTask, taskManager } from "./Tasks.ts";

//
const UUIDv4 = () => { return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16)); };
const isSameOrigin = (a)=>{
    const urlA = a instanceof URL ? a : (URL.canParse(a) ? new URL(a) : null);
    return !a || (a.startsWith("./") || a.startsWith("/")) || (urlA?.origin == location?.origin) || a?.trim()?.startsWith?.("#");
};

//
export const linkViewer = ({label, icon, href})=>{
    const taskId = "#" + "TASK-" + Array.from({ length: 8 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
    const task = makeReactive({
        taskId, active: true, //type: "iframe",
        desc: makeReactive({ label, icon }),
        args: makeReactive({ href: href?.trim?.(), type: "iframe" })
    });

    {
        taskManager?.addTask?.(task, true);
        requestIdleCallback?.(()=>{
            taskManager?.focus?.(taskId);
        })
    }
};

//
const DOC = document.documentElement;
export const actionMap = new Map<any, any>([
    ["toggle-popup", (target?)=>{
        if (target?.matches("[data-popup]")) {
            const popup = document.querySelector("ui-modal[type=\"popup\"][data-name=\"" + target?.dataset?.popup + "\"]") as any;
            popup?.showPopup?.(target?.matches(".ui-anchor") ? target : target?.closest(".ui-anchor"))
            DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ if (el != popup) { el.dataset.hidden = ""; }; });
        } else {
            DOC.querySelectorAll("ui-modal[type=\"popup\"]")?.forEach?.((el: any)=>{ el.dataset.hidden = ""; });
        }
    }],

    ["close-task", (id)=>{
        taskManager?.removeTask?.(id);
    }],

    ["manager", (goTo = "")=>{
        taskManager?.addTask?.(managerTask);
        taskManager?.focus?.("#manager");
        const manager = FileManagment.getManager(document.querySelector("#manager"));
        requestAnimationFrame(()=>{
            if (goTo) { manager?.navigate?.(goTo); };
        });
    }],

    ["settings", ()=>{
        taskManager?.addTask?.(settingsTask);
        taskManager?.focus?.("#settings");
    }],

    ["fullscreen", ()=>{
        //
        if (!document.fullscreenElement) {
            return document.documentElement?.requestFullscreen?.({ navigationUI: "hide", screen })?.catch?.(console.warn.bind(console));
        } else
        if (document.exitFullscreen) {
            return document?.exitFullscreen?.();
        }
    }],

    ["item-edit", (id)=>{
        const item = workspace.getItem(id);
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    //
    ["item-add", (event?: any)=>{
        const item = workspace.addItem(UUIDv4(), event);
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    //
    ["item-delete", (id)=>{
        workspace.removeItem(id);
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
                return (takeAction ?? (fileActions ?? openLink)?.(href, {actionMap}))?.(href);
            } else
            if (href?.trim?.()?.startsWith?.("#")) {
                if (href?.trim?.() == "#manager")  { actionMap?.get?.("manager")?.(href);  };
                if (href?.trim?.() == "#settings") { actionMap?.get?.("settings")?.(href); };
                //return actionMap?.get?.("manager")?.();
            } else {
                return (takeAction ?? openLink)?.(href);
            }
        }
    }],

    //
    ["export-settings", ()=>{ saveBinaryToFS?.(exportSettings()); }],
    ["import-settings", ()=>{ pickBinaryFromFS()?.then?.(importSettings); }]
]);
