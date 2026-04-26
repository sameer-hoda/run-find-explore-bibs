import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-primary text-primary-foreground py-2 text-center text-sm z-50 shadow-md">
      <div className="container mx-auto px-4">
        <p>
          Cant find an event, let me know :{" "}
          <a
            href="mailto:sameer.hoda@gmail.com?subject=Event%20Suggestion&body=Hi%20Sameer%2C%0A%0AI%20couldn't%20find%20the%20following%20event%20on%20mynextbib.com%3A%0A%0AEvent%20Name%3A%20%0AEvent%20Date%3A%20%0AEvent%20Location%3A%20%0AEvent%20Website%20(if%20any)%3A%20%0A%0AThanks%2C%0A[Your%20Name]"
            className="underline hover:text-secondary"
          >
            📤
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
