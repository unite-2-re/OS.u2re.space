import { subscribe } from '/externals/modules/object.js';
import { synchronizeInputs } from '/externals/modules/ui.js';
import { E, M } from "/externals/modules/blue.js"

//
import { preferences } from '../../../$core$/state/Preferences.ts';
import { workspace } from '../../../$core$/state/GridState.ts'

//
import { forms } from "./Fields.ts"

//
export default (task)=>{
    const bindContent = (ct) => { return ct; }
    const syncInput = (form) => {
        synchronizeInputs(workspace.layout, '.u2-input', form?.element ?? form, subscribe);
        synchronizeInputs(preferences, '.u2-input', form?.element ?? form, subscribe);
        return form;
    }

    //
    return bindContent(E("div" + (task.taskId || "#settings") + ".ui-content", {
        dataset: {highlight: 0, alpha: 0, scheme: "solid"},
    }, [
        E("div.adl-toolbar", {dataset: {highlight: 0, chroma: 0}}, [
        ]),
        E("div.adl-main", {dataset: {alpha: 0, chroma: 0, scheme: "solid"}}, [
            E("ui-scrollbox.adl-tab-box", {dataset: {scheme: "solid", alpha: 0, highlight: 0.5, chroma: 0.01}}),
            E("ui-scrollbox.adl-content-box", {dataset: {scheme: "solid", alpha: 0}}, [
                E("div.adl-content", {}, M(forms, (form)=>{
                    return syncInput(E("form", { dataset: {scheme: "solid", alpha: 1, chroma: 0.05, highlight: 0} }, [
                        E("span.adl-form-label", {style: "background-color: transparent;", slot: "label", dataset: {scheme: "solid", alpha: 0, chroma: 0, highlight: 0}}, [form?.label||""]),
                        E("div.adl-block", {style: "background-color: transparent;", dataset: {scheme: "solid", alpha: 0, chroma: 0, highlight: 0}}, M(form.inputs, (input)=>{
                            return E("ui-block", {
                                style: "background-color: transparent; content-visibility: visible;",
                                dataset: {scheme: "solid", alpha: 0, chroma: 0, highlight: 0}},
                            [
                                E("ui-icon", {slot: "icon", properties: input}),
                                E("span", {slot: "label"}, [input?.label||""]),
                                input?.component
                            ])
                        }))
                    ]))
                }))
            ]),
        ])
    ]));
}
