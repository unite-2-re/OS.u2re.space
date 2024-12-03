// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "./Content.tsx";
import Form from "./Form.tsx";

//
import { observe, refAndMount } from "@src/$core$/Utils.ts";
import { forms, tabs } from "../../$maps$/Settings.ts";

// while: tab.component should be  ()=> html`...`
export const Settings = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const cTab = createMemo(()=>tabOf(currentTab()));
    const $content = refAndMount((topLevel)=> {
        //console.log(topLevel.querySelector("input"));
    });

    //
    return html`<div data-alpha="1" data-scheme="solid" class="ui-content" id="settings" ref=${$content} data-tab=${currentTab} ref=${observe(["data-tab", setTab])}>
        <ui-scrollbox class="adl-tab-box">
            <div class="adl-tabs">
                <${For} each=${() => tabs}>${(tab) => {
                    return html`<ui-select-row onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id}>
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
