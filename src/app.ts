import { render } from "solid-js/web"
import html from "solid-js/html";

//
import { Tabbed, type TabType } from "./$hash$/settings/index.ts";

//
const tabs: TabType[] = [
    {id: "display", content: "Display"}
]

//
export const initialize = (root)=>{
    render(()=>html`<${Tabbed} tabs=${tabs}><//>`, root);
}

//
export default initialize;

// DEBUG MODE!
initialize(document.querySelector("#root"));
