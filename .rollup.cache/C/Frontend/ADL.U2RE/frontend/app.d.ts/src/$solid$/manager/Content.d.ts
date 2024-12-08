import type { TabType } from "@/src/$core$/Types";
export declare const TabContent: ({ tab, children }: {
    tab: () => TabType;
    children?: () => any;
}) => Node | Node[];
export default TabContent;
