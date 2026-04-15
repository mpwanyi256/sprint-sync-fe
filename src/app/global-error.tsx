'use client';

export default function GlobalError() {
  return (
    <html lang='en'>
      <body>
        <div className='flex min-h-screen items-center justify-center bg-gray-50 p-6'>
          <div className='max-w-md rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>
            <h1 className='text-2xl font-bold text-gray-900'>
              Something went wrong
            </h1>
            <p className='mt-3 text-sm text-gray-600'>
              An unexpected error occurred while loading Sprint Sync.
            </p>
          </div>
        </div>
      </body>
    </html>
  );
}
