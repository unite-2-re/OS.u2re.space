//
import { preferences } from '../../$core$/state/Preferences.ts';
import type { TabType } from "../../$core$/Types";

//
import { subscribe } from '/externals/lib/object.js';
import { synchronizeInputs } from '/externals/lib/dom.js';

//
import { forms } from "./Fields.ts"
import { E, M } from "/externals/lib/blue.js"
import { workspace } from '../../$core$/state/GridState.ts'

//
interface InputDesc {
    component?: any;
    icon?: string;
    label?: string;
};

//
interface FormDesc {
    inputs?: InputDesc[];
    label?: string;
};

//
interface FormProps {
    form?: FormDesc;
    tab?: TabType|null;
};

//
export default (task)=>{
    let list: any;
    const bindContent = (ct)=>{
        return ct;
    }

    const syncInput = (form)=>{
        synchronizeInputs(workspace.layout, '.u2-input', form?.element ?? form, subscribe);
        synchronizeInputs(preferences, '.u2-input', form?.element ?? form, subscribe);
        return form;
    }

    return bindContent(E("div" + (task.taskId || "#settings") + ".ui-content", {
        dataset: {highlight: 0, alpha: 0, scheme: "solid"},
    }, [
        E("div.adl-toolbar", {dataset: {highlight: 0, chroma: 0}}, [
        ]),
        E("div.adl-main", {dataset: {alpha: 0, chroma: 0, scheme: "solid"}}, [
            E("ui-scrollbox.adl-tab-box", {dataset: {scheme: "solid", alpha: 1, highlight: 0.5, chroma: 0.01}}),
            E("ui-scrollbox.adl-content-box", {dataset: {scheme: "solid", alpha: 1}}, [
                list = E("div.adl-content", {}, M(forms, (form)=>{
                    return syncInput(E("form", {dataset: {alpha: 0, chroma: 0, highlight: 0} }, [
                        E("span.adl-form-label", {slot: "label"}, [form?.label||""]),
                        M(form.inputs, (input)=>{
                            return E("ui-block", {style: "content-visibility: visible;"}, [
                                E("ui-icon", {slot: "icon", properties: input}),
                                E("span", {slot: "label"}, [input?.label||""]),
                                input?.component
                            ])
                        })
                    ]))
                }))
            ]),
        ])
    ]));
}
