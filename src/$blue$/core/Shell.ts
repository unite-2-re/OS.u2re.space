import { confirmEdit, itemForm, workspace } from "../../$core$/state/GridState.ts";
import Workspace from "../workspace/Workspace";
import {E, H, M, observableBySet} from "/externals/lib/blue.js"

//
import Manager from "../manager/Manager.ts";
import Settings from "../settings/Settings.ts";
import ItemEdit from "../workspace/ItemEdit.ts";
import { QuickSettings } from "./QuickSettings.ts";
import { AppMenu } from "./AppMenu.ts";

//
export const viewable = (task)=>{
    return H(`<div id="${task.taskId?.replace?.("#", "")}" class="ui-content"><div class="adl-main"><div class="adl-content-box"><iframe referrerpolicy="no-referrer" width="100%" height="100%" frameBorder="0" allowtransparency scrolling seamless credentialless style="border:none;inline-size:100%;block-size:100%;pointer-events:auto;" src="${task.args?.href}" loading="eager" allowfullscreen allow="*"></iframe></div></div></div>`);
}

//
export const imageView = (task)=>{
    return H(`<div id="${task.taskId?.replace?.("#", "")}" class="ui-content"><div class="adl-main"><div class="adl-content-box">
        <img src="${task?.args?.src || task?.args?.href || ""}" alt="Image View" style="inline-size: 100%; block-size: 100%; object-fit: contain; object-position: center; background-color: transparent;"/>
    </div></div></div>`);
}

//
export const components: Map<string, any> = new Map<string, any>([
    ["manager", Manager],
    ["settings", Settings],
    ["image", imageView],
    ["iframe", viewable]
]);

//
export default (tasks: any)=>{
    let taskproc: any;
    let taskbar: any;

    //
    return E(":fragment:", {}, [
        Workspace(workspace.gridState),
        E("ui-orientbox#ui-layer.ui-layer", {attribute: {orient: 0, }, style: {backgroundColor: "transparent"}}, [
            //! we can't reactive contents without container element
            taskproc = E("div", {style: "display: contents !important; background-color: transparent !important;"}, M(observableBySet(tasks), (task: any)=>{
                return E("ui-frame", {dataset: {hidden: "", highlight: 2, chroma: 0.1, scheme: "solid", id: task?.taskId.replace("#", "") }}, [
                    E("div", {style: "justify-self: start; text-align: start; padding=inline: 1rem", slot: "ui-title-bar"}, [task?.desc?.label||""]),
                    (components.get(task?.args?.type) || viewable)?.(task),
                ])
            })),
            taskbar = E("ui-taskbar", {properties: {tasks}}, M(observableBySet(tasks), (task)=>E("ui-task", {properties: task, dataset: {id: task.taskId}}, [E("ui-icon", {attributes: task.desc})]))),
            E("ui-navbar", {}, []),
            E("ui-modal#contextmenu", {attributes: {type: "contextmenu"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, []),
            E("ui-modal", {attributes: {type: "popup"}, dataset: {name: "calendar"}}, [
                E("ui-calendar", {}, [])
            ]),

            ItemEdit(workspace, confirmEdit, itemForm),
            QuickSettings(),
            AppMenu()
        ])
    ]);
}
