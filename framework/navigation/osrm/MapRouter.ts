import OSRM from "@project-osrm/osrm";

export default class MapRouter {
    private osrm = new OSRM("/home/pi/carmedia/framework/navigation/osrm/network/switzerland-latest");

    route(destination: LatLon, source: LatLon): Promise<OSRM.RouteResults> {
        return new Promise((resolve, reject) => {
            this.osrm.route(
                {
                    coordinates: [
                        [source.lon, source.lat],
                        [destination.lon, destination.lat],
                    ],
                    steps: true,
                    annotations: ["speed", "distance", "duration"],
                    geometries: "geojson",
                },
                (error: Error, result: OSRM.RouteResults) => {
                    if (error) return reject(error);
                    else return resolve(result);
                }
            );
        });
    }

    snapToGrid(position: LatLon): Promise<SnappedLatLon> {
        return new Promise((resolve, reject) => {
            this.osrm.nearest(
                {
                    coordinates: [[position.lon, position.lat]],
                },
                (error: Error, result: OSRM.NearestResults) => {
                    if (error) return reject(error);
                    else {
                        const waypoint = result?.waypoints[0];
                        return resolve({
                            lat: waypoint?.location[1],
                            lon: waypoint?.location[0],
                            distance: waypoint?.distance,
                        });
                    }
                }
            );
        });
    }
}

interface LatLon {
    lat: number;
    lon: number;
}

interface SnappedLatLon {
    lat: number;
    lon: number;
    distance: number;
}
