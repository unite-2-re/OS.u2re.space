import type { TabType } from "../../$core$/Types";

// Functionality Not Implemented
export const tabs: TabType[] = [
    //{id: "display", icon: "monitor-cog", content: "Display" },
    //{id: "layout", icon: "grid-3x3", content: "Layout" }
];

//
export const forms: any[] = [
/*{
    // Unknown Plans, Under of 2025...
    label: "Agate.UX Settings (NOT implemented)",
    inputs: [{
        icon: "scaling",
        label: "Scale:",
        component: ()=>{
            return html`<ui-number>
                <span slot="icon" class="ui-indicator"></span>
                <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" label=" " placeholder="Scaling" name="scaling" value="1" min="0.5" max="2" step="0.125"/>
            </ui-number>`;
        }
    }]
},*/
{
    label: "Appearance",
    inputs: [{
        icon: "sun-moon",
        label: "Theme:",
        component: ()=>{
            return (<ui-switch data-name="theme" style="--max-value: 2;">
                <ui-icon icon="sun-moon" slot="icon"></ui-icon>
                <input type="radio" placeholder="Dark" name="theme" value="dark"/>
                <input type="radio" placeholder="Default" name="theme" value="default"/>
                <input type="radio" placeholder="Light" name="theme" value="light"/>
            </ui-switch>) ;
        }
    }]
},
{
    label: "Workspace",
    inputs: [{
        icon: "columns-3",
        label: "Columns:",
        component: ()=>{
            return (<ui-number>
                <span slot="icon" class="ui-indicator"></span>
                <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" placeholder="Columns" name="columns" value="4" min="4" max="6" step="1"/>
            </ui-number>) ;
        }
    },
    {
        icon: "rows-3",
        label: "Rows:",
        component: ()=>{
            return (<ui-number>
                <span slot="icon" class="ui-indicator"></span>
                <input type="number" inputmode="numeric" pattern="[0-9]*" size="5" placeholder="Rows" name="rows" value="8" min="8" max="12" step="1"/>
            </ui-number>) ;
        }
    }]
}];
