import { subscribe } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";
import { E, M, H, observableByMap } from "/externals/lib/blue.js"

//
import { FileManagment } from "../../../$core$/file/FileManage.ts";
import { doUIAction } from "../../../$core$/interact/ItemAction.ts";
import type { Task } from "../../../$core$/Types.ts";

//
export default (task: Task, )=>{
    const manager = new FileManagment(task.args);
    manager.navigate(task.args?.directory || "/user/images/");
    const current = manager.getCurrent();

    //
    const bindContent = (ct)=>{
        const content = ct.element;
        FileManagment.bindManager(content, manager);
        synchronizeInputs(task.args, ".u2-input", content, subscribe);
        return content;
    }

    //
    const bindInput   = (input) => { input.addEventListener("change", (ev)=>{ manager.navigate(ev.target.value || FileManagment.fileOf(content.value), ev)}); return input; }
    const initiatorOf = () => content?.querySelector?.(".adl-content input:checked");

    //
    const handleDeleteClick   = (_: Event) => { return doUIAction("file:delete", initiatorOf()); };
    const handlePlayClick     = (_: Event) => { return doUIAction("file:use"   , initiatorOf()); };
    const handleAddClick      = (_: Event) => { return manager.requestUpload(); };
    const handleDirUp         = (_: Event) => { return manager.navigate("../"); };
    const goDirectory         = (_: Event) => { return manager.navigate(manager.currentDir()); };

    //
    const navigateFile   = (ev: Event, _: string) => { return manager.navigate((ev?.target as any)?.value || FileManagment.fileOf(content.value), ev); };
    const getFilename    = (        path: string) => { const parts = path.split("/"); return parts.at(-1) || parts.at(-2) || path; };
    const dropHandle     = (ev: DragEvent) => { ev.preventDefault(); return manager.handleDrop(ev.dataTransfer); };
    const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };

    //
    const makeSortable = (current, Ef)=>{
        const element = Ef.element;
        subscribe(current, ()=>element.style.order = Array.from(current.keys()).sort().indexOf(element.value));
        return Ef;
    }

    //
    const content = bindContent(E("div" + (task.taskId || "#manager") + ".ui-content", { dataset: {highlight: 0, alpha: 0, scheme: "solid"}, }, [
        E("div.adl-toolbar", {dataset: {highlight: 0, chroma: 0}}, [
            E("button.adl-dir-up", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleDirUp])}}, [H(`<ui-icon icon="arrow-up" />`)]),
            E("button.adl-file-add", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleAddClick])}}, [H(`<ui-icon icon="file-up" />`)]),
            // TODO: re-design those controls
            //E("button.adl-file-get", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleDownloadClick])}}, [H(`<ui-icon icon="file-down" />`)]),
            //
            E("ui-longtext.adl-space.u2-input", {attributes: {tabindex: -1, type: "button"}, dataset: {highlight: 1, name: "directory"}}, [
                bindInput(H(`<input type="text" name="directory" placeholder="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" />`))
            ]),
            E("button.adl-dir-go"  , {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([goDirectory])}}, [H(`<ui-icon icon="step-forward" />`)]),
            E("button.adl-file-del", {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handleDeleteClick])}}, [H(`<ui-icon icon="file-x" />`)]),
            E("button.adl-dir-use" , {attributes: {tabindex: -1, type: "button"}, dataset: {highlightHover: 2}, on: {click: new Set([handlePlayClick])}}, [H(`<ui-icon icon="image-play" />`)]),
        ]),
        E("div.adl-main", {dataset: {alpha: 0, chroma: 0, scheme: "solid"}}, [
            E("ui-scrollbox.adl-tab-box", {dataset: {scheme: "solid", alpha: 1, highlight: 0.5, chroma: 0.01}}),
            E("ui-scrollbox.adl-content-box", {dataset: {scheme: "solid", alpha: 1}}, [
                E("div.adl-content", {on: {drop: new Set([dropHandle]), dragover: new Set([dragOverHandle])}}, M(observableByMap(current), (entry)=>{
                    return makeSortable(current, E("ui-select-row", {
                        attributes: { href: "#", name: "file", draggable: true},
                        properties: { value: entry[0] },
                        style: "user-select: none; pointer-events: auto; touch-action: manipulation; -webkit-touch-callout: default; -webkit-user-drag: element; -moz-user-drag: element;",
                        on: {
                            click: new Set([(ev)=>navigateFile(ev, entry[0])]),
                            dblclick: new Set([(ev)=>navigateFile(ev, entry[0])]),
                            //contextmenu: new Set([(ev)=>ctxMenuWorkaround(ev, entry[0])])
                        }
                    }, [
                        E("ui-icon", {style: "user-select: none; pointer-events: none;", properties: {icon: manager.byType(entry[0]), inert: true}}),
                        E("span", {style: "user-select: none; pointer-events: none;", properties: {inert: true}}, [getFilename(entry[0]||"")]),
                        E("span", {style: "user-select: none; pointer-events: none;", properties: {inert: true}}, [entry[1]?.size ? (entry[1]?.size + " B") : ""]),
                        E("span", {style: "user-select: none; pointer-events: none;", properties: {inert: true}}, [entry[1]?.lastModified
                            ? new Date(entry[1]?.lastModified).toLocaleString()
                            : entry[0]?.startsWith("..") ? "" : "N/A"])
                    ]))
                }))
            ]),
        ])
    ]));
    return content;
}
