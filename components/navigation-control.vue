<script>
export default {
    props: {
        api: { type: Object, required: true },
        step: { type: Object, default: undefined },
        target: { type: String, default: null },
    },
    data() {
        return {
            _target: null,
        };
    },
    watch: {
        target: {
            immediate: true,
            handler(value) {
                this._target = value;
            },
        },
        _target(value) {
            this.$emit("update:target", value);
        },
    },
};
</script>

<template>
    <div class="control-main">
        <div v-if="step" class="nav-step">
            <div class="step-maneuver">
                <direction-icon :name="step?.step_maneuver" size="2.5rem" />
                <div>{{ step?.step_distance }}</div>
            </div>
            <div class="step-action" v-html="step?.action"></div>
            <div class="step-progress">
                <div class="route-distance">{{ step?.distance }}</div>
                <div class="route-time">{{ step?.time }}</div>
                <div class="route-arrive">
                    Ankunft um <b>{{ step?.arrival }}</b>
                </div>
            </div>
        </div>
        <div class="nav-action" :class="{ active: step != undefined }">
            <div class="nav-search">
                <div v-ripple class="nav-button" @click="$emit('submit', _target)"><Icon name="mdi:magnify" size="2rem" /></div>
                <input v-model="_target" type="text" placeholder="Wo willst du hin?" @keypress.enter="$emit('submit', _target)" />
            </div>
            <div class="nav-route">
                <div v-ripple class="nav-button" @click="resetRoute"><Icon name="mdi:close" size="2rem" /></div>
                <div v-ripple class="nav-button"><Icon name="mdi:map-marker-distance" size="2rem" /></div>
                <div v-ripple class="nav-button"><Icon name="mdi:gas-station" size="2rem" /></div>
                <div v-ripple class="nav-button"><Icon name="mdi:volume-high" size="2rem" /></div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.control-main {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    width: 40%;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    z-index: 10;

    .nav-step {
        height: calc(100% - 4rem - 2rem);
        background: rgba(40, 40, 45, 0.8);
        border-radius: 10px;
        display: grid;
        grid-template-columns: auto;
        grid-template-rows: 4rem calc(100% - 4rem - 3rem - 0.8rem - 0.8rem) 3rem;
        gap: 0.8rem;

        .step-maneuver {
            display: flex;
            align-items: center;
            font-size: 32px;
            gap: 1rem;
            padding: 1rem;
            background: rgba(0, 0, 0, 0.2);
            // border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 10px 10px 0 0;
        }

        .step-action {
            font-weight: 100;
            font-size: 20px;
            padding: 0 1rem;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .step-progress {
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 0 1rem;

            .route-distance {
                position: relative;

                &::after {
                    content: "";
                    position: absolute;
                    left: calc(100% + 0.5rem);
                    top: 50%;
                    transform: translate3d(-50%, -50%, 0);
                    background: white;
                    height: 5px;
                    width: 5px;
                    border-radius: 2.5px;
                }
            }

            .route-time {
                color: rgb(41, 148, 235);
                flex: 1;
            }

            .route-arrive {
                font-weight: 100;
            }
        }
    }

    .nav-action {
        display: flex;
        height: 4rem;
        width: 100%;
        max-width: 100%;
        background: rgba(30, 30, 35, 0.8);
        border: 1px solid rgba(30, 30, 35, 0.9);
        border-radius: 10px;
        overflow: hidden;

        .nav-button {
            width: 4rem;
            height: 4rem;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .nav-search {
            display: flex;
            align-items: center;
            min-width: 100%;
            max-width: 100%;
            margin-left: 0;
            transition: margin-left 0.2s ease-in-out;

            input {
                height: 100%;
                flex: 1;
                padding-right: 1rem;
                text-overflow: ellipsis;
                background: transparent;
                color: white;
                border: none;
                font-size: 18px;

                &:focus {
                    outline: none;
                }
            }
        }

        .nav-route {
            display: flex;
            align-items: center;
            min-width: 100%;
            max-width: 100%;

            .nav-button {
                flex: 1;
            }
        }
    }

    .nav-action.active {
        .nav-search {
            margin-left: -100%;
        }
    }
}
</style>
