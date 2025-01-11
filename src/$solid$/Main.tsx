// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";
import type { AppsType } from "../$core$/Types";
import { itemFields, itemForm } from "../$solid$/$maps$/Forms.tsx";
import { getItem, gridState } from "../$state$/GridState";
import ItemEdit, {targetItem} from "./workspace/ItemEdit.tsx";
import Items from "./workspace/Items";

// @ts-ignore
import { observeAttribute } from "/externals/lib/dom.js";

// @ts-ignore
import { makeSelection } from "/externals/core/interact.js";


//
const makeView = ({url, id}: {url: string, id: string})=>{
    return html`<div id=${id?.replace?.("#","")} class="ui-content"><div class="adl-main"><div class="adl-content-box"><iframe 
    referrerpolicy="no-referrer" 
    width="100%" height="100%" 
    frameBorder="0" 
    style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" 
    allowtransparency="true" 
    scrolling="auto"
    src=${url}
    loading="eager" 
    seamless=true
    sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms" 
    allowfullscreen=true
    credentialless=true
    allow="*"
    ></iframe></div></div></div>`;
}


// while: tab.component should be  ()=> html`...`
export const Workspace = ({tasks}: AppsType) => {
    return html`<>
        <!-- Workspace Icons -->
        <${Items} items=${()=>gridState.items} lists=${()=>gridState.lists}><//>

        <!-- UI-Scaled Layer -->
        <ui-orientbox id="ui-layer" class="ui-layer" orient="0">
            <!-- Apps Part -->
            <${For} each=${tasks}>${(task) => {
                return html`<ui-frame data-highlight="2" data-chroma="0.1" data-scheme="solid" id=${task?.id.replace("#","")}>
                <div style="justify-self: start; text-align: start; padding-inline: 1rem;" slot="ui-title-bar">${task?.title}</div>  <${  task?.component || makeView } id=${task?.id} url=${task?.href}><//>
                </ui-frame>`;
            }}<//>

            <!-- -->
            <${ItemEdit}
                loadState=${()=>(targetItem)}
                confirmState=${(state, /*[_, k]*/p?: [any?, any?])=>{
                    const item = getItem(state?.id)||{};
                    if (state && item) {
                        if (!p) {
                            for (const k of itemFields) {
                                if (item[k] != state?.[k]) { item[k] = state?.[k] ?? item[k]; };
                            }
                        } else {
                            const k = p?.[1]; if (item[k] != state?.[k]) { item[k] = state?.[k] ?? item[k]; };
                        }
                    }
                }}
                form=${()=>itemForm}
            ><//>

            <!-- Taskbar -->
            <ui-taskbar prop:tasks=${tasks?.()}>

                <${For} each=${tasks}>${(task) => {
                    return html`<ui-task prop:taskId=${task?.id} label=${task?.title} icon=${task?.icon}> <ui-icon icon=${task?.icon}></ui-icon> </ui-task>`;
                }}<//>

            </ui-taskbar>

            <!-- Navbar (Mobile Only) -->
            <ui-navbar></ui-navbar>

            <!-- Merge to UI layer context-menu (13.12.2024) -->
            <ui-modal type="contextmenu" id="contextmenu" style="display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"></ui-modal>

            <!-- Sentence 30.12.2024 -->
            <ui-modal type="popup" data-name="calendar">
                <ui-calendar></ui-calendar>
            </ui-modal>
        </ui-orientbox>

    </>`;
};

//
import tasks, { setTasks } from "./$maps$/Tasks.tsx";
import { taskManager } from "../$state$/ActionMap.ts";

//
taskManager?.on?.("removeTask", ({task})=>{
    const index = tasks?.()?.findIndex((t)=>t?.id == task?.id);
    if (index >= 0) {
        tasks?.().splice(index, 1);
    }
    setTasks?.(tasks);
});

//
taskManager?.on?.("addTask", ({task})=>{
    const index = tasks?.()?.findIndex((t)=>t?.id == task?.id);
    if (index < 0) tasks?.()?.push?.(task);
    setTasks?.(tasks);
});




export default Workspace;
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>html`<${Workspace} tasks=${()=>tasks}><//>`, root);
}
