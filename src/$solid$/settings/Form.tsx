// @ts-ignore
import { For, createSignal, onMount, lazy } from "solid-js";
import { Dynamic } from "solid-js/web";

// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

// @ts-ignore
import { observeAttribute, synchronizeInputs } from "/externals/lib/dom.js";
import { preferences } from "../../$state$/Preferences.ts";

//
export const Form = ({ form, tab }: { form: any, tab: () => any }) => {
    const $content = (topLevel) => { synchronizeInputs(preferences, ".u2-input", topLevel, subscribe); };

    // TODO: available by tab (' data-hidden="..." ')
    return (
        <form
            data-alpha="0"
            data-scheme="solid"
            data-chroma="0"
            data-highlight="0"
            ref={$content}
        >
            <span class="adl-form-label">{form?.label}</span>
            <For each={form?.inputs}>
                {(input) => (
                    <ui-block>
                        <ui-icon slot="icon" icon={input?.icon} />
                        <span slot="label">{input?.label}</span>
                        <Dynamic component={input?.component} slot="element"></Dynamic>
                    </ui-block>
                )}
            </For>
        </form>
    );
};

//
export default Form;
