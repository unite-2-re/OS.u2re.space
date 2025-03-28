//
import { For, createSignal } from "solid-js";
import { Dynamic } from "solid-js/web"

//
import type { AppsType } from "../../$core$/Types.ts";
import { confirmEdit, gridState, itemForm } from "../../$state$/GridState.ts";
import ItemEdit, { targetItem } from "../workspace/ItemEdit.tsx";
import Workspace from "../workspace/Workspace.tsx";
import components from "./Components.tsx";

//
import { subscribe } from "/externals/lib/object.js";

// sandbox="allow-same-origin allow-scripts allow-downloads allow-storage-access-by-user-activation allow-forms"
const makeView = ({ args, id }: { args: any, id: string }) => {
    return (<div id={id?.replace?.("#", "")} class="ui-content"><div class="adl-main"><div class="adl-content-box"><iframe
    referrerpolicy="no-referrer"
    width="100%" height="100%"
    //frameBorder="0"
    //allowtransparency
    //scrolling
    //seamless
    //credentialless
    style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;"
    src={args?.href}
    loading="eager"
    allowfullscreen
    allow="*"
    ></iframe></div></div></div>);
}

// while: tab.component should be  ()=> html`...`
export const Shell = ({ tasksList }: AppsType) => {
    const [tasks, setTasks] = createSignal(Array.from(tasksList.values()), { equals: false });
    subscribe(tasksList, () => { setTasks(Array.from(tasksList.values())) });

    return (
        <>
            {/* Workspace Icons */}
            <Workspace {...gridState} />

            {/* UI-Scaled Layer */}
            <ui-orientbox id="ui-layer" className="ui-layer" orient="0" style="background-color: transparent;">
                {/* Apps Part */}

                <For each={tasks()}>{(task: any) => (
                    <ui-frame
                        key={task?.taskId}
                        data-highlight="2"
                        data-chroma="0.1"
                        data-scheme="solid"
                        data-id={task?.taskId.replace("#", "")}
                    >
                        <div
                            style="justify-self: start; text-align: start; padding=inline: 1rem"
                            slot="ui-title-bar"
                        >
                            {task?.desc?.label}
                        </div>
                        <Dynamic component={components?.get(task?.args?.type) || makeView} {...task} />
                    </ui-frame>
                )}</For>

                {/* Taskbar */}
                <ui-taskbar prop:tasks={tasks()}>
                    <For each={tasks()}>{(task: any) => (
                        <ui-task
                            key={task?.taskId}
                            prop:taskId={task?.taskId.replace("#", "")}
                            prop:desc={task?.desc}
                            data-id={task?.taskId.replace("#", "")}
                        >
                            <ui-icon icon={task?.desc?.icon} />
                        </ui-task>
                    )}</For>
                </ui-taskbar>

                {/* Navbar (Mobile Only) */}
                <ui-navbar></ui-navbar>

                {/* Merge to UI layer context-menu (13.12.2024) */}
                <ui-modal type="contextmenu" id="contextmenu" style="display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"></ui-modal>

                {/* Sentence 30.12.2024 */}
                <ui-modal type="popup" data-name="calendar">
                    <ui-calendar></ui-calendar>
                </ui-modal>

                <ItemEdit loadState={targetItem} confirmState={confirmEdit} form={itemForm} />
            </ui-orientbox>
        </>
    );
};

//
export default Shell;
