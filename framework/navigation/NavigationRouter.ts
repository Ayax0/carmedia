import NavigationMap from "./NavigationMap";
import RoutingApi, { convertLngLat, JSONRoute, JSONRouteResult, LatLon, Step } from "./RoutingApi";
import { getDistance, getPathLength } from "geolib";

export default class NavigationRouter {
    private map: NavigationMap;
    private api: RoutingApi;

    private result: JSONRouteResult;
    private line: RouteLine;
    private instructions: RouteInstruction;

    private current_index = 0;

    private listener: Map<string, Array<(data: any) => void>> = new Map();

    constructor(map: NavigationMap, api: RoutingApi) {
        this.map = map;
        this.api = api;

        this.map.on("move", () => {
            if (this.line) {
                const center = map.getCenter();
                const distanceMap: Array<{ index: number; distance: number }> = [];
                for (let feature of this.line.features) {
                    for (let position of feature.geometry.coordinates) {
                        let distance = getDistance(center, { lat: position[1], lon: position[0] });
                        distanceMap.push({ index: feature.properties.index, distance });
                    }
                }

                distanceMap.sort((a, b) => a.distance - b.distance);
                if (distanceMap[0].index != this.current_index) {
                    this.current_index = distanceMap[0].index;

                    for (let feature of this.line.features) {
                        map.setFeatureState({ id: feature.id, source: "routing" }, { current_index: this.current_index });
                    }

                    for (let listener of this.listener.get("index_change")) listener(this.current_index);
                }
            }
        });
    }

    reset() {
        if (this.map.getLayer("routing")) this.map.removeLayer("routing");
        if (this.map.getSource("routing")) this.map.removeSource("routing");
        this.result = undefined;
        this.line = undefined;
        this.instructions = undefined;
        this.current_index = 0;

        for (let listener of this.listener.get("index_change")) listener(this.current_index);
    }

    async navigateTo(destination: LatLon, origin?: LatLon) {
        if (!origin) origin = convertLngLat(this.map.getCenter());

        this.result = await this.api.route<JSONRouteResult>(origin, destination, {
            details: ["instruction_details", "route_details"],
            traffic: "approximated",
            format: "json",
        });

        this.line = this.parseLine(this.result);
        this.instructions = this.parseInstructions(this.result);

        console.log(this.result);
        console.log(this.line);
        console.log(this.instructions);

        if (this.map.getSource("routing")) this.map.removeSource("routing");
        this.map.addSource("routing", { type: "geojson", data: this.line });

        if (this.map.getLayer("routing")) this.map.removeLayer("routing");
        this.map.addLayer(
            {
                id: "routing",
                source: "routing",
                type: "line",
                paint: {
                    "line-color": ["case", [">=", ["number", ["feature-state", "current_index"], 0], ["get", "index"]], "#505050", "#940700"],
                    "line-width": 8,
                },
                layout: {
                    "line-cap": "round",
                    "line-join": "round",
                },
            },
            "building"
        );

        this.current_index = 0;
        for (let listener of this.listener.get("index_change")) listener(this.current_index);
    }

    on(event: "index_change", cb: (data: any) => void) {
        if (!this.listener.has(event)) this.listener.set(event, []);
        this.listener.get(event).push(cb);
    }

    getInstruction(index: number): SingleInstruction {
        if (!this.instructions || !this.instructions.instructions || !this.instructions.instructions[index]) return;
        const step = this.instructions.instructions[index].step;
        return {
            distance_total: this.instructions.distance,
            time_total: this.instructions.time,
            distance: step.distance,
            instruction: step.instruction,
            maneuver: step.maneuver,
            lane_count: step.lane_count,
            speed_limit: step.speed_limit,
            geometry: step.geometry,
        };
    }

