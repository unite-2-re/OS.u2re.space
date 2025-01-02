
//
import tasks from "./$solid$/$maps$/Tasks.tsx";
import { renderInPage } from "./$solid$/Main";
import CSS from "./css";

//
import $M from "./$core$/Modal.ts";
import $A from "./$core$/ActionMap.ts";
import $S from "./$core$/Sidebar.ts";
import $C from "./$core$/ContextMenu.ts";

//
const $I = [$M, $A, $S, $C]?.map?.((f)=>Promise?.try?.(f));

//
export const initialize = async (root)=>{
    await CSS?.(root);

    // DEBUG_MODE
    await Promise.allSettled([
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/agate.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/core.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/theme.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/grid.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/design.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/core/existence.js"),

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/ui.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/longtext.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/rows.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/scrollbox.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/image.js"),
    ])?.then?.((mds)=>mds.map((rs: any)=> {try { return rs?.value?.default?.() } catch(e) {}}))?.catch?.(console.warn.bind(console));

    //
    renderInPage(root, tasks);
}

//
export default initialize;

// DEBUG MODE
//initialize?.(document.querySelector("#viewport"));
