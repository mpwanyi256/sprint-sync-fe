export interface AISuggestion {
  type: 'task_description' | 'daily_plan'
  content: string
  metadata?: Record<string, any>
}

export interface AISuggestionRequest {
  mode: 'task_description' | 'daily_plan'
  title?: string
  userId: string
}

export interface AISuggestionResponse {
  success: boolean
  data: AISuggestion
  error?: string
}

export interface AutoAssignRequest {
  taskId: string
}

export interface AutoAssignResponse {
  success: boolean
  data: {
    taskId: string
    assignedUserId: string
    matchScore: number
  }
  error?: string
}
