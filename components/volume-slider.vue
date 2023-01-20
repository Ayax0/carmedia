<script>
export default {
    name: "VolumeSliderComponent",
    props: {
        modelValue: { type: Boolean, default: false },
        volume: { type: Number, default: 0 },
    },
    data() {
        return {
            colapse: false,
            timeout: undefined,
            localVolume: 0,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.colapse = value;
            },
        },
        volume: {
            immediate: true,
            handler(value) {
                this.localVolume = value;
            },
        },
        localVolume(value, previous) {
            if (value != previous) {
                this.$emit("update:volume", value);
                if (this.timeout) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => (this.colapse = false), 10000);
                }
            }
        },
        colapse(value, previous) {
            if (value != previous) {
                this.$emit("update:modelValue", value);
                if (this.timeout) clearTimeout(this.timeout);
            }
            if (previous == false && value == true) this.timeout = setTimeout(() => (this.colapse = false), 10000);
        },
    },
};
</script>

<template>
    <div class="volume" :class="{ colapse }">
        <span><Icon v-ripple name="mdi:volume-high" @click="colapse = !colapse" /></span>
        <vertical-slider v-model="localVolume" />
    </div>
</template>

<style lang="scss" scoped>
.volume {
    position: absolute;
    bottom: 1rem;
    left: 1rem;
    width: 4rem;
    height: calc(100% - 3rem);
    max-height: 4rem;
    border-radius: 2rem;
    border: 1px solid rgba(20, 20, 20, 0.6);
    background: rgba(20, 20, 20, 0.5);
    display: flex;
    flex-direction: column-reverse;
    overflow: hidden;
    transition: max-height ease-in-out 0.2s;
    z-index: 1;

    span {
        width: 4rem;
        height: 4rem;
        min-height: 4rem;
        min-width: 4rem;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 2rem;
    }
}

.volume.colapse {
    max-height: 100%;
}
</style>
