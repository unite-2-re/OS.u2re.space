// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
import type { TabType } from "./Types.tsx";
import Forms from "./Forms.tsx";
import html from "solid-js/html";

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

//
export const tabs: TabType[] = [
    {id: "display", icon: "monitor-cog", content: "Display" },
    {id: "layout", icon: "grid-3x3", content: "Layout" }
];

// while: tab.component should be  ()=> html`...`
export const Settings = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const cTab = createMemo(()=>tabOf(currentTab()));

    //
    const $content = refAndMount((topLevel)=> {
        console.log(topLevel.querySelector("input"));
    });

    //
    return html`<div data-alpha="1" data-scheme="solid" class="ui-content" id="settings" ref=${$content} data-tab=${currentTab} ref=${observe(["data-tab", setTab])} style="display: inline grid; grid-template-columns: minmax(0px, 15rem) minmax(0px, 1fr); grid-template-rows: minmax(0px, 1fr);">
        <ui-scrollbox style="grid-column: 1 / 1 span; grid-row: 1 / 1 span; block-size: 100%; inline-size: 100%;">
            <div style="display: inline grid; grid-auto-rows: minmax(0px, max-content); grid-template-columns: minmax(2rem, max-content) minmax(0px, 1fr); block-size: max-content; inline-size: 100%; overflow: hidden;">
                <${For} each=${() => tabs}>${(tab) => {
                    return html`<ui-listrow onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id} style="block-size: 2rem;">
                        <ui-icon icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                        <span>${tab.content as string}</span>
                    </ui-listrow>`;
                }}<//>
            </div>
        </ui-scrollbox>
        <ui-scrollbox style="grid-column: 2 / 2 span; grid-row: 1 / 1 span; block-size: 100%; inline-size: 100%;">
            <${Forms} tab=${()=>cTab}><//>
        </ui-scrollbox>
    </div>`;
};

//
export default Settings;
