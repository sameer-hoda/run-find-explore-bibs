const { GoogleGenerativeAI } = require("@google/generative-ai");

class InfographicService {
    constructor() {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error("GEMINI_API_KEY is required for Infographic service");
        }
        this.genAI = new GoogleGenerativeAI(apiKey);
        // Use gemini-2.5-flash as it is the available stable model
        this.model = this.genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            tools: [{ googleSearch: {} }]
        });
    }

    /**
     * Discovers upcoming marquee running events.
     * @param {Array<string>} postedEvents - List of event names already posted.
     * @param {string} [specificEventName] - Optional specific event to find.
     * @returns {Promise<Array>} List of events.
     */
    async discoverEvents(postedEvents = [], specificEventName = null) {
        if (specificEventName) {
            console.log(`Skipping discovery, using specific event: ${specificEventName}`);
            return [{ name: specificEventName }];
        }

        const prompt = `
      Find 5 upcoming "marquee" or very popular running events (marathons, half-marathons, ultras) 
      in India or globally scheduled for the next 3-6 months. 
      Focus on major events that would be exciting to share on social media.
      
      Return a JSON array of objects, where each object has:
      - "name": Name of the event
      - "date": Date of the event
      - "location": City, Country
      - "popularity": A brief reason why it's popular (1 sentence)
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            const allEvents = this.parseJSON(text);

            // Filter out events that are already in the postedEvents list
            const filteredEvents = allEvents.filter(event => {
                const normalizedName = event.name.toLowerCase().replace(/[^a-z0-9]/g, '');
                const isPosted = postedEvents.some(posted =>
                    posted.toLowerCase().replace(/[^a-z0-9]/g, '').includes(normalizedName) ||
                    normalizedName.includes(posted.toLowerCase().replace(/[^a-z0-9]/g, ''))
                );
                return !isPosted;
            });

            return filteredEvents;
        } catch (error) {
            console.error("Error discovering events:", error);
            throw new Error("Failed to discover events via Gemini.");
        }
    }

    /**
     * Researches a specific event to get deep details.
     * @param {string} eventName - Name of the event to research.
     * @returns {Promise<Object>} Detailed event data.
     */
    async researchEvent(eventName) {
        const prompt = `
      Do DEEP research on the running event: "${eventName}".
      I need a "Runner's Perspective" analysis, similar to a detailed "Route Preview" or "Race Report".
      
      Search for:
      - "Route preview ${eventName}"
      - "Race report ${eventName}"
      - "Elevation profile ${eventName}"
      - "Runner blogs ${eventName}"

      I want INSIDER TIPS, not generic marketing copy.
      
      Find the following details:
      1. Official Date and Time
      2. Exact Location (Start/Finish lines)
      3. Race Categories
      4. **Course Nuances (Crucial)**: Specific hills (names?), turns, narrow sections, scenic spots. Mention specific landmarks along the route.
      5. **Atmosphere & Vibe**: What is the crowd like? Specific cheering zones? Navy choppers? Bands?
      6. **Swag & Logistics**: Medal details, holding area tips, transport (e.g. special metro services).
      7. **Weather**: Realistic expectations (humidity, temp).
      8. **Why Run This? (Insider POV)**: "Perfect tune-up for X", "Run with the Navy", etc.
      9. Registration status & Cost.
      10. Official Website URL.
      
      Return a JSON object with these keys:
      {
        "name": "${eventName}",
        "date": "...",
        "location": "...",
        "categories": ["..."],
        "course_difficulty": "...",
        "atmosphere": "...",
        "swag_value": "...",
        "weather_expectations": "...",
        "why_run_this": "...",
        "registration_status": "...",
        "website": "..."
      }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return this.parseJSON(text);
        } catch (error) {
            console.error(`Error researching event ${eventName}:`, error);
            throw new Error(`Failed to research event: ${eventName}`);
        }
    }

    /**
     * Generates the infographic prompt and content.
     * @param {Object} eventData - The researched event data.
     * @returns {Promise<Object>} Infographic prompt and caption.
     */
    async generateInfographic(eventData) {
        const prompt = `
      Create a social media infographic plan for the event: ${eventData.name}.
      
      Event Details:
      ${JSON.stringify(eventData, null, 2)}
      
      1. **Image Generation Prompt**: Write a highly detailed prompt for an AI image generator (Midjourney/DALL-E 3).
         - Style: Modern, clean, "Apple-esque" but energetic.
         - Elements: Visually represent the SPECIFIC landmarks mentioned in the research (e.g. Sea Link, specific buildings).
         - Vibe: Capture the specific atmosphere described (e.g. Navy choppers, morning block party).
      
      2. **Caption/Post Text**: Write an engaging Instagram/LinkedIn caption.
         - **Tone**: Insider, "Runner-to-Runner", knowledgeable. NOT generic marketing.
         - **Content**: Use the specific "Course Nuances" and "Insider POV" details found. Mention specific hills, turns, or tips.
         - **Structure**:
           - Hook: Something specific about the race character.
           - The "Real" Scoop: What to expect on the course (elevation, vibes).
           - Pro Tip: Logistics or strategy.
           - CTA: Link in bio.
      
      Return a JSON object. Do not include any markdown formatting or explanations outside the JSON.
      {
        "image_prompt": "...",
        "caption": "..."
      }
    `;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();
            return this.parseJSON(text);
        } catch (error) {
            console.error("Error generating infographic:", error);
            throw new Error("Failed to generate infographic content.");
        }
    }

    /**
     * Helper to parse JSON from AI response.
     */
    parseJSON(text) {
        try {
            // 1. Try to find markdown code block
            const match = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
            if (match) {
                return JSON.parse(match[1]);
            }

            // 2. Try to find the first '{' and last '}'
            const firstOpen = text.indexOf('{');
            const lastClose = text.lastIndexOf('}');
            if (firstOpen !== -1 && lastClose !== -1) {
                return JSON.parse(text.substring(firstOpen, lastClose + 1));
            }

            // 3. Try parsing the whole text
            return JSON.parse(text);
        } catch (e) {
            console.error("Failed to parse JSON. Raw text:", text);
            throw new Error("Invalid JSON response from AI");
        }
    }
}

module.exports = InfographicService;
