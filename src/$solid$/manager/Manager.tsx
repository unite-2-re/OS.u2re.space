// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

//
import html from "solid-js/html";
import Content from "./Content.tsx";

//
import { hooked, observe, refAndMount } from "../../$solid$/Utils.tsx";
import { addItemEv, downloadItemEv, dropItemEv, removeItemEv } from "../../$core$/FileOps.ts";
import { byType, current, currentDir, fileOf, navigate, preload } from "../../$core$/FileManage.ts";
import { tabs } from "../$maps$/Settings.tsx";

//
const MOCElement = (el, selector)=>{
    return el?.matches?.(selector) ? el : el?.closest?.(selector);
}


//
const ghostImage = new Image();
ghostImage.decoding = "async";
ghostImage.src = URL.createObjectURL(new Blob([`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 384 512"><!--!Font Awesome Free 6.7.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2025 Fonticons, Inc.--><path d="M0 64C0 28.7 28.7 0 64 0L224 0l0 128c0 17.7 14.3 32 32 32l128 0 0 288c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 64zm384 64l-128 0L256 0 384 128z"/></svg>`], {type: "image/svg+xml"}));
ghostImage.width = 24;
ghostImage.height = 24;

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
    const dragOverHandle = (ev)=>{
        ev?.preventDefault?.();
    }

    //
    const dropHandle = (ev)=>{
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        if (file) { dropItemEv(file, currentDir(), current); };
    }

    //
    const dragHandle = (ev) => {
        const path = ev?.target?.querySelector?.("input")?.value || fileOf();
        const file = current?.get?.(path);
        if (file) {
            const url = URL.createObjectURL(file);
            
            ev.dataTransfer.effectAllowed = "copyLink";
            ev?.dataTransfer?.clearData?.();
            ev?.dataTransfer?.setDragImage?.(ghostImage, 0, 0);
            ev?.dataTransfer?.setData?.("text/plain", url);
            ev?.dataTransfer?.setData?.("text/uri-list", url);
            ev?.dataTransfer?.setData?.("DownloadURL", file?.type + ":" + file?.name + ":" + url);
            ev?.dataTransfer?.items?.add?.(file);
        } else { ev?.preventDefault?.(); }
    }

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
                            <ui-icon inert icon=${tab.icon} style="padding: 0.5rem;"></ui-icon>
                            <span inert>${tab.content as string}</span>
                        </ui-select-row>`;
                    }}<//>
                </div>
            </ui-scrollbox>
            <ui-scrollbox data-scheme="solid" data-alpha="1" class="adl-content-box" ref=${$content}>
                <div on:drop=${dropHandle} on:dragover=${dragOverHandle} class="adl-content">
                    <${For} each=${()=>Array.from(files()?.entries?.()||[])}>${([path, file]) => {
                        return html`<ui-select-row href="#" 
                            onClick=${(ev)=>navigate?.(fileOf(), ev)} onDblClick=${(ev)=>navigate?.(fileOf(), ev)} name="file" value=${path}
                            style="-webkit-user-drag: element; -moz-user-drag: element;" draggable="true" prop:draggable=true on:dragstart=${dragHandle}
                            >
                            <ui-icon inert icon=${byType(path)}></ui-icon>
                            <span inert>${(path?.split?.("/")?.at?.(-1) || (path?.split?.("/")?.at?.(-2)) || path)}</span>
                            <span inert>${file.lastModified ? new Date(file.lastModified)?.toLocaleString?.() : path?.startsWith("..") ? "" : "N/A"}</span>
                        </ui-select-row>`;
                    }}<//>
                </div>
            </ui-scrollbox>
        </div>
    </div>`;
};

//
export default Manager;
