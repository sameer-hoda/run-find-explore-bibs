import React, { useState } from "react";
import { useToast } from "./ui/use-toast";
import { trackEvent } from "@/lib/analytics";

const NewsletterSignUp: React.FC = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast({
          title: "Success",
          description: result.message,
        });
        trackEvent("newsletter_signup", {});
        setEmail("");
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Subscription failed. Please try again later.",
        variant: "destructive",
      });
      console.error('Subscription failed:', error);
    }
  };

  return (
    <div
      className="text-center bg-gray-100 p-4 rounded-lg mb-6"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-xl font-bold mb-2">
          Never miss an event, sign up for the monthly newsletter of running events
        </h2>
        <form
          className="flex justify-center mt-4"
          onSubmit={handleSubmit}
        >
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="px-4 py-2 w-64 border rounded-l-md focus:outline-none"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-white font-semibold rounded-r-md hover:bg-primary-dark"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSignUp;
