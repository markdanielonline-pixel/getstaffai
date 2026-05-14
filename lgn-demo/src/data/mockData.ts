export const news = [
  {
    id: "1",
    category: "Community",
    title: "South Trinidad Communities Call for Stronger Local Development Support",
    summary: "Community leaders gather in Marabella to discuss new infrastructure and youth support programs.",
    date: "May 11, 2026",
    hasVideo: true,
  },
  {
    id: "2",
    category: "Business",
    title: "Small Businesses Look to Digital Media for New Customer Growth",
    summary: "Local entrepreneurs are finding new ways to reach audiences across the nation.",
    date: "May 10, 2026",
    hasVideo: false,
  },
  {
    id: "3",
    category: "Culture",
    title: "Cultural Voices Across Trinidad and Tobago Take Center Stage",
    summary: "Artists and performers prepare for the upcoming national cultural showcase.",
    date: "May 9, 2026",
    hasVideo: true,
  },
  {
    id: "4",
    category: "National",
    title: "Youth Leaders Push for More Creative Opportunities",
    summary: "A new initiative aims to provide training in media and arts for young professionals.",
    date: "May 8, 2026",
    hasVideo: false,
  },
  {
    id: "5",
    category: "Caribbean",
    title: "Regional Conversations Continue Around Caribbean Media Collaboration",
    summary: "Broadcasters from across the region discuss shared programming and news networks.",
    date: "May 7, 2026",
    hasVideo: true,
  },
  {
    id: "6",
    category: "Business",
    title: "Local Entrepreneurs Prepare for Weekend Business Showcase",
    summary: "Over 50 local vendors will display their products in South Trinidad this weekend.",
    date: "May 6, 2026",
    hasVideo: false,
  }
];

export const shows = [
  {
    id: "1",
    title: "LGN Morning Brief",
    description: "A fast, focused start to the day with headlines, weather, traffic, and community updates.",
    airTime: "6:00 AM",
    host: "Anchor Placeholder",
  },
  {
    id: "2",
    title: "Community Today",
    description: "Stories from the people, places, and communities shaping Trinidad and Tobago.",
    airTime: "8:00 AM",
    host: "Host Placeholder",
  },
  {
    id: "3",
    title: "Caribbean Conversations",
    description: "Interviews and discussions connecting local issues to wider Caribbean realities.",
    airTime: "10:00 AM",
    host: "Guest Host",
  },
  {
    id: "4",
    title: "Culture Connect",
    description: "Music, food, fashion, festivals, art, and the creative pulse of the region.",
    airTime: "2:00 PM",
    host: "Reporter Placeholder",
  },
  {
    id: "5",
    title: "Evening Report",
    description: "A clear, professional roundup of the day’s most important stories.",
    airTime: "5:00 PM",
    host: "Anchor Placeholder",
  },
  {
    id: "6",
    title: "The Lisa Granger Interview",
    description: "A signature conversation series featuring leaders, builders, artists, and changemakers.",
    airTime: "7:00 PM",
    host: "Mrs. Lisa Granger",
  }
];

export const schedule = [
  { time: "6:00 AM", title: "LGN Morning Brief", isLiveNow: false },
  { time: "8:00 AM", title: "Community Today", isLiveNow: false },
  { time: "10:00 AM", title: "Caribbean Conversations", isLiveNow: false },
  { time: "12:00 PM", title: "Midday News Update", isLiveNow: false },
  { time: "2:00 PM", title: "Culture Connect", isLiveNow: false },
  { time: "5:00 PM", title: "Evening Report", isLiveNow: false },
  { time: "7:00 PM", title: "The Lisa Granger Interview", isLiveNow: true },
  { time: "9:00 PM", title: "LGN Replay", isLiveNow: false },
];

export const personalities = [
  {
    id: "1",
    name: "Mrs. Lisa Granger",
    role: "Chief Executive Officer & Host",
    bio: "Founder and visionary behind LGN, Mrs. Granger brings decades of media experience and a passion for community building to the network.",
  },
  {
    id: "2",
    name: "Anchor Placeholder",
    role: "News Presenter",
    bio: "Delivering the day's top headlines with clarity and credibility. An award-winning journalist with roots in South Trinidad.",
  },
  {
    id: "3",
    name: "Host Placeholder",
    role: "Community Affairs",
    bio: "Dedicated to highlighting the unsung heroes and vital stories of local communities across the nation.",
  },
  {
    id: "4",
    name: "Reporter Placeholder",
    role: "Culture Desk",
    bio: "Covering the vibrant pulse of Trinidad and Tobago's arts, music, and festivals.",
  },
  {
    id: "5",
    name: "Producer Placeholder",
    role: "Digital Content",
    bio: "Bridging the gap between traditional broadcast and modern digital engagement for LGN's audience.",
  }
];

