import { timeElapsed } from '@/lib/utils';

interface UserAvatarProps {
  firstName: string;
  lastName: string;
  showName?: boolean;
  recordTime?: string;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  firstName,
  lastName,
  showName = false,
  recordTime,
}) => {
  return (
    <div className='flex items-center space-x-2 w-fit'>
      <div className='flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-1 border-gray-200 bg-purple-900'>
        <span className='text-xs font-bold text-white'>
          {`${firstName.charAt(0)}${lastName.charAt(0)}`}
        </span>
      </div>
      {/* Full name && time */}
      <div className='flex flex-col gap-1'>
        {showName && (
          <p className='text-sm font-bold text-[#292A2E] m-0 p-0'>
            {`${firstName} ${lastName}`}
          </p>
        )}
        {recordTime && (
          <p className='text-xs text-[#6b6e76] m-0 p-0'>
            {timeElapsed(recordTime)}
          </p>
        )}
      </div>
    </div>
  );
};
