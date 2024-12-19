// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "./Content.tsx";

//
import { observe, refAndMount } from "@/src/$solid$/Utils.tsx";
import { tabs } from "../$maps$/Settings.tsx";
import { addItemEv, downloadItemEv, getFileList, removeItemEv, useItemEv } from "@src/$core$/FileManagment.ts";

// while: tab.component should be  ()=> html`...`
export const Manager = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const [files, setFiles] = createSignal(null, { equals: false });

    //
    const cTab = createMemo(()=>tabOf(currentTab()));
    const fileOf = ()=>((document.querySelector("#manager .adl-content input:checked") as HTMLInputElement)?.value||"");
    const $content = refAndMount((topLevel)=> {
        getFileList(null, setFiles);
    });

    //
    return html`<div data-alpha="0" data-scheme="solid" class="ui-content" id="manager" data-tab=${currentTab} ref=${observe(["data-tab", setTab])}>
        <div class="adl-toolbar" data-alpha="0">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-add" onClick=${(ev)=>addItemEv(setFiles)}> <ui-icon icon="file-up"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-get" onClick=${(ev)=>downloadItemEv(fileOf(), setFiles)}> <ui-icon icon="file-down"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-del" onClick=${(ev)=>removeItemEv(fileOf(), setFiles)}> <ui-icon icon="file-x"></ui-icon> </button>
            <div class="adl-space"></div>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-use" onClick=${(ev)=>useItemEv(fileOf(), setFiles)}> <ui-icon icon="file-input"></ui-icon> </button>
        </div>
        <ui-scrollbox data-highlight="0" data-chroma="0" class="adl-tab-box" data-alpha="1">
            <div class="adl-tabs">
                <${For} each=${() => tabs}>${(tab) => {
                    return html`<ui-select-row name="m-tab" onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id}>
                        <ui-icon icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                        <span>${tab.content as string}</span>
                    </ui-select-row>`;
                }}<//>
            </div>
        </ui-scrollbox>
        <ui-scrollbox data-alpha="1" class="adl-content-box" ref=${$content}>
            <${Content} tab=${()=>cTab}>
                <${For} each=${()=>Array.from(files()?.values?.()||[])}>${(file) => {
                    return html`<ui-select-row name="file" value=${file?.name}>
                        <ui-icon icon="wallpaper" style="padding: 0.75rem; min-block-size: 2.5rem;"></ui-icon>
                        <span>${file?.name}</span>
                    </ui-select-row>`;
                }}<//>
            <//>
        </ui-scrollbox>
    </div>`;
};

//
export default Manager;
