<script>
export default {
    name: "SpotifySliderComponent",
    props: {
        modelValue: { type: Number, default: 0 },
        width: { type: String, default: "5rem" },
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
    <div ref="slider" class="slider" :style="{ '--slider-value': `${value}%`, width }" @click="click">
        <div class="track"></div>
        <div class="track-filled"></div>
    </div>
</template>

<style lang="scss" scoped>
.slider {
    position: relative;
    padding: 0 0.5rem 0 0.5rem;
    height: 100%;

    .track,
    .track-filled {
        position: absolute;
        left: 0;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
        height: 5px;
        background: rgb(100, 100, 100);
        border-radius: 2px;
        pointer-events: none;
    }

    .track-filled {
        width: var(--slider-value);
        background: white;
        z-index: 5;
        transition: top ease-in-out 0.3s;
    }
}
</style>
