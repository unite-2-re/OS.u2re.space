import Appearance from "./Fields/Appearance.vue";
import Columns from "./Fields/Columns.vue";
import Rows from "./Fields/Rows.vue";

//
import type { TabType } from "../../$core$/Types";

// Functionality Not Implemented
export const tabs: TabType[] = [
    //{id: "display", icon: "monitor-cog", content: "Display" },
    //{id: "layout", icon: "grid-3x3", content: "Layout" }
];

//
export const forms: any[] = [
{
    label: "Appearance",
    inputs: [{
        icon: "sun-moon",
        label: "Theme:",
        component: Appearance
    }]
},
{
    label: "Workspace",
    inputs: [{
        icon: "columns-3",
        label: "Columns:",
        component: Columns
    },
    {
        icon: "rows-3",
        label: "Rows:",
        component: Rows
    }]
}];
