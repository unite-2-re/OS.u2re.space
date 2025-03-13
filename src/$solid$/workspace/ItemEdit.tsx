// @ts-ignore
import { For, createSignal, createComputed, onMount, lazy } from "solid-js";
import html from "solid-js/html";

//
import { removeItem } from "../../$state$/GridState.ts";
import { UIState } from "../../$state$/UIState.ts";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";

//
const fields = ["label", "icon", "href", "action", "id"];
const fieldTypes = new Map([
    ["text", ({input}: {input?: any})=> html`<ui-longtext class="u2-input" data-name=${()=>input?.name}><input value="" placeholder=${()=>input?.name} name=${()=>input?.name} type="text" label="test" placeholder="test-longtext" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no"/></ui-longtext>`]
]);

//
export const [targetItem, setTargetItem] = createSignal(null);
export const stateOnEdit = makeObjectAssignable(makeReactive({
    id: "",
    label: "",
    icon: "",
    href: "",
    action: ""
}));

//
export const ItemEdit = ({
    loadState, // loader from state manager (load for id)
    confirmState, // uploader to state manager (set by id)
    form // forms of editor
}: {
    loadState: ()=>any,
    confirmState: (S: any, KV?: [any, any])=>any,
    form: any
}) => {
    //
    const $content = (topLevel)=> { synchronizeInputs(stateOnEdit, ".u2-input", topLevel, subscribe); };

    //
    subscribe([UIState, "currentItem"], (value, prop)=>setTargetItem(value))

    // when changing target, set another field values
    createComputed(()=>{
        const state = loadState?.();
        if (state) {
            for (const k of fields) {
                if (stateOnEdit[k] != state?.[k]) { stateOnEdit[k] = state?.[k] || ""; };
            }
        }
    });

    //
    const confirm = (ev)=>{
        const modal = ev?.target?.closest?.(".adl-modal");
        if (modal) {
            confirmState(stateOnEdit);
            modal.dataset.hidden = "";
        };
    };

    //
    const deleteA = (ev)=>{
        const modal = ev?.target?.closest?.(".adl-modal");
        if (modal) {
            removeItem(stateOnEdit?.id);
            modal.dataset.hidden = "";
        };
    };

    //
    return html`<ui-modal class="adl-modal" data-hidden data-alpha="1" data-scheme="solid">
        <form data-alpha="0" data-highlight="0" class="adl-item-edit" ref=${$content}>
            <${For} each=${() => form}>${(input) => { return html`<label>
                <div class="adl-label">${input?.label}</div>
                <div class="adl-input" data-scheme="solid" data-alpha="0" data-highlight="2"><${fieldTypes?.get(input?.type)} input=${()=>input}><//></div>
            </label>`;}}<//>
        </form>
        <div data-alpha="0" data-highlight="0" class="adl-buttons">
            <!-- TODO! support for l18n -->
            <button onClick=${deleteA} class="adl-delete" data-scheme="inverse" data-chroma="0.05"> Delete </button>
            <button onClick=${confirm} class="adl-confirm" data-scheme="inverse" data-chroma="0.05"> Confirm </button>
        </div>
    </ui-modal>`;
};

//
export default ItemEdit;
