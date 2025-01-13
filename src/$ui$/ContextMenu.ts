import { actionMap } from "../$state$/ActionMap.ts";

// @ts-ignore
import { UILucideIcon, makeCtxMenuItems, openContextMenu } from "/externals/wcomp/ui.js";

//
export const ctxMenuMap = new Map([
    [".u2-grid-item", [
        {icon: new UILucideIcon({icon: "external-link", padding: "0.05rem"}), content: "Open Link", callback(initiator) { actionMap.get("open-link")?.(initiator?.dataset?.href || "#"); } },
        {icon: new UILucideIcon({icon: "pencil", padding: "0.05rem"}), content: "Edit", callback(initiator) { actionMap.get("item-edit")?.(initiator?.dataset?.id); } },
        {icon: new UILucideIcon({icon: "badge-x", padding: "0.05rem"}), content: "Delete", callback(initiator) { actionMap.get("item-delete")?.(initiator?.dataset?.id); } }
    ]],
    [".u2-desktop-grid", [
        {icon: new UILucideIcon({icon: "badge-plus", padding: "0.05rem"}), content: "Add Item", callback() { actionMap.get("item-add")?.(); } },

        // deprecated, needs to refactor UI
        /*{icon: new UILucideIcon({icon: "fullscreen", padding: "0.05rem"}), content: "Fullscreen", callback() { actionMap.get("fullscreen")?.(); } },
        {icon: new UILucideIcon({icon: "folder-code", padding: "0.05rem"}), content: "Manager", callback() { actionMap.get("manager")?.(); } },
        {icon: new UILucideIcon({icon: "settings", padding: "0.05rem"}), content: "Settings", callback() { actionMap.get("settings")?.(); } },*/
    ]],
]);

//
export const initCtxMenu = (root = document.documentElement)=>{
    //
    const ctxMenu = (ev, o_ev?)=>{
        o_ev?.preventDefault?.();
        o_ev?.stopPropagation?.();

        //
        const element = ev?.target as HTMLElement;
        const entry = Array.from(ctxMenuMap.entries())?.find?.(([K,_])=>{
            return (element?.matches?.(K) || element?.closest?.(K));
        });

        //
        const one = entry?.[1];
        const selector = entry?.[0] || "";
        const initiator = selector ? (element?.matches?.(selector) ? element : element?.closest?.(selector)) : null;

        //
        if (one && initiator) {
            //ev?.stopImmediatePropagation?.();
            //o_ev?.stopImmediatePropagation?.();
            openContextMenu({
                target: initiator,
                clientX: ev.clientX,
                clientY: ev.clientY,
                pageX: ev.pageX,
                pageY: ev.pageY
            }, false, (menu, initiator)=>makeCtxMenuItems(menu, initiator, one));
        }
    }

    //
    root?.addEventListener?.("contextmenu", ctxMenu);
}

//
export default initCtxMenu;
