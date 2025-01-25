// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

// while: tab.component should be  ()=> html`...`
export const Print = () => {
    const $content = (topLevel)=> {
        // @ts-ignore
        import(/* @vite-ignore */ "/print/app.js")?.then?.((module)=>{
            module?.default?.(topLevel);
        });
    };

    //
    return html`<div data-alpha="0" data-scheme="solid" class="ui-content" id="print" ref=${$content}></div>`;
};

//
export default Print;
