<script>
export default {
    name: "NavigationControlComponent",
    data() {
        return {
            route: undefined,
        };
    },
    methods: {
        toggleNav() {
            if (this.route) this.route = undefined;
            else this.route = "Test";
        },
    },
};
</script>

<template>
    <div class="control-main">
        <div class="nav-step">
            <div class="step-icon"><direction-icon name="turn_left" size="2.5rem" /></div>
            <div class="step-distance">1.2 km</div>
            <div class="step-action">
                Take the <b>E54</b>/<wbr /><b>N19</b>/<wbr /><b>S6</b> exit toward <b>Épinal</b>/<wbr /><b>Vesoul</b>/<wbr /><b>Héricourt</b>
            </div>
            <div class="step-progress">
                <div class="route-distance">57 km</div>
                <div class="route-time">31 min</div>
                <div class="route-arrive">Ankunft um <b>09:11</b></div>
            </div>
        </div>
        <div class="nav-action" :class="{ active: route != undefined }">
            <div class="nav-search">
                <div v-ripple class="nav-button" @click="toggleNav"><Icon name="mdi:magnify" size="2rem" /></div>
                <input type="text" placeholder="Wo willst du hin?" />
            </div>
            <div class="nav-route">
                <div v-ripple class="nav-button" @click="toggleNav"><Icon name="mdi:close" size="2rem" /></div>
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
        grid-template-areas:
            "icon     distance"
            "action   action"
            "progress progress";
        grid-template-columns: 2.5rem auto;
        grid-template-rows: 2.5rem auto 2.5rem;
        gap: 1rem;
        padding: 1rem;

        .step-icon {
            grid-area: icon;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .step-distance {
            grid-area: distance;
            display: flex;
            align-items: center;
            font-size: 32px;
        }

        .step-action {
            grid-area: action;
            font-weight: 100;
            font-size: 20px;
        }

        .step-progress {
            grid-area: progress;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            margin: 0 -1rem -1rem -1rem;
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
