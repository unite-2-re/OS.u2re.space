//
export const actionMap = new Map([
    ["set-wallpaper", (initiator, ev?)=>{
        console.log(initiator);
    }]
]);

//
export const initActionMap = (root = document.documentElement)=>{
    root?.addEventListener?.("click", (ev)=>{
        const element   = ev?.target as HTMLElement;
        const selector  = "*[data-action]";
        const initiator = element?.matches?.(selector) ? element : element?.closest?.(selector);
        const actionCb  = actionMap.get((initiator as HTMLElement)?.dataset?.action || "");
        if (actionCb && initiator) {
            ev?.preventDefault?.();
            ev?.stopPropagation?.();
            actionCb?.(initiator, ev);
        }
    });
}

//
export default initActionMap;
