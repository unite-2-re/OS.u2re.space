import html from "solid-js/html";

//
export const textField = ({input}: {input?: any})=> html`<ui-longtext class="u2-input" data-name=${()=>input?.name}><input value="" placeholder=${()=>input?.name} name=${()=>input?.name} type="text" label="test" placeholder="test-longtext" tabindex="0" draggable="false" autocomplete="off" class="u2-input" scroll="no"/></ui-longtext>`;
export const itemFields = ["label", "icon", "href", "action"];
export const itemForm  = [
    {
        name: "label",
        label: "Label",
        component: textField
    },
    {
        name: "icon",
        label: "IconID",
        component: textField
    },
    {
        name: "action",
        label: "Action",
        component: textField
    },
    {
        name: "href",
        label: "HREF",
        component: textField
    },
];
