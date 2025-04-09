import { dropFile, removeFile, UUIDv4 } from "../file/FileOps.ts";
import { FileManagment, getLeast } from "../file/FileManage.ts";
import { workspace } from "../state/GridState.ts";
import { JSOX } from "jsox";
import { useAsWallpaper } from "../file/Wallpaper.ts";
import { imageTypes } from "../file/FileAction.ts";

//
const MOCElement = (el, selector)=>{
    return el?.matches?.(selector) ? el : el?.closest?.(selector);
};

//
export const ghostImage = new Image();
ghostImage.decoding = "async";
ghostImage.width  = 24;
ghostImage.height = 24;

//
try {
    ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], {type: "image/svg+xml"}));
} catch(e) {}

//
export const attachFile = (transfer, file, path = "") => {
    try {
        const url = URL.createObjectURL(file);
        if (file?.type && file?.type != "text/plain") {
            transfer?.items?.add?.(file, file?.type || "text/plain");
        } else {
            transfer?.add?.(file);
        }
        if (path) { transfer?.items?.add?.(path, "text/plain"); };
        transfer?.setData?.("text/uri-list", url);
        transfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
    } catch(e) {}
}

//
export const dropAsTempFile = async (data: any)=>{
    const items   = (data)?.items;
    const item    = items?.[0];
    const isImage = item?.types?.find?.((n)=>n?.startsWith?.("image/"));
    const blob    = await (data?.files?.[0] ?? ((isImage ? item?.getType?.(isImage) : null) || getLeast(item)));
    const path    = await dropFile(blob, "/user/temp/");
    if (path) { useAsWallpaper?.(path); }
}

//
export const pasteInWorkspace = async (data?: any, e?: any)=>{
    data = await data;
    const item = data?.items?.find?.(item => item?.getType?.("text/plain"));
    let text = await (item?.getType?.("text/plain") ?? (item ? new Promise((r)=>(item.getAsString((data)=>r(data)))) : null)) || data?.getData?.("text/plain");
    if (text instanceof Blob) { text = await text.text(); };

    //
    if (imageTypes.has(text?.split?.(".")?.at?.(-1))) {
        useAsWallpaper(text);
    } else
    if (text && typeof text == "string") {
        if (URL.canParse(text)) {
            const url = new URL(text);
            workspace.addItem(UUIDv4(), e, { href: text||"", icon: "globe", label: url?.hostname || "" });
        } else
        if (text?.startsWith?.("/user/")) {
            workspace.addItem(UUIDv4(), e, { href: text||"", icon: "file", label: text?.split?.("/")?.at?.(-1) || "" });
        } else
        if (text?.startsWith?.("/")) {
            //useAsWallpaper((window.location.origin + text)||"");
            workspace.addItem(UUIDv4(), e, { action: "use-as-wallpaper", href: (window.location.origin + text)||"", icon: "globe", label: text?.split?.("/")?.at?.(-1) || "" });
        } else
        {
            const obj = await Promise.try(JSOX.parse.bind(JSOX), text)?.catch?.(()=>null);
            if (obj)
                { workspace.importItem(obj); } else
                { dropAsTempFile(data); }
        }
    } else { dropAsTempFile(data); }
}

