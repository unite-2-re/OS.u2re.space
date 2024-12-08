export declare const tasks: ({
    id: string;
    component: () => Promise<typeof import("../settings/Settings")>;
    icon: string;
    active: boolean;
    title: string;
} | {
    id: string;
    component: () => Promise<typeof import("../manager/Manager")>;
    icon: string;
    active: boolean;
    title: string;
})[];
export default tasks;
