import tasksList from "../$core$/Tasks.ts";
import Shell from "./core/Shell.tsx";

//
import { render } from "solid-js/web";

//
export const renderInPage = (root: HTMLElement/*, tasks: any*/)=>{
    render(()=>(<Shell tasksList={tasksList}></Shell>), root);
}
