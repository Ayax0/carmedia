<script>
export default {
    name: "SettingTextComponent",
    props: {
        modelValue: { type: String, default: null },
        title: { type: String, required: true },
    },
    data() {
        return {
            value: null,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.value = value;
            },
        },
        value(value) {
            this.$emit("update:modelValue", value);
        },
    },
};
</script>

<template>
    <div class="setting-text">
        <div class="title">{{ title }}</div>
        <input v-model="value" type="text" />
    </div>
</template>

<style lang="scss" scoped>
.setting-text {
    display: grid;
    grid-template-rows: 1.5rem 2rem;

    input {
        border: 1px solid rgb(20, 20, 20);
        padding: 0 0.5rem;

        &:focus {
            outline: none;
        }
    }
}
</style>
