// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "./Content.tsx";
import Form from "./Form.tsx";

//
import { $hideMenu, $openMenu } from "@src/$core$/Sidebar.ts";
import { observe, refAndMount } from "@/src/$solid$/Utils.tsx";
import { forms, tabs } from "../$maps$/Settings.tsx";

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
    return html`<div data-alpha="0" data-scheme="solid" class="ui-content" id="settings" ref=${$content} data-tab=${currentTab} ref=${observe(["data-tab", setTab])}>
        <!-- TODO: support titlebar-inline menu button support -->
        <div class="adl-toolbar" data-alpha="0">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-menu" onClick=${()=>$openMenu(content)}> <ui-icon icon="menu"></ui-icon> </button>
            <div class="adl-space"></div>
        </div>
        <ui-scrollbox data-highlight="0" data-chroma="0" class="adl-tab-box" data-alpha="1">
            <div class="adl-tabs">
                <${For} each=${() => tabs}>${(tab) => {
                    return html`<ui-select-row name="s-tab" onClick=${()=>$hideMenu(content)} onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id}>
                        <ui-icon icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                        <span>${tab.content as string}</span>
                    </ui-select-row>`;
                }}<//>
            </div>
        </ui-scrollbox>
        <ui-scrollbox data-alpha="1" class="adl-content-box">
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
