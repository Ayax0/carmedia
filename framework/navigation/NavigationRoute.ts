import { GeoJSONRouteResult } from "./RoutingApi";

export default class NavigationRoute {
    private route: GeoJSONRouteResult;
    private route_segments;
    private route_index = 0;

    constructor(route: GeoJSONRouteResult) {
        this.route = route;
        this.route_segments = this.parseRoute(route);
    }

    private parseRoute(route: GeoJSONRouteResult): SegmentRouteResult {
        let id = 0;
        let segments: Array<RouteSegment> = [];
        for (let [index, leg] of route.features[0].properties.legs.entries()) {
            if (route.features[0].geometry.type == "GeometryCollection") return;
            let leg_geometry = route.features[0].geometry.coordinates[index];

            for (let step of leg.steps) {
                if (step.from_index == step.to_index) return;
                let step_geometry = leg_geometry.slice(step.from_index, step.to_index + 1);

                for (let i = 0; i < step_geometry.length - 1; i++) {
                    segments.push({
                        id: id,
                        type: "Feature",
                        geometry: { type: "LineString", coordinates: [step_geometry[i], step_geometry[i + 1]] },
                        properties: {
                            index: id,
                            ...step,
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
    };
}
