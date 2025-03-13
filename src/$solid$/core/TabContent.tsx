// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";
import type { TabType } from "../../$core$/Types";

//
export const TabContent = ({tab, children}: {tab: ()=>TabType, children?: ()=>any}) => {
    return html`<div class="adl-content" data-tab=${()=>tab()?.id}>${children}</div>`;
};

//
export default TabContent;
