import { UIState } from "../$state$/UIState.ts";
import { getItem, removeItem, addItem } from "../$state$/GridState.ts";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";
import { exportSettings, importSettings, pickBinaryFromFS, saveBinaryToFS } from "../$state$/ImportExport.ts";
import tasks, { setTasks } from "../$solid$/$maps$/Tasks.tsx";

//
const taskManager = initTaskManager();

//
taskManager?.on?.("removeTask", ({task})=>{
    const index = tasks?.()?.findIndex((t)=>t?.id == task?.id);
    if (index >= 0) {
        tasks?.().splice(index, 1);
    }
    setTasks?.(tasks);
});

//
taskManager?.on?.("addTask", ({task})=>{
    const index = tasks?.()?.findIndex((t)=>t?.id == task?.id);
    if (index < 0) tasks?.()?.push?.(task);
    setTasks?.(tasks);
});


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
export const actionMap = new Map([
    ["close-task", ()=>{
        
    }],

    ["open-in-frame", (initiator, ev?)=>{
        const id = "#" + "TASK-" + Array.from({ length: 8 }, () => "0123456789ABCDEF".charAt(Math.floor(Math.random() * 16))).join('');
        const task = {
            id,
            title: (initiator?.dataset?.label?.trim?.() || initiator?.dataset?.href?.trim?.()),
            active: true,
            icon: (initiator?.dataset?.icon?.trim?.() || "globe"),
            href: (initiator?.dataset?.href?.trim?.())
        };
        
        // @ts-ignore
        const module = import("../$solid$/$maps$/Tasks.tsx")?.then?.(({tasks, setTasks})=>{
            taskManager?.addTask?.(task, true);
            requestIdleCallback?.(()=>{
                taskManager?.focus?.(id);
            })
        });
    }],

    ["set-wallpaper", (initiator, ev?)=>{
        taskManager?.focus?.("#manager");
    }],

    ["settings", (initiator, ev?)=>{
        taskManager?.focus?.("#settings");
    }],

    ["fullscreen", ()=>{
        //
        if (!document.fullscreenElement) {
            document.documentElement?.requestFullscreen?.({
                navigationUI: "hide",
            })?.catch?.(console.warn.bind(console));
        } else
        if (document.exitFullscreen) {
            document?.exitFullscreen?.();
        }
    }],

    ["item-edit", (initiator, ev?)=>{
        const item = getItem(initiator?.dataset?.id);
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    ["item-add", (initiator, ev?)=>{
        const item = addItem(UUIDv4(), {});
        if (item) {
            UIState.currentItem = item;
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    ["item-delete", (initiator, ev?)=>{
        removeItem(initiator?.dataset?.id);
    }],

    // "open-link" works as "_blank" if external domain, and "_self" if internal domain or same origin
    ["open-link", (initiator)=>{
        if (initiator?.dataset?.href?.trim?.()?.startsWith?.("#")) {
            taskManager?.focus?.(initiator?.dataset?.href?.trim?.());
        } else {
            window.open(initiator?.dataset?.href, isSameOrigin(initiator?.dataset?.href||"") ? "_self" : "_blank");
        }
    }],

    //
    ["export-settings", (initiator)=>{ saveBinaryToFS?.(exportSettings()); }],
    ["import-settings", (initiator)=>{ pickBinaryFromFS()?.then?.(importSettings); }]
]);

//
export const initActionMap = (root = document.documentElement)=>{
    root?.addEventListener?.("ag-click", (evc: any)=>{
        const ev = evc?.detail || evc;
        if (ev?.target?.matches?.("[data-dragging]") || ev?.target?.closest?.("[data-dragging]")) { return; };
        const element   = ev?.target as HTMLElement;
        const selector  = "*[data-action]";
        const initiator = element?.matches?.(selector) ? element : element?.closest?.(selector);
        const actionCb  = actionMap.get((initiator as HTMLElement)?.dataset?.action || "open-link");
        if (actionCb && initiator) {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            actionCb?.(initiator, ev);
        }
    });
}

//
export default initActionMap;
