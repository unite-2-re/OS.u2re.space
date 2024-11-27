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
    label: string;
    icon: string;
    id: string;
    href?: string;
    action?: string;
    cell: [number, number];
};

//
export interface ItemsType {
    items: ItemType[];
    lists: string[][];
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
    tasks: AppType[];
};
