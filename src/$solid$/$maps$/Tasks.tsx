import $S from "../settings/Settings";
import $M from "../manager/Manager";
import $P from "../print/Print";

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
        icon: "folder-code",
        active: false,
        title: "Manager"
    },
    {
        id: "#print",
        component: $P,
        icon: "book-marked",
        active: false,
        title: "Markdown"
    }
], { equals: false });

//
export {tasks, setTasks};
export default tasks;
