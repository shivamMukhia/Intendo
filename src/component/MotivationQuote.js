'use client';

export default function MotivationQuote() {
  const quotes = [
    "Push yourself, because no one else is going to do it for you.",
    "Success is the sum of small efforts repeated day in and day out.",
    "Discipline is choosing what you want most over what you want now.",
    "Great things never come from comfort zones."
  ];
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <p className="text-xl md:text-2xl font-semibold text-gray-700 italic text-center">
        {randomQuote}
      </p>
    </div>
  );
}
