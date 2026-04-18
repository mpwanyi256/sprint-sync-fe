# Task Comments API - Frontend Implementation Guide

## Overview

The Task Comments API allows users to add, view, edit, and delete comments on tasks. Comments are stored with user information, timestamps, and support pagination. **Comments are returned sorted by creation time (newest first).**

## Base URL

```
/api/tasks/:taskId/comments
```

---

## API Endpoints

### 1. Create a Comment

**Endpoint:** `POST /api/tasks/:taskId/comments`

**Authentication:** Required (Bearer Token)

**Request Body:**
```json
{
  "message": "This is a comment about the task"
}
```

**Parameters:**
- `taskId` (URL param, required): The ID of the task
- `message` (body, required): Comment text (1-5000 characters)

**Response (201 Created):**
```json
{
  "statusCode": "10000",
  "message": "Comment created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "taskId": "507f1f77bcf86cd799439010",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "message": "This is a comment about the task",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid message format or missing required fields
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Task does not exist

**Example (JavaScript/Fetch):**
```javascript
async function createComment(taskId, message, accessToken) {
  const response = await fetch(`/api/tasks/${taskId}/comments`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`
    },
    body: JSON.stringify({ message })
  });

  if (!response.ok) {
    throw new Error('Failed to create comment');
  }

  return response.json();
}
```

---

### 2. Get All Comments for a Task

**Endpoint:** `GET /api/tasks/:taskId/comments?page=1&limit=10`

**Authentication:** Required (Bearer Token)

**Query Parameters:**
- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 10): Number of comments per page

**Response (200 OK):**
```json
{
  "statusCode": "10000",
  "message": "Comments fetched successfully",
  "data": {
    "comments": [
      {
        "id": "507f1f77bcf86cd799439011",
        "taskId": "507f1f77bcf86cd799439010",
        "user": {
          "id": "507f1f77bcf86cd799439012",
          "firstName": "John",
          "lastName": "Doe",
          "email": "john@example.com"
        },
        "message": "Latest comment",
        "createdAt": "2026-04-17T11:00:00.000Z",
        "updatedAt": "2026-04-17T11:00:00.000Z"
      },
      {
        "id": "507f1f77bcf86cd799439013",
        "taskId": "507f1f77bcf86cd799439010",
        "user": {
          "id": "507f1f77bcf86cd799439014",
          "firstName": "Jane",
          "lastName": "Smith",
          "email": "jane@example.com"
        },
        "message": "Earlier comment",
        "createdAt": "2026-04-17T10:30:00.000Z",
        "updatedAt": "2026-04-17T10:30:00.000Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "totalCount": 2,
      "totalPages": 1
    }
  }
}
```

**Important:** Comments are sorted by `createdAt` in **descending order** (newest first).

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Task does not exist

**Example (JavaScript/Fetch):**
```javascript
async function getTaskComments(taskId, page = 1, limit = 10, accessToken) {
  const queryParams = new URLSearchParams({ page, limit });
  const response = await fetch(`/api/tasks/${taskId}/comments?${queryParams}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch comments');
  }

  return response.json();
}
```

---

### 3. Get a Specific Comment

**Endpoint:** `GET /api/tasks/:taskId/comments/:commentId`

**Authentication:** Required (Bearer Token)

**Response (200 OK):**
```json
{
  "statusCode": "10000",
  "message": "Comment fetched successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "taskId": "507f1f77bcf86cd799439010",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "message": "This is a comment",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `404 Not Found`: Comment does not exist

---

### 4. Update a Comment (Owner Only)

**Endpoint:** `PATCH /api/tasks/:taskId/comments/:commentId`

**Authentication:** Required (Bearer Token)

**Authorization:** Only the comment author can update

**Request Body:**
```json
{
  "message": "Updated comment text"
}
```

**Response (200 OK):**
```json
{
  "statusCode": "10000",
  "message": "Comment updated successfully",
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "taskId": "507f1f77bcf86cd799439010",
    "user": {
      "id": "507f1f77bcf86cd799439012",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com"
    },
    "message": "Updated comment text",
    "createdAt": "2026-04-17T10:30:00.000Z",
    "updatedAt": "2026-04-17T11:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid message format
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User is not the comment author
- `404 Not Found`: Comment does not exist

**Example (JavaScript/Fetch):**
```javascript
async function updateComment(taskId, commentId, newMessage, accessToken) {
  const response = await fetch(
    `/api/tasks/${taskId}/comments/${commentId}`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ message: newMessage })
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You can only edit your own comments');
    }
    throw new Error('Failed to update comment');
  }

  return response.json();
}
```

---

### 5. Delete a Comment (Owner Only)

**Endpoint:** `DELETE /api/tasks/:taskId/comments/:commentId`

**Authentication:** Required (Bearer Token)

**Authorization:** Only the comment author can delete

**Response (200 OK):**
```json
{
  "statusCode": "10000",
  "message": "Comment deleted successfully",
  "data": {
    "message": "Comment has been deleted"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Missing or invalid authentication token
- `403 Forbidden`: User is not the comment author
- `404 Not Found`: Comment does not exist

**Example (JavaScript/Fetch):**
```javascript
async function deleteComment(taskId, commentId, accessToken) {
  const response = await fetch(
    `/api/tasks/${taskId}/comments/${commentId}`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    }
  );

  if (!response.ok) {
    if (response.status === 403) {
      throw new Error('You can only delete your own comments');
    }
    throw new Error('Failed to delete comment');
  }

  return response.json();
}
```

---

## Frontend Implementation Examples

### React Component Example

```typescript
import React, { useState, useEffect } from 'react';

interface Comment {
  id: string;
  taskId: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  message: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskCommentsProps {
  taskId: string;
  accessToken: string;
  currentUserId: string;
}

const TaskComments: React.FC<TaskCommentsProps> = ({
  taskId,
  accessToken,
  currentUserId,
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // Fetch comments
  const fetchComments = async (pageNum = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `/api/tasks/${taskId}/comments?page=${pageNum}&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch comments');

      const data = await response.json();
      setComments(data.data.comments);
      setPage(data.data.pagination.page);
      setTotalPages(data.data.pagination.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  // Add comment
  const handleAddComment = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ message: newMessage }),
      });

      if (!response.ok) throw new Error('Failed to add comment');

      setNewMessage('');
      // Refresh comments (newest will be first)
      await fetchComments(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Update comment
  const handleUpdateComment = async (commentId: string) => {
    try {
      const response = await fetch(
        `/api/tasks/${taskId}/comments/${commentId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ message: editText }),
        }
      );

      if (!response.ok) throw new Error('Failed to update comment');

      setEditingId(null);
      await fetchComments(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  // Delete comment
  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await fetch(
        `/api/tasks/${taskId}/comments/${commentId}`,
        {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (!response.ok) throw new Error('Failed to delete comment');

      await fetchComments(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  };

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const isOwner = (comment: Comment) => comment.user.id === currentUserId;

  return (
    <div className="comments-section">
      <h3>Comments</h3>

      {error && <div className="error">{error}</div>}

      <div className="add-comment">
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Add a comment..."
          maxLength={5000}
        />
        <button onClick={handleAddComment} disabled={!newMessage.trim()}>
          Post Comment
        </button>
      </div>

      {loading ? (
        <div>Loading comments...</div>
      ) : (
        <div className="comments-list">
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <strong>
                  {comment.user.firstName} {comment.user.lastName}
                </strong>
                <span className="comment-time">
                  {new Date(comment.createdAt).toLocaleString()}
                </span>
              </div>

              {editingId === comment.id ? (
                <div>
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    maxLength={5000}
                  />
                  <button onClick={() => handleUpdateComment(comment.id)}>
                    Save
                  </button>
                  <button onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              ) : (
                <div>
                  <p>{comment.message}</p>
                  {isOwner(comment) && (
                    <div className="comment-actions">
                      <button
                        onClick={() => {
                          setEditingId(comment.id);
                          setEditText(comment.message);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteComment(comment.id)}>
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => fetchComments(page - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => fetchComments(page + 1)}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TaskComments;
```

---

## Key Features for Frontend Developers

### ✅ Comment Ordering
- Comments are **always sorted by creation time (newest first)**
- When you fetch comments, the latest comment appears at the top
- No need to reverse arrays on the frontend

### ✅ Ownership Restrictions
- Users can only **edit their own comments** (403 Forbidden error if not)
- Users can only **delete their own comments** (403 Forbidden error if not)
- Display edit/delete buttons conditionally based on `currentUserId === comment.user.id`

### ✅ Pagination
- Default: 10 comments per page
- Response includes `totalCount`, `totalPages`, `page`, and `limit`
- Implement pagination controls for better UX with many comments

### ✅ Timestamps
- `createdAt`: When comment was created (immutable)
- `updatedAt`: When comment was last modified (changes on edit)
- Use these for sorting and display purposes

### ✅ Error Handling
- `400 Bad Request`: Invalid input (empty message, too long, etc.)
- `401 Unauthorized`: Missing/invalid token
- `403 Forbidden`: Permission denied (not comment owner)
- `404 Not Found`: Comment or task doesn't exist

---

## Best Practices

1. **Debounce Comment Input**: Add debouncing to prevent accidental double posts
2. **Optimistic UI Updates**: Update local state before API response for better UX
3. **Loading States**: Show loading indicators during API calls
4. **Error Messages**: Display user-friendly error messages
5. **Refresh on Action**: Refetch comments after create/update/delete
6. **Timezone Handling**: Convert `createdAt`/`updatedAt` to local time
7. **Truncate Long Comments**: Show "Show More" for comments > 300 chars
8. **Real-time Updates** (Optional): Use WebSockets to show new comments instantly

---

## Validation Rules

| Field | Rules |
|-------|-------|
| `message` | 1-5000 characters, required |
| `taskId` | Valid MongoDB ObjectId |
| `commentId` | Valid MongoDB ObjectId |
| `page` | Positive integer, optional (default: 1) |
| `limit` | Positive integer, optional (default: 10) |

