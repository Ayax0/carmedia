import NavigationMap from "./NavigationMap";
import RoutingApi, { convertLngLat, GeoJSONRouteResult, LatLon } from "./RoutingApi";
import { getDistance } from "geolib";

export default class NavigationRouter {
    private map: NavigationMap;
    private api: RoutingApi;

    private route: GeoJSONRouteResult;
    private route_segments;
    private route_index = 0;

    private listener: Map<string, Array<(data: any) => void>> = new Map();

    constructor(map: NavigationMap, api: RoutingApi) {
        this.map = map;
        this.api = api;

        this.map.on("move", () => {
            if (this.route && this.route_segments) {
                const center = map.getCenter();
                const distanceMap: Array<{ index: number; distance: number }> = [];
                this.route_segments.features.forEach((feature: any) => {
                    feature.geometry.coordinates.forEach((position: Array<number>) => {
                        const distance = getDistance(center, { lat: position[1], lon: position[0] });
                        distanceMap.push({ index: feature.properties.index, distance });
                    });
                });
                distanceMap.sort((a, b) => a.distance - b.distance);
                if (distanceMap[0].index != this.route_index) {
                    this.route_index = distanceMap[0].index;

                    this.route_segments.features.forEach((feature: any) => {
                        map.setFeatureState({ id: feature.id, source: "routing" }, { current_index: this.route_index });
                    });

                    this.listener.get("leg")?.forEach((cb) => cb(this.route_segments.features.find((feature) => feature.id == this.route_index)));
                }
            }
        });
    }

    navigateTo(destination: LatLon, origin?: LatLon) {
        this.api
            .route<GeoJSONRouteResult>(origin || convertLngLat(this.map.getCenter()), destination, {
                details: ["instruction_details", "route_details"],
            })
            .then((route) => {
                this.route = route;
                this.route_segments = this.parseRoute(this.route);

                if (this.map.getSource("routing")) this.map.removeSource("routing");
                this.map.addSource("routing", { type: "geojson", data: this.route_segments });

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
            })
            .catch(() => console.error("error occoured on routing"));
    }

    on(event: "leg", cb: (data: any) => void) {
        if (!this.listener.has(event)) this.listener.set(event, []);
        this.listener.get(event).push(cb);
    }

    private parseRoute(route: GeoJSONRouteResult): SegmentRouteResult {
        if (!route.features) throw new Error("invalide route");

        let id = 0;
        let segments: Array<RouteSegment> = [];
        for (let [leg_index, leg] of route.features[0].properties.legs.entries()) {
            if (route.features[0].geometry.type == "GeometryCollection") continue;
            let leg_geometry = route.features[0].geometry.coordinates[leg_index];

            for (let step of leg.steps) {
                if (step.from_index == step.to_index) continue;
                let step_geometry = leg_geometry.slice(step.from_index, step.to_index + 1);
                let step_end = step_geometry[step_geometry.length - 1];

                for (let i = 0; i < step_geometry.length - 1; i++) {
                    segments.push({
                        id: id,
                        type: "Feature",
                        geometry: { type: "LineString", coordinates: [step_geometry[i], step_geometry[i + 1]] },
                        properties: {
                            index: id,
                            ...step,
                            step_end: {
                                lat: step_end[1],
                                lon: step_end[0],
                            },
                        },
                    });
                    id++;
                }
            }
        }

        return { type: "FeatureCollection", features: segments };
    }
}

interface SegmentRouteResult {
    type: "FeatureCollection";
    features: Array<RouteSegment>;
}

interface RouteSegment {
    id: number;
    type: "Feature";
    geometry: {
        type: "LineString";
        coordinates: Array<Array<number>>;
    };
    properties: {
        index: number;
        distance: number;
        time: number;
        from_index: number;
        to_index: number;
        toll: true | null;
        ferry: true | null;
        tunnel: true | null;
        bridge: true | null;
        roundabout: true | null;
        speed: number | null;
        speed_limit: number | null;
        truck_limit: number | null;
        surface: "paved_smooth" | "paved" | "paved_rough" | "compacted" | "dirt" | "gravel" | "path" | "impassable" | null;
        lane_count: number | null;
        road_class: "motorway" | "trunk" | "primary" | "secondary" | "tertiary" | "unclassified" | "residential" | "service_other" | null;
        name: string | null;
        rightside: true | null;
        traversability: "forward" | "backward" | "both" | null;
        elevation: number | null;
        max_elevation: number | null;
        min_elevation: number | null;
        elevation_gain: number | null;
        instruction: {
            text: string;
            type:
                | "None"
                | "StartAt"
                | "StartAtRight"
                | "StartAtLeft"
                | "DestinationReached"
                | "DestinationReachedRight"
                | "DestinationReachedLeft"
                | "Straight"
                | "Straight"
                | "SlightRight"
                | "Right"
                | "SharpRight"
                | "TurnAroundRight"
                | "TurnAroundLeft"
                | "SharpLeft"
                | "Left"
                | "SlightLeft"
                | "Straight"
                | "Right"
                | "Left"
                | "ExitRight"
                | "ExitLeft"
                | "Straight"
                | "StayRight"
                | "StayLeft"
                | "Merge"
                | "Roundabout"
                | "Roundabout"
                | "FerryEnter"
                | "FerryExit"
                | "Transit"
                | "TransitTransfer"
                | "TransitRemainOn"
                | "TransitConnectionStart"
                | "TransitConnectionTransfer"
                | "TransitConnectionDestination"
                | "PostTransitConnectionDestination"
                | "MergeRight"
                | "MergeLeft"
                | null;
            transition_instruction: string | null;
            pre_transition_instruction: string | null;
            post_transition_instruction: string | null;
            streets: Array<string> | null;
            exit_number: Array<string> | null;
            exit_road_name: Array<string> | null;
            exit_towards: Array<string> | null;
            contains_next_instruction: true | null;
            roundabout_exit: number | null;
        };
        step_end: { lat: number; lon: number };
    };
}
