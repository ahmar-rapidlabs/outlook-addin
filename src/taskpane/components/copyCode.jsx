import React from 'react';

function CopyCode({ code }) {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg w-full max-w-lg">
          <div className="px-6 py-8 sm:p-10">
            <h2 className='text-xl font-semibold mb-4'>Copy and Paste the Code in Browser</h2>
            <h2 className='text-4xl font-bold mb-6'>{code}</h2>
            <div>
              <a href="#" className="text-md font-medium text-indigo-600 hover:text-indigo-500" onClick={() => navigator.clipboard.writeText(code)}>Copy Code</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CopyCode;
