import { getRoute } from "../services/osrmService.js";

export async function getRouteHandler(req, res) {
  try {
    const { origin, destination } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ success: false, message: "origin and destination query params required (lng,lat)" });
    }

    const [oLng, oLat] = origin.split(",").map(Number);
    const [dLng, dLat] = destination.split(",").map(Number);

    if (isNaN(oLat) || isNaN(oLng) || isNaN(dLat) || isNaN(dLng)) {
      return res.status(400).json({ success: false, message: "Invalid coordinates. Use format: lng,lat" });
    }

    const route = await getRoute(oLat, oLng, dLat, dLng);
    res.json({ success: true, data: route });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}
