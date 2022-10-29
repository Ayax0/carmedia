<script>
export default {
    name: "VolumeSliderComponent",
    props: {
        modelValue: { type: Boolean, default: false },
    },
    data() {
        return {
            colapse: false,
            timeout: undefined,
            volume: 0,
        };
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                this.colapse = value;
            },
        },
        colapse(value, previous) {
            if (value != previous) {
                this.$emit("update:modelValue", value);
                if(this.timeout) clearTimeout(this.timeout);
            }
            if (previous == false && value == true)
                this.timeout = setTimeout(() => this.colapse = false, 10000);
        },
        async volume(value, previous) {
            if(value != previous) await $fetch("/api/volume", { method: "post", body: { volume: this.volume } });
        }
    },
    async mounted() {
        this.volume = (await $fetch("/api/volume")).volume;
    }
};
</script>

<template>
    <div class="volume" :class="{ colapse }">
        <span v-ripple class="mdi mdi-volume-high" @click="colapse = !colapse"></span>
        <vertical-slider v-model="volume" />
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
    border: 3px solid rgb(10, 10, 10);
    background: rgba(20, 20, 20, 0.5);
    display: flex;
    flex-direction: column-reverse;
    overflow: hidden;
    transition: max-height ease-in-out 0.2s;

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
