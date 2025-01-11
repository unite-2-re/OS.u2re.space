// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

//
import html from "solid-js/html";
import Content from "./Content.tsx";

//
import { hooked, observe, refAndMount } from "../../$solid$/Utils.tsx";
import { addItemEv, downloadItemEv, removeItemEv } from "../../$core$/FileOps.ts";
import { byType, current, currentDir, fileOf, navigate } from "../../$core$/FileManage.ts";
import { tabs } from "../$maps$/Settings.tsx";

//
const MOCElement = (el, selector)=>{
    return el?.matches?.(selector) ? el : el?.closest?.(selector);
}

// while: tab.component should be  ()=> html`...`
export const Manager = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const [files, setFiles] = createSignal(null, { equals: false });

    //
    subscribe(current, ()=>setFiles(current));

    //
    let input = hooked();
    let content = hooked();

    //
    const cTab = createMemo(()=>tabOf(currentTab()));
    const $content = refAndMount((topLevel)=> navigate(currentDir()));

    //
    document.documentElement.addEventListener("keydown", (e) => {
        if (e?.key == "Enter" && (e?.target == input?.["@target"] || MOCElement(document.querySelector(":hover, :focus"), ".ui-content") == content)) {
            e?.preventDefault?.();
            // TODO: trigger by selected in list
            navigate(currentDir());
        }
    });

    //
    return html`<div data-chroma="0" data-highlight="0" data-alpha="0" data-scheme="solid" class="ui-content" id="manager" data-tab=${currentTab} ref=${content} ref=${observe(["data-tab", setTab])}>
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-add" onClick=${(ev)=>addItemEv(currentDir(), current)}> <ui-icon icon="file-up"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-get" onClick=${(ev)=>downloadItemEv(fileOf())}> <ui-icon icon="file-down"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-del" onClick=${(ev)=>removeItemEv(fileOf(), current)}> <ui-icon icon="file-x"></ui-icon> </button>

            <ui-longtext data-highlight="1" class="adl-space" class="u2-input" data-name="directory"><input ref=${input} placeholder="" name="directory" type="text" label="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" value="/user/images/"/></ui-longtext>
            
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-dir-go" onClick=${(ev)=>navigate(currentDir())}> <ui-icon icon="step-forward"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-use" onClick=${(ev)=>navigate(fileOf())}> <ui-icon icon="image-play"></ui-icon> </button>
        </div>
        <div data-scheme="solid" data-alpha="0" class="adl-main">
            <ui-scrollbox data-scheme="solid" data-alpha="1" data-highlight="0.5" data-chroma="0.01" class="adl-tab-box">
                <div class="adl-tabs">
                    <${For} each=${() => tabs}>${(tab) => {
                        return html`<ui-select-row data-alpha="0" name="m-tab" onChange=${(e)=>setTab(e.target.value)} value=${tab.id} checked=${currentTab() == tab.id}>
                            <ui-icon icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                            <span>${tab.content as string}</span>
                        </ui-select-row>`;
                    }}<//>
                </div>
            </ui-scrollbox>
            <ui-scrollbox data-scheme="solid" data-alpha="1" class="adl-content-box" ref=${$content}>
                <${Content} tab=${()=>cTab}>
                    <${For} each=${()=>Array.from(files()?.entries?.()||[])}>${([path, file]) => {
                        return html`<ui-select-row onClick=${(ev)=>navigate?.(fileOf(), ev)} onDblClick=${(ev)=>navigate?.(fileOf(), ev)} name="file" value=${path}>
                            <ui-icon icon=${byType(path)}></ui-icon>
                            <span>${(path?.split?.("/")?.at?.(-1) || (path?.split?.("/")?.at?.(-2)) || path)}</span>
                            <span>${file.lastModified ? new Date(file.lastModified)?.toLocaleString?.() : path?.startsWith("..") ? "" : "N/A"}</span>
                        </ui-select-row>`;
                    }}<//>
                <//>
            </ui-scrollbox>
        </div>
    </div>`;
};

//
export default Manager;
