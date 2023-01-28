<script>
export default {
    name: "SelectComponent",
    props: {
        items: { type: Array, default: () => [] },
        modelValue: { type: [String, Object], default: undefined },
        itemText: { type: String, default: undefined },
    },
    data() {
        return {
            selected: null,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.selected = value;
            },
        },
        selected(value) {
            if (value != this.modelValue) this.$emit("update:modelValue", value);
        },
    },
    methods: {
        toItemText(item) {
            if (typeof item == "object" && this.itemText) return item[this.itemText];
            return item;
        },
    },
};
</script>

<template>
    <select v-model="selected" class="select">
        <option v-for="(item, index) in items" :key="index" :value="item">{{ toItemText(item) }}</option>
    </select>
</template>

<style lang="scss" scoped>
select {
    border: 1px solid rgb(20, 20, 20);
    height: 2rem;
    min-height: 2rem;

    &:focus {
        outline: none;
    }
}
</style>
