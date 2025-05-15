// @ts-ignore /* @vite-ignore */
import { safe, makeReactive, makeObjectAssignable, observableArray } from "/externals/lib/object.js";
import { initTaskManager } from "/externals/wcomp/ui.js";

//
export const settingsTask = makeReactive({
    taskId: "#settings",
    desc: makeReactive({
        icon: "settings",
        label: "Settings",
    }),
    args: makeReactive({
        type: "settings"
    }),
});

//
export const managerTask = makeReactive({
    taskId: "#manager",
    desc: makeReactive({
        icon: "folder-code",
        label: "Manager",
    }),
    args: makeReactive({
        type: "manager",
        directory: "/user/images/"
    }),
});

//
export const tasks: any[] = observableArray([]);
export const taskManager = initTaskManager(tasks);
export default tasks;
