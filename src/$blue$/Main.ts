import Shell from './Shell.ts';
export const renderInPage = (root: HTMLElement, tasks: any[]): void => {
    root.append(Shell(tasks)?.element);
};
