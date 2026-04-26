// Post-build script to inject event-specific meta tags into prerendered HTML
// Run after vite build to update meta tags in dist/event/[slug]/index.html

const fs = require('fs');
const path = require('path');

// Helper: slugify (same as eventService)
const slugify = (text) => {
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

// Load events data
const prdPath = path.join(__dirname, 'public/prd.txt');
const eventsData = JSON.parse(fs.readFileSync(prdPath, 'utf-8'));

// Create slug to event mapping
const slugToEvent = {};
for (const key in eventsData) {
    const event = eventsData[key];
    const slug = slugify(event.event_name);
    slugToEvent[slug] = event;
}

// Get all event directories
const distEventPath = path.join(__dirname, 'dist/event');
if (!fs.existsSync(distEventPath)) {
    console.log('No dist/event directory found. Skipping meta tag injection.');
    process.exit(0);
}

const eventDirs = fs.readdirSync(distEventPath);
console.log(`Found ${eventDirs.length} event directories to process...`);

let updated = 0;
let skipped = 0;

for (const slug of eventDirs) {
    const htmlPath = path.join(distEventPath, slug, 'index.html');

    if (!fs.existsSync(htmlPath)) {
        skipped++;
        continue;
    }

    const event = slugToEvent[slug];
    if (!event) {
        console.log(`  - No event data found for slug: ${slug}`);
        skipped++;
        continue;
    }

    let html = fs.readFileSync(htmlPath, 'utf-8');

    const city = event.location?.city || 'India';
    const year = event.event_date ? new Date(event.event_date).getFullYear() : '';
    const distances = Object.keys(event.distances || {})
        .filter(k => event.distances[k] && k !== 'other')
        .join(', ');

    // Generate new values
    const newTitle = `${event.event_name} - ${city}${year ? ` | ${year}` : ''} | mynextbib.com`;
    const description = event.event_description
        ? event.event_description.substring(0, 160)
        : `Join ${event.event_name} in ${city}. Distances: ${distances}. Register now for this ${event.event_type || 'Physical'} running event.`;
    const canonicalUrl = `https://mynextbib.com/event/${slug}`;
    const ogTitle = `${event.event_name} - ${city} | mynextbib.com`;
    const ogDescription = `Register for ${event.event_name}. A premier running event in ${city} featuring ${distances} distances.`;

    // Replace title
    html = html.replace(
        /<title>[^<]*<\/title>/,
        `<title>${newTitle}</title>`
    );

    // Replace description meta tag
    html = html.replace(
        /<meta name="description" content="[^"]*" >/,
        `<meta name="description" content="${description}" >`
    );

    // Replace keywords
    html = html.replace(
        /<meta name="keywords" content="[^"]*" >/,
        `<meta name="keywords" content="${event.event_name}, running event ${city}, marathon ${city}, ${distances} run, race registration" >`
    );

    // Replace canonical
    html = html.replace(
        /<link rel="canonical" href="[^"]*" >/,
        `<link rel="canonical" href="${canonicalUrl}" >`
    );

    // Replace og:title
    html = html.replace(
        /<meta property="og:title" content="[^"]*" >/,
        `<meta property="og:title" content="${ogTitle}" >`
    );

    // Replace og:description
    html = html.replace(
        /<meta property="og:description" content="[^"]*" >/,
        `<meta property="og:description" content="${ogDescription}" >`
    );

    // Replace og:url
    html = html.replace(
        /<meta property="og:url" content="[^"]*" >/,
        `<meta property="og:url" content="${canonicalUrl}" >`
    );

    // Replace og:type
    html = html.replace(
        /<meta property="og:type" content="[^"]*" >/,
        `<meta property="og:type" content="event" >`
    );

    // Replace twitter:title
    html = html.replace(
        /<meta name="twitter:title" content="[^"]*" >/,
        `<meta name="twitter:title" content="${ogTitle}" >`
    );

    // Replace twitter:description
    html = html.replace(
        /<meta name="twitter:description" content="[^"]*" >/,
        `<meta name="twitter:description" content="${ogDescription}" >`
    );

    // Add Event schema before closing </head>
    const eventSchema = {
        "@context": "https://schema.org",
        "@type": "Event",
        "name": event.event_name,
        "startDate": event.event_date || undefined,
        "description": description,
        "eventStatus": "https://schema.org/EventScheduled",
        "location": {
            "@type": "Place",
            "name": event.location?.venue || city,
            "address": {
                "@type": "PostalAddress",
                "addressLocality": city,
                "addressRegion": event.location?.state || null,
                "addressCountry": "IN"
            }
        },
        "image": ["https://mynextbib.com/mynextbib_logo.png"],
        "organizer": {
            "@type": "Organization",
            "name": event.organizer_info?.name || 'MyNextBib',
            "url": "https://mynextbib.com"
        }
    };

    // Check if event schema already exists, if not add it
    if (!html.includes('"@type": "Event"')) {
        const schemaScript = `<script type="application/ld+json">${JSON.stringify(eventSchema)}</script>\n  </head>`;
        html = html.replace('</head>', schemaScript);
    }

    fs.writeFileSync(htmlPath, html);
    updated++;
}

console.log(`\n✅ Updated ${updated} event pages with specific meta tags.`);
if (skipped > 0) {
    console.log(`⚠️  Skipped ${skipped} pages (no matching event data).`);
}
