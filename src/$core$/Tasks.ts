// @ts-ignore /* @vite-ignore */
import { safe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";
import { initTaskManager } from "/externals/wcomp/ui.js";

//
import type { Task } from "./Types.ts";

//
export const taskManager = initTaskManager();
export const tasks: Set<Task> = makeReactive(new Set<Task>([
    {
        taskId: "#settings",
        desc: makeReactive({
            icon: "settings",
            label: "Settings",
        }),
        args: makeReactive({
            type: "settings"
        }),
    },
    {
        taskId: "#manager",
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
taskManager?.on?.("removeTask", ({task})=>{ tasks?.delete(task); });
taskManager?.on?.("addTask", ({task})=>{ tasks.add(task); });
export default tasks;
