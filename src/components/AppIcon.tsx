import Image from 'next/image';

export const AppIcon = () => {
  return (
    <div className='flex flex-row gap-4'>
      <Image
        src='/icon/logo.svg'
        alt='SprintSync Logo'
        width={30}
        height={30}
      />
      <span className='text-xl font-bold text-gray-900'>SprintSync</span>
    </div>
  );
};
