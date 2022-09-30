<template>
    <NuxtLayout name="index">
        <template #default>
            <NuxtChild />
        </template>
        <template #action>
            <vbutton icon="mdi:skip-previous" @click="navigateTo('/app/content1')" />
            <vbutton icon="mdi:play" />
            <vbutton icon="mdi:skip-next" @click="navigateTo('/app/content2')" />
            <vbutton icon="mdi:menu-open" @click="navigateTo('/menu')" />
        </template>
    </NuxtLayout>
</template>
