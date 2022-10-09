<script>
export default {
    name: "SettingCategoryComponent",
    props: {
        title: { type: String, default: "Unbenannt" },
        icon: { type: String, default: undefined },
        href: { type: String, default: undefined },
        alt: { type: Boolean, default: undefined },
    },
    computed: {
        active() {
            return this.$route.fullPath == this.href;
        },
    },
    methods: {
        click() {
            if (this.href) navigateTo(this.href);
        },
    },
};
</script>

<template>
    <div v-ripple class="setting-category" :class="{ alt, active }" @click="click">
        <span class="mdi" :class="icon" style="font-size: 2rem" />
        <div class="title">{{ title }}</div>
    </div>
</template>

<style lang="scss" scoped>
.setting-category {
    display: grid;
    grid-template-columns: 3rem auto;
    padding: 1rem;
    gap: 0.5rem;

    .title {
        display: flex;
        align-items: center;
    }
}

.setting-category.alt {
    box-shadow: $shadow;
}

.setting-category.active {
    background: rgb(40, 40, 40);
    box-shadow: $shadow;
}
</style>
