// @ts-ignore
import { subscribe, makeReactive, makeObjectAssignable } from "/externals/lib/object.js";

//
export const preferences = makeObjectAssignable(makeReactive({
    scaling: 1,
    columns: 4,
    rows: 8,
    theme: "default"
}));
