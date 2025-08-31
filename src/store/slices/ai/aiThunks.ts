import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/services/api';
import { streamHandler } from '@/lib/streamHandler';

interface AiSuggestionRequest {
  title: string;
}

interface AiSuggestionResponse {
  description: string;
}

export const generateTaskDescription = createAsyncThunk<
  AiSuggestionResponse,
  AiSuggestionRequest,
  {
    rejectValue: string;
    dispatch: any;
  }
>(
  'ai/generateTaskDescription',
  async ({ title }, { rejectWithValue, dispatch }) => {
    try {
      console.log('Starting AI suggestion for title:', title);

      // Use fetch for streaming support since axios doesn't support streaming
      const apiUrl = `${api.defaults.baseURL}/ai/suggest/`;

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': api.defaults.headers['x-api-key'] as string,
          Authorization: api.defaults.headers['Authorization'] as string,
        },
        body: JSON.stringify({ title }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Check if response is actually streaming
      const contentType = response.headers.get('content-type') || '';
      const isStreaming =
        contentType.includes('text/event-stream') ||
        contentType.includes('application/stream+json') ||
        contentType.includes('chunked');

      console.log('Is streaming response:', isStreaming);

      let finalContent = '';

      if (isStreaming) {
        // Handle streaming response
        finalContent = await streamHandler.handleClientStream(response, {
          onChunk: chunk => {
            // Dispatch real-time updates to the store
            dispatch({
              type: 'ai/updateStreamingContent',
              payload: chunk.content,
            });
          },
          onComplete: completedContent => {
            // Ensure final content is dispatched
            dispatch({
              type: 'ai/updateStreamingContent',
              payload: completedContent,
            });
          },
          onError: error => {
            console.error('Streaming error:', error);
          },
        });
      } else {
        // Handle regular response
        finalContent = await streamHandler.handleRegularResponse(response, {
          onChunk: chunk => {
            dispatch({
              type: 'ai/updateStreamingContent',
              payload: chunk.content,
            });
          },
          onComplete: completedContent => {
            dispatch({
              type: 'ai/updateStreamingContent',
              payload: completedContent,
            });
          },
          onError: error => {
            console.error('Regular response error:', error);
          },
        });
      }

      // Fallback: if we didn't get content, try to read response directly
      if (!finalContent || finalContent.trim() === '') {
        try {
          const directContent = await response.text();
          if (directContent && directContent.trim() !== '') {
            finalContent = directContent;
            dispatch({
              type: 'ai/updateStreamingContent',
              payload: directContent,
            });
          }
        } catch (directError) {
          console.error('Error reading direct response:', directError);
        }
      }

      return { description: finalContent };
    } catch (error: any) {
      console.error('Error in generateTaskDescription:', error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Failed to generate task description';
      return rejectWithValue(errorMessage);
    }
  }
);
