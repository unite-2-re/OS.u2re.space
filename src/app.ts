import { render } from "solid-js/web"
import html from "solid-js/html";

//
import { Apps } from "./$app$/Main.ts";

//
const $settings$ = import("./$hash$/settings/index");
const apps = [
    {
        id: "#settings",
        component: ()=>$settings$,
        icon: "settings",
        active: false
    }
];

//
export const initialize = (root)=>{
    render(()=>html`<${Apps} apps=${apps}><//>`, root);
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
    }, {timeout: 1000});
});
