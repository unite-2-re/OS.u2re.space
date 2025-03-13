// @ts-ignore /* @vite-ignore */
import { safe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

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
            type: "manager"
        }),
    }
]));

//
export default tasks;
