// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";

//
import html from "solid-js/html";

//
import { hooked, observe, refAndMount } from "../core/Utils.tsx";
import { addItemEv, downloadItemEv, dropItemEv, removeItemEv } from "../../$core$/FileOps.ts";
import { FileManagment } from "../../$core$/FileManage.ts";
import { tabs } from "../settings/Fields.tsx";

// while: tab.component should be  ()=> html`...`
export const Manager = (task: {args: any, id: string}) => {
    //const tabOf = (tabId)=>tabs.find((t)=>(t?.id==tabId));
    const [currentTab, setTab] = createSignal("display");

    //
    const manager = new FileManagment(task?.args);
    const current: any = manager.getCurrent();
    manager.navigate(task?.args?.directory || "/user/images/");

    //
    const [files, setFiles] = createSignal(current, { equals: false });
    subscribe(current, (value, prop) => setFiles(current));

    // subscribe by args payload (if prop is directory, change it)
    subscribe(task?.args, (value, prop) => { if (prop == "directory") manager.navigate(value); });

    //
    let input = hooked();
    let content = hooked(null, (topLevel)=>{
        FileManagment.bindManager(topLevel, manager);

        // when input changes opinion of directory, reflect it
        synchronizeInputs(task?.args, ".u2-input", topLevel, subscribe);
    });

    //
    //const cTab = createMemo(()=>tabOf(currentTab()));
    const $content = refAndMount((topLevel)=> {
        manager.navigate(manager.currentDir());
    });

    //
    const dragOverHandle = (ev)=>{
        ev?.preventDefault?.();
    }

    //
    const dropHandle = (ev)=>{
        ev?.preventDefault?.();
        const file = ev?.dataTransfer?.files?.[0];
        if (file) { dropItemEv(file, manager.currentDir(), current); };
    }

    //
    return html`<div data-chroma="0" data-highlight="0" data-alpha="0" data-scheme="solid" class="ui-content" id=${task?.id?.replace?.("#","")||"manager"} data-tab=${currentTab} ref=${content} ref=${observe(["data-tab", setTab])}>
        <div data-alpha="0" data-highlight="0" data-chroma="0" class="adl-toolbar">
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-add" onClick=${(ev)=>addItemEv(manager.currentDir(), current)}> <ui-icon icon="file-up"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-get" onClick=${(ev)=>downloadItemEv(FileManagment.fileOf(content))}> <ui-icon icon="file-down"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-del" onClick=${(ev)=>removeItemEv(FileManagment.fileOf(content), current)}> <ui-icon icon="file-x"></ui-icon> </button>
            <ui-longtext data-highlight="1" class="adl-space u2-input" data-name="directory"><input ref=${input} placeholder="" name="directory" type="text" label="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" value="/user/images/"/></ui-longtext>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-dir-go" onClick=${(ev)=>manager.navigate(manager.currentDir())}> <ui-icon icon="step-forward"></ui-icon> </button>
            <button data-highlight-hover="2" type="button" tabindex="-1" class="adl-file-use" onClick=${(ev)=>manager.navigate(FileManagment.fileOf(content))}> <ui-icon icon="image-play"></ui-icon> </button>
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
                    <${For} each=${()=>Array.from(files().entries()||[])}>${([path, file]) => {
                        return html`<ui-select-row href="#"
                            onClick=${(ev)=>manager.navigate?.(FileManagment.fileOf(content), ev)} onDblClick=${(ev)=>manager.navigate?.(FileManagment.fileOf(content), ev)} name="file" value=${path}
                            style="-webkit-user-drag: element; -moz-user-drag: element;" draggable="true" prop:draggable=true
                            >
                            <ui-icon inert icon=${manager.byType(path)}></ui-icon>
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
