import { confirmEdit, gridState, itemForm } from "../../$state$/GridState";
import Workspace from "../workspace/Workspace";
import {E, M, computed, observableBySet, remap} from "/externals/lib/blue.js"

//
import Manager from "../manager/Manager.ts";
import Settings from "../settings/Settings.ts";
import ItemEdit from "../workspace/ItemEdit.ts";

//
export const components: Map<string, any> = new Map<string, any>([
    ["manager", Manager],
    ["settings", Settings]
]);

//
export default (tasks: any)=>{
    let taskproc: any;
    let taskbar: any;

    //
    return E(":fragment:", {}, [
        Workspace(gridState),
        E("ui-orientbox#ui-layer.ui-layer", {attribute: {orient: 0, }, style: {backgroundColor: "transparent"}}, [
            //! we can't reactive contents without container element
            taskproc = E("div", {style: "display: contents !important; background-color: transparent !important;"}, M(observableBySet(tasks), (task: any)=>{
                return E("ui-frame", {dataset: {highlight: 2, chroma: 0.1, scheme: "solid", id: task?.taskId.replace("#", "") }}, [
                    E("div", {style: "justify-self: start; text-align: start; padding=inline: 1rem", slot: "ui-title-bar"}, [task?.desc?.label]),
                    components.get(task?.args?.type)?.(task),
                ])
            })),
            taskbar = E("ui-taskbar", {properties: {tasks}}, M(observableBySet(tasks), (task)=>E("ui-task", {properties: task, dataset: {id: task.taskId}}, [E("ui-icon", {attributes: task.desc})]))),
            E("ui-navbar", {}, []),
            E("ui-modal#contextmenu", {attributes: {type: "contextmenu"}, style: "display: inline grid; padding: 0.25rem; grid-template-columns: [icon] minmax(0px, 1.75rem) [content] minmax(0px, 1fr);"}, []),
            E("ui-modal", {attributes: {type: "popup"}, dataset: {name: "calendar"}}, [
                E("ui-calendar", {}, [])
            ]),
            ItemEdit(confirmEdit, itemForm)
        ])
    ]);
}
