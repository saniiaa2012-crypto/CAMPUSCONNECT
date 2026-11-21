// Preloaded CampusConnect Dataset (Fallback & Offline Resilience)
// Guarantees that opportunities, tickets, services, and events display instantly
// even during Render cold-starts, network transitions, or standalone previews.

const FALLBACK_DATA = {
  opportunities: [
    {
      id: 'opp_1',
      title: 'React & Frontend Developer Intern',
      company: 'Gurugram Tech Innovations',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Gurugram / Hybrid',
      workMode: 'Hybrid',
      type: 'Internship',
      stipend: 18000,
      stipendFormatted: '₹18,000 / mo',
      duration: '3 Months',
      weeklyHours: '20 hrs/week',
      openings: 3,
      applicantsCount: 24,
      deadline: '2026-12-15',
      featured: true,
      category: 'Software Engineering',
      tags: ['React', 'Tailwind CSS', 'TypeScript', 'API Integration'],
      description: 'We are seeking an enthusiastic undergraduate frontend engineer to collaborate on client-facing student portals. You will build responsive UI components, connect RESTful backends, and optimize performance.',
      requirements: [
        'Solid fundamentals in HTML5, modern CSS, and ES6+ JavaScript',
        'Demonstrated experience with React or similar modern libraries',
        'Familiarity with Git and collaborative version control',
        'Ability to commit 18-20 hours weekly'
      ]
    },
    {
      id: 'opp_2',
      title: 'AI & Data Research Assistant',
      company: 'DTU Advanced AI & Robotics Lab',
      companyLogo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Delhi (On-Campus)',
      workMode: 'On-site',
      type: 'Project',
      stipend: 22000,
      stipendFormatted: '₹22,000 / mo',
      duration: '6 Months',
      weeklyHours: '15 hrs/week',
      openings: 2,
      applicantsCount: 41,
      deadline: '2026-12-05',
      featured: true,
      category: 'Data Science & AI',
      tags: ['Python', 'PyTorch', 'Data Processing', 'Computer Vision'],
      description: 'Assist university faculty in analyzing synthetic sensor datasets and benchmarking open-source LLM reasoning models. Opportunity to co-author peer-reviewed publications.',
      requirements: [
        'Good grasp of Python, NumPy, and basic machine learning workflows',
        'Strong analytical thinking and academic curiosity',
        'Undergrad or Postgrad students in STEM'
      ]
    },
    {
      id: 'opp_3',
      title: 'Campus Growth Lead & Community Ambassador',
      company: 'Fintech Spark India',
      companyLogo: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Delhi-NCR / Remote',
      workMode: 'Remote',
      type: 'Part-time',
      stipend: 12000,
      stipendFormatted: '₹12,000 / mo + incentives',
      duration: '2 Months',
      weeklyHours: '10 hrs/week',
      openings: 5,
      applicantsCount: 18,
      deadline: '2026-12-20',
      featured: false,
      category: 'Marketing & Community',
      tags: ['Community', 'Social Media', 'Event Organizing', 'Networking'],
      description: 'Represent India’s fastest-growing student fintech community on campus. Organize peer workshops, host demo sessions, and lead peer activations.',
      requirements: [
        'Excellent verbal communication and campus club leadership',
        'Active on campus student groups and tech societies',
        'Self-starter with passion for financial literacy'
      ]
    },
    {
      id: 'opp_4',
      title: 'UI/UX Product Design Fellow',
      company: 'DesignSphere Studio',
      companyLogo: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Bengaluru / Remote',
      workMode: 'Remote',
      type: 'Internship',
      stipend: 20000,
      stipendFormatted: '₹20,000 / mo',
      duration: '3 Months',
      weeklyHours: '20 hrs/week',
      openings: 2,
      applicantsCount: 33,
      deadline: '2026-12-10',
      featured: true,
      category: 'Design & Creative',
      tags: ['Figma', 'User Research', 'Design Systems', 'Wireframing'],
      description: 'Craft elegant mobile and web product experiences. Collaborate directly with product managers to conduct student usability tests and build design systems.',
      requirements: [
        'Solid Figma portfolio demonstrating mobile-first UI patterns',
        'Understanding of typography, WCAG accessibility, and visual rhythm',
        'Curiosity to solve high-friction user journeys'
      ]
    },
    {
      id: 'opp_5',
      title: 'Backend API Developer (Node.js & Postgres)',
      company: 'EduNex Systems',
      companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Pune / Remote',
      workMode: 'Remote',
      type: 'Internship',
      stipend: 25000,
      stipendFormatted: '₹25,000 / mo',
      duration: '4 Months',
      weeklyHours: '25 hrs/week',
      openings: 2,
      applicantsCount: 29,
      deadline: '2026-12-18',
      featured: false,
      category: 'Software Engineering',
      tags: ['Node.js', 'Express', 'PostgreSQL', 'REST API', 'Redis'],
      description: 'Develop high-throughput RESTful endpoints and microservices handling student registration and live event streaming pipelines.',
      requirements: [
        'Experience building server-side applications in Node.js or Python',
        'Understanding of relational databases, indexing, and SQL queries',
        'Familiarity with Postman and API documentation'
      ]
    }
  ],

  tickets: [
    {
      id: 'cf_101',
      title: 'Hostel Block C 3rd Floor Wi-Fi Router Down',
      category: 'Wi-Fi & IT',
      block: 'Hostel Block C, Room 301-320',
      campus: 'North Campus',
      priority: 'High',
      status: 'In Progress',
      upvotes: 42,
      hasUpvoted: true,
      reporterName: 'Aryan Sharma',
      description: 'The corridor access point in Wing 3 keeps rebooting every 10 minutes. Students preparing for semester midterms cannot connect to the college portal or attend online labs.',
      assignedTo: 'Campus IT Network Team (Naveen Kumar)',
      eta: 'Today by 4:00 PM',
      timeline: [
        { stage: 'Reported', note: 'Issue ticket submitted with 18 initial upvotes.' },
        { stage: 'In Progress', note: 'Technician on-site replacing PoE adapter.' }
      ]
    },
    {
      id: 'cf_102',
      title: 'Library Reading Hall 2 AC Failure',
      category: 'Electrical & HVAC',
      block: 'Central Library, 1st Floor East',
      campus: 'Main Academic Area',
      priority: 'Medium',
      status: 'Assigned',
      upvotes: 28,
      hasUpvoted: false,
      reporterName: 'Priya Verma',
      description: 'The split AC unit on the quiet reading hall has ceased cooling and makes a loud rattling sound. Room temperature is exceeding 32C during afternoon study hours.',
      assignedTo: 'Voltas Facility Maintenance Contractor',
      eta: 'Tomorrow 11:00 AM',
      timeline: [
        { stage: 'Assigned', note: 'Work order #VLT-449 issued.' }
      ]
    },
    {
      id: 'cf_103',
      title: 'Main Academic Block Water Cooler Filter Overflow',
      category: 'Water & Hygiene',
      block: 'Academic Block A, Ground Floor Near Gate 2',
      campus: 'North Wing',
      priority: 'Urgent',
      status: 'Resolved',
      upvotes: 56,
      hasUpvoted: true,
      reporterName: 'Anonymous Student',
      description: 'Water filtration drainage line cracked; clean drinking water is leaking across the main corridor, creating a slip hazard for morning lectures.',
      assignedTo: 'Plumbing & Sanitation Dept',
      timeline: [
        { stage: 'Resolved', note: 'Sign-off complete with estate inspection.' }
      ]
    }
  ],

  services: [
    {
      id: 'srv_1',
      name: 'QuickPrint Hub & Binding Solutions',
      category: 'Printing & Stationery',
      rating: 4.8,
      reviewsCount: 142,
      distance: '50m from Main Gate 1',
      phone: '+91 98711 00221',
      whatsapp: '919871100221',
      discountBadge: '20% OFF on B.Tech & Thesis Binding',
      hours: '8:00 AM - 10:00 PM',
      description: 'Fast high-volume laser printing, color plots, hardcover thesis binding, project report formatting, and spiral notebooks at subsidized student pricing.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'srv_2',
      name: 'Campus Tiffin & Healthy Mess Express',
      category: 'Food & Tiffin',
      rating: 4.7,
      reviewsCount: 98,
      distance: '120m from North Gate',
      phone: '+91 98102 33445',
      whatsapp: '919810233445',
      discountBadge: 'Flat ₹300 OFF on Monthly Subscription',
      hours: '7:30 AM - 11:00 PM',
      description: 'Hygienic, low-oil North and South Indian thalis. Daily hostel delivery available for lunch and dinner with customizable diet options.',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'srv_3',
      name: 'TechDoctor Laptop & Gadget Repair',
      category: 'Laptop & Electronics Repair',
      rating: 4.9,
      reviewsCount: 215,
      distance: '200m near Metro Station',
      phone: '+91 98991 77889',
      whatsapp: '919899177889',
      discountBadge: 'FREE Diagnostic Check + 15% Student Discount',
      hours: '10:00 AM - 9:00 PM',
      description: 'Certified repair technicians for MacBooks, Dell, HP, Lenovo. Screen replacement, SSD upgrades, thermal repasting, and liquid damage recovery.',
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'
    }
  ],

  events: [
    {
      id: 'evt_1',
      title: 'DTU Sprint National Hackathon 2026',
      category: 'Hackathon',
      organizer: 'IEEE & ACM Student Chapter',
      date: 'Dec 12 - Dec 14, 2026',
      time: '36 Hours Non-stop',
      venue: 'Dr. B.R. Ambedkar Auditorium & Virtual',
      prizePool: '₹1,50,000 INR',
      teamsRegistered: 124,
      bannerImage: '/assets/diverse-students.png',
      description: 'India\'s premier collegiate sprint. Build solutions addressing Smart Education, AI for Healthcare, FinTech, and Sustainable Campus Green Infrastructure.',
      isRegistered: true
    },
    {
      id: 'evt_2',
      title: 'Cracking Placement Interviews: From Campus to Tier-1 Startups',
      category: 'Placement & Career',
      organizer: 'Training & Placement Cell',
      date: 'Nov 28, 2026',
      time: '5:00 PM - 7:30 PM IST',
      venue: 'Virtual (Google Meet Live Stream)',
      prizePool: 'Certificate + Free Resume Review',
      teamsRegistered: 340,
      bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80',
      description: 'Interactive fireside chat with DTU and IIT alumni now working as Senior Software Engineers at Google, Uber, and Microsoft. Live DSA mock interview walkthrough.',
      isRegistered: false
    }
  ]
};

window.FALLBACK_DATA = FALLBACK_DATA;
