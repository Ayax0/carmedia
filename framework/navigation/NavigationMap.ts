import { Map } from "maplibre-gl";
import { UBX_NAV_PVT_DATA } from "@nextlvlup/ubx-parser";
import { GeoJSONRouteResult } from "./RoutingApi";

export default class NavigationMap extends Map {
    private route: GeoJSONRouteResult;
    private;

    constructor(container?: string | HTMLElement) {
        super({
            container: container || document.createElement("div"),
            style: window.location.origin + "/api/map",
            interactive: false,
            zoom: 18,
            pitch: 60,
        });
    }

    setUnderground(state: boolean, easeDuration = 1000) {
        this.setPaintProperty("building", "fill-opacity-transition", { easeDuration });
        this.setPaintProperty("building_3d", "fill-extrusion-opacity-transition", { easeDuration });
        this.setPaintProperty("road_name", "text-opacity-transition", { easeDuration });
        this.setPaintProperty("road_service", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_major", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_minor", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_service_outline", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_private", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_major_outline", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_minor_outline", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("road_oneway", "icon-opacity-transition", { easeDuration });
        this.setPaintProperty("railway_hatching", "line-opacity-transition", { easeDuration });
        this.setPaintProperty("railway", "line-opacity-transition", { easeDuration });

        this.setPaintProperty("building", "fill-opacity", state ? 0 : 1);
        this.setPaintProperty("building_3d", "fill-extrusion-opacity", state ? 0 : 0.9);
        this.setPaintProperty("road_name", "text-opacity", state ? 0 : 1);
        this.setPaintProperty("road_service", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_major", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_minor", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_service_outline", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_private", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_major_outline", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_minor_outline", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("road_oneway", "icon-opacity", state ? 0 : 1);
        this.setPaintProperty("railway_hatching", "line-opacity", state ? 0 : 1);
        this.setPaintProperty("railway", "line-opacity", state ? 0 : 1);
        this.setLayoutProperty("poi", "visibility", state ? "none" : "visible");
    }

    triggerGps(data: any) {
        setTimeout(() => {
            if (!data) return;
            if (data.packet_class == 0x01 && data.packet_id == 0x07) {
                const packet = data as UBX_NAV_PVT_DATA;

                this.easeTo({
                    center: { lat: packet.lat, lng: packet.lon },
                    bearing: packet.headVeh,
                    zoom: packet.gSpeed * 0.0036 > 65 ? 16 : 18,
                    duration: 100,
                    easing: (num) => num,
                });
            }
        }, 1);
    }
}
