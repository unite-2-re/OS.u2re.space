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