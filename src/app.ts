//
import tasks from './$core$/Tasks.ts';
import { renderInPage } from "./$blue$/Main";
import CSS from "./css";

//
import $A from "./$core$/interact/Actions.ts";
import $S from "./$core$/interact/Sidebar.ts";
import $C from "./$core$/interact/ContextMenu.ts";
import $F from "./$core$/interact/FileInteration.ts";
import $T from "./$core$/interact/ItemAction.ts";
import $P from "./$core$/file/Preload.ts";

//
const $I = Promise.allSettled([$A, $S, $C, $F, $P, $T]?.map?.((f)=>Promise?.try?.(f?.default || f)));
export const initialize = async (root)=>{

    //
    const OpenSans = new FontFace("Open Sans", "url(\"/assets/fonts/OpenSans-VariableFont_wdth,wght.ttf\")", {
    });
    const OpenSansItalic = new FontFace("Open Sans Italic", "url(\"/assets/fonts/OpenSans-Italic-VariableFont_wdth,wght.ttf\")", {
    });

    //
    const SourceSans3 = new FontFace("Source Sans 3", "url(\"/assets/fonts/SourceSans3-VariableFont_wght.ttf\")", {
    });
    const SourceSansItalic3 = new FontFace("Source Sans 3 Italic", "url(\"/assets/fonts/SourceSans3-Italic-VariableFont_wght.ttf\")", {
    });

    // @ts-ignore
    document.fonts?.add?.(OpenSans);

    // @ts-ignore
    document.fonts?.add?.(OpenSansItalic);

    // @ts-ignore
    document.fonts?.add?.(SourceSans3);

    // @ts-ignore
    document.fonts?.add?.(SourceSansItalic3);

    //
    const loadingModules = Promise.allSettled([
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
        import(/* @vite-ignore */ "/externals/wcomp/scrollbox.js"),
        // @ts-ignore
        import(/* @vite-ignore */ "/externals/wcomp/image.js"),
    ]);

    //
    await loadingModules?.then?.((mds)=>Promise.allSettled(mds.map((rs: any)=> Promise.try(rs?.value?.default || rs?.value))))?.catch?.(console.warn.bind(console));
    await CSS?.(document.head);
    await Promise.allSettled([ $I ]);
    renderInPage(root, tasks);
}

//
export default initialize;
