// @ts-ignore
import { For, createSignal, onMount, lazy, Show, createMemo, createEffect } from "solid-js";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
export const refAndMount = (cb)=>{
    return (element)=>{
        onMount(()=>cb(element));
    }
}

//
export const observe = (val) => {
    return (el)=> {
        const [attr, setter] = val;
        observeAttribute(el, attr, (obs)=>setter(el.getAttribute(attr)));
    }
}

//
export const logged = (fx)=>{
    return (...args)=>{
        console.log(...args);
        return fx(...args);
    }
}
