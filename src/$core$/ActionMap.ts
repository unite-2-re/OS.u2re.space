import { UIState } from "@src/$state$/UIState.ts";
import { getItem, removeItem, addItem } from "../$state$/GridState.ts";

// @ts-ignore
import {initTaskManager} from "/externals/core/core.js";
import { exportSettings, importSettings, pickBinaryFromFS, saveBinaryToFS } from "@/src/$state$/ImportExport.ts";

//
const taskManager = initTaskManager();

//
const UUIDv4 = () => {
    return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
};

//
const isSameOrigin = (a)=>{
    const urlA = a instanceof URL ? a : (URL.canParse(a) ? new URL(a) : null);
    return !a || (a.startsWith("./") || a.startsWith("/")) || (urlA?.origin == location?.origin) || a?.trim()?.startsWith?.("#");
}

//
export const actionMap = new Map([
    ["set-wallpaper", (initiator, ev?)=>{
        taskManager?.focus?.("#manager");
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
    root?.addEventListener?.("ag-click", (evc)=>{
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
