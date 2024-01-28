<script lang="ts" setup>
import store from "store-js";
import { getDistance } from "geolib";
import { awaitElement } from "@/framework/utils";
import NavigationMap from "@/framework/navigation/NavigationMap";
import NavigationCar from "@/framework/navigation/NavigationCar";

import models from "@/framework/models";
import NavigationRouter, { SingleInstruction } from "~~/framework/navigation/NavigationRouter";
import RoutingApi, { JSONGeocodeResult, Geocode } from "~~/framework/navigation/RoutingApi";

const { $socket } = useNuxtApp();

const api = new RoutingApi(store.get("navigation.api_key"));

var map: NavigationMap;
var car: NavigationCar;
var router: NavigationRouter;

const target = ref<string>();
const destination_result = ref<JSONGeocodeResult>();

const instruction = ref<SingleInstruction>();

const model = models.find((model) => model.name == (store.get("navigation.model") || models[0].name));
model.color.primary = store.get("navigation.model.primary") || model.color.primary;

async function search() {
    destination_result.value = await api.geocode(target.value, {
        bias: {
            type: "location",
            lat: map.getCenter().lat,
            lon: map.getCenter().lng,
        },
        lang: "de",
        limit: 3,
        format: "json",
    });
}

function clearSearch() {
    target.value = null;
    destination_result.value = null;
}

function getCurrentDistance(target: { lat: number; lon: number }) {
    return getDistance(map.getCenter(), target);
}

function formatDistance(distance: number) {
    if (distance > 500) return `${Math.ceil(distance / 1000)} km`;
    if (distance > 250) return "500 m";
    if (distance > 100) return "250 m";
    if (distance > 50) return "100 m";
    if (distance > 10) return "50 m";
    return `${Math.round(distance)} m`;
}

function route(target: Geocode) {
    router.navigateTo({ lat: target.lat, lon: target.lon });
}

function clearRoute() {
    router.reset();
}

onMounted(async () => {
    const mapElement = await awaitElement("map");
    map = new NavigationMap(mapElement);

    const carElement = await awaitElement("car");
    car = new NavigationCar(carElement);

    router = new NavigationRouter(map, api);
    router.on("index_change", (index) => (instruction.value = router.getInstruction(index)));

    await car.setModel(model);
    car.setPosition(0, 0, 2000);
    car.setRotation(30, 180, 0);

    map.on("zoom", () => car.setPosition(0, 0, -1000 * map.getZoom() + 20000));
    map.on("pitch", () => car.setRotation(90 - map.getPitch(), 180, 0));

    $socket.on("gps", (packet) => map.triggerGps(packet));

    // setTimeout(() => router.navigateTo({ lat: 47.06664003633498, lon: 8.291588776578921 }), 2000);
});
</script>

<template>
    <div class="map-wrapper">
        <div id="map" class="map">
            <div class="map-slot">
                <div id="car"></div>
                <div class="control-main">
                    <div class="nav-step" :class="{ active: instruction }">
                        <div class="step-maneuver">
                            <direction-icon name="off_ramp_right" size="2.5rem" />
                            <div>{{ formatDistance(instruction?.distance) }}</div>
                        </div>
                        <div class="step-action">{{ instruction?.instruction }}</div>
                        <div class="step-progress">
                            <div class="route-distance">{{ formatDistance(instruction?.distance_total) }}</div>
                            <div class="route-time">17 min</div>
                            <div class="route-arrive">Ankunft um <b>17:35</b></div>
                        </div>
                    </div>
                    <div class="nav-action" :class="{ active: instruction }">
                        <div class="nav-search">
                            <div v-ripple class="nav-button" @click="clearSearch">
                                <Icon :name="target?.length > 0 ? 'mdi:close' : 'mdi:magnify'" size="2rem" />
                            </div>
                            <input v-model="target" type="text" placeholder="Wo willst du hin?" @keypress.enter="search" />
                        </div>
                        <div class="nav-route">
                            <div v-ripple class="nav-button" @click="clearRoute"><Icon name="mdi:close" size="2rem" /></div>
                            <div v-ripple class="nav-button"><Icon name="mdi:map-marker-distance" size="2rem" /></div>
                            <div v-ripple class="nav-button"><Icon name="mdi:gas-station" size="2rem" /></div>
                            <div v-ripple class="nav-button"><Icon name="mdi:volume-high" size="2rem" /></div>
                        </div>
                    </div>
                    <div class="nav-results" :class="{ active: destination_result != undefined && !instruction }">
                        <template v-if="destination_result">
                            <div v-ripple v-for="result in destination_result.results" class="nav-result" @click="route(result)">
                                <div class="title text-overflow">{{ result.address_line1 }}</div>
                                <div class="subtitle text-overflow">{{ result.address_line2 }}</div>
                                <div class="distance">{{ formatDistance(getCurrentDistance({ lat: result.lat, lon: result.lon })) }}</div>
                            </div>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.map-wrapper {
    width: 100%;
    height: 100%;
    overflow: hidden;
    position: relative;

    .map {
        width: 140%;
        height: calc(100% + 15px);
        position: absolute;
        right: 0;
        top: 0;

        .map-slot {
            position: absolute;
            top: 0;
            bottom: 15px;
            right: 0;
            left: calc(calc(100% / 140) * 40);

            #car {
                position: absolute;
                top: 0;
                left: 0;
                width: 60%;
                height: 100%;
            }

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
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.2s ease-in-out;

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

                .nav-step.active {
                    max-height: 100%;
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

                .nav-results {
                    display: flex;
                    flex-direction: column;
                    border-radius: 10px;
                    background: rgba(50, 50, 55, 0.9);
                    border: none;
                    max-height: 0;
                    transition: max-height 0.2s ease-in-out;
                    overflow: hidden;
                    .nav-result {
                        padding: 1rem;
                        border-bottom: 1px solid rgba(20, 20, 20, 0.6);
                        display: grid;
                        grid-template-areas:
                            "title    distance"
                            "subtitle distance";
                        grid-template-columns: auto 5rem;
                        grid-template-rows: 1fr 1fr;

                        .title {
                            grid-area: title;
                            font-size: 20px;
                        }

                        .subtitle {
                            grid-area: subtitle;
                            font-size: 14px;
                            font-weight: 100;
                        }

                        .distance {
                            grid-area: distance;
                            display: flex;
                            justify-content: flex-end;
                            align-items: center;
                            font-weight: 100;
                        }
                    }

                    :last-child {
                        border: none;
                    }
                }

                .nav-results.active {
                    max-height: 100%;
                    border: 1px solid rgba(30, 30, 35, 0.9);
                }
            }
        }
    }
}
</style>
