import { UILucideIcon, makeCtxMenuItems, openContextMenu } from "/externals/wcomp/ui.js";

//
import { actionMap } from "../ActionMap.ts";
import { FileManagment } from "../file/FileManage.ts";
import { pasteInWorkspace } from "./FileInteration.ts";
import { doUIAction, UIAction } from "./ItemAction.ts";
import { getFileExtension } from "../file/FileOps.ts";
import { imageTypes } from "../file/FileAction.ts";

//
export const ctxMenuMap = new Map([
    [".u2-grid-item", [
        {icon: new UILucideIcon({icon: "pencil"    , padding: "0.05rem"}), content: "Edit"     , callback(initiator) { return UIAction.get("item-edit")?.(initiator);   } }, //if (initiator?.dataset?.href)
        {icon: new UILucideIcon({icon: "copy-minus", padding: "0.05rem"}), content: "Copy Link", callback(initiator) { return UIAction.get("copy-link")?.(initiator);   }  , condition(initiator) { return !!initiator?.dataset?.href; } },
        {icon: new UILucideIcon({icon: "braces"    , padding: "0.05rem"}), content: "Copy JSOX", callback(initiator) { return UIAction.get("item-copy")?.(initiator);   } },
        {icon: new UILucideIcon({icon: "folder"    , padding: "0.05rem"}), content: "Explore"  , callback(initiator) { return UIAction.get("manager")?.(initiator);     }  , condition(initiator) { return initiator?.dataset?.href?.startsWith?.("/user/"); } },
        {icon: new UILucideIcon({icon: "badge-x"   , padding: "0.05rem"}), content: "Delete"   , callback(initiator) { return UIAction.get("item-delete")?.(initiator); } },
    ]],
    [".u2-desktop-grid", [
        {icon: new UILucideIcon({icon: "badge-plus", padding: "0.05rem"}), content: "Add Item", callback(_, event?) { return actionMap.get("item-add")?.(event); } },
        {icon: new UILucideIcon({icon: "settings"  , padding: "0.05rem"}), content: "Settings", callback(_, event?) { return actionMap.get("settings")?.(event); } },
        {icon: new UILucideIcon({icon: "clipboard" , padding: "0.05rem"}), content: "Paste"   , callback(_, event?) { return pasteInWorkspace(navigator.clipboard?.read?.()?.then?.((items)=>({items})), event); } },
    ]],
    ["ui-select-row[name=\"file\"], #manager ui-select-row", [
        {icon: new UILucideIcon({icon: "app-window", padding: "0.05rem"}), content: "View file"       , callback(initiator) { return doUIAction?.("file:action"      , initiator); } },
        {icon: new UILucideIcon({icon: "wallpaper" , padding: "0.05rem"}), content: "Use as wallpaper", callback(initiator) { return doUIAction?.("file:use"         , initiator); }, condition(initiator) { return imageTypes.has(getFileExtension(initiator?.value)); } },
        {icon: new UILucideIcon({icon: "copy-minus", padding: "0.05rem"}), content: "Copy path"       , callback(initiator) { return doUIAction?.("file:copy-path"   , initiator); } },
        {icon: new UILucideIcon({icon: "book-copy" , padding: "0.05rem"}), content: "Copy item"       , callback(initiator) { return doUIAction?.("file:to-clipboard", initiator); } },
        {icon: new UILucideIcon({icon: "file-down" , padding: "0.05rem"}), content: "Download"        , callback(initiator) { return doUIAction?.("file:download"    , initiator); } },
        {icon: new UILucideIcon({icon: "circle-x"  , padding: "0.05rem"}), content: "Delete"          , callback(initiator) { return doUIAction?.("file:delete"      , initiator); } },
    ]],
    ["#manager .adl-content", [
        {icon: new UILucideIcon({icon: "clipboard", padding: "0.05rem"}), content: "Paste" , callback(initiator, _?) { return FileManagment?.getManager?.(initiator)?.requestPaste?.(); } },
        {icon: new UILucideIcon({icon: "file-up"  , padding: "0.05rem"}), content: "Upload", callback(initiator, _?) { return FileManagment?.getManager?.(initiator)?.requestUpload?.(); } },
    ]]
]);

//
export const initCtxMenu = (root = document.documentElement)=>{
    //
    const ctxMenu = (ev, o_ev?)=>{
        (o_ev || ev)?.preventDefault?.();
        (o_ev || ev)?.stopPropagation?.();

        //
        const element = ev?.target as HTMLElement;
        const entry = Array.from(ctxMenuMap?.entries?.() || [])?.find?.(([K,_])=>{
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
                ...ev,
                type: "contextmenu",
                target: initiator,
                clientX: ev.clientX,
                clientY: ev.clientY,
                pageX: ev.pageX,
                pageY: ev.pageY
            // @ts-ignore
            }, false, (menu, initiator)=>makeCtxMenuItems(menu, initiator, one.filter((el)=>{ return el?.condition?.(initiator) ?? true; })));
        }
    }

    //
    root?.addEventListener?.("contextmenu", ctxMenu);
}

//
export default initCtxMenu;
