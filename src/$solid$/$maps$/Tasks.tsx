import $S from "../settings/Settings";
import $M from "../manager/Manager";

// @ts-ignore
import { createSignal } from "solid-js";

//
const [tasks, setTasks] = createSignal([
    {
        id: "#settings",
        component: $S,
        icon: "settings",
        active: false,
        title: "Settings"
    },
    {
        id: "#manager",
        component: $M,
        icon: "wallpaper",
        active: false,
        title: "Manager"
    }
], { equals: false });

//
export {tasks, setTasks};
export default tasks;
