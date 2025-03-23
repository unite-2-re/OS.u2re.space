//
import { actionMap } from "../ActionMap.ts";
import { workspace } from "../state/GridState.ts";

//
export const UIAction = new Map([
    ["open-in-frame", (initiator, ev?)=>{
        const dataset = initiator?.dataset;
        return actionMap?.get?.("open-link")?.({
            label: (dataset?.label?.trim?.() || dataset?.href?.trim?.()),
            icon: (initiator?.icon?.trim?.() || dataset?.icon?.trim?.() || "globe"),
            href: (dataset?.href?.trim?.() || "#")
        });
    }],

    //
    ["item-copy", (initiator)=>(Promise.try(navigator.clipboard.writeText.bind(navigator.clipboard), workspace.getItemRepresentation(initiator?.dataset?.id)))],
    ["item-edit", (initiator, ev?)=> actionMap?.get?.("item-edit")?.(initiator?.dataset?.id)],
    ["item-delete", (initiator, ev?)=> actionMap?.get?.("item-delete")?.(initiator?.dataset?.id)],
    ["open-link", (initiator)=> actionMap?.get?.("open-link")?.(initiator?.dataset?.href)],
    ["manager", (initiator, ev?)=> actionMap?.get?.("manager")?.(initiator?.dataset?.href)],
    ["settings", (initiator, ev?)=> actionMap?.get?.("settings")?.(initiator?.dataset?.href)],
    ["use-as-wallpaper", (initiator, ev?)=> actionMap?.get?.("use-as-wallpaper")?.(initiator?.dataset?.href)],
    ["copy-link", (initiator, ev?)=> { if (initiator?.dataset?.href) Promise.try(navigator.clipboard.writeText.bind(navigator.clipboard), initiator?.dataset?.href); }],

    //
    ["import-state", ()=> actionMap?.get?.("import-state")?.()],
    ["export-state", ()=> actionMap?.get?.("export-state")?.()]
]);

//
export const initUIAction = (root = document.documentElement)=>{
    root?.addEventListener?.("click", (evc: any)=>{
        const ev = evc;
        if (ev?.target?.matches?.("[data-dragging]") || ev?.target?.closest?.("[data-dragging]")) { return; };
        const element   = ev?.target as HTMLElement;
        const selector  = "*[data-action]";
        const initiator = element?.matches?.(selector) ? element : element?.closest?.(selector);
        const actionNm  = (initiator as HTMLElement)?.dataset?.action || ((initiator as HTMLElement)?.dataset?.href ? "open-link" : "item-edit");
        const actionCb  = UIAction.get(actionNm) ?? actionMap.get(actionNm);
        if (actionCb && initiator) {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            actionCb?.(initiator, ev);
        }
    });
};

//
export default initUIAction;
