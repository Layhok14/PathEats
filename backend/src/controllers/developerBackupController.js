import DeveloperBackupService from "../services/DeveloperBackupService.js";
import { catchAsync } from "../utils/catchAsync.js";

const backupService = new DeveloperBackupService();

const streamDownload = async (res, download) => {
  res.setHeader("Content-Type", download.contentType);
  res.setHeader("Content-Disposition", `attachment; filename="${download.filename}"`);
  res.setHeader("X-Backup-Format", download.format);
  const cleanup = download.cleanup || (() => {});
  res.on("finish", cleanup);
  res.on("close", cleanup);
  download.stream.on("error", async () => {
    await cleanup();
    if (!res.headersSent) res.status(500).json({ success: false, code: "BACKUP_STREAM_FAILED", message: "Could not stream backup file" });
    else res.destroy();
  });
  download.stream.pipe(res);
};

export const listProfiles = catchAsync(async (_req, res) => res.json({ success: true, data: await backupService.listProfiles() }));
export const listTables = catchAsync(async (_req, res) => res.json({ success: true, data: await backupService.listTables() }));
export const createProfile = catchAsync(async (req, res) => res.status(201).json({ success: true, data: await backupService.createProfile(req.body, req.user) }));
export const downloadProfile = catchAsync(async (req, res) => streamDownload(res, await backupService.prepareProfileDownload(req.params.id, req.user)));
export const updateProfile = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.updateProfile(req.params.id, req.body, req.user) }));
export const pauseProfile = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.setProfileEnabled(req.params.id, false, req.user) }));
export const resumeProfile = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.setProfileEnabled(req.params.id, true, req.user) }));
export const deleteProfile = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.deleteProfile(req.params.id, req.user) }));
export const listScheduled = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.listScheduled(req.query.profileId) }));
export const downloadScheduled = catchAsync(async (req, res) => streamDownload(res, await backupService.prepareScheduledDownload(req.params.id)));
export const deleteScheduled = catchAsync(async (req, res) => res.json({ success: true, data: await backupService.deleteScheduled(req.params.id, req.user) }));
export const listRecovery = catchAsync(async (_req, res) => res.json({ success: true, data: await backupService.listRecovery() }));
export const recover = catchAsync(async (req, res) => {
  const data = await backupService.recover({ ...req.body, file: req.file }, req.user);
  res.json({ success: true, data });
});
