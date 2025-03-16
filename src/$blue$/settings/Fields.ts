
import { E, H } from "/externals/lib/blue.js"
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
        component: H(
`<ui-switch data-name="theme" style="--max-value: 2;">
    <ui-icon icon="sun-moon" slot="icon"/>
    <input type="radio" label=" " placeholder="Dark" name="theme" value="dark"/>
    <input type="radio" label=" " placeholder="Default" name="theme" value="default"/>
    <input type="radio" label=" " placeholder="Light" name="theme" value="light"/>
</ui-switch>`)
    }]
},
{
    label: "Workspace",
    inputs: [{
        icon: "columns-3",
        label: "Columns:",
        component: H(
`ui-number>
    <span slot="icon" class="ui-indicator"></span>
    <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" label=" " placeholder="Columns" name="columns" value="4" min="4" max="6" step="1"/>
</ui-number>`)
    },
    {
        icon: "rows-3",
        label: "Rows:",
        component: H(
`<ui-number>
    <span slot="icon" class="ui-indicator"></span>
    <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" label=" " placeholder="Rows" name="rows" value="8" min="8" max="12" step="1"/>
</ui-number>`)
    }]
}];
