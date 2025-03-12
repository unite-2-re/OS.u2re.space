// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";
import type { ItemsType } from "../../$core$/Types";
import { refAndMount } from "../../$solid$/Utils.tsx";
import { createLabel, createShaped } from "../../$core$/Items.ts";

// @ts-ignore
import {fixOrientToScreen} from "/externals/core/agate.js";

// @ts-ignore
import {inflectInGrid} from "/externals/core/grid.js";
import { dropItemEv } from "../../$core$/FileOps.ts";
import { current } from "../../$core$/FileManage.ts";
import { fileActions } from "../../$core$/FileAction";

// while: tab.component should be  ()=> html`...`
export const Items = ({items, lists}: ItemsType) => {

    //
    const dragOverHandle = (ev)=>{
        ev?.preventDefault?.();
    }

    //
    const dropHandle = (ev)=>{
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        if (file) { dropItemEv(file, "/user/temp/", current)?.then?.((path)=>{
            if (path) { fileActions?.(path); };
        }); };
    }


    const $element = (topLevel)=> {
        //makeSelection(topLevel, "ui-shaped");
        fixOrientToScreen(topLevel);
    };

    //
    const $shapes = refAndMount((gridSet)=> {
        inflectInGrid(gridSet, items, lists?.[0] || [], createShaped);
    });

    //
    const $labels = refAndMount((gridSet)=> {
        inflectInGrid(gridSet, items, lists?.[0] || [], createLabel);
    });

    // TODO! replace by orient-layer, and make it local
    return html`<ui-orientbox on:dragover=${dragOverHandle} on:drop=${dropHandle} orient="0" ref=${$element} data-alpha="0" data-chroma="0" data-scheme="base" class="u2-desktop-grid" style="background-color: transparent; inset: 0px; inset-block-end: auto; pointer-events: auto; contain: none; overflow: visible; container-type: normal; touch-action: none;">
        <ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref=${$labels}></ui-gridbox>
        <ui-gridbox class="u2-grid-page" style="background-color: transparent; inline-size: 100%; block-size: 100%;" ref=${$shapes}></ui-gridbox>
    </ui-orientbox>`;
};

//
export default Items;
