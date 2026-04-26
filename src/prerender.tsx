/**
 * Prerender script for vite-prerender-plugin
 * Reads event data directly from prd.txt and injects event-specific meta tags
 */
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TooltipProvider } from '@/components/ui/tooltip';
import { EventProvider } from '@/context/EventContext';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import EventDetailPage from './pages/EventDetailPage';
import WizardPage from './pages/WizardPage';
import ResultsPage from './pages/ResultsPage';
import FAQPage from './pages/FAQPage';
import NotFound from './pages/NotFound';
import fs from 'fs';
import path from 'path';

// Types
interface PrerenderData {
    url: string;
}

interface PrerenderResult {
    html: string;
    head?: {
        lang?: string;
        title?: string;
        elements?: Set<{ type: string; props: Record<string, string> }>;
    };
    links?: Set<string>;
}

interface EventData {
    event_name: string;
    event_date: string | null;
    event_description: string;
    event_type: string;
    location: {
        city: string | null;
        venue: string | null;
        state: string | null;
    };
    distances: Record<string, boolean>;
    organizer_info: {
        name: string;
        contact: string | null;
    };
}

// Helper: slugify (same as eventService)
const slugify = (text: string | null | undefined): string => {
    if (!text) return '';
    return text
        .toString()
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
};

// Load events data from prd.txt (synchronous for SSR)
let eventsData: Record<string, EventData> | null = null;
const loadEvents = (): Record<string, EventData> => {
    if (eventsData) return eventsData;

    try {
        const prdPath = path.resolve(process.cwd(), 'public/prd.txt');
        const content = fs.readFileSync(prdPath, 'utf-8');
        eventsData = JSON.parse(content);
        return eventsData!;
    } catch (error) {
        console.error('Failed to load events for prerender:', error);
        return {};
    }
};

// Find event by slug
const findEventBySlug = (slug: string): EventData | null => {
    const events = loadEvents();
    for (const key in events) {
        if (slugify(events[key].event_name) === slug) {
            return events[key];
        }
    }
    return null;
};

// Server-side App component with StaticRouter
const ServerApp = ({ url, helmetContext }: { url: string; helmetContext: object }) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                refetchOnWindowFocus: false,
            },
        },
    });

    return (
        <HelmetProvider context={helmetContext}>
            <QueryClientProvider client={queryClient}>
                <TooltipProvider>
                    <EventProvider>
                        <StaticRouter location={url}>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/event/:id" element={<EventDetailPage />} />
                                <Route path="/wizard" element={<WizardPage />} />
                                <Route path="/results" element={<ResultsPage />} />
                                <Route path="/faq" element={<FAQPage />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                        </StaticRouter>
                    </EventProvider>
                </TooltipProvider>
            </QueryClientProvider>
        </HelmetProvider>
    );
};

export async function prerender(data: PrerenderData): Promise<PrerenderResult> {
    const { url } = data;

    // Create helmet context
    const helmetContext = {};

    // Render the app to string
    const html = renderToString(<ServerApp url={url} helmetContext={helmetContext} />);

    // Build head elements based on the URL
    const elements = new Set<{ type: string; props: Record<string, string> }>();
    let title = "mynextbib.com - India's Premier Running Event Calendar";

    // Check if this is an event page
    const eventMatch = url.match(/^\/event\/([^/]+)/);
    if (eventMatch) {
        const slug = eventMatch[1];
        const event = findEventBySlug(slug);

        if (event) {
            const city = event.location.city || 'India';
            const year = event.event_date ? new Date(event.event_date).getFullYear() : '';
            const distances = Object.keys(event.distances)
                .filter(k => event.distances[k] && k !== 'other')
                .join(', ');

            // Set event-specific title
            title = `${event.event_name} - ${city}${year ? ` | ${year}` : ''} | mynextbib.com`;

            // Event description
            const description = event.event_description
                ? event.event_description.substring(0, 160)
                : `Join ${event.event_name} in ${city}. Distances: ${distances}. Register now for this ${event.event_type} running event.`;

            // Add event-specific meta tags
            elements.add({ type: 'meta', props: { name: 'description', content: description } });
            elements.add({ type: 'meta', props: { name: 'keywords', content: `${event.event_name}, running event ${city}, marathon ${city}, ${distances} run, race registration` } });

            // OG tags
            elements.add({ type: 'meta', props: { property: 'og:title', content: `${event.event_name} - ${city} | mynextbib.com` } });
            elements.add({ type: 'meta', props: { property: 'og:description', content: `Register for ${event.event_name}. A premier running event in ${city} featuring ${distances} distances.` } });
            elements.add({ type: 'meta', props: { property: 'og:url', content: `https://mynextbib.com/event/${slug}` } });
            elements.add({ type: 'meta', props: { property: 'og:type', content: 'event' } });
            elements.add({ type: 'meta', props: { property: 'og:image', content: 'https://mynextbib.com/mynextbib_logo.png' } });

            // Twitter tags
            elements.add({ type: 'meta', props: { name: 'twitter:card', content: 'summary_large_image' } });
            elements.add({ type: 'meta', props: { name: 'twitter:image', content: 'https://mynextbib.com/mynextbib_logo.png' } });

            // Canonical URL
            elements.add({ type: 'link', props: { rel: 'canonical', href: `https://mynextbib.com/event/${slug}` } });

            // Event schema
            const schema = {
                "@context": "https://schema.org",
                "@type": "Event",
                "name": event.event_name,
                "startDate": event.event_date || undefined,
                "description": description,
                "eventStatus": "https://schema.org/EventScheduled",
                "location": {
                    "@type": "Place",
                    "name": event.location.venue || city,
                    "address": {
                        "@type": "PostalAddress",
                        "addressLocality": event.location.city,
                        "addressRegion": event.location.state,
                        "addressCountry": "IN"
                    }
                },
                "image": ["https://mynextbib.com/mynextbib_logo.png"],
                "organizer": {
                    "@type": "Organization",
                    "name": event.organizer_info.name || 'MyNextBib'
                }
            };
            elements.add({
                type: 'script',
                props: {
                    type: 'application/ld+json',
                    // The plugin should handle innerHTML, but we'll include data here
                    'data-schema': JSON.stringify(schema)
                }
            });
        }
    } else if (url === '/faq') {
        title = 'FAQ - Running Events India | mynextbib.com';
        elements.add({ type: 'meta', props: { name: 'description', content: 'Frequently asked questions about running events in India. Get answers about marathons, registration, training, and more.' } });
        elements.add({ type: 'link', props: { rel: 'canonical', href: 'https://mynextbib.com/faq' } });
    } else if (url === '/wizard') {
        title = 'Event Finder Wizard | mynextbib.com';
        elements.add({ type: 'meta', props: { name: 'description', content: 'Find the perfect running event for you. Filter by city, distance, date, and more.' } });
        elements.add({ type: 'link', props: { rel: 'canonical', href: 'https://mynextbib.com/wizard' } });
    } else if (url === '/results') {
        title = 'Recommended Events | mynextbib.com';
        elements.add({ type: 'link', props: { rel: 'canonical', href: 'https://mynextbib.com/results' } });
    } else if (url === '/') {
        elements.add({ type: 'link', props: { rel: 'canonical', href: 'https://mynextbib.com' } });
    }

    // Parse links from the rendered HTML
    const { parseLinks } = await import('vite-prerender-plugin/parse');
    const links = new Set(parseLinks(html));

    return {
        html,
        head: {
            lang: 'en',
            title,
            elements,
        },
        links,
    };
}
