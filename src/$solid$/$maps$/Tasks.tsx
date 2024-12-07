//
export const tasks = [
    {
        id: "#settings",
        component: ()=>import("../settings/Settings"),
        icon: "settings",
        active: false,
        title: "Settings"
    },
    {
        id: "#manager",
        component: ()=>import("../manager/Manager"),
        icon: "wallpaper",
        active: false,
        title: "Manager"
    }
];

//
export default tasks;
