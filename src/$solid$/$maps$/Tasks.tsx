import $S from "../settings/Settings";
import $M from "../manager/Manager";

//
export const tasks = [
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
];

//
export default tasks;
