import React from 'react';

<<<<<<< HEAD
function CopyCode({ text, code, onBackClick, onNextClick }) {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg w-full max-w-lg">
          <div className="px-6 py-8 sm:p-10">
            <button
              onClick={onBackClick}
              className="mt-4 rounded-md bg-gray-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-600"
            >
              Back
            </button>
            <button
              onClick={onNextClick}
              className="mt-4 ml-4 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Next
            </button>
            <h2 className='text-xl font-semibold mb-4 mt-4'>{text}</h2>
=======
function CopyCode({ code }) {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="overflow-hidden rounded-lg bg-white shadow-lg w-full max-w-lg">
          <div className="px-6 py-8 sm:p-10">
            <h2 className='text-xl font-semibold mb-4'>Copy and Paste the Code in Browser</h2>
>>>>>>> 72283bd (initial commit)
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
