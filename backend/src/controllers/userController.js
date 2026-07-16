import UserService from "../services/UserService.js";
import AppError from "../utils/AppError.js";
import { catchAsync } from "../utils/catchAsync.js";
import { attachProfileImageUrl, saveProfileImage } from "../services/profileImageService.js";

const userService = new UserService();

export const getProfile = catchAsync(async (req, res) => {
  const user = await userService.getProfile(req.user.sub);
  res.json({ success: true, data: attachProfileImageUrl(user) });
});

export const updateProfile = catchAsync(async (req, res) => {
  const user = await userService.updateProfile(req.user.sub, req.body);
  res.json({ success: true, data: user });
});

export const uploadProfileImage = catchAsync(async (req, res) => {
  if (!req.file) throw new AppError("Profile image file is required", 400);
  const profileImage = await saveProfileImage({
    userId: req.user.sub,
    file: req.file,
    altText: req.body.altText,
    baseUrl: `${req.protocol}://${req.get("host")}`,
  });
  res.status(201).json({ success: true, data: profileImage });
});

export const getPreferences = catchAsync(async (req, res) => {
  res.json({ success: true, data: await userService.getPreferences(req.user.sub) });
});

export const updatePreferences = catchAsync(async (req, res) => {
  const preferences = await userService.updatePreferences(req.user.sub, req.body);
  res.json({ success: true, data: preferences });
});

export const getBookmarks = catchAsync(async (req, res) => {
  res.json({ success: true, data: await userService.getBookmarks(req.user.sub) });
});

export const addBookmark = catchAsync(async (req, res) => {
  const bookmark = await userService.addBookmark(req.user.sub, req.body.placeId);
  res.status(201).json({ success: true, data: bookmark });
});

export const removeBookmark = catchAsync(async (req, res) => {
  const deleted = await userService.removeBookmark(req.user.sub, req.params.placeId);
  res.json({ success: true, data: { deleted } });
});

export const getRoutes = catchAsync(async (req, res) => {
  res.json({ success: true, data: await userService.getRoutes(req.user.sub) });
});

export const addRoute = catchAsync(async (req, res) => {
  const route = await userService.addRoute(req.user.sub, req.body);
  res.status(201).json({ success: true, data: route });
});

export const deleteAllRoutes = catchAsync(async (req, res) => {
  const deleted = await userService.deleteAllRoutes(req.user.sub);
  res.json({ success: true, data: { deleted } });
});

export const deleteRoute = catchAsync(async (req, res) => {
  await userService.deleteRoute(req.user.sub, req.params.id);
  res.json({ success: true, data: { deleted: true } });
});

export const updateRoute = catchAsync(async (req, res) => {
  const route = await userService.updateRoute(req.user.sub, req.params.id, req.body.label);
  res.json({ success: true, data: route });
});

export const getHistory = catchAsync(async (req, res) => {
  res.json({ success: true, data: await userService.getHistory(req.user.sub) });
});

export const addHistory = catchAsync(async (req, res) => {
  const history = await userService.addHistory(req.user.sub, req.body);
  res.status(201).json({ success: true, data: history });
});

export const deleteAllHistory = catchAsync(async (req, res) => {
  const deleted = await userService.deleteAllHistory(req.user.sub);
  res.json({ success: true, data: { deleted } });
});

export const deleteHistory = catchAsync(async (req, res) => {
  const deleted = await userService.deleteHistory(req.user.sub, req.params.id);
  res.json({ success: true, data: { deleted } });
});
