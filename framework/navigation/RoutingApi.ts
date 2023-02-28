import { LngLat } from "maplibre-gl";

export default class RoutingApi {
    private api_key: string;

    constructor(api_key: string) {
        this.api_key = api_key;
    }

    route<Type = GeoJSONRouteResult | JSONRouteResult | XMLRouteResult>(from: LatLon, to: LatLon, options?: RoutingOptions): Promise<Type> {
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

    geocode<Type = GeoJSONGeocodeResult | JSONGeocodeResult | XMLGeocodeResult>(text: string, options?: GeocodeOptions): Promise<Type> {
        const params = new URLSearchParams({
            apiKey: this.api_key,
            text: text,
            format: options?.format || "geojson",
        });

        params.append("lang", options?.lang || "de");
        params.append("limit", options?.limit?.toString() || "3");
        if (options?.name) params.append("name", options.name);
        if (options?.housenumber) params.append("housenumber", options.housenumber);
        if (options?.street) params.append("street", options.street);
        if (options?.postcode) params.append("postcode", options.postcode.toString());
        if (options?.city) params.append("city", options.city);
        if (options?.state) params.append("state", options.state);
        if (options?.country) params.append("country", options.country);
        if (options?.filter) {
            if (options.filter.type == "circle")
                params.append("filter", `circle:${options.filter.lon},${options.filter.lat},${options.filter.radiusMeters}`);
            if (options.filter.type == "rect")
                params.append("filter", `rect:${options.filter.lon1},${options.filter.lat1},${options.filter.lon2},${options.filter.lat2}`);
            if (options.filter.type == "country") params.append("filter", `countrycode:${options.filter.countries.join(",")}`);
            if (options.filter.type == "place") params.append("filter", `place:${options.filter.placeId}`);
        }
        if (options?.bias) {
            if (options.bias.type == "circle") params.append("bias", `circle:${options.bias.lon},${options.bias.lat},${options.bias.radiusMeters}`);
            if (options.bias.type == "rect")
                params.append("bias", `rect:${options.bias.lon1},${options.bias.lat1},${options.bias.lon2},${options.bias.lat2}`);
            if (options.bias.type == "country") params.append("bias", `countrycode:${options.bias.countries.join(",")}`);
            if (options.bias.type == "location") params.append("bias", `proximity:${options.bias.lon},${options.bias.lat}`);
        }

        return fetch("https://api.geoapify.com/v1/geocode/search?" + params).then((result) => result.json());
    }
}

export function convertLngLat(pos: LngLat): LatLon {
    return { lat: pos.lat, lon: pos.lng };
}

export type RoutingMode =
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

export type RoutingUnit = "metric" | "imperial";

export type RoutingDetails = "instruction_details" | "route_details" | "elevation";

export interface RoutingOptions {
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
    details?: Array<RoutingDetails> | null;
    traffic?: "free_flow" | "approximated" | null;
    format?: "geojson" | "json" | "xml" | null;
}

export interface LatLon {
    lat: number;
    lon: number;
}

export interface GeoJSONRouteResult {
    type: "FeatureCollection";
    properties: RoutingOptions;
    features: Array<RouteFeature>;
}

export interface JSONRouteResult {
    properties: RoutingOptions;
    results: Array<JSONRoute>;
}

export interface XMLRouteResult {
    properties: RoutingOptions;
    results: Array<XMLRoute>;
}

export type GeometryType = "Point" | "LineString" | "Polygon" | "MultiPoint" | "MultiLineString" | "MultiPolygon";

export interface RouteFeature {
    type: "Feature";
    geometry:
        | {
              type: GeometryType;
              coordinates: Array<Array<Array<number>>>;
          }
        | {
              type: "GeometryCollection";
              geometries: [
                  {
                      type: GeometryType;
                      coordinates: Array<Array<Array<number>>>;
                  }
              ];
          };
    properties: GeoJSONRoute;
}

export interface Route {
    mode: RoutingMode;
    units: RoutingUnit;
    details: Array<RoutingDetails>;
    distance: number;
    distance_units: string;
    time: number;
    legs: [
        {
            distance: number;
            time: number;
            steps: Array<Step>;
            elevation: Array<number> | null;
            elevation_range: Array<number> | null;
            country_code: Array<string>;
        }
    ];
    toll: true | null;
    ferry: true | null;
    country_code: Array<string>;
}

export interface Step {
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
}

export interface GeoJSONRoute extends Route {
    waypoints: [
        {
            location: [number, number];
            original_index: number;
        }
    ];
}

export interface JSONRoute extends Route {
    geometry: Array<Array<LatLon>>;
}

export interface XMLRoute extends Route {
    geometry: Array<Array<LatLon>>;
}

export interface GeocodeOptions {
    name?: string;
    housenumber?: string;
    street?: string;
    postcode?: number;
    city?: string;
    state?: string;
    country?: string;
    type?: "country" | "state" | "city" | "postcode" | "street" | "amenity" | "locality";
    lang?: string;
    limit?: number;
    filter?:
        | {
              type: "circle";
              lat: number;
              lon: number;
              radiusMeters: number;
          }
        | {
              type: "rect";
              lat1: number;
              lon1: number;
              lat2: number;
              lon2: number;
          }
        | {
              type: "country";
              countries: Array<string>;
          }
        | {
              type: "place";
              placeId: string;
          };
    bias?:
        | {
              type: "circle";
              lat: number;
              lon: number;
              radiusMeters: number;
          }
        | {
              type: "rect";
              lat1: number;
              lon1: number;
              lat2: number;
              lon2: number;
          }
        | {
              type: "country";
              countries: Array<string>;
          }
        | {
              type: "location";
              lat: number;
              lon: number;
          };
    format?: "json" | "xml" | "geojson";
}

export interface GeoJSONGeocodeResult {
    features: Array<GeocodeFeature>;
    query: any;
    type: "FeatureCollection";
}

export interface JSONGeocodeResult {
    results: Array<Geocode>;
    query: any;
}

export interface XMLGeocodeResult {
    results: Array<Geocode>;
    query: any;
}

export interface GeocodeFeature {
    bbox: Array<number>;
    geometry: {
        type: GeometryType;
        coordinates: Array<number>;
    };
    properties: Geocode;
    type: "Feature";
}

export interface Geocode {
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
