import { propRef } from "/externals/lib/object.js"
import { fixOrientToScreen } from "/externals/core/agate.js"
import { bindInteraction, reflectCell } from "/externals/core/interact.js"
import { H } from "/externals/lib/blue.js"

//
import { pasteInWorkspace } from "../../$core$/interact/FileInteration.ts"
import { createLabel, createShaped } from "../../$core$/grid/Items.ts"

//
const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };
const dropHandle     = (ev: DragEvent) => { ev.preventDefault(); pasteInWorkspace(ev.dataTransfer, ev); };

//
export default (gridState: any)=>{
    const style = {"background-color": "transparent", "inline-size": "100%", "block-size": "100%", "--layout-c": propRef(gridState.layout, "columns", 4), "--layout-r": propRef(gridState.layout, "rows", 8)};
    const tree = H`<${"ui-orientbox.u2-desktop-grid"} on:drop=${dropHandle} on:dragover=${dragOverHandle} dataset=${{ alpha: 0, chroma: 0, scheme: "base" }} style="background-color: transparent; inset: 0px; inset-block-end: auto; pointer-events: auto; contain: none; overflow: visible; container-type: normal; touch-action: none;">
    <${"ui-gridbox.u2-grid-page"} style=${style} iterate=${gridState?.items}>${(item)=>{
        const label = createLabel(item); if (label) reflectCell(label, {item, ...gridState}); return label;
    }}</ui-gridbox>
    <${"ui-gridbox.u2-grid-page"} style=${style} iterate=${gridState?.items}>${(item)=>{
        const shape = createShaped(item); if (shape) bindInteraction(shape, {item, ...gridState}); return shape;
    }}</ui-gridbox>
</ui-orientbox>`; fixOrientToScreen(tree); return tree;
}
