'use client';

import { useState, useEffect } from 'react';
import { Timer, Mail, CheckCircle, Loader2 } from 'lucide-react';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    setMounted(true);
    const endTime = new Date('2025-03-08T18:00:00');

    const timer = setInterval(() => {
      const now = new Date();
      const difference = endTime.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      // Convert days to hours and add to hours
      const totalHours = days * 24 + hours;
      setTimeLeft({ hours: totalHours, minutes, seconds });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubscribed(true);
      } else {
        throw new Error('Failed to subscribe');
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        {/* Illustration */}
        <div className="mb-12">
          <img
            src="https://media-hosting.imagekit.io//bbaba807bd544022/Grey%20Minimalist%20Under%20Construction%20Announcement%20Instagram%20Post.svg?Expires=1833629207&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=vty8PBtV0BUioZkd2ZJVa-UlRiq1CMaSGyHHTB6TDbjYbdXx~C0ET67-xaQOMa4vW9GhI81paXk36ucPNQMFHpxwF7oI5gC8F3QaDD9Ww3HiVIPcux1dxQ-~yAEQTP7gwm2o8S3kLWphF2C1UaQYvNz81NigxsIB-udohmHpvpjSP78bWZyhi~SzkauPUw6EB9Gp7HMxsKajUy0yD596ktE1qI66WTIRcWcxNLScO0EQzHlx2DR1GJkT0mNG2o31Nw7UkqF~8UDhNsrSPF0b7bYec1Ys7fRElFy5zvGBuDiyVp7X8dkcfrZKtkEVEFBfkPzCeGUmYkIyGRgzHQX2GA__"
            alt="Maintenance Illustration"
            className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
          />
        </div>

        {/* Content */}
        <div className="space-y-8">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            We're Currently Under Maintenance
          </h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We're working hard to improve our website and we'll be back on March
            8, 2025 at 18:00 WIB. Thank you for your patience!
          </p>

          {/* Timer */}
          <div className="flex flex-col items-center space-y-4">
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Timer className="w-6 h-6" />
              <span className="text-lg font-semibold">Time Remaining:</span>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary">
                  {timeLeft.hours.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500">Hours</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary">
                  {timeLeft.minutes.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500">Minutes</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="text-3xl font-bold text-primary">
                  {timeLeft.seconds.toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-gray-500">Seconds</div>
              </div>
            </div>
          </div>

          {/* Subscribe Form */}
          <div className="max-w-md mx-auto">
            {!isSubscribed ? (
              <form
                onSubmit={handleSubscribe}
                className="mt-4 flex flex-col sm:flex-row gap-3"
              >
                <div className="flex-1">
                  <input
                    type="email"
                    required
                    className="block w-full rounded-md border border-gray-300 px-4 py-3 text-base text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-primary"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-3 font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 w-full sm:w-auto"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Mail className="w-5 h-5" />
                      <span>Notify Me</span>
                    </div>
                  )}
                </button>
              </form>
            ) : (
              <div className="flex items-center justify-center space-x-2 text-green-600 bg-green-50 p-4 rounded-lg">
                <CheckCircle className="w-6 h-6" />
                <span className="text-lg">Thank you for subscribing!</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
