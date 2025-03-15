import { createApp, h } from 'vue';
import tasksList from '../$core$/Tasks.ts';
import Shell from './core/Shell.vue';
export const renderInPage = (root: HTMLElement): void => {
    createApp(Shell, {tasksList}).mount(root);
};
