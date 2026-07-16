import PlaceService from "../services/PlaceService.js";
import * as adminService from "../services/AdminService.js";
import { catchAsync } from "../utils/catchAsync.js";

const placeService = new PlaceService();

export const getAll = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await placeService.getAll() });
});

export const search = catchAsync(async (req, res) => {
  const { routePoints, range, cuisine, maxPrice, openNow, search: searchQuery, limit, offset } = req.body;
  const result = await placeService.search({
    routePoints,
    range,
    cuisine,
    maxPrice,
    openNow,
    search: searchQuery,
    limit,
    offset,
  });
  res.json({ success: true, data: result });
});

export const getScore = catchAsync(async (req, res) => {
  res.json({ success: true, data: placeService.calculateScore(req.body) });
});

export const getRoute = catchAsync(async (req, res) => {
  res.json({ success: true, data: await placeService.getRoute(req.body) });
});

export const getCount = catchAsync(async (_req, res) => {
  res.json({ success: true, data: { total: await placeService.getCount() } });
});

export const getCategories = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await adminService.getConsumerCategories() });
});

export const getAllReviews = catchAsync(async (_req, res) => {
  res.json({ success: true, data: await placeService.getAllReviews() });
});

export const getById = catchAsync(async (req, res) => {
  res.json({ success: true, data: await placeService.getById(req.params.id) });
});

export const getReviews = catchAsync(async (req, res) => {
  res.json({ success: true, data: await placeService.getReviews(req.params.id) });
});

export const createReview = catchAsync(async (req, res) => {
  const review = await placeService.createReview(req.params.id, req.user.sub, req.body);
  res.status(201).json({ success: true, data: review });
});

export const updateReview = catchAsync(async (req, res) => {
  const review = await placeService.updateReview(req.params.reviewId, req.user.sub, req.body);
  res.json({ success: true, data: review });
});

export const deleteReview = catchAsync(async (req, res) => {
  await placeService.deleteReview(req.params.reviewId, req.user.sub);
  res.json({ success: true, data: { message: "Review deleted" } });
});
