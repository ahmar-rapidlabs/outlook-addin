<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5a83849 (Get Drafts)
import React, { useState } from 'react';
import axios from 'axios';

function GetDrafts({ postemail }) {
    const [drafts, setDrafts] = useState([]); // State to store drafts

    const handleDrafts = async () => {
        try {
            const response = await axios.post('http://localhost:5000/fetch_drafts', {
                APP_ID: 'f04d6fd2-727a-4177-8554-c7d52a3cef2a',
                SCOPES: ['User.Read', 'Mail.Read', 'Mail.ReadWrite', 'Mail.Send'],
                email_verification: postemail
            });
            setDrafts(response.data); // Store the fetched drafts in state
            console.log(response); // Optional: log the response to see the draft data
        } catch (error) {
            console.error('Error fetching drafts:', error);
        }
    };
<<<<<<< HEAD

=======
import React from 'react'

function getDrafts() {
>>>>>>> 72283bd (initial commit)
=======

>>>>>>> 5a83849 (Get Drafts)
    return (
        <>
            <div className="container flex justify-center items-center pt-12">
                <button
<<<<<<< HEAD
<<<<<<< HEAD
                    onClick={handleDrafts}
=======
>>>>>>> 72283bd (initial commit)
=======
                    onClick={handleDrafts}
>>>>>>> 5a83849 (Get Drafts)
                    type="button"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Get Drafts
                </button>
            </div>
<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5a83849 (Get Drafts)
            <div className="mt-6 overflow-x-auto">
                {drafts.length > 0 ? (
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Subject
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Preview
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {drafts.map((draft, index) => (
                                <tr key={index}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{draft.subject}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{draft.bodyPreview}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No drafts found.</p>
                )}
            </div>
<<<<<<< HEAD
        </>
    );
}

export default GetDrafts;
=======
=======
>>>>>>> 5a83849 (Get Drafts)
        </>
    );
}

<<<<<<< HEAD
export default getDrafts
>>>>>>> 72283bd (initial commit)
=======
export default GetDrafts;
>>>>>>> 5a83849 (Get Drafts)
