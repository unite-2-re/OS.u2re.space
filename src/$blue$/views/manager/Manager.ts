import { subscribe, observableByMap } from "/externals/lib/object.js";
import { synchronizeInputs } from "/externals/lib/dom.js";
import { H } from "/externals/lib/blue.js"

//
import { FileManagment } from "../../../$core$/file/FileManage.ts";
import { doUIAction } from "../../../$core$/interact/ItemAction.ts";
import type { Task } from "../../../$core$/Types.ts";

//
export default (task: Task, )=>{
    const manager = new FileManagment(task.args); manager.navigate(task.args?.directory || "/user/images/");
    const current = manager.getCurrent();

    //
    const bindContent = (ct)=>{
        const content = ct?.element ?? ct;
        FileManagment.bindManager(content, manager);
        synchronizeInputs(task.args, ".u2-input", content, subscribe);
        return content;
    }

    //
    const bindInput   = (input) => { input.addEventListener("change", (ev)=>{ manager.navigate(ev.target.value || FileManagment.fileOf(content.value), ev)}); return input; }
    const initiatorOf = () => content?.querySelector?.(".adl-content input:checked");

    //
    //const handleDeleteClick   = (_: Event) => { return doUIAction("file:delete", initiatorOf()); };
    const handlePlayClick     = (_: Event) => { return doUIAction("file:use"   , initiatorOf()); };
    const handleAddClick      = (_: Event) => { return manager.requestUpload(); };
    const handleDirUp         = (_: Event) => { return manager.navigate("../"); };
    const goDirectory         = (_: Event) => { return manager.navigate(document.activeElement?.value || initiatorOf()?.parentNode?.value || manager.currentDir()); };

    //
    const navigateFile   = (ev: Event, _: string) => { return manager.navigate((ev?.target as any)?.value || FileManagment.fileOf(content.value), ev); };
    const getFilename    = (        path: string) => { const parts = path.split("/"); return parts.at(-1) || parts.at(-2) || path; };
    const dropHandle     = (ev: DragEvent) => { ev.preventDefault(); return manager.handleDrop(ev.dataTransfer); };
    const dragOverHandle = (ev: DragEvent) => { ev.preventDefault(); };
    const makeSortable   = (current, Ef) => { const element = Ef?.element ?? Ef; subscribe(current, ()=>element.style.order = Array.from(current.keys()).sort().indexOf(element.value)); return Ef; }

    //
    const content = bindContent(H`<${"div" + (task.taskId || "#manager") + ".ui-content"} dataset=${{highlight: 0, alpha: 0, scheme: "solid"}}>
    <${"div.adl-toolbar"} dataset=${{highlight: 0, chroma: 0}}>
        <${"button.adl-dir-up"} tabIndex="-1" type="button" dataset=${{scheme: "inverse", chroma: 0.2, highlight: 2, highlightHover: 3}} on:click=${handleDirUp}><ui-icon icon="arrow-up" /></button>
        <${"ui-longtext.adl-space.u2-input"} tabIndex="-1" type="button" dataset=${{highlight: 1, name: "directory"}} on:click=${handleDirUp} style=${{ display: "grid", inlineSize: "auto", flexGrow: 1, minInlineSize: "max-content", maxInlineSize: "100%"}}>
            ${bindInput(H(`<input type="text" name="directory" placeholder="" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no" />`))}
        </ui-longtext>
        <${"button.adl-dir-go"} tabIndex="-1" type="button" dataset=${{scheme: "inverse", chroma: 0.2, highlight: 2, highlightHover: 3}} on:click=${goDirectory}><ui-icon icon="step-forward" /></button>
        <${"button.adl-file-add"} tabIndex="-1" type="button" dataset=${{highlightHover: 2}} on:click=${handleAddClick}><ui-icon icon="file-up" /></button>
        <${"button.adl-dir-use"} tabIndex="-1" type="button" dataset=${{highlightHover: 2}} on:click=${handlePlayClick}><ui-icon icon="image-play" /></button>
    </div>
    <${"div.adl-main"} dataset=${{alpha: 0, chroma: 0, scheme: "solid"}}>
        <${"ui-scrollbox.adl-tab-box"} dataset=${{scheme: "solid", alpha: 1, highlight: 0.5, chroma: 0.01}}></ui-scrollbox>
        <${"ui-scrollbox.adl-content-box"} dataset=${{scheme: "solid", alpha: 1}}>
            <${"div.adl-content"} on:drop=${dropHandle} on:dragover=${dragOverHandle} iterate=${observableByMap(current)}>${(entry)=>{
                return makeSortable(current, H`<ui-select-row on:dblclick=${(ev)=>navigateFile(ev, entry[0])} on:click=${(ev)=>navigateFile(ev, entry[0])} href="#" style="user-select: none; pointer-events: auto; touch-action: manipulation; -webkit-touch-callout: default; -webkit-user-drag: element; -moz-user-drag: element;" name="file" draggable="true" prop:value=${entry[0]} value=${entry[0]} dataset=${{ value: entry[0] }}>
                    <ui-icon style="user-select: none; pointer-events: none;" inert prop:icon=${manager.byType(entry[0])}></ui-icon>
                    <span style="user-select: none; pointer-events: none;" inert>${getFilename(entry[0]||"")}</span>
                    <span style="user-select: none; pointer-events: none;" inert>${entry[1]?.size ? (entry[1]?.size + " B") : ""}</span>
                    <span style="user-select: none; pointer-events: none;" inert>${entry[1]?.lastModified ? new Date(entry[1]?.lastModified).toLocaleString() : entry[0]?.startsWith("..") ? "" : "N/A"}</span>
                </ui-select-row>`)}
            }</div>
        </ui-scrollbox>
    </div>
</div>`);
    return content;
}
