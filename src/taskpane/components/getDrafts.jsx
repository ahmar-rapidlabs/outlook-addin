<<<<<<< HEAD
<<<<<<< HEAD
=======
>>>>>>> 5a83849 (Get Drafts)
import React, { useState } from 'react';
import axios from 'axios';

function GetDrafts({ postemail }) {
    const [drafts, setDrafts] = useState([]); // State to store drafts
    const [selectedDraft, setSelectedDraft] = useState(null); // State to store the selected draft
    const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
    const [responseMessage, setResponseMessage] = useState(""); // State to store response message

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

<<<<<<< HEAD
=======
import React from 'react'

function getDrafts() {
>>>>>>> 72283bd (initial commit)
=======

>>>>>>> 5a83849 (Get Drafts)
=======
    const openModal = (draft) => {
        setSelectedDraft(draft);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDraft(null);
        setResponseMessage(""); // Clear response message
    };

    const send_email = async () => {
        if (!selectedDraft) return; // Ensure a draft is selected
        console.log(selectedDraft.id);
        try {
            const response2 = await axios.post('http://localhost:5000/send_email', {
                APP_ID: 'f04d6fd2-727a-4177-8554-c7d52a3cef2a',
                SCOPES: ['User.Read', 'Mail.Read', 'Mail.ReadWrite', 'Mail.Send'],
                email_verification: postemail,
                draft_id: selectedDraft.id // Include the selected draft ID in the request
            });
            console.log(response2); // log the response to see the result
    
            // Call handleDrafts after successfully sending the email
            await handleDrafts();
            // closeModal();
    
        } catch (error) {
            console.error('Error sending email:', error);
        }
    };
    

    

    const sendTextResponse = () => {
        // Implement sending response logic here
        console.log('Text response sent:', responseMessage);
        setResponseMessage(""); // Clear the response message after sending
    };

    const sendAudioResponse = () => {
        // Implement sending response logic here
        console.log('Audio response sent:', responseMessage);
        setResponseMessage(""); // Clear the response message after sending
    };

>>>>>>> 1b36948 (completed frontend functionality)
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
                    className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
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
                                <tr key={index} onClick={() => openModal(draft)} className="cursor-pointer hover:bg-gray-100">
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
<<<<<<< HEAD
=======

            {isModalOpen && selectedDraft && (
    <div className="fixed bottom-4 right-4 z-50 flex items-end justify-end">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md"> {/* Increased width */}
            <div className="px-4 py-3 border-b bg-[#F2F6FC] border-gray-200 flex justify-between items-center">
                <h3 className="text-gray-800">Message</h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="p-4">
                <div className="flex mb-4">
                    <p className="text-gray-800 mb-2">
                        To: {selectedDraft.toRecipients && selectedDraft.toRecipients.length > 0 ? selectedDraft.toRecipients[0].emailAddress.address : 'No recipient'}
                    </p>
                    <div className="flex justify-end ml-auto">
                        <button onClick={send_email} className="rounded-lg bg-indigo-600 px-2 py-1 text-sm font-semibold text-white shadow-md hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition">
                            <p>Send</p>
                        </button>
                    </div>
                </div>
                <hr className="my-2 border-gray-300" />
                <p className="text-gray-800 mb-2">{selectedDraft.subject}</p>
                <hr className="my-2 border-gray-300" />
                <p className="text-gray-700 whitespace-pre-line">{selectedDraft.bodyPreview}</p>
            </div>
            <div className="px-4 py-3 border-t border-gray-200 flex items-center">
                <input
                    type="text"
                    value={responseMessage}
                    onChange={(e) => setResponseMessage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded-lg px-2 py-1 text-sm"
                    placeholder="Type a prompt"
                />
                <button
                    onClick={sendTextResponse}
                    className="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
                >
                    <img
                    src={require('../../../assets/microsoft-logo.png')}
                    alt="text"
                    className="h-4"
                    />
                </button>
                <button
                    onClick={sendAudioResponse}
                    className="ml-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition"
                >
                    <img
                    src={require('../../../assets/microsoft-logo.png')}
                    alt="audio"
                    className="h-4"
                    />
                </button>
            </div>
        </div>
    </div>
)}

>>>>>>> 1b36948 (completed frontend functionality)
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
