// @ts-ignore
import { onMount } from "solid-js";

// @ts-ignore
import {observeAttribute} from "/externals/lib/dom.js";

//
export const refAndMount = (cb)=>{
    return (element)=>{
        cb(element);
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
