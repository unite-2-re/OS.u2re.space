// @ts-ignore
import { For, createSignal, onMount  } from "solid-js";
import html from "solid-js/html";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";
import type { TabType } from "./Types.tsx";

//
export const Forms = ({tab}: {tab: ()=>TabType}) => {
    return html`<form data-tab=${()=>tab()?.id}>${()=>tab()?.id}</form>`;
};

//
export default Forms;
