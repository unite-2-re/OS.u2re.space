// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";
import type { TabType } from "./Types.tsx";

//
export const TabContent = ({tab}: {tab: ()=>TabType}) => {
    return html`<div data-tab=${()=>tab()?.id}><slot></slot></div>`;
};

//
export default TabContent;
