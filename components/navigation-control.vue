<script>
export default {
    name: "NavigationControlComponent",
    data() {
        return {
            route: undefined,
        }
    },
    methods: {
        toggleNav() {
            if(this.route) this.route = undefined;
            else this.route = "Test";
        }
    }
}
</script>

<template>
    <div class="control-main">
        <div class="nav-step">
            <direction-icon name="fork_right" size="4rem" />
        </div>
        <div class="nav-search" :class="{ active: route != undefined }">
            <div class="nav-button" @click="toggleNav"><Icon :name="route ? 'mdi:close' : 'mdi:magnify'" size="2rem" /></div>
            <input type="text" placeholder="Wo willst du hin?">
            <div class="nav-route">
                <div class="text-overflow"><span>8min</span><div class="dot"></div>2.2km</div>
                <div class="text-overflow">Ankunft um 14:41</div>
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
        height: calc(100% - 4rem - 4rem - 2rem);
        width: 100%;
        background: rgba(40, 40, 45, 0.8);
        border-radius: 10px;
    }

    .nav-search {
        height: 4rem;
        width: 100%;
        background: rgba(30, 30, 35, 0.8);
        border-radius: 10px;
        display: flex;
        overflow: hidden;

        .nav-button {
            padding: 1rem;
        }

        input {
            background: transparent;
            border: none;
            padding-right: 10px;
            font-size: 18px;
            color: white;

            flex: 1;
            max-width: 100%;
            transition: max-width 0.2s ease-in-out, padding 0.2s ease-in-out;

            &:focus {
                outline: none;
            }
        }

        .nav-route {
            display: grid;
            grid-template-rows: 50% 50%;
            padding: 0;

            flex: 1;
            max-width: 0;
            transition: max-width 0.2s ease-in-out, padding 0.2s ease-in-out;

            div {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                font-size: 20px;
                font-weight: lighter;
                color: #ccc;


                span {
                    color: $primary;
                }

                .dot {
                    width: 4px;
                    height: 4px;
                    background: #ccc;
                    border-radius: 2px;
                }
            }
        }
    }
    
    .nav-search.active {
        input {
            padding: 0;
            max-width: 0;
        }

        .nav-route {
            padding: 5px 1rem 5px 10px;
            max-width: 100%;
        }
    }
}
</style>