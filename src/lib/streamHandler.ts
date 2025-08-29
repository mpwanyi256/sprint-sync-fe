export interface StreamChunk {
  content: string;
  done: boolean;
  error?: string;
}

export interface StreamOptions {
  onChunk?: (chunk: StreamChunk) => void;
  onComplete?: (finalContent: string) => void;
  onError?: (error: Error) => void;
}

export class StreamHandler {
  private encoder = new TextEncoder();
  private decoder = new TextDecoder();
  private accumulatedContent = '';

  /**
   * Creates a streaming response from a fetch response
   */
  createStreamResponse(response: Response): Response {
    const stream = new ReadableStream({
      start: async (controller) => {
        try {
          const reader = response.body?.getReader();
          if (!reader) {
            throw new Error('No response body reader');
          }

          let buffer = '';
          let accumulatedContent = '';

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += this.decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmedLine = line.trim();
              if (trimmedLine === '' || trimmedLine === 'data: [DONE]') continue;

              if (trimmedLine.startsWith('data: ')) {
                try {
                  const jsonStr = trimmedLine.slice(6);
                  const data = JSON.parse(jsonStr);
                  const content = data.choices?.[0]?.delta?.content || '';

                  if (content) {
                    accumulatedContent += content;
                    controller.enqueue(
                      this.encoder.encode(
                        `data: ${JSON.stringify({ content: accumulatedContent, done: false })}\n\n`,
                      ),
                    );
                  }
                } catch (e) {
                  console.error('Error parsing stream response:', e);
                }
              }
            }
          }

          // Send final message with complete content
          controller.enqueue(
            this.encoder.encode(
              `data: ${JSON.stringify({ content: accumulatedContent, done: true })}\n\n`,
            ),
          );
          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  }

  /**
   * Handles client-side streaming from a fetch response
   */
  async handleClientStream(response: Response, options: StreamOptions = {}): Promise<string> {
    const { onChunk, onComplete, onError } = options;

    try {
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No response body reader');
      }

      let buffer = '';
      let accumulatedContent = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += this.decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          const trimmedLine = line.trim();
          if (trimmedLine === '' || trimmedLine === 'data: [DONE]') continue;

          if (trimmedLine.startsWith('data: ')) {
            try {
              const jsonStr = trimmedLine.slice(6);
              const data = JSON.parse(jsonStr);
              const content = data.content || '';
              const isDone = data.done || false;

              if (content) {
                this.accumulatedContent = content;
                accumulatedContent = content; // Also track locally
                onChunk?.({ content, done: isDone });
              }

              if (isDone) {
                onComplete?.(this.accumulatedContent);
                return this.accumulatedContent;
              }
            } catch (e) {
              console.error('Error parsing client stream response:', e);
            }
          } else {
            // Handle plain text responses (non-streaming format)
            if (trimmedLine) {
              this.accumulatedContent = trimmedLine;
              accumulatedContent = trimmedLine; // Also track locally
              onChunk?.({ content: trimmedLine, done: true });
              onComplete?.(trimmedLine);
              return trimmedLine;
            }
          }
        }
      }

      // If we get here, treat the entire response as content
      if (this.accumulatedContent || accumulatedContent) {
        const finalContent = this.accumulatedContent || accumulatedContent;
        onComplete?.(finalContent);
        return finalContent;
      }

      // Fallback: try to get the response as text
      const textResponse = await response.text();
      if (textResponse) {
        this.accumulatedContent = textResponse;
        onChunk?.({ content: textResponse, done: true });
        onComplete?.(textResponse);
        return textResponse;
      }

      onComplete?.('');
      return '';
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Streaming failed');
      onError?.(errorObj);
      throw errorObj;
    }
  }

  /**
   * Handles regular (non-streaming) responses
   */
  async handleRegularResponse(response: Response, options: StreamOptions = {}): Promise<string> {
    const { onChunk, onComplete, onError } = options;

    try {
      const textResponse = await response.text();
      console.log('Regular response received:', textResponse);
      
      if (textResponse) {
        this.accumulatedContent = textResponse;
        onChunk?.({ content: textResponse, done: true });
        onComplete?.(textResponse);
        return textResponse;
      }

      onComplete?.('');
      return '';
    } catch (error) {
      const errorObj = error instanceof Error ? error : new Error('Failed to read response');
      onError?.(errorObj);
      throw errorObj;
    }
  }

  /**
   * Creates a mock streaming response for when AI is not configured
   */
  createMockStreamResponse(content: string): Response {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content, done: true })}\n\n`));
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
      },
    });
  }

  /**
   * Resets the accumulated content
   */
  reset(): void {
    this.accumulatedContent = '';
  }
}

export const streamHandler = new StreamHandler();
