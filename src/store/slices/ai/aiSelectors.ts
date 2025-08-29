import { RootState } from '@/store/index'

export const selectAiState = (state: RootState) => state.ai

export const selectAiLoading = (state: RootState) => state.ai.loading

export const selectAiError = (state: RootState) => state.ai.error

export const selectGeneratingDescription = (state: RootState) => state.ai.generatingDescription

export const selectStreamingContent = (state: RootState) => state.ai.streamingContent
