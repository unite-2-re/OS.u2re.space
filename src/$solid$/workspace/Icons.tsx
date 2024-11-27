// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

// @ts-ignore
import {inflectInGrid} from "/externals/system/grid-system.js";

// @ts-ignore
import {makeSelection} from "/externals/lib/interact.js";

//
import type { ItemsType } from "@src/$core$/Types.tsx";
import { refAndMount } from "@src/$core$/Utils.ts";

//
const createShaped = (item, gs)=>{
    // if exists, skip
    const exists = gs?.querySelector?.(`.u2-grid-item[data-id=\"${item?.id}\"]`);
    if (exists) { return exists; }

    //
    const element: any = document.createElement("ui-shaped");
    element.classList.add("u2-grid-item");
    element.item = item;
    element.icon = item.icon;
    element.setAttribute("data-scheme", "inverse");

    //
    const shape: any = document.createElement("div");
    shape.classList.add("u2-item-design");
    shape.setAttribute("data-scheme", "inverse");
    shape.setAttribute("data-shape", "wavy");
    shape.setAttribute("data-scheme", "inverse");
    shape.setAttribute("data-alpha", "1");
    shape.setAttribute("data-highlight", "4");
    shape.setAttribute("data-highlight-hover", "6");

    //
    element.append(shape);
    return element;
}

//
const createLabel = (item, gs)=>{
    // if exists, skip
    const exists = gs?.querySelector?.(`.u2-grid-item[data-id=\"${item?.id}\"]`);
    if (exists) { return exists; }

    //
    const element: any = document.createElement("span");
    element.classList.add("u2-grid-item");
    element.classList.add("u2-item-label");
    element.setAttribute("data-scheme", "accent");
    element.setAttribute("data-alpha", "0");
    element.setAttribute("data-transparent", "");
    element.innerHTML = item.label;
    return element;
}

// while: tab.component should be  ()=> html`...`
export const Items = ({items, lists}: ItemsType) => {
    const $element = refAndMount((topLevel)=> {
        makeSelection(topLevel, "ui-shaped");
    });

    //
    const $shapes = refAndMount((gridSet)=> {
        inflectInGrid(gridSet, items, lists?.[0] || [], createShaped);
    });

    //
    const $labels = refAndMount((gridSet)=> {
        inflectInGrid(gridSet, items, lists?.[0] || [], createLabel);
    });

    //
    return html`<div ref=${$element} class="u2-desktop-grid" style="pointer-events: auto;">
        <ui-gridbox class="u2-grid-page" style="inline-size: 100%; block-size: 100%;" ref=${$shapes}></ui-gridbox>
        <ui-gridbox class="u2-grid-page" style="inline-size: 100%; block-size: 100%;" ref=${$labels}></ui-gridbox>
    </div>`;
};

//
export default Items;
