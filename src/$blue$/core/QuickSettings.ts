import { E } from "/externals/lib/blue.js"
import { synchronizeInputs } from '/externals/lib/dom.js';
import { subscribe } from '/externals/lib/object.js';

//
import { preferences } from '../../$core$/state/Preferences.ts';

//
export const QuickSettings = () => {
    const syncInput = (form) => {
        synchronizeInputs(preferences, '.u2-input', form?.element ?? form, subscribe);
        return form;
    }

    //
    return syncInput(
        E("ui-modal.ui-modal", {
            attributes: { type: "popup" },
            dataset: { name: "quick-settings", hidden: "" }
        }, [
            E("div.modal-container", { dataset: { scheme: "solid", alpha: 1, chroma: 0.2, highlight: 1 }, }, [
                E("div.modal-main", { dataset: { scheme: "solid", alpha: 1, chroma: 0, highlight: 0 } }, [
                    // Верхняя панель с переключателями
                    E("div.modal-controls", { dataset: { alpha: 0 } }, [
                        E("ui-toggle.modal-toggle", { dataset: { alpha: 1, name: "theme-quick", chroma: 0.3, highlight: 1 } }, [
                            E("ui-icon.icon", { attributes: { icon: "sun-moon" } }),
                            E("input", { attributes: { type: "checkbox", name: "theme-quick" } })
                        ]),
                        E("ui-toggle.modal-toggle", { dataset: { alpha: 1, name: "orientation-lock", chroma: 0.3, highlight: 1 } }, [
                            E("ui-icon.icon", { attributes: { icon: "smartphone" } }),
                            E("input", { attributes: { type: "checkbox", name: "orientation-lock" } })
                        ]),
                        E("ui-toggle.modal-toggle", { dataset: { alpha: 1, name: "fullscreen", chroma: 0.3, highlight: 1 } }, [
                            E("ui-icon.icon", { attributes: { icon: "fullscreen" } }),
                            E("input", { attributes: { type: "checkbox", name: "fullscreen" } })
                        ]),
                        E("ui-toggle.modal-toggle", { dataset: { alpha: 1, name: "unk1", chroma: 0.3, highlight: 1 } }, [
                            E("ui-icon.icon", { attributes: { icon: "circle-help" } }),
                            E("input", { attributes: { type: "checkbox", name: "unk1" } })
                        ]),
                    ]),
                    // Центральная панель с ползунками
                    E("div.modal-sliders", { dataset: { alpha: 0 } }, [
                        E("div.modal-slider-row", { dataset: { alpha: 0 } }, [
                            E("ui-icon.slider-icon", { attributes: { icon: "volume-2" } }),
                            E("ui-slider.slider-control", { dataset: { scheme: "solid", alpha: 1 } }, [
                                E("span.ui-indicator.slider-indicator", { slot: "icon", dataset: { alpha: 0 } }),
                                E("input.slider-input", {
                                    dataset: { alpha: 0 },
                                    attributes: { type: "number", name: "volume" },
                                    properties: { min: 0, max: 1, step: 0.01, value: 0 }
                                })
                            ]),
                        ]),
                        E("div.modal-slider-row", { dataset: { alpha: 0 } }, [
                            E("ui-icon.slider-icon", { attributes: { icon: "sun-dim" } }),
                            E("ui-slider.slider-control", { dataset: { scheme: "solid", alpha: 1 } }, [
                                E("span.ui-indicator.slider-indicator", { slot: "icon", dataset: { alpha: 0 } }),
                                E("input.slider-input", {
                                    dataset: { alpha: 0 },
                                    attributes: { type: "number", name: "brightness" },
                                    properties: { min: 0, max: 1, step: 0.01, value: 0 }
                                })
                            ]),
                        ]),
                        E("div.modal-slider-row", { dataset: { alpha: 0 } }, [
                            E("ui-icon.slider-icon", { attributes: { icon: "eye" } }),
                            E("ui-slider.slider-control", { dataset: { scheme: "solid", alpha: 1 } }, [
                                E("span.ui-indicator.slider-indicator", { slot: "icon", dataset: { alpha: 0 } }),
                                E("input.slider-input", {
                                    dataset: { alpha: 0 },
                                    attributes: { type: "number", name: "night-mode" },
                                    properties: { min: 0, max: 1, step: 0.01, value: 0 }
                                })
                            ]),
                        ]),
                    ]),
                ]),
                E("div.modal-footer", { dataset: { alpha: 0 } }, [
                    E("span"),
                    E("ui-button.github", { dataset: { alpha: 0, action: "open-link", href: "https://github.com/orgs/unite-2-re" } }, [ E("ui-icon.icon", { attributes: { icon: "github" } }) ]),
                    E("ui-button.settings", { dataset: { alpha: 0, action: "settings" } }, [ E("ui-icon.icon", { attributes: { icon: "settings" } }) ]),
                ])
            ])
        ])
    );
}
