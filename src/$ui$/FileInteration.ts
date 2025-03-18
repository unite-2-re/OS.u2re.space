import { dropItemEv } from "../$core$/FileOps.ts";
import { FileManagment } from "../$core$/FileManage.ts";
import { addItem } from "../$state$/GridState.ts";

//
const MOCElement = (el, selector)=>{
    return el?.matches?.(selector) ? el : el?.closest?.(selector);
};

//
const UUIDv4 = () => {
    return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
};

//
export const ghostImage = new Image();
ghostImage.decoding = "async";
ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], {type: "image/svg+xml"}));
ghostImage.width = 24;
ghostImage.height = 24;


//
export const pasteInWorkspace = async (data?: any, e?: any)=>{
    data = await data;
    const item = data?.items?.find?.(item => item?.getType?.("text/plain"));
    let text = await (item?.getType?.("text/plain") ?? (item ? new Promise((r)=>(item.getAsString((data)=>r(data)))) : null)) || data?.getData?.("text/plain");
    if (text instanceof Blob) { text = await text.text(); };
    if (text && typeof text == "string") {
        if (URL.canParse(text)) {
            const url = new URL(text);
            e?.preventDefault?.();
            addItem(UUIDv4(), e, { href: text||"", icon: "globe", label: url?.hostname || "" });
        } else
        if (text?.startsWith?.("/user/")) {
            e?.preventDefault?.();
            addItem(UUIDv4(), e, { href: text||"", icon: "file", label: text?.split?.("/")?.at?.(-1) || "" });
        }
    };
}

//
export const initFileInteraction = (ROOT = document.documentElement)=>{
    //
    ROOT.addEventListener("copy", (ev) => {
        const content = ROOT.querySelector("ui-frame #manager");
        const manager = FileManagment.getManager(content);

        //
        if (MOCElement(ROOT.querySelector(":where(ui-frame *):is(:hover, :active, :focus)"), ".ui-content") == content) {
            const path = FileManagment.fileOf(content);
            const file = manager.getCurrent().get(path);
            if (file) {
                const url = URL.createObjectURL(file);
                ev?.clipboardData?.clearData?.();
                ev?.clipboardData?.setData?.("text/uri-list", url);
                ev?.clipboardData?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
                //ev?.clipboardData?.setData?.("text/plain", path);
                ev?.clipboardData?.items?.add?.(file);
                ev?.clipboardData?.items?.add?.(path, "text/plain");
                ev?.preventDefault?.();
            }
        }
    });

    //
    ROOT.addEventListener("paste", (e) => {
        const content = ROOT.querySelector("ui-frame #manager");
        const manager = FileManagment.getManager(content);

        //
        if (MOCElement(ROOT.querySelector(":where(ui-frame *):is(:hover, :active, :focus)"), ".ui-content") == content) {
            const items = (e.clipboardData)?.items;
            const blob = items?.[0]?.getAsFile?.();
            if (blob) {
                e?.preventDefault?.();
                const file = blob instanceof File ? blob : (new File([blob], UUIDv4() + ".tmp"));
                if (file) dropItemEv(file, manager.currentDir(), manager.getCurrent());
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

        //
        if (MOCElement(ROOT.querySelector(":where(ui-frame *):is(:hover, :active, :focus)"), ".ui-content") == content) {
            if (e?.key == "Enter" && (e?.target == input)) {
                e?.preventDefault?.();
                // TODO: trigger by selected in list
                manager.navigate(manager.currentDir());
            }

            //
            if (e?.ctrlKey && e?.key == "v") {
                navigator.clipboard.read?.()?.then?.(async (items)=>{
                    const item = items?.[0];
                    const isImage = item?.types?.find?.((n)=>n?.startsWith?.("image/"));
                    if (isImage) {
                        const blob = await item?.getType?.(isImage);
                        if (blob) {
                            e?.preventDefault?.();
                            const file = blob instanceof File ? blob : (new File([blob], UUIDv4() + "." + isImage?.replace?.("image/", "")));
                            if (file) dropItemEv(file, manager.currentDir(), manager.getCurrent());
                        }
                    }
                });
            }

            //
            if (e?.ctrlKey && e?.key == "c") {
                const path = FileManagment.fileOf(content);
                const file = manager.getCurrent().get(path);
                if (file && ClipboardItem?.supports?.(file?.type)) {
                    e?.preventDefault?.();
                    navigator.clipboard.write([new ClipboardItem({
                        [file?.type]: file,
                        ["text/plain"]: path
                    })]);
                }
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
        const manager = FileManagment.getManager(content);

        //
        const path = input?.value || FileManagment.fileOf(content)
        const file = manager.getCurrent()?.get?.(path);
        if (file) {
            const url = URL.createObjectURL(file);
            if (ev?.dataTransfer) {
                ev.dataTransfer.effectAllowed = "copyLink";
                ev?.dataTransfer?.clearData?.();
                ev?.dataTransfer?.setDragImage?.(ghostImage, 0, 0);
                ev?.dataTransfer?.setData?.("text/uri-list", url);
                ev?.dataTransfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
                //ev?.dataTransfer?.setData?.("text/plain", path);
                ev?.dataTransfer?.items?.add?.(file);
                ev?.dataTransfer?.items?.add?.(path, "text/plain");
            }
        } else { ev?.preventDefault?.(); }
    });

};

//
export default initFileInteraction;
