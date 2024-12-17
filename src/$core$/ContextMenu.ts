import { actionMap } from "@/src/$core$/ActionMap.ts";

// @ts-ignore
import { UILucideIcon } from "/externals/wcomp/ui.js";

// @ts-ignore
import { openContextMenu } from "/externals/wcomp/contextmenu.js";

//
export const ctxMenuMap = new Map([
    [".u2-grid-item", [
        {icon: new UILucideIcon({icon: "pencil", padding: "0.05rem"}), content: "Edit", callback(initiator) { actionMap.get("item-edit")?.(initiator); } },
        {icon: new UILucideIcon({icon: "badge-x", padding: "0.05rem"}), content: "Delete", callback(initiator) { actionMap.get("item-delete")?.(initiator); } }
    ]],
    [".u2-desktop-grid", [
        {icon: new UILucideIcon({icon: "badge-plus", padding: "0.05rem"}), content: "Add Item", callback(initiator) { actionMap.get("item-add")?.(initiator); } },
        {icon: new UILucideIcon({icon: "wallpaper", padding: "0.05rem"}), content: "Set Wallpaper", callback(initiator) { actionMap.get("set-wallpaper")?.(initiator); } },
        {icon: new UILucideIcon({icon: "fullscreen", padding: "0.05rem"}), content: "Fullscreen", callback(initiator) { actionMap.get("fullscreen")?.(initiator); } },
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
            }, one, false);
        }
    }

    //
    root?.addEventListener?.("contextmenu", ctxMenu);
}

//
export default initCtxMenu;
