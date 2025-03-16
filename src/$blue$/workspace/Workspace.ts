import { createLabel, createShaped } from "../../$core$/Items.ts";
import { dropItemEv } from "../../$core$/FileOps.ts";
import { fileActions } from "../../$core$/FileAction";

//
import { fixOrientToScreen } from "/externals/core/agate.js";
import { inflectInGrid } from "/externals/core/grid.js";
import { E, H } from "/externals/lib/blue.js"

//
const dragOverHandle = (ev: DragEvent) => {
    ev.preventDefault();
};

//
const dropHandle = (ev: DragEvent) => {
    ev.preventDefault();
    const file = ev.dataTransfer?.files?.[0];
    if (file) {
        dropItemEv(file, "/user/temp/")?.then((path: any) => {
            if (path) {
                fileActions?.(path);
            }
        });
    }
};

//
export default (gridState: any)=>{
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
    fixOrientToScreen(tree.element);
    inflectInGrid(labels, gridState?.items, gridState?.lists, createLabel);
    inflectInGrid(shapes, gridState?.items, gridState?.lists, createShaped);
    return tree;
}
