// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

// @ts-ignore
import {inflectInGrid} from "/externals/system/grid-system.js";

//
export interface ItemType {
    label: string;
    icon: string;
    id: string;
    href?: string;
    action?: string;
    cell: [number, number];
};

//
export interface ItemsType {
    items: ItemType[];
    lists: string[][];
};

//
const refAndMount = (cb)=>{
    return (element)=>{
        onMount(()=>cb(element));
    }
}

//
const observe = (val) => {
    return (el)=> {
        const [attr, setter] = val;
        observeAttribute(el, attr, (obs)=>setter(el.getAttribute(attr)));
    }
}

//
const logged = (fx)=>{
    return (...args)=>{
        console.log(...args);
        return fx(...args);
    }
}

// while: tab.component should be  ()=> html`...`
export const Items = ({items, lists}: ItemsType) => {
    const $element = refAndMount((gridSet)=> {
        inflectInGrid(gridSet, items, lists?.[0] || [], (item, gs)=>{
            // if exists, skip
            const exists = gs?.querySelector?.(`.u2-grid-item[data-id=\"${item?.id}\"]`);
            if (exists) { return exists; }

            //
            const element: any = document.createElement("ui-shaped");
            element.item = item;
            element.icon = item.icon;
            return element;
        });
    });

    //
    return html`<ui-gridbox style="inline-size: 100%; block-size: 100%;" ref=${$element}></ui-gridbox>`;
};

//
export default Items;
