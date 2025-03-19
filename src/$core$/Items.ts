import { workspace } from "../$state$/GridState";
import { subscribe } from "/externals/lib/object.js";

//
export const setProperty = (target, name, value, importance = "")=>{
    if ("attributeStyleMap" in target) {
        const raw = target.attributeStyleMap.get(name);
        const prop = raw?.[0] ?? raw?.value;
        if (parseFloat(prop) != value && prop != value || prop == null) {
            //if (raw?.[0] != null) { raw[0] = value; } else
            if (raw?.value != null) { raw.value = value; } else
            { target.attributeStyleMap.set(name, value); };
        }
    } else
    {
        const prop = target?.style?.getPropertyValue?.(name);
        if ((parseFloat(prop||"0") != value && prop != value) || !prop) {
            target.style.setProperty(name, value, importance);
        }
    }
}

//
export const createShaped = (item, gs)=>{
    // if exists, skip
    const exists = gs?.querySelector?.(`.u2-grid-item[data-id=\"${item?.id}\"]`);
    if (exists || !item?.id) { return exists; };

    //
    const element: any = document.createElement("ui-shaped");
    element.classList.add("u2-grid-item");
    element.item = item;
    element.icon = item.icon || "shield-question";
    element.label = item.label || "";
    element.setAttribute("data-scheme", "accent-inverse");
    element.setAttribute("data-alpha", "1");
    element.setAttribute("data-chroma", "0");
    element.setAttribute("data-id", item.id || "");
    element.setAttribute("data-label", item.label || "");
    element.setAttribute("data-action", item.action || "");
    element.setAttribute("data-href", item.href || "");

    //
    const shape: any = document.createElement("div");
    shape.classList.add("u2-item-design");
    shape.setAttribute("data-scheme", "accent-inverse");
    shape.setAttribute("data-shape", "square");
    shape.setAttribute("data-alpha", "1");
    shape.setAttribute("data-highlight", "1");
    shape.setAttribute("data-highlight-hover", "5");
    shape.setAttribute("data-chroma", "0");

    //
    const scr = workspace.getItem(item.id);
    subscribe(scr, (value, prop)=>{
        trackShortcutState(element, scr, [value, prop]);
    });

    //
    element.append(shape);
    return element;
}

//
export const createLabel = (item, gs)=>{
    // if exists, skip
    const exists = gs?.querySelector?.(`.u2-grid-item[data-id=\"${item?.id}\"]`);
    if (exists || !item?.id) { return exists; }

    //
    const element: any = document.createElement("span");
    element.classList.add("u2-grid-item");
    element.classList.add("u2-item-label");
    element.setAttribute("data-scheme", "base");
    element.setAttribute("data-alpha", "0");
    element.setAttribute("data-chroma", "0.01");
    element.setAttribute("data-transparent", "");
    element.setAttribute("data-label", item.label || "");
    element.label = item.label || "";
    element.innerHTML = item.label || "";

    //
    const scr = workspace.getItem(item.id);
    subscribe(scr, (value, prop)=>{
        trackShortcutState(element, scr, [value, prop]);
    });

    //
    return element;
}

//
export const trackShortcutState = (element, shoftcut, [value, prop], args?)=>{

    //
    if (element) {
        if (prop == "label" && element.matches("span")) { element.innerHTML = value; } else
        if (prop == "icon") { element[prop] = value || element[prop] || ""; } else
        if (element?.dataset && typeof prop == "string" && !URL.canParse(prop) && !prop.includes("\/") && !prop.includes("#")) { element.dataset[prop] = value; };
    }

    //
    element?.dispatchEvent?.(new CustomEvent("u2-item-state-change", {
        detail: {shoftcut, value, prop},
        bubbles: true,
        cancelable: true
    }));
}
