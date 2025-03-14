<template>
    <ui-switch data-name="theme" style="--max-value: 2;">
        <ui-icon icon="sun-moon" slot="icon"/>
        <input type="radio" label=" " placeholder="Dark" name="theme" value="dark"/>
        <input type="radio" label=" " placeholder="Default" name="theme" value="default"/>
        <input type="radio" label=" " placeholder="Light" name="theme" value="light"/>
    </ui-switch>
</template>
