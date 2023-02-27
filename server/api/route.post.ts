import MapRouter from "@/framework/navigation/osrm/MapRouter";

const router = new MapRouter();

export default defineEventHandler(async (event) => {
    const body = await useBody(event);
    const origin = body.origin;
    const destination = body.destination;
    if (!origin || !destination || !origin.lat || !origin.lon || !destination.lat || !destination.lon)
        throw createError({ statusCode: 400, statusMessage: "invalide body" });

    return await router.route(destination, origin);
});
