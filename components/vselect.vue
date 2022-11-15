<script>
export default {
    name: "SelectComponent",
    props: {
        items: { type: Array, default: () => [] },
        modelValue: { type: String, default: undefined }
    },
    data() {
        return {
            selected: null,
        }
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.selected = value;
            }
        },
        selected(value) {
            if(value != this.modelValue) this.$emit("update:modelValue", value);
        }
    }
}
</script>

<template>
    <select v-model="selected" class="select">
        <option v-for="(item, index) in items" :key="index" :value="item">{{ item }}</option>
    </select>
</template>

<style lang="scss" scoped>
select {
    border: 1px solid rgb(20, 20, 20);
    height: 2rem;

    &:focus {
        outline: none;
    }
}
</style>