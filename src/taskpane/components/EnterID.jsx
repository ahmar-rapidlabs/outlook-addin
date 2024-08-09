import React, { useState } from 'react';
import axios from 'axios';
import CopyCode from './copyCode';
import GetDraft from './getDrafts'; // Import GetDraft component

export default function EnterID() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [showDraft, setShowDraft] = useState(false); // State for displaying GetDraft

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/start_polling', {
        APP_ID: 'f04d6fd2-727a-4177-8554-c7d52a3cef2a',
        SCOPES: ['User.Read', 'Mail.Read', 'Mail.ReadWrite','Mail.Send'],
        email_verification: email
      });
      console.log('Response from backend:', response.data);
      setCode(response.data.user_code); // Assuming your backend sends a user_code
      setShowCode(true); // Show the code display
    } catch (error) {
      console.error('Error starting polling:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
      }
    }
  };

  const handleBackClick = () => {
    setCode(null);
    setShowCode(false);
    setShowDraft(false);
  };

  const handleNextClick = () => {
    setShowCode(false);
    setShowDraft(true); // Show GetDraft component
  };

  return (
    <>
      {!showCode && !showDraft ? (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="overflow-hidden rounded-lg bg-white shadow-lg w-full max-w-md">
            <div className="px-6 py-8 sm:p-10">
              <form onSubmit={handleSubmit}>
                <label htmlFor="ID" className="block text-lg font-medium leading-6 text-gray-900">
                  Please Enter your Email ID
                </label>
                <div className="my-4">
                  <input
                    id="ID"
                    name="ID"
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full rounded-md border-0 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-lg sm:leading-6"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : showCode ? (
        <div className="">
          <div className="mt-6">
            <CopyCode text="Copy and paste the code in your browser: " code={code} onBackClick={handleBackClick} onNextClick={handleNextClick} />
          </div>
        </div>
      ) : showDraft ? (
        <GetDraft postemail={email} /> // Render GetDraft component
      ) : null}
    </>
  );
}