    private parseLine(data: JSONRouteResult): RouteLine {
        let route: JSONRoute = JSON.parse(JSON.stringify(data.results[0]));
        let segments: Array<RouteSegment> = [];

        let id = 0;
        for (let [leg_index, leg] of route.legs.entries()) {
            for (let step of leg.steps) {
                if (step.from_index == step.to_index) continue;

                for (let step_index = step.from_index; step_index < step.to_index; step_index++) {
                    let from = route.geometry[leg_index][step_index];
                    let to = route.geometry[leg_index][step_index + 1];
                    if (!from || !to) continue;

                    segments.push({
                        id,
                        type: "Feature",
                        geometry: {
                            type: "LineString",
                            coordinates: [
                                [from.lon, from.lat],
                                [to.lon, to.lat],
                            ],
                        },
                        properties: { index: id },
                    });

                    id++;
                }
            }
        }

        return { type: "FeatureCollection", features: segments };
    }

    private parseInstructions(data: JSONRouteResult): RouteInstruction {
        let route: JSONRoute = JSON.parse(JSON.stringify(data.results[0]));
        let instructions: Array<Instruction> = [];

        let distance_carry = 0;
        let time_carry = 0;
        let step_distance_carry = 0;
        let step_instruction_carry = null;
        let step_maneuver_carry = null;
        let step_index_carry = null;
        for (let [leg_index, leg] of route.legs.reverse().entries()) {
            for (let step of leg.steps.reverse()) {
                if (step.from_index == step.to_index) {
                    instructions.push({
                        distance: 0,
                        time: 0,
                        step: {
                            distance: 0,
                            instruction: step.instruction?.text,
                            maneuver: step.instruction?.type,
                            lane_count: 0,
                            speed_limit: 0,
                            geometry: [],
                        },
                    });
                    step_distance_carry = 0;
                    step_instruction_carry = step.instruction?.text;
                    step_maneuver_carry = step.instruction?.type;
                    step_index_carry = step.to_index;
                } else {
                    time_carry += step.time;
                    distance_carry += step.distance;
                    step_distance_carry += step.distance;

                    if (step.instruction) {
                        step_distance_carry = 0;
                        step_instruction_carry = step.instruction.text || step.instruction.transition_instruction;
                        step_maneuver_carry = step.instruction.type;
                        step_index_carry = step.to_index;
                    }

                    for (let step_index = step.to_index; step_index > step.from_index; step_index--) {
                        instructions.push({
                            distance: distance_carry,
                            time: time_carry,
                            step: {
                                distance: step_distance_carry + getPathLength(route.geometry[leg_index].slice(step_index, step.to_index)),
                                instruction: step.instruction?.transition_instruction || step_instruction_carry,
                                maneuver: step_maneuver_carry,
                                lane_count: step.lane_count,
                                speed_limit: step.speed_limit,
                                geometry: route.geometry[leg_index].slice(step_index, step_index_carry),
                            },
                        });
                    }
                }
            }
        }

        return {
            country_code: route.country_code,
            distance: route.distance,
            time: route.time,
            toll: route.toll,
            instructions: instructions.reverse(),
        };
    }
}

export interface RouteLine {
    type: "FeatureCollection";
    features: Array<RouteSegment>;
}

export interface RouteSegment {
    id: number;
    type: "Feature";
    geometry: {
        type: "LineString";
        coordinates: Array<Array<number>>;
    };
    properties: {
        index: number;
    };
}

export interface RouteInstruction {
    country_code: Array<string>;
    distance: number;
    time: number;
    toll: true | null;
    instructions: Array<Instruction>;
}

export interface Instruction {
    distance: number;
    time: number;
    step: {
        distance: number;
        instruction: string;
        maneuver: string;
        lane_count: number;
        speed_limit: number;
        geometry: Array<LatLon>;
    };
}

export interface SingleInstruction {
    distance_total: number;
    time_total: number;
    distance: number;
    instruction: string;
    maneuver: string;
    lane_count: number;
    speed_limit: number;
    geometry: Array<LatLon>;
}
