import compareDesc from "date-fns/compareDesc";

export default class RoutingApi {
    private api_key: string;

    constructor(api_key: string) {
        this.api_key = api_key;
    }

    route<Type = GeoJSONResult | JSONResult | XMLResult>(from: LatLon, to: LatLon, options?: RoutingOptions): Promise<Type> {
        const params = new URLSearchParams({
            apiKey: this.api_key,
            waypoints: `${from.lat},${from.lon}|${to.lat},${to.lon}`,
            mode: "drive",
            units: "metric",
            lang: "de",
        });

        if (options) {
            if (options.mode) params.set("mode", options.mode);
            if (options.units) params.set("units", options.units);
            if (options.lang) params.set("lang", options.lang);

            if (options.type) params.append("type", options.type);
            if (options.avoid && options.avoid.length > 0) {
                const avoid: Array<string> = [];
                options.avoid.forEach((rule) => {
                    if (rule.type == "location") avoid.push(`location:${rule.lat},${rule.lon}`);
                    else avoid.push(rule.importance ? `${rule.type}:${rule.importance}` : rule.type);
                });
                params.append("avoid", avoid.join("|"));
            }
            if (options.details && options.details.length > 0) params.append("details", options.details.join(","));
            if (options.traffic) params.append("traffic", options.traffic);
            if (options.format) params.append("format", options.format);
        }

        return fetch("https://api.geoapify.com/v1/routing?" + params).then((result) => result.json());
    }

    autocomplete(text: string, options?: AutocompleteOptions): Promise<Array<AutocompleteResult>> {
        const params = new URLSearchParams({
            apiKey: this.api_key,
            text: text,
            format: options?.format || "geojson",
        });

        params.append("lang", options?.lang || "de");
        if (options?.type) params.append("type", options.type);
        if (options?.filter) params.append("filter", options.filter);
        if (options?.bias) params.append("bias", options.bias);

        return fetch("https://api.geoapify.com/v1/geocode/autocomplete?" + params).then((result) => result.json());
    }
}

type RoutingMode =
    | "drive"
    | "light_truck"
    | "medium_truck"
    | "truck"
    | "heavy_truck"
    | "truck_dangerous"
    | "long_truck"
    | "bus"
    | "scooter"
    | "motocycle"
    | "bicycle"
    | "mountain_bike"
    | "road_bike"
    | "walk"
    | "hike"
    | "transit"
    | "approximated_transit";

type RoutingUnit = "metric" | "imperial";

type RoutingDetails = ["instruction_details" | "route_details" | "elevation"];

interface RoutingOptions {
    mode?: RoutingMode;
    type?: "balanced" | "short" | "less_maneuvers" | null;
    units?: RoutingUnit | null;
    lang?:
        | "bg"
        | "ca"
        | "cs"
        | "da"
        | "de"
        | "el"
        | "en-GB"
        | "en"
        | "es"
        | "et"
        | "fi"
        | "fr"
        | "hi"
        | "hu"
        | "it"
        | "ja"
        | "nb-NO"
        | "nl"
        | "pl"
        | "pt-BR"
        | "pt"
        | "ro"
        | "ru"
        | "sk"
        | "sl"
        | "sv"
        | "tr"
        | "uk"
        | null;
    avoid?: [{ type: "tolls" | "ferries" | "highways"; importance: number } | { type: "location"; lat: number; lon: number }] | null;
    details?: RoutingDetails | null;
    traffic?: "free_flow" | "approximated" | null;
    format?: "geojson" | "json" | "xml" | null;
}

interface LatLon {
    lat: number;
    lon: number;
}

export interface GeoJSONResult {
    type: "FeatureCollection";
    properties: RoutingOptions;
    features: Array<ResultFeature>;
}

export interface JSONResult {
    properties: RoutingOptions;
    features: Array<ResultFeature>;
}

export interface XMLResult {
    properties: RoutingOptions;
    features: Array<ResultFeature>;
}

type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

interface ResultFeature {
    type: "Feature";
    geometry:
        | {
              type: GeometryType;
              coordinates: Array<any>;
          }
        | {
              type: "GeometryCollection";
              geometries: [
                  {
                      type: GeometryType;
                      coordinates: Array<any>;
                  }
              ];
          };
    properties: {
        mode: RoutingMode;
        waypoints: [
            {
                location: [number, number];
                original_index: number;
            }
        ];
        units: RoutingUnit;
        details: RoutingDetails;
        distance: number;
        distance_units: string;
        time: number;
        legs: [
            {
                distance: number;
                time: number;
                steps: [
                    {
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
                        road_class:
                            | "motorway"
                            | "trunk"
                            | "primary"
                            | "secondary"
                            | "tertiary"
                            | "unclassified"
                            | "residential"
                            | "service_other"
                            | null;
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
                    }
                ];
                elevation: Array<number> | null;
                elevation_range: Array<number> | null;
                country_code: Array<string>;
            }
        ];
        toll: true | null;
        ferry: true | null;
        country_code: Array<string>;
    };
}

interface AutocompleteOptions {
    type?: "country" | "state" | "city" | "postalcode" | "street" | "amenity" | "locality";
    lang?: string;
    filter?: string;
    bias?: string;
    format?: "json" | "xml" | "geojson";
}

interface AutocompleteResult {
    name: string;
    country: string;
    country_code: string;
    state: string;
    state_code: string;
    county: string;
    county_code: string;
    postcode: string;
    city: string;
    street: string;
    housenumber: string;
    lat: number;
    lon: number;
    formatted: string;
    address_line1: string;
    address_line2: string;
    result_type: string;
    distance: number;
    rank: {
        importance: number;
        confidence: number;
        confidence_city_level: number;
        match_type: string;
    };
    datasource: string;
    category: string;
    timezone: {
        name: string;
        name_alt: string;
        offset_STD: string;
        offset_STD_seconds: number;
        offset_DST: string;
        offset_DST_seconds: number;
        abbreviation_STD: string;
        abbreviation_DST: string;
    };
}
