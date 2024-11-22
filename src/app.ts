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
    import(/* @vite-ignore */ "/externals/core/theme.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/core/grid.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/core/design.js"),

    // @ts-ignore
    import(/* @vite-ignore */ "/externals/wcomp/longtext.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/wcomp/contextmenu.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/wcomp/rows.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/wcomp/scrollbox.js"),
    // @ts-ignore
    import(/* @vite-ignore */ "/externals/wcomp/image.js")
]).then((mds)=>mds.map((rs: any)=> {try { return rs?.value?.default?.() } catch(e) {}})).then(()=>{
    initialize(document.querySelector("#viewport"));

    //
    requestIdleCallback(()=>{
    }, {timeout: 1000});
});
