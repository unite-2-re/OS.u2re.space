import { dropFile } from "../../$core$/file/FileOps.ts";
import { fileActions } from "../../$core$/file/FileAction";

//
import { pasteInWorkspace } from "../../$core$/interact/FileInteration.ts";
import { createLabel, createShaped } from "../../$core$/grid/Items.ts";

//
import { subscribe } from "/externals/lib/object.js";
import { fixOrientToScreen } from "/externals/core/agate.js";
import { inflectInGrid } from "/externals/core/grid.js";
import { E, H } from "/externals/lib/blue.js"

//
const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };
const dropHandle = (ev: DragEvent) => {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    const text = ev.dataTransfer?.getData?.("text/plain");
    if (text || !file) {
        pasteInWorkspace(ev.dataTransfer);
    } else
    if (file) {
        dropFile(file, "/user/temp/")?.then((path: any) => {
            if (path) {
                fileActions?.(path);
            }
        });
    }
};

//
export default (gridState: any)=>{
    //
    let labels: any;
    let shapes: any;
    const tree = E("ui-orientbox.u2-desktop-grid", {
        dataset: { alpha: 0, chroma: 0, scheme: "base" },
        style: "background-color: transparent; inset: 0px; inset-block-end: auto; pointer-events: auto; contain: none; overflow: visible; container-type: normal; touch-action: none;",
        on: {
            dragover: new Set([dragOverHandle]),
            drop: new Set([dropHandle])
        }}, [
            labels = H(`<ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref="labelsRef"></ui-gridbox>`),
            shapes = H(`<ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref="shapesRef"></ui-gridbox>`)
        ]);

    //
    subscribe(gridState.layout, (value, prop)=>{
        if (prop == "columns") { Array.from<any>(tree.element.children).forEach((target: HTMLElement)=>target.style.setProperty("--layout-c", "" + (value||4))); };
        if (prop == "rows") { Array.from<any>(tree.element?.children).forEach((target: HTMLElement)=>target.style.setProperty("--layout-r", "" + (value||8))); };
    });

    //
    fixOrientToScreen(tree.element);
    inflectInGrid(labels, gridState?.items, createLabel);
    inflectInGrid(shapes, gridState?.items, createShaped);
    return tree;
}
