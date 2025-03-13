// @ts-ignore
import { For, createSignal } from "solid-js";
import { render } from "solid-js/web";
import html from "solid-js/html";
import type { AppsType } from "../$core$/Types";
import { itemFields, itemForm } from "../$solid$/$maps$/Forms.tsx";
import { getItem, gridState } from "../$state$/GridState";
import ItemEdit, {targetItem} from "./workspace/ItemEdit.tsx";
import Items from "./workspace/Items";

// @ts-ignore /* @vite-ignore */
import { safe, subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

//
const makeView = ({args, id}: {args: any, id: string})=>{
    return html`<div id=${id?.replace?.("#","")} class="ui-content"><div class="adl-main"><div class="adl-content-box"><iframe 
    referrerpolicy="no-referrer" 
    width="100%" height="100%" 
    frameBorder="0" 
    style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" 
    allowtransparency="true" 
    scrolling="auto"
    src=${args?.href}
    loading="eager" 
    seamless=true
    sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms" 
    allowfullscreen=true
    credentialless=true
    allow="*"
    ></iframe></div></div></div>`;
}

// app or task types
export const components = new Map([
    ["manager", Manager],
    ["settings", Settings]
]);

// while: tab.component should be  ()=> html`...`
export const Workspace = ({tasksList}: AppsType) => {
    const [tasks, setTasks] = createSignal(tasksList, {equals: false});
    subscribe(tasksList, ()=>{ setTasks(Array.from(tasksList.values())) });

    return html`<>
        <!-- Workspace Icons -->
        <${Items} items=${()=>gridState.items} lists=${()=>gridState.lists}><//>

        <!-- UI-Scaled Layer -->
        <ui-orientbox id="ui-layer" class="ui-layer" orient="0" style="background-color: transparent;">
            <!-- Apps Part -->
            <${For} each=${tasks}>${(task) => {
                return html`<ui-frame data-highlight="2" data-chroma="0.1" data-scheme="solid" id=${task?.id.replace("#","")}>
                <div style="justify-self: start; text-align: start; padding-inline: 1rem;" slot="ui-title-bar">${task?.desc?.label}</div>  <${  components?.get(task?.args?.type) || makeView } id=${task?.id} args=${task?.args}><//>
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
                    return html`<ui-task prop:taskId=${task?.id} desc=${task?.desc}> <ui-icon icon=${task?.desc?.icon}></ui-icon> </ui-task>`;
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
import tasksList from "../$core$/Tasks.ts";
import { taskManager } from "../$core$/ActionMap.ts";
import Manager from "./manager/Manager";
import Settings from "./settings/Settings";

//
taskManager?.on?.("removeTask", ({task})=>{
    tasksList?.delete(task);
});

//
taskManager?.on?.("addTask", ({task})=>{
    tasksList.add(task);
});

//
export default Workspace;
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>html`<${Workspace} tasksList=${()=>tasksList}><//>`, root);
}
