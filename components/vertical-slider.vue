<script>
export default {
    name: "VerticalSliderComponent",
    props: {
        modelValue: { type: Number, default: 0 },
    },
    data() {
        return {
            value: 0,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.value = value;
            },
        },
    },
    methods: {
        click(event) {
            if (event.target == this.$refs.slider) {
                this.value = Math.round(100 - (100 / this.$refs.slider.clientHeight) * event.offsetY);
                this.$emit("update:modelValue", this.value);
            }
        },
    },
};
</script>

<template>
    <div ref="slider" class="slider" :style="{ '--slider-value': `${value}%` }" @click="click">
        <div class="track"></div>
        <div class="track-filled"></div>
        <div class="thumb"></div>
    </div>
</template>

<style lang="scss" scoped>
.slider {
    flex: 1;
    height: 100%;
    position: relative;
    margin: 1.5rem 0 0.5rem 0;

    .track,
    .track-filled {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        width: 5px;
        transform: translateX(-50%);
        background: #ccc;
        border-radius: 2px;
        pointer-events: none;
    }

    .track-filled {
        top: calc(100% - var(--slider-value));
        background: $primary;
        z-index: 5;
        transition: top ease-in-out 0.3s;
    }

    .thumb {
        position: absolute;
        background: white;
        width: 15px;
        height: 15px;
        border-radius: 8px;
        box-shadow: $shadow;
        left: 50%;
        bottom: var(--slider-value);
        transform: translateX(-50%);
        z-index: 10;
        transition: bottom ease-in-out 0.3s;
    }
}
</style>
