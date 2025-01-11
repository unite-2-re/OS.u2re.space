// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";
import html from "solid-js/html";

//
import Content from "./Content.tsx";

//
import { observe, refAndMount } from "../../$solid$/Utils.tsx";
import { tabs } from "../$maps$/Settings.tsx";
import { addItemEv, downloadItemEv, getFileList, removeItemEv, useItemEv } from "../../$core$/FileManagment.ts";

//
const MOCElement = (el, selector)=>{
    return el?.matches?.(selector) ? el : el?.closest?.(selector);
}

// while: tab.component should be  ()=> html`...`
export const Manager = () => {
    const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");
    const [files, setFiles] = createSignal(null, { equals: false });

    // TODO! special JS object for hooking
    let input: HTMLInputElement|null = null;
    let content: HTMLElement|null = null;

    //
    const cTab = createMemo(()=>tabOf(currentTab()));
    const fileOf = ()=>((document.querySelector("#manager .adl-content input:checked") as HTMLInputElement)?.value||"");
    const $content = refAndMount((topLevel)=> {
        getFileList(null, setFiles, input?.value || "/user/images/", navigate);
    });

    //
    const fileAction = (path, setFiles, ev?: any)=>{
        if (path?.endsWith?.("/") || path?.startsWith?.("..")) {
            return files?.()?.get(path)?.();
        };
        return useItemEv(path, setFiles);
    };

    //
    const byType = (path)=>{
        if (path?.endsWith?.("..")) {
            return input?.value?.endsWith("user/") ? "shield-alert" : "arrow-left";
        }
        if (path?.endsWith?.("/")) {
            return path?.startsWith("/assets") ? "folder-root" : "folder";
        }
        return "wallpaper";
    }

    //
    const navigate = (path = "/")=>{
        return getFileList(null, setFiles, input ? (input.value = path) : path, navigate);
    }

    //
    document.documentElement.addEventListener("keydown", (e) => {
        if (e?.key == "Enter" && (e?.target == input || MOCElement(document.querySelector(":hover, :focus"), ".ui-content") == content)) {
            e?.preventDefault?.();
            getFileList(null, setFiles, input?.value || "/user/images/", navigate);
        }
    });

    //
    return html`<div data-chroma="0" data-highlight="0" data-alpha="0" data-scheme="solid" class="ui-content" id="manager" data-tab=${currentTab} ref=${(c)=>(content = c)} ref=${observe(["data-tab", setTab])}>
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-add" onClick=${(ev)=>addItemEv(setFiles, input?.value || "/user/images/")}> <ui-icon icon="file-up"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-get" onClick=${(ev)=>downloadItemEv(fileOf(), setFiles)}> <ui-icon icon="file-down"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-del" onClick=${(ev)=>removeItemEv(fileOf(), setFiles)}> <ui-icon icon="file-x"></ui-icon> </button>

            <ui-longtext data-highlight="1" class="adl-space" class="u2-input" data-name="directory"><input ref=${(I)=>(input = I)} placeholder="" name="directory" type="text" label="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" value="/user/images/"/></ui-longtext>
            
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-dir-go" onClick=${(ev)=>getFileList(null, setFiles, input?.value || "/user/images/", navigate)}> <ui-icon icon="step-forward"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-use" onClick=${(ev)=>fileAction(fileOf(), setFiles)}> <ui-icon icon="file-input"></ui-icon> </button>
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
                        return html`<ui-select-row onDblClick=${(ev)=>fileAction?.(fileOf(), setFiles, ev)} name="file" value=${path}>
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
