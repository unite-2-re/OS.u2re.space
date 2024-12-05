//
export const tasks = [
    {
        id: "#settings",
        component: ()=>import("../$solid$/settings/Settings"),
        icon: "settings",
        active: false,
        title: "Settings"
    },
    {
        id: "#manager",
        component: ()=>import("../$solid$/manager/Manager"),
        icon: "wallpaper",
        active: false,
        title: "Manager"
    }
];

//
export default tasks;