export const events = [
  {
    id: "1",
    type: "Community Meetings",
    title: "Marabella Community Market Weekend",
    date: "May 15-16, 2026",
    location: "Marabella Market Grounds",
  },
  {
    id: "2",
    type: "Cultural Events",
    title: "South Trinidad Youth Talent Showcase",
    date: "May 20, 2026",
    location: "Southern Academy for the Performing Arts",
  },
  {
    id: "3",
    type: "Business Events",
    title: "Local Business Networking Evening",
    date: "May 25, 2026",
    location: "LGN Headquarters, ManJack Street",
  },
  {
    id: "4",
    type: "Cultural Events",
    title: "Cultural Heritage Night",
    date: "June 2, 2026",
    location: "San Fernando Hill",
  },
  {
    id: "5",
    type: "Public Notices",
    title: "Community Health Awareness Day",
    date: "June 10, 2026",
    location: "Regional Health Centers",
  }
];

export const alerts = [
  {
    id: "1",
    type: "Weather Watch",
    message: "Showers expected in parts of South and Central Trinidad.",
    severity: "warning",
  },
  {
    id: "2",
    type: "Traffic Notice",
    message: "Allow extra travel time near major town centers during peak hours.",
    severity: "info",
  },
  {
    id: "3",
    type: "Community Notice",
    message: "Organizations may submit verified public advisories for review.",
    severity: "normal",
  }
];

export const businessSpotlights = [
  {
    id: "1",
    name: "Marabella Eats",
    category: "Restaurant",
    story: "Serving authentic local cuisine for over 20 years. Family-owned and deeply rooted in the community.",
    offer: "10% off weekday lunches",
    featured: true,
  },
  {
    id: "2",
    name: "Southside Auto Care",
    category: "Automotive",
    story: "Trusted mechanics providing reliable service and repairs for all vehicle makes and models.",
    offer: "Free diagnostic with oil change",
    featured: false,
  },
  {
    id: "3",
    name: "Island Beauty Studio",
    category: "Salon & Spa",
    story: "A modern oasis for self-care, offering premium beauty treatments and styling.",
    offer: "New client consultation package",
    featured: true,
  },
  {
    id: "4",
    name: "Caribbean Tech Services",
    category: "IT & Tech",
    story: "Helping small businesses modernize their operations with digital solutions.",
    offer: "Free network security assessment",
    featured: false,
  },
  {
    id: "5",
    name: "Local Fitness Hub",
    category: "Health & Wellness",
    story: "A community-focused gym promoting health and wellness for all ages.",
    offer: "No initiation fee this month",
    featured: false,
  }
];

export const adPackages = [
  {
    id: "1",
    name: "Starter Visibility Package",
    description: "Perfect for local businesses looking to build awareness across our digital platforms.",
    features: ["Website Banner Ads", "App Sponsorship mentions", "Social Media Video Features"],
  },
  {
    id: "2",
    name: "Community Growth Package",
    description: "Designed for organizations ready to engage deeply with our local audience.",
    features: ["Sponsored Community Segments", "Business Spotlight Feature", "Event Coverage"],
  },
  {
    id: "3",
    name: "Premium Broadcast Package",
    description: "High-impact visibility across TV, digital, and mobile.",
    features: ["TV Commercial Packages", "Sponsored Shows", "Premium App Placement"],
  },
  {
    id: "4",
    name: "Full Media Partner Package",
    description: "Comprehensive media partnership for maximum national reach.",
    features: ["All Premium Features", "Product Launch Features", "Custom Campaigns"],
  }
];

export const viewerPerks = [
  {
    id: "1",
    title: "10% off lunch special",
    business: "Marabella Eats",
  },
  {
    id: "2",
    title: "Free consultation",
    business: "Island Beauty Studio",
  },
  {
    id: "3",
    title: "Weekend family discount",
    business: "Local Fitness Hub",
  },
  {
    id: "4",
    title: "Featured local service",
    business: "Southside Auto Care",
  },
  {
    id: "5",
    title: "Sponsor giveaway",
    business: "Caribbean Tech Services",
  }
];

export const breakingNewsTicker = [
  "Developing: Community leaders meet in South Trinidad to discuss local development.",
  "Weather Watch: Intermittent showers expected across parts of Trinidad and Tobago.",
  "Public Notice: Submit your community events for LGN’s weekly bulletin.",
  "Culture: Local artists invited to register for upcoming feature segments."
];
