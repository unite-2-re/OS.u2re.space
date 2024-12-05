//
export const tasks = [
    {
        id: "#settings",
        component: ()=>import("../$solid$/settings/Settings"),
        icon: "settings",
        active: false
    },
    {
        id: "#manager",
        component: ()=>import("../$solid$/manager/Manager"),
        icon: "wallpaper",
        active: false
    }
];

//
export default tasks;
