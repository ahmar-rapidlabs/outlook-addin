import React from 'react'

function getDrafts() {
    return (
        <>
            <div className="container flex justify-center items-center pt-12">
                <button
                    type="button"
                    className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Get Drafts
                </button>
            </div>
        </>
    )
}

export default getDrafts