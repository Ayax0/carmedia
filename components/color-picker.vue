<script>
export default {
    name: "ColorPickerComponent",
    props: {
        modelValue: { type: String, default: "hsl(0, 100%, 50%)" },
    },
    data() {
        return {
            hue: undefined,
            saturation: undefined,
            lightness: undefined,
        };
    },
    computed: {
        hsl() {
            return `hsl(${this.hue || 0}, ${this.saturation || 100}%, ${this.lightness || 50}%)`;
        },
    },
    watch: {
        modelValue: {
            immediate: true,
            handler(value) {
                const matches = /hsl\((\d+),[ ]*(\d+)%,[ ]*(\d+)%\)/.exec(value);
                if (!matches) return;
                this.hue = matches[1];
                this.saturation = matches[2];
                this.lightness = matches[3];
            },
        },
    },
    methods: {
        clickHue(event) {
            this.hue = Math.round((360 / event.target.clientWidth) * event.offsetX);
            this.$emit("update:modelValue", this.hsl);
        },
        clickSaturation(event) {
            this.saturation = Math.round((100 / event.target.clientWidth) * event.offsetX);
            this.$emit("update:modelValue", this.hsl);
        },
        clickLightness(event) {
            this.lightness = Math.round((100 / event.target.clientWidth) * event.offsetX);
            this.$emit("update:modelValue", this.hsl);
        },
    },
};
</script>

<template>
    <div
        class="color-picker"
        :style="{ '--hue': hue, '--hue-offset': hue / 3.6 + '%', '--saturation': saturation + '%', '--lightness': lightness + '%' }"
    >
        <div class="select hue" @click="clickHue"><div class="thumb"></div></div>
        <div class="select saturation" @click="clickSaturation"><div class="thumb"></div></div>
        <div class="select lightness" @click="clickLightness"><div class="thumb"></div></div>
    </div>
</template>

<style lang="scss" scoped>
.color-picker {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .select {
        width: 100%;
        height: 0.5rem;
        border-radius: 0.25rem;
        box-shadow: $shadow;

        .thumb {
            width: 1rem;
            height: 1rem;
            border-radius: 0.5rem;
            margin-top: -0.25rem;
            transform: translateX(-50%);
            box-shadow: $shadow;
        }
    }
    .hue {
        background: linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%);

        .thumb {
            background: hsl(var(--hue), 100%, 50%);
            margin-left: var(--hue-offset);
        }
    }

    .saturation {
        background: linear-gradient(to right, hsl(var(--hue), 0%, var(--lightness)), hsl(var(--hue), 100%, var(--lightness)));

        .thumb {
            background: hsl(var(--hue), var(--saturation), var(--lightness));
            margin-left: var(--saturation);
        }
    }

    .lightness {
        background: linear-gradient(
            to right,
            hsl(var(--hue), var(--saturation), 0%),
            hsl(var(--hue), var(--saturation), 50%),
            hsl(var(--hue), var(--saturation), 100%)
        );

        .thumb {
            background: hsl(var(--hue), var(--saturation), var(--lightness));
            margin-left: var(--lightness);
        }
    }
}
</style>
