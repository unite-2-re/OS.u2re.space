
//
import tasks from "./$solid$/$maps$/Tasks.tsx";
import { renderInPage } from "./$solid$/Main";
import CSS from "./css";

//
export const initialize = async (root)=>{
    await CSS?.(root);

    // DEBUG_MODE
    await Promise.allSettled([
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/lib/agate.js"),

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
        import(/* @vite-ignore */ "/externals/core/existence.js"),

        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/longtext.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/contextmenu.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/rows.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/scrollbox.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/image.js"),

        // @ts-ignore
        import(/* @vite-ignore */ "./$core$/Modal.ts"),
        // @ts-ignore
        import(/* @vite-ignore */ "./$core$/ActionMap.ts"),
        // @ts-ignore
        import(/* @vite-ignore */ "./$core$/ContextMenu.ts"),
        // @ts-ignore
        import(/* @vite-ignore */ "./$core$/Sidebar.ts"),
    ])?.then?.((mds)=>mds.map((rs: any)=> {try { return rs?.value?.default?.() } catch(e) {}}))?.catch?.(console.warn.bind(console));

    //
    renderInPage(root, tasks);
}

//
export default initialize;

// DEBUG MODE
//initialize?.(document.querySelector("#viewport"));
