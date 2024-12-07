// pages/index.js
export default function Home() {
  return (
    <section className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-sm mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Simple Polls</h1>
        <p className="text-gray-600 mb-6">A simple poll system made with NextJS & Prisma! 🍔</p>

        <a
          href="/poll/create"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition"
        >
          Create a new poll
        </a>
      </div>
    </section>
  );
}
