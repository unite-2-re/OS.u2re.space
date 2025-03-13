// @ts-ignore /* @vite-ignore */
import { safe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";
import { taskManager } from "../$core$/ActionMap.ts";

//
export const tasks = makeReactive(new Set([
    {
        id: "#settings",
        desc: makeReactive({
            icon: "settings",
            label: "Settings",
        }),
        args: makeReactive({
            type: "settings"
        }),
    },
    {
        id: "#manager",
        desc: makeReactive({
            icon: "folder-code",
            label: "Manager",
        }),
        args: makeReactive({
            type: "manager",
            directory: "/user/images/"
        }),
    }
]));

//
taskManager?.on?.("removeTask", ({task})=>{
    tasks?.delete(task);
});

//
taskManager?.on?.("addTask", ({task})=>{
    tasks.add(task);
});

//
export default tasks;
