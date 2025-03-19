//
export interface TabType {
    component?: ()=>any;
    content: string;
    id: string;
    icon: string;
};

//
export interface TabProps {
    tabs: TabType[];
}

//
export interface ItemType {
    id: string;
    cell: [number, number];
};

//
export interface ShortcutType {
    id: string;
    label: string;
    icon: string;
    href?: string;
    action?: string;
};

//
export interface GridLayout {
    columns: number,
    rows: number
};

//
export interface ItemsType {
    layout: GridLayout;
    shortcuts: Set<ShortcutType>;
    items: Set<ItemType>;
    //lists: Set<string>;
};

//
export interface AppType {
    component?: ()=>any;
    title: string;
    icon: string;
    id: string;
};

//
export interface AppsType {
    tasksList: any;
};

//
export interface Task {
    args: any;
    desc: any;
    taskId: string;
};
