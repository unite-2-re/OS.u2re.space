import { getItem, removeItem, setTargetItem, addItem } from "../$state$/GridState.ts";

//
const UUIDv4 = () => {
    return crypto?.randomUUID ? crypto?.randomUUID() : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, c => (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16));
};

//
const isSameOrigin = (a)=>{
    const urlA = a instanceof URL ? a : (URL.canParse(a) ? new URL(a) : null);
    return (urlA?.origin == location?.origin) || a?.trim()?.startsWith?.("#");
}

//
export const actionMap = new Map([
    ["set-wallpaper", (initiator, ev?)=>{
        //console.log(initiator);
    }],

    ["item-edit", (initiator, ev?)=>{
        const item = getItem(initiator?.dataset?.id);
        if (item) {
            setTargetItem(item);
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    ["item-add", (initiator, ev?)=>{
        const item = addItem(UUIDv4(), {});
        if (item) {
            setTargetItem(item);
            document?.querySelector?.(".adl-modal:has(.adl-item-edit)")?.removeAttribute?.("data-hidden");
        }
    }],

    ["item-delete", (initiator, ev?)=>{
        removeItem(initiator?.dataset?.id);

        //setTargetItem(getItem(initiator?.dataset?.id));
    }],

    ["open-link", (initiator)=>{
        window.open(initiator?.dataset?.href, isSameOrigin(initiator.dataset.href) ? "_self" : "_blank");
    }]
]);

//
export const initActionMap = (root = document.documentElement)=>{
    root?.addEventListener?.("click", (ev)=>{
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
