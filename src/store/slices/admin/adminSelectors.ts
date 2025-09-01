import { RootState } from '@/store';

export const selectRoleToggleLoading = (state: RootState) =>
  state.admin.roleToggleLoading;

export const selectBulkUserLoading = (state: RootState) =>
  state.admin.bulkUserLoading;

export const selectAdminError = (state: RootState) => state.admin.error;

export const selectLastRoleToggle = (state: RootState) =>
  state.admin.lastRoleToggle;

export const selectLastBulkUserResult = (state: RootState) =>
  state.admin.lastBulkUserResult;
