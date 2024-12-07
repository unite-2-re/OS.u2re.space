// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "./Content.tsx";
import Form from "./Form.tsx";

//
import { observe, refAndMount } from "@src/$core$/Utils.ts";
import { forms, tabs } from "../$maps$/Settings.tsx";

//
document.documentElement.addEventListener("click", (ev)=>{
    const target = ev?.target as HTMLElement;
    if (!(target?.matches?.(".adl-tab-box, .adl-menu") || target?.closest?.(".adl-tab-box, .adl-menu"))) {
        //const sidebar = target?.matches?.(".adl-tab-box") ? target : target?.closest?.(".adl-tab-box");
        document.documentElement.querySelectorAll(".adl-tab-box").forEach((sidebar)=>{
            sidebar?.classList?.remove?.("adl-open");
        });
    }
});

// while: tab.component should be  ()=> html`...`
export const Settings = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const cTab = createMemo(()=>tabOf(currentTab()));

    //
    let content: any = null;
    const $content = refAndMount((topLevel)=> {
        content = topLevel;
        //console.log(topLevel.querySelector("input"));
    });

    //
    const $openMenu = ()=>{
        const sidebar = content?.querySelector?.(".adl-tab-box");
        if (!sidebar?.classList?.contains?.("adl-open")) {
            sidebar?.classList?.add("adl-open");
        } else {
            sidebar?.classList?.remove("adl-open");
        }
    }

    //
    const $hideMenu = ()=>{
        const sidebar = content?.querySelector?.(".adl-tab-box");
        sidebar?.classList?.remove("adl-open");
    }

    //
    return html`<div data-alpha="1" data-scheme="solid" class="ui-content" id="settings" ref=${$content} data-tab=${currentTab} ref=${observe(["data-tab", setTab])}>
        <div class="adl-toolbar" data-alpha="1" data-chroma="0.1" data-highlight="5">
            <button type="button" tabindex="-1" class="adl-menu" onClick=${$openMenu}> <ui-icon icon="menu"></ui-icon> </button>
            <div class="adl-space"></div>
        </div>
        <ui-scrollbox class="adl-tab-box" data-alpha="1" data-highlight="2" data-chroma="0.05">
            <div class="adl-tabs">
                <${For} each=${() => tabs}>${(tab) => {
                    return html`<ui-select-row name="s-tab" onClick=${$hideMenu} onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id}>
                        <ui-icon icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                        <span>${tab.content as string}</span>
                    </ui-select-row>`;
                }}<//>
            </div>
        </ui-scrollbox>
        <ui-scrollbox class="adl-content-box">
            <${Content} tab=${()=>cTab}>
                <${For} each=${() => forms}>${(form) => {
                    return html`<${Form} form=${()=>form} tab=${()=>cTab}><//>`;
                }}<//>
            <//>
        </ui-scrollbox>
    </div>`;
};

//
export default Settings;
