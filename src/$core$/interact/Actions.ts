import { actionMap } from "../ActionMap.ts";

//
export const initActions = (root = document.documentElement)=>{
    root.addEventListener("u2-action", (ev)=>{
        const det = ev?.detail;
        if (det?.type == "action") {
            actionMap?.get?.(det?.name)?.(...(det?.args || []));
        } else
        if (det?.type == "popup") {
            actionMap?.get?.("toggle-popup")?.(det?.initial);
        }
    });

    //
    root.addEventListener("u2-close", (ev)=>{
        if (ev?.detail?.taskId?.replace?.("#", "")?.startsWith?.("TASK-")) { actionMap?.get?.("close-task")?.("#" + ev?.detail?.taskId?.replace?.("#", "")); };
    });
};

//
export default initActions;
