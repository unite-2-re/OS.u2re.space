import tasksList from "../$core$/Tasks.ts";
import Shell from "./core/Shell.tsx";

//
import { render } from "solid-js/web";
import html from "solid-js/html";

//
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>html`<${Shell} tasksList=${()=>tasksList}><//>`, root);
}
