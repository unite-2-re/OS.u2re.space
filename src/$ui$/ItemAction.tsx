//
import { actionMap } from "../$state$/ActionMap.ts";

//
export const UIAction = new Map([
    ["open-in-frame", (initiator, ev?)=>{
        const dataset = initiator?.dataset;
        return actionMap?.get?.("open-link")?.({
            title: (dataset?.label?.trim?.() || dataset?.href?.trim?.()),
            icon: (initiator?.icon?.trim?.() || dataset?.icon?.trim?.() || "globe"),
            href: (dataset?.href?.trim?.() || "#")
        });
    }],

    //
    //["item-edit", (initiator, ev?)=> actionMap?.get?.("item-edit")?.(initiator?.dataset?.id)],
    //["item-delete", (initiator, ev?)=> actionMap?.get?.("item-delete")?.(initiator?.dataset?.id)],
    ["open-link", (initiator)=> actionMap?.get?.("open-link")?.(initiator?.dataset?.href)],

    // legacy...
    ["import-settings", ()=> actionMap?.get?.("import-settings")?.()],
    ["export-settings", ()=> actionMap?.get?.("export-settings")?.()]
]);

//
export const initUIAction = (root = document.documentElement)=>{
    root?.addEventListener?.("ag-click", (evc: any)=>{
        const ev = evc?.detail || evc;
        if (ev?.target?.matches?.("[data-dragging]") || ev?.target?.closest?.("[data-dragging]")) { return; };
        const element   = ev?.target as HTMLElement;
        const selector  = "*[data-action]";
        const initiator = element?.matches?.(selector) ? element : element?.closest?.(selector);
        const actionCb  = UIAction.get((initiator as HTMLElement)?.dataset?.action || "open-link");
        if (actionCb && initiator) {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            actionCb?.(initiator, ev);
        }
    });
};

//
export default initUIAction;
