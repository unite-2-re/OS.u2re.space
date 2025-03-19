import {E, H, M, observableBySet} from "/externals/lib/blue.js"
import { synchronizeInputs } from '/externals/lib/dom.js';
import { preferences } from '../../$core$/state/Preferences.ts';
import { subscribe } from '/externals/lib/object.js';

//
export const QuickSettings = ()=>{
    const syncInput = (form)=>{
        synchronizeInputs(preferences, '.u2-input', form?.element ?? form, subscribe);
        return form;
    }

    //
    return syncInput(E("ui-modal", {attributes: {type: "popup", hidden: ""}, dataset: {name: "quick-settings"}}, [
        E("div", { dataset: {alpha: 0}, style: "inline-size: 100%; padding: 1rem; padding-block-end: 0rem; display: flex; flex-direction: row; gap: 1rem; background-color: transparent; justify-content: space-between;" }, [
            E("ui-toggle", { dataset: {alpha: 1, name: "theme-quick", chroma: 0.3, highlight: 1}, style: "inline-size: 2.5rem; block-size: 2.5rem;" }, [
                E("ui-icon", {attributes: {"icon": "sun"}, style: "padding: 0.75rem;"}),
                E("input", {attributes: {"type": "checkbox", "name": "theme-quick"}})
            ]),
            E("ui-toggle", { dataset: {alpha: 1, name: "orientation-lock", chroma: 0.3, highlight: 1}, style: "inline-size: 2.5rem; block-size: 2.5rem;" }, [
                E("ui-icon", {attributes: {"icon": "smartphone"}, style: "padding: 0.75rem;"}),
                E("input", {attributes: {"type": "checkbox", "name": "orientation-lock"}})
            ]),
            E("ui-toggle", { dataset: {alpha: 1, name: "unk0", chroma: 0.3, highlight: 1}, style: "inline-size: 2.5rem; block-size: 2.5rem;" }, [
                E("ui-icon", {attributes: {"icon": "circle-help"}, style: "padding: 0.75rem;"}),
                E("input", {attributes: {"type": "checkbox", "name": "unk0"}})
            ]),
            E("ui-toggle", { dataset: {alpha: 1, name: "unk1", chroma: 0.3, highlight: 1}, style: "inline-size: 2.5rem; block-size: 2.5rem;" }, [
                E("ui-icon", {attributes: {"icon": "circle-help"}, style: "padding: 0.75rem;"}),
                E("input", {attributes: {"type": "checkbox", "name": "unk1"}})
            ]),
        ]),
        E("div", { dataset: {alpha: 0}, style: "inline-size: 100%; padding: 1rem; padding-block-end: 0.5rem; display: flex; flex-direction: column; gap: 1rem; background-color: transparent; gap: 1rem;" }, [
            E("div", { dataset: {alpha: 0}, style: "padding: 0.5rem; padding-block: 0.25rem; justify-content: space-between; inline-size: 100%; min-block-size: 1rem; block-size: max-content; display: flex; flex-direction: row; gap: 1rem; background-color: transparent; gap: 1rem;" }, [
                E("ui-icon", { attributes: {icon: "volume-2"}, style: "block-size: 100%; min-block-size: 1rem;" }),
                E("ui-slider", { dataset: {scheme: "solid", alpha: 1}, style: "background-color: transparent; flex-grow: 1; flex-basis: 100%; block-size: 0.75rem;"}, [
                    E("span.ui-indicator", {style: "font-size: 0.4rem;", slot: "icon", dataset: {alpha: 0}}),
                    E("input", {dataset: {alpha: 0}, style: "background-color: transparent;", attributes: {type: "number", name: "volume"}, properties: {min: 0, max: 1, step: 0.01, value: 0}})
                ]),
            ]),
            E("div", { dataset: {alpha: 0}, style: "padding: 0.5rem; padding-block: 0.25rem; justify-content: space-between; inline-size: 100%; min-block-size: 1rem; block-size: max-content; display: flex; flex-direction: row; gap: 1rem; background-color: transparent; gap: 1rem;" }, [
                E("ui-icon", { attributes: {icon: "sun-dim"}, style: "block-size: 100%; min-block-size: 1rem;" }),
                E("ui-slider", { dataset: {scheme: "solid", alpha: 1}, style: "background-color: transparent; flex-grow: 1; flex-basis: 100%; block-size: 0.75rem;"}, [
                    E("span.ui-indicator", {style: "font-size: 0.4rem;", slot: "icon", dataset: {alpha: 0}}),
                    E("input", {dataset: {alpha: 0}, style: "background-color: transparent;", attributes: {type: "number", name: "brightness"}, properties: {min: 0, max: 1, step: 0.01, value: 0}})
                ]),
            ]),
        ]),
        E("div", { dataset: {alpha: 1, chroma: 0.2, highlight: 2}, style: "inline-size: 100%; padding: 1rem; padding-block: 0.5rem; display: flex; flex-direction: row; gap: 1rem; place-content: center; place-items: center; justify-content: space-between;" }, [
            E("span"),
            E("ui-button", { dataset: {alpha: 0, action: "settings"}, style: "inline-size: 2rem; block-size: 2rem;" }, [
                E("ui-icon", {attributes: {"icon": "settings"}, style: "padding: 0.5rem;"}),
            ]),
        ]),
    ]));
}
