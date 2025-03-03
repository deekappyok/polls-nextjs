'use client'; // Ensure this is a client-side component

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Poll {
  id: string;
  title: string;
  description: string;
  options: { id: any, text: string }[];
}


export default function VotePage() {
  const [poll, setPoll] = useState<Poll | null>(null);

  const router = useRouter();
  const params = useParams();
  const pollId:any = params?.id;

  useEffect(() => {
    // Fetch poll data when the page loads
    if (pollId) {
      fetchPollData(pollId);
    }
  }, [pollId]);

  const fetchPollData = async (id: string) => {
    try {
      const response = await fetch(`/api/polls?id=${id}`);
      if (response.ok) {
        const pollData = await response.json();
        setPoll(pollData);        

      } else {
        toast.error('Error fetching poll data.');
      }
    } catch (error) {
      console.error('Failed to fetch poll data:', error);
      toast.error('An error occurred while fetching poll data.');
    }
  };

  const handleVote = async (optionId: string) => {

    try {
      const response = await fetch('/api/polls', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pollId: poll?.id,
          optionId
        }),
      });

      switch (response.status) {
        case 200:
          toast.success('Vote submitted successfully!');
          setTimeout(() => {
            router.push(`/poll/${poll?.id}/results`);
          }, 1500);
          break;
        case 400:
          toast.error('Invalid vote!');
          break;
        case 421:
          toast.info('You have already voted.');
          break;
        default:
          toast.error('An error occurred.');
      }
    } catch (error) {
      console.error('Failed to submit vote:', error);
      toast.error('An error occurred while submitting your vote.');
    }
  };

  if (!poll) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading poll {pollId}...</p>
      </div>
    );
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-lg w-full mx-auto relative mt-12">
        {/* Return Icon */}
        <button
            onClick={() => router.back()} // Go back to the previous page
            className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 transition"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6 text-gray-800">
                <path fillRule="evenodd" d="M12.707 4.293a1 1 0 011.414 1.414L8.414 10l5.707 5.293a1 1 0 01-1.414 1.414l-7-6a1 1 0 010-1.414l7-6z" clipRule="evenodd" />
            </svg>
        </button>

        <h1 className="text-3xl font-bold text-gray-800 mb-4 text-right">{poll.title}</h1>
        <p className="text-gray-600 mb-6 text-right">{poll.description}</p>

        
        <div className="grid grid-cols-1 gap-4">
          {poll.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleVote(option.id)}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-md transition"
            >
              {option.text}
            </button>
          ))}
        </div>

        <button
          onClick={() => router.push(`/poll/${poll.id}/results`)}
          className="mt-4 bg-purple-400 hover:bg-purple-500 text-white font-semibold py-2 px-4 rounded-md transition"
        >
            View Results
        </button>
      </div>
    </section>
  );
}
