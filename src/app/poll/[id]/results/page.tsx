'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import { toast } from 'react-toastify';


interface Poll {
  title: string;
  description: string;
  votes: Vote[];
  totalVotes: number;
}

interface Vote {
    text: string;
    votes: number;
    percentage: number;
}


export default function PollResults() { 
  const [poll, setPoll] = useState<Poll | null>(null);
  const params = useParams();
  const pollId:any = params?.id;
  const router = useRouter();

  useEffect(() => {
    if (pollId) {
      fetchPollResults(pollId);
    }
  }, [pollId]);

  const fetchPollResults = async (id: string) => {
    try {
      const response = await fetch(`/api/polls?id=${id}`);
      if (response.ok) {
        const data = await response.json();
        setPoll(data);

        const votes: Vote[] = data.options.map((option: any) => {
          const votes = data.votes.filter((vote: any) => vote.optionId === option.id);
          return {
            text: option.text,
            votes: votes.length,
            percentage: Math.round((votes.length / data.votes.length) * 100),
          } as Vote;
        });

        setPoll({
            title: data.title,
            description: data.description,
            votes: votes,
            totalVotes: votes.map((vote: Vote) => vote.votes).reduce((a, b) => a + b, 0),
        })

      } else {
        console.error('Error fetching poll results');
        toast.error('An error occurred while fetching poll results');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  if (!poll) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading poll results...</p>
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

        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-right">
          {poll.title} <span className="opacity-75">({poll.totalVotes} votes)</span>
        </h1>
        <p className="text-gray-600 mb-6 text-lg text-right">{poll.description}</p>

        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-4 text-gray-700 font-semibold">Option</th>
              <th className="p-4 text-gray-700 font-semibold">Votes</th>
              <th className="p-4 text-gray-700 font-semibold">Progress</th>
            </tr>
          </thead>
          <tbody>
            {poll.votes.map((option:any, index: number) => (
              <tr key={index} className="border-b">
                <td className="p-4 text-gray-800">{option.text}</td>
                <td className="p-4 text-gray-800">
                  {option.votes} ({option.percentage}%)
                </td>
                <td className="p-4">
                  <div className="relative w-full h-4 bg-gray-200 rounded">
                    <div
                      className="absolute top-0 left-0 h-full bg-purple-600 rounded"
                      style={{ width: `${option.percentage}%` }}
                    ></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
