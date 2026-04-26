# Design Prompt: Minimalist "Apple-Like" Event Finder

## Objective
Revamp the frontend of the running event finder application to achieve a premium, minimalistic, "Apple-like" aesthetic. The goal is to create a highly intuitive, visually stunning, and SEO-optimized experience without altering the underlying codebase logic yet.

## Design Philosophy
- **Minimalism**: Less is more. Use whitespace generously.
- **Typography**: Clean, sans-serif fonts (Inter, SF Pro, or system fonts). High readability.
- **Color Palette**: Monochromatic base (White, Black, Grays) with subtle accent colors for actions or status.
- **Visuals**: Soft shadows, rounded corners (large radii), glassmorphism (where appropriate, e.g., sticky headers), and smooth transitions.
- **Interaction**: "City Bubbles" and "Distance Selectors" should feel tactile and responsive.

## Layout Requirements

### 1. Header & Navigation
- **Style**: Minimal sticky header with a blur effect (glassmorphism).
- **Content**: Logo/Brand Name (left), subtle navigation links (right).

### 2. City Bubble Selector (Top Row)
- **Placement**: Prominently displayed at the top of the main content area.
- **Design**: Horizontal scrollable list of "bubbles" (pills).
- **Interaction**:
    - **Default**: Light gray background, dark text.
    - **Selected**: Black background, white text.
    - **Hover**: Subtle scale up or background darken.
- **Behavior**: Sticky or stays at the top to allow easy filtering by location.

### 3. Distance Selector (Second Row)
- **Placement**: Directly below the City Selector.
- **Design**: Smaller pills or a segmented control style.
- **Interaction**: Similar to City Selector but visually distinct (e.g., outlined instead of filled, or different corner radius).

### 4. Event Grid
- **Layout**: Responsive grid (1 col mobile, 2 col tablet, 3 col desktop).
- **Spacing**: Generous gaps between cards.

### 5. Event Card Design (The Hero)
- **Container**: Clean white card, subtle border (1px solid #e5e5e5), large border radius (e.g., `rounded-2xl`).
- **Shadow**: Very soft, diffuse shadow on hover (`hover:shadow-lg transition-all duration-300`).
- **Content Hierarchy**:
    1.  **Date**: Top left or right. Styled elegantly (e.g., "OCT 24" in a compact box or just bold text).
    2.  **Event Name**: The most prominent text. `<h3>` tag for SEO. Bold, dark text.
    3.  **Location**: Subtle, below the name. Icon + City Name.
    4.  **Distances**: Minimal badges. e.g., "5K • 10K • 21K".
    5.  **Status/Inclusions**: Very subtle indicators (icons) for Medal, T-shirt, etc., at the bottom.
- **Action**: The entire card should be clickable. A subtle "View" arrow or button can appear on hover.

## SEO Optimization Requirements
- **Semantic HTML**: Use `<main>`, `<section>`, `<article>` (for cards), `<header>`, `<footer>`.
- **Headings**:
    - `<h1>`: Main page title (e.g., "Find Your Next Run").
    - `<h2>`: Section headers (e.g., "Upcoming Events in Mumbai").
    - `<h3>`: Event names within cards.
- **Meta Tags**: Ensure dynamic generation of Title and Description based on selected filters (e.g., "Running Events in Bangalore - 5K, 10K").
- **Schema.org**: Implement `Event` schema for each card (structured data) to help search engines understand dates, locations, and names.
- **Alt Text**: Descriptive alt text for any images.
- **Performance**: Lazy load images/components off-screen.

## Sample Data (JSON)
Use this data structure to mock the UI:

```json
[
  {
    "id": "delhi-half-marathon-2024",
    "event_name": "Delhi Half Marathon 2024",
    "event_date": "2024-10-20T06:00:00",
    "location": {
      "city": "New Delhi",
      "venue": "Jawaharlal Nehru Stadium",
      "state": "Delhi"
    },
    "event_type": "Physical",
    "distances": {
      "5K": true,
      "10K": true,
      "21.1K": true,
      "42.2K": false
    },
    "inclusions": {
      "t_shirt": true,
      "medal": true,
      "timing_chip": true,
      "refreshments": true
    },
    "registration_closes": "2024-10-01"
  },
  {
    "id": "mumbai-ultra-run",
    "event_name": "Mumbai Ultra Run",
    "event_date": "2024-11-15T05:00:00",
    "location": {
      "city": "Mumbai",
      "venue": "Shivaji Park",
      "state": "Maharashtra"
    },
    "event_type": "Physical",
    "distances": {
      "25K": true,
      "50K": true,
      "100K": false
    },
    "inclusions": {
      "t_shirt": true,
      "medal": true,
      "timing_chip": true,
      "refreshments": true
    },
    "registration_closes": "2024-10-30"
  },
  {
    "id": "bangalore-midnight-marathon",
    "event_name": "Bangalore Midnight Marathon",
    "event_date": "2024-12-10T23:00:00",
    "location": {
      "city": "Bengaluru",
      "venue": "KTPO Whitefield",
      "state": "Karnataka"
    },
    "event_type": "Physical",
    "distances": {
      "10K": true,
      "21.1K": true,
      "42.2K": true
    },
    "inclusions": {
      "t_shirt": true,
      "medal": true,
      "timing_chip": true,
      "refreshments": true
    },
    "registration_closes": "2024-11-25"
  }
]
```

## Implementation Notes
- **Framework**: React / Next.js (as per current codebase).
- **Styling**: Tailwind CSS is preferred for rapid, consistent styling.
- **Icons**: Lucide React (clean, consistent stroke width).
- **Responsiveness**: Mobile-first approach. The "City Bubbles" must be horizontally scrollable on mobile without hiding the scrollbar ugly (use `scrollbar-hide`).

## Prompt for AI/Designer
"Create a high-fidelity UI design for a running event discovery platform. The aesthetic should be 'Apple-like'—minimal, premium, and clean. The top of the page features a horizontal scrollable list of city pills (bubbles) for filtering. Directly below, a secondary filter row for distances. The main content is a grid of event cards. Each card must be minimal: white background, soft shadow, clear typography for the event name, date, and location. Use badges for distances. Ensure the design implies a seamless, fast user experience. Prioritize whitespace and readability. The HTML structure must be semantic for SEO."
