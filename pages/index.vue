<template>
    <NuxtLayout name="index">
        <template #default>
            <NuxtChild />
        </template>
        <template #action>
            <vbutton icon="mdi:skip-previous" />
            <vbutton icon="mdi:play" />
            <vbutton icon="mdi:skip-next" />
            <vbutton icon="mdi:apps" @click="navigateTo('/app')" />
        </template>
    </NuxtLayout>
</template>
