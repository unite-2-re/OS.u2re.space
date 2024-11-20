import { render } from "solid-js/web"
import html from "solid-js/html";

//
import { Apps } from "./$app$/Main.ts";

// @ts-ignore
import {makeSelection} from /* @vite-ignore */ "/externals/lib/interact.js";

//
export const initialize = (root)=>{
    render(()=>html`<${Apps}><//>`, root);
}

//
export default initialize;

// DEBUG_MODE
Promise.allSettled([
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/system/grid-system.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/system/ui.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/core/core.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/core/design.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/core/theme.js")
]).then((mds)=>mds.map((rs: any)=>rs?.value?.default?.())).then(()=>{
    initialize(document.querySelector("#root"));

    //
    requestIdleCallback(()=>{
        makeSelection(document.querySelector("#application"), "ui-shaped");
    }, {timeout: 1000});
});