//
export const initFileInteraction = (ROOT = document.documentElement)=>{
    //
    ROOT.addEventListener("copy", (ev) => {
        const content = ROOT.querySelector("ui-frame #manager");
        const manager = FileManagment.getManager(content);

        //
        if (content && MOCElement(content, ":where(ui-frame):is(:hover, :active, :focus), :where(ui-frame):has(:hover, :active, :focus)")?.querySelector?.(".ui-content") == content) {
            const path = FileManagment.fileOf(content);
            const file = manager.getCurrent().get(path);
            if (file) {
                ev?.clipboardData?.clearData?.();
                attachFile(ev?.clipboardData, file, path);
                ev?.preventDefault?.();
            }
        }
    });

    //
    ROOT.addEventListener("paste", (e) => {
        const content = ROOT.querySelector("ui-frame #manager");
        const manager = FileManagment.getManager(content);

        //
        if (content && MOCElement(content, ":where(ui-frame):is(:hover, :active, :focus), :where(ui-frame):has(:hover, :active, :focus)")?.querySelector?.(".ui-content") == content) {
            e?.preventDefault?.();
            if (!manager.handleDrop(e.clipboardData)) {
                navigator.clipboard.read?.()?.then?.(async (items)=>manager.handleDrop({items}));
            }
        } else
        if (ROOT.querySelector(".u2-desktop-grid:is(:hover, :active, :focus), .u2-desktop-grid:has(:hover, :active, :focus)")) {
            pasteInWorkspace(e.clipboardData);
        }
    });

    //
    ROOT.addEventListener("keydown", (e) => {
        const content = ROOT.querySelector("ui-frame #manager");
        const input = content?.querySelector?.("input[type=\"text\"]");
        const manager = FileManagment.getManager(content);

        // close modals by esc
        if (e?.key == "Escape") {
            const isMobile = matchMedia("not (((hover: hover) or (pointer: fine)) and ((width >= 9in) or (orientation: landscape)))").matches;
            const taskbar = isMobile ? document.querySelector("ui-taskbar:not([data-hidden])") : null;
            const modal = (document.querySelector("ui-modal[type=\"contextmenu\"]:not([data-hidden])") ?? document.querySelector("ui-modal:not([data-hidden]):where(:has(:focus), :focus)") ?? document.querySelector("ui-modal:not([data-hidden])") ?? taskbar) as HTMLElement;

            //
            if (document.activeElement?.matches?.("input")) {
                (document.activeElement as any)?.blur?.();
                e?.preventDefault?.();
            } else

            //
            if (modal) {
                modal.dataset.hidden = "";
                e?.preventDefault?.();
            }
        }

        //
        if (content && MOCElement(ROOT.querySelector(":where(ui-frame *):is(:hover, :active, :focus)"), ".ui-content") == content) {
            if (e?.key == "Enter" && (e?.target == input)) {
                e?.preventDefault?.();
                // TODO: trigger by selected in list
                manager.navigate(manager.currentDir());
            }

            //
            /*if (e?.ctrlKey && e?.key == "v") {
                navigator.clipboard.read?.()?.then?.(async (items)=>{
                    const item = items?.[0];
                    const isImage = item?.types?.find?.((n)=>n?.startsWith?.("image/"));
                    const blob = await ((isImage ? item?.getType?.(isImage) : null) || getLeast(item));
                    if (blob) {
                        e?.preventDefault?.();
                        if (blob) dropFile(blob, manager.currentDir(), manager.getCurrent());
                    }
                });
            }*/

            //
            /*if (e?.ctrlKey && e?.key == "c") {
                const path = FileManagment.fileOf(content);
                const file = manager.getCurrent().get(path);
                if (file && ClipboardItem?.supports?.(file?.type)) {
                    e?.preventDefault?.();
                    navigator.clipboard.write([new ClipboardItem({
                        [file?.type]: file,
                        ["text/plain"]: path
                    })]);
                }
            }*/

            //
            if (e?.key == "Delete") {
                const path = FileManagment.fileOf(content);
                if (path) removeFile(path, manager.getCurrent());
            }
        }
    });

    //
    ROOT.addEventListener("dragstart", (ev) => {
        const content = MOCElement(ev?.target, "#manager") || ROOT.querySelector("ui-frame #manager");
        const input   = MOCElement(ev?.target, "ui-select-row") || (
            content?.querySelector?.("ui-select-row:is(:hover, :active)") ||
            content?.querySelector?.("ui-select-row[checked]")
        ) as HTMLInputElement;

        //
        const manager = FileManagment.getManager(content);
        const path = input?.value || FileManagment.fileOf(content)
        const file = manager.getCurrent()?.get?.(path);
        if (file && ev?.dataTransfer) {
            ev.dataTransfer.effectAllowed = "copyLink";
            ev?.dataTransfer?.clearData?.();
            ev?.dataTransfer?.setDragImage?.(ghostImage, 0, 0);
            attachFile(ev?.dataTransfer, file, path);
        } else { ev?.preventDefault?.(); }
    });

};

//
export default initFileInteraction;
