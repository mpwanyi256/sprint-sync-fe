import { timeElapsed } from '@/lib/utils';
import { useAppSelector } from '@/store/hooks';
import { selectSelectedTaskComments } from '@/store/slices/selectedTask';

export const TaskCommentsWrapper = () => {
  const comments = useAppSelector(selectSelectedTaskComments);

  return comments.map(comment => {
    const authorName =
      `${comment.user?.firstName ?? ''} ${comment.user?.lastName ?? ''}`.trim() ||
      'Unknown User';

    return (
      <div key={comment.id} className='flex gap-3'>
        <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-1 border-gray-200 bg-purple-900'>
          <span className='text-xs font-bold text-white'>
            {authorName
              .split(' ')
              .map(n => n[0])
              .join('')}
          </span>
        </div>
        <div className='flex-1'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-sm font-bold text-[#292A2E] m-0 p-0'>
                {authorName}
              </p>
              <p className='text-xs text-[#6b6e76]'>
                {timeElapsed(comment.createdAt)}
              </p>
            </div>
          </div>
          <div
            className='mt-1 text-sm text-[#292A2E] prose prose-sm max-w-none'
            dangerouslySetInnerHTML={{ __html: comment.message }}
          />
          {/* <div className='mt-2 flex items-center gap-4'>
                <button
                    onClick={() => onLikeComment?.(comment.id)}
                    className='flex items-center gap-1 text-xs text-gray-500 hover:text-red-500'
                >
                    <Heart
                    className={`h-4 w-4 ${comment.isLiked ? 'fill-red-500 text-red-500' : ''}`}
                    />
                    {comment.likes || 0}
                </button>
                <button className='flex items-center gap-1 text-xs text-gray-500 hover:text-blue-500'>
                    <MessageCircle className='h-4 w-4' />
                    Reply
                </button>
            </div> */}
        </div>
      </div>
    );
  });
};
