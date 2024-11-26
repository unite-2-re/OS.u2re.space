// @ts-ignore
import { openContextMenu } from "/externals/wcomp/contextmenu.js";

// @ts-ignore
import { UILucideIcon } from "/externals/system/ui.js";

//
export const actionMap = new Map([
    ["set-wallpaper", (initiator, ev?)=>{
        console.log(initiator);
    }]
]);

//
export const ctxMenuMap = new Map([
    [".u2-grid-item", [
        {icon: new UILucideIcon({icon: "github", padding: ""}), content: "Properties", callback(initiator) { actionMap.get("set-wallpaper")?.(initiator); } },
        {icon: new UILucideIcon({icon: "youtube", padding: ""}), content: "Clone", callback(initiator) { actionMap.get("set-wallpaper")?.(initiator); } }
    ]]
]);

//
export const initActionMap = (root = document.documentElement)=>{
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
