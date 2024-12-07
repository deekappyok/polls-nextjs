'use client';  // Ensures this is a client-side component

import { useState } from "react";
import { useRouter } from 'next/navigation'
import { toast } from "react-toastify"; // Import the toast module to show notifications

export default function CreatePoll() {
    const [question, setQuestion] = useState("");
    const [description, setDescription] = useState("");
    const [options, setOptions] = useState(["", ""]);
    const [pollId, setPollId] = useState<number | null>(null);
    
    const router = useRouter();

    // const router = useRouter(); // Initialize useRouter

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        
        // if all options are filled, add a new empty option
        if (index === options.length - 1 && value !== "") {
            newOptions.push("");
        }
        setOptions(newOptions);

        // check if any option is a duplicate of another, if so, remove it
        const uniqueOptions = newOptions.filter((option, i) => newOptions.indexOf(option) === i);
        setOptions(uniqueOptions);
    };

    const send = async () => {
        try {
            // send request to create poll at /api/polls/create
            const res = await fetch("/api/polls", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    question,
                    description,
                    options: options.filter((option) => option),
                }),
            });
    
            if (res.ok) {
                const data = await res.json();
                setPollId(data.id);
    
                toast.success("Poll created successfully!");
    
                // Reset form
                setQuestion("");
                setDescription("");
                setOptions(["", ""]);
            } else {
                // Handle different error statuses
                const errorData = await res.json();
                if (res.status === 400) {
                    toast.error(`Bad Request: ${errorData.error}`);
                } else if (res.status === 409) {
                    toast.warning(`Conflict: ${errorData.error}`);
                } else if (res.status === 500) {
                    toast.error("Internal Server Error: Something went wrong on the server.");
                } else {
                    toast.error(`Unexpected Error: ${errorData.error || 'Please try again later.'}`);
                }
            }
        } catch (error) {
            console.error("Error creating poll:", error);
            toast.error("Network error: Could not reach the server. Please try again later.");
        }
    };
    
    return (
        <section className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full mx-auto relative mt-12">
                {/* Return Icon */}
                <button
                    onClick={() => router.push("/")} // Go back to the previous page
                    className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gray-800">
                        <path fillRule="evenodd" d="M12.707 4.293a1 1 0 011.414 1.414L8.414 10l5.707 5.293a1 1 0 01-1.414 1.414l-7-6a1 1 0 010-1.414l7-6z" clipRule="evenodd" />
                    </svg>
                </button>

                {/* move to right side */}
                <h1 className="text-3xl font-semibold text-gray-800 mb-4 text-right">Create a New Poll</h1>
                <p className="text-gray-600 mb-6 text-right">A simple poll system made with TypeScript! 🍔</p>

                {/* Poll Question Input */}
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                    Poll Question
                </label>
                <input
                    type="text"
                    id="name"
                    placeholder="Enter your poll question"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />

                {/* Description Input */}
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                    Description
                </label>
                <input
                    type="text"
                    id="description"
                    placeholder="Enter a description..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full mb-4 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                />

                {/* Poll Options */}
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Options</label>
                    {options.map((option, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Option ${index + 1}`}
                            value={option}
                            onChange={(e) => handleOptionChange(index, e.target.value)}
                            className="w-full mb-2 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-purple-600"
                        />
                    ))}
                </div>

                {/* Submit Button */}
                <div className="flex justify-center">
                    <button
                        onClick={send}
                        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-md transition duration-300 ease-in-out w-full"
                    >
                        Create Poll
                    </button>
                </div>
            </div>
        </section>
    );
}
