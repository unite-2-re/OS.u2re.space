
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
`<ui-number>
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
},
{
    label: "State managment",
    inputs: [{
        icon: "upload",
        label: "Import:",
        component: H(`<ui-button data-action="import-state" data-scheme="inverse" data-alpha="1" data-chroma="0.01" data-highlight="3" data-highlight-hover="1" data-name="import" style="min-inline-size: 6rem; block-size: 2rem; padding: 0.25rem; padding-inline: 0.5rem;"> <ui-icon style="padding: 0.2rem;" icon="upload"></ui-icon> <span style="background-color: transparent; font-size: 0.75rem;">Import State</span> </ui-button>`)
    },
    {
        icon: "download",
        label: "Export:",
        component: H(`<ui-button data-action="export-state" data-scheme="inverse" data-alpha="1" data-chroma="0.01" data-highlight="3" data-highlight-hover="1" data-name="export" style="min-inline-size: 6rem; block-size: 2rem; padding: 0.25rem; padding-inline: 0.5rem;"> <ui-icon style="padding: 0.2rem;" icon="download"></ui-icon> <span style="background-color: transparent; font-size: 0.75rem;">Export State</span> </ui-button>`)
    }]
}];
