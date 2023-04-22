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
                this.value = Math.round((100 / this.$refs.slider.clientWidth) * event.offsetX);
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
    width: 100%;
    min-height: 20px;
    position: relative;

    .track,
    .track-filled {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        height: 5px;
        transform: translateY(-50%);
        background: #ccc;
        border-radius: 2px;
        pointer-events: none;
    }

    .track-filled {
        right: calc(100% - var(--slider-value));
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
        top: 50%;
        left: var(--slider-value);
        transform: translateY(-50%);
        z-index: 10;
        transition: bottom ease-in-out 0.3s;
    }
}
</style>
