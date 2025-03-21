import { UILucideIcon, makeCtxMenuItems, openContextMenu } from "/externals/wcomp/ui.js";

//
import { actionMap } from "../ActionMap.ts";
import { fileActionMap } from "../file/FileAction.ts";
import { FileManagment } from "../file/FileManage.ts";
import { pasteInWorkspace } from "./FileInteration.ts";

//
export const ctxMenuMap = new Map([
    [".u2-grid-item", [
        {icon: new UILucideIcon({icon: "pencil", padding: "0.05rem"}), content: "Edit", callback(initiator) { actionMap.get("item-edit")?.(initiator?.dataset?.id); } },
        {icon: new UILucideIcon({icon: "badge-x", padding: "0.05rem"}), content: "Delete", callback(initiator) { actionMap.get("item-delete")?.(initiator?.dataset?.id); } },

        {icon: new UILucideIcon({icon: "copy-minus", padding: "0.05rem"}), content: "Copy Link", condition(initiator) { return !!initiator?.dataset?.href; }, callback(initiator) { if (initiator?.dataset?.href) Promise.try(navigator.clipboard.writeText.bind(navigator.clipboard), initiator?.dataset?.href);; } },
        {icon: new UILucideIcon({icon: "external-link", padding: "0.05rem"}), content: "Open Link", condition(initiator) { return !!initiator?.dataset?.href; }, callback(initiator) { actionMap.get("open-link")?.(initiator?.dataset?.href || "#"); } },
        {icon: new UILucideIcon({icon: "app-window", padding: "0.05rem"}), content: "Open Frame", condition(initiator) { return !!initiator?.dataset?.href; }, callback(initiator) { actionMap.get("open-link")?.({
            label: (initiator?.dataset?.label?.trim?.() || initiator?.dataset?.href?.trim?.()),
            icon: (initiator?.dataset?.icon?.trim?.() || initiator?.icon?.trim?.() || "globe"),
            href: (initiator?.dataset?.href?.trim?.() || "#")
        }); } },
    ]],
    [".u2-desktop-grid", [
        {icon: new UILucideIcon({icon: "badge-plus", padding: "0.05rem"}), content: "Add Item", callback(_, event?) { actionMap.get("item-add")?.(event); } },
        {icon: new UILucideIcon({icon: "settings", padding: "0.05rem"}), content: "Settings", callback(_, event?) { actionMap.get("settings")?.(event); } },
        {icon: new UILucideIcon({icon: "clipboard", padding: "0.05rem"}), content: "Paste", callback(_, event?) { pasteInWorkspace(navigator.clipboard?.read?.()?.then?.((items)=>({items})), event); } },
        // deprecated, needs to refactor UI
        /*{icon: new UILucideIcon({icon: "fullscreen", padding: "0.05rem"}), content: "Fullscreen", callback() { actionMap.get("fullscreen")?.(); } },
        {icon: new UILucideIcon({icon: "folder-code", padding: "0.05rem"}), content: "Manager", callback() { actionMap.get("manager")?.(); } },
        {icon: new UILucideIcon({icon: "settings", padding: "0.05rem"}), content: "Settings", callback() { actionMap.get("settings")?.(); } },*/
    ]],
    ["ui-select-row[name=\"file\"]", [
        {icon: new UILucideIcon({icon: "app-window", padding: "0.05rem"}), content: "View file", callback(initiator) { fileActionMap?.get?.("view")?.(initiator?.value); } },
        {icon: new UILucideIcon({icon: "wallpaper", padding: "0.05rem"}), content: "Use as wallpaper", callback(initiator) { fileActionMap?.get?.("use")?.(initiator?.value); } },
        {icon: new UILucideIcon({icon: "copy-minus", padding: "0.05rem"}), content: "Copy path", callback(initiator) { if (initiator?.value) Promise.try(navigator.clipboard.writeText.bind(navigator.clipboard), initiator?.value); } },
        {icon: new UILucideIcon({icon: "circle-x", padding: "0.05rem"}), content: "Delete", callback(initiator) { fileActionMap?.get?.("delete")?.(initiator?.value, FileManagment?.getManager?.(initiator)?.getCurrent?.()); } },
    ]]
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
            }, true, (menu, initiator)=>makeCtxMenuItems(menu, initiator, one.filter((el)=>{
                return el?.condition?.(initiator) ?? true;
            })));
        }
    }

    //
    root?.addEventListener?.("contextmenu", ctxMenu);
}

//
export default initCtxMenu;
