// @ts-ignore
import { For, createSignal } from "solid-js";
import html from "solid-js/html";

//
import type { AppsType } from "../../$core$/Types.ts";
import { confirmEdit, gridState, itemForm } from "../../$state$/GridState.ts";
import ItemEdit, {targetItem} from "../workspace/ItemEdit.tsx";
import Workspace from "../workspace/Workspace.tsx";
import components from "./Components.tsx";

// @ts-ignore /* @vite-ignore */
import { safe, subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms"
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
    seamless
    allowfullscreen
    credentialless=true
    allow="*"
    ></iframe></div></div></div>`;
}

// while: tab.component should be  ()=> html`...`
export const Shell = ({tasksList}: AppsType) => {
    const [tasks, setTasks] = createSignal(tasksList, {equals: false});
    subscribe(tasksList, ()=>{ setTasks(Array.from(tasksList.values())) });

    return html`<>
        <!-- Workspace Icons -->
        <${Workspace}
            items=${()=>gridState.items}
            lists=${()=>gridState.lists}
        ><//>

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
                confirmState=${confirmEdit}
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
export default Shell;
