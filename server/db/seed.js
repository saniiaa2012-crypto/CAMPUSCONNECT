const bcrypt = require('bcryptjs');
const {
  usersDB,
  opportunitiesDB,
  applicationsDB,
  ticketsDB,
  servicesDB,
  eventsDB,
  announcementsDB
} = require('./database');

async function seedDatabase(force = false) {
  const existingUsers = usersDB.read();
  if (existingUsers.length > 0 && !force) {
    console.log('Database already populated. Skipping seed.');
    return;
  }

  console.log('Seeding initial CampusConnect data...');
  const salt = bcrypt.genSaltSync(10);
  const defaultPasswordHash = bcrypt.hashSync('password123', salt);

  // 1. SEED USERS (Personas from PRD)
  const users = [
    {
      id: 'usr_student_1',
      name: 'Aryan Sharma',
      email: 'aryan@campusconnect.edu',
      password: defaultPasswordHash,
      role: 'student', // student, faculty, recruiter
      college: 'Delhi Technological University (DTU)',
      department: 'Computer Science & Engineering',
      graduationYear: 2027,
      phone: '+91 98765 43210',
      avatar: '/assets/student-portrait.png',
      bio: 'Pre-final year CSE student passionate about React, Node.js, and Open Source.',
      skills: ['React', 'JavaScript', 'Node.js', 'Tailwind CSS', 'Git', 'Problem Solving'],
      resumeUrl: 'https://example.com/aryan_resume.pdf',
      profileStrength: 85,
      createdAt: '2026-10-01T10:00:00.000Z'
    },
    {
      id: 'usr_faculty_1',
      name: 'Prof. Ananya Iyer',
      email: 'ananya.iyer@campusconnect.edu',
      password: defaultPasswordHash,
      role: 'faculty',
      college: 'Delhi Technological University (DTU)',
      department: 'Dean of Student Welfare & Facilities',
      phone: '+91 98111 22334',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
      bio: 'Overseeing campus civic welfare, infrastructure upkeep, and student grievance resolutions.',
      createdAt: '2026-09-15T08:30:00.000Z'
    },
    {
      id: 'usr_recruiter_1',
      name: 'Rohan Mehta',
      email: 'rohan@gurugramtech.in',
      password: defaultPasswordHash,
      role: 'recruiter',
      company: 'Gurugram Tech & Local Hubs',
      designation: 'Founder & Hiring Lead',
      phone: '+91 99222 33445',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
      bio: 'Bridging tier 1-3 college talent with funded startups and tech ecosystems across NCR.',
      createdAt: '2026-09-20T11:00:00.000Z'
    }
  ];
  usersDB.writeAtomic(users);

  // 2. SEED OPPORTUNITIES
  const opportunities = [
    {
      id: 'opp_1',
      title: 'React & Frontend Developer Intern',
      company: 'Gurugram Tech Innovations',
      companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      verified: true,
      location: 'Gurugram / Hybrid',
      workMode: 'Hybrid', // Remote, Hybrid, On-site
      type: 'Internship', // Internship, Part-time, Project
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
      ],
      postedBy: 'usr_recruiter_1',
      createdAt: '2026-10-15T12:00:00.000Z'
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
      ],
      postedBy: 'usr_faculty_1',
      createdAt: '2026-10-18T09:30:00.000Z'
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
      ],
      postedBy: 'usr_recruiter_1',
      createdAt: '2026-10-22T14:15:00.000Z'
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
      ],
      postedBy: 'usr_recruiter_1',
      createdAt: '2026-10-25T11:45:00.000Z'
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
      ],
      postedBy: 'usr_recruiter_1',
      createdAt: '2026-10-28T16:00:00.000Z'
    }
  ];
  opportunitiesDB.writeAtomic(opportunities);

  // 3. SEED APPLICATIONS
  const applications = [
    {
      id: 'app_1',
      opportunityId: 'opp_1',
      opportunityTitle: 'React & Frontend Developer Intern',
      company: 'Gurugram Tech Innovations',
      studentId: 'usr_student_1',
      studentName: 'Aryan Sharma',
      studentEmail: 'aryan@campusconnect.edu',
      status: 'Shortlisted', // Applied, Viewed, Shortlisted, Interview, Offer, Rejected
      stageIndex: 2, // 0: Applied, 1: Viewed, 2: Shortlisted, 3: Interview, 4: Offer
      stipendFormatted: '₹18,000 / mo',
      appliedAt: '2026-10-17T15:20:00.000Z',
      coverNote: 'Excited about building responsive student web apps. Built 3 full-stack React projects on my GitHub.',
      portfolioUrl: 'https://github.com/aryan-dev',
      feedback: 'Strong portfolio projects. Shortlisted for technical round.'
    },
    {
      id: 'app_2',
      opportunityId: 'opp_2',
      opportunityTitle: 'AI & Data Research Assistant',
      company: 'DTU Advanced AI & Robotics Lab',
      studentId: 'usr_student_1',
      studentName: 'Aryan Sharma',
      studentEmail: 'aryan@campusconnect.edu',
      status: 'Interview',
      stageIndex: 3,
      stipendFormatted: '₹22,000 / mo',
      appliedAt: '2026-10-20T10:10:00.000Z',
      coverNote: 'Interested in AI reasoning and benchmark evaluation.',
      portfolioUrl: 'https://github.com/aryan-dev',
      interviewDate: '2026-11-25 14:00 IST',
      feedback: 'Panel interview scheduled at Lab 4B.'
    },
    {
      id: 'app_3',
      opportunityId: 'opp_4',
      opportunityTitle: 'UI/UX Product Design Fellow',
      company: 'DesignSphere Studio',
      studentId: 'usr_student_1',
      studentName: 'Aryan Sharma',
      studentEmail: 'aryan@campusconnect.edu',
      status: 'Applied',
      stageIndex: 0,
      stipendFormatted: '₹20,000 / mo',
      appliedAt: '2026-11-01T09:00:00.000Z',
      coverNote: 'Keen to contribute to Figma component libraries and accessible design.',
      portfolioUrl: 'https://behance.net/aryan-design'
    }
  ];
  applicationsDB.writeAtomic(applications);

  // 4. SEED CAMPUSFIX TICKETS (Civic Problem Solver)
  const tickets = [
    {
      id: 'cf_101',
      title: 'Hostel Block C 3rd Floor Wi-Fi Router Down',
      category: 'Wi-Fi & IT',
      block: 'Hostel Block C, Room 301-320',
      campus: 'North Campus',
      priority: 'High', // Low, Medium, High, Urgent
      status: 'In Progress', // Reported, Under Review, Assigned, In Progress, Resolved
      statusIndex: 3,
      upvotes: 42,
      upvotedBy: ['usr_student_1'],
      reportedBy: 'usr_student_1',
      reporterName: 'Aryan Sharma',
      isAnonymous: false,
      description: 'The corridor access point in Wing 3 keeps rebooting every 10 minutes. Students preparing for semester midterms cannot connect to the college portal or attend online labs.',
      photoUrl: '/assets/campus-building.png',
      assignedTo: 'Campus IT Network Team (Naveen Kumar)',
      eta: 'Today by 4:00 PM',
      timeline: [
        { stage: 'Reported', timestamp: '2026-11-19T09:30:00.000Z', note: 'Issue ticket submitted with 18 initial upvotes.' },
        { stage: 'Under Review', timestamp: '2026-11-19T10:15:00.000Z', note: 'Validated by Facilities Desk. SLA target: 6 hours.' },
        { stage: 'Assigned', timestamp: '2026-11-19T11:00:00.000Z', note: 'Dispatched to Campus Network Engineer Naveen Kumar.' },
        { stage: 'In Progress', timestamp: '2026-11-19T12:30:00.000Z', note: 'Technician on-site. Replacing faulty PoE switch adapter.' }
      ],
      createdAt: '2026-11-19T09:30:00.000Z'
    },
    {
      id: 'cf_102',
      title: 'Library Reading Hall 2 AC Failure',
      category: 'Electrical & HVAC',
      block: 'Central Library, 1st Floor East',
      campus: 'Main Academic Area',
      priority: 'Medium',
      status: 'Assigned',
      statusIndex: 2,
      upvotes: 28,
      upvotedBy: [],
      reportedBy: 'usr_student_2',
      reporterName: 'Priya Verma',
      isAnonymous: false,
      description: 'The split AC unit on the quiet reading hall has ceased cooling and makes a loud rattling sound. Room temperature is exceeding 32C during afternoon study hours.',
      photoUrl: '',
      assignedTo: 'Voltas Facility Maintenance Contractor',
      eta: 'Tomorrow 11:00 AM',
      timeline: [
        { stage: 'Reported', timestamp: '2026-11-18T14:00:00.000Z', note: 'Reported by library patrons.' },
        { stage: 'Under Review', timestamp: '2026-11-18T16:00:00.000Z', note: 'Inspected by Assistant Estate Officer.' },
        { stage: 'Assigned', timestamp: '2026-11-19T09:00:00.000Z', note: 'Work order #VLT-449 issued for compressor inspection.' }
      ],
      createdAt: '2026-11-18T14:00:00.000Z'
    },
    {
      id: 'cf_103',
      title: 'Main Academic Block Water Cooler Filter Overflow',
      category: 'Water & Hygiene',
      block: 'Academic Block A, Ground Floor Near Gate 2',
      campus: 'North Wing',
      priority: 'Urgent',
      status: 'Resolved',
      statusIndex: 4,
      upvotes: 56,
      upvotedBy: ['usr_student_1'],
      reportedBy: 'usr_student_3',
      reporterName: 'Anonymous Student',
      isAnonymous: true,
      description: 'Water filtration drainage line cracked; clean drinking water is leaking across the main corridor, creating a slip hazard for morning lectures.',
      photoUrl: '',
      assignedTo: 'Plumbing & Sanitation Dept',
      resolutionProof: 'Replaced drain piping and calibrated UV filter. Water pressure normalized.',
      resolvedAt: '2026-11-17T16:45:00.000Z',
      timeline: [
        { stage: 'Reported', timestamp: '2026-11-17T08:15:00.000Z', note: 'Reported as urgent slip risk.' },
        { stage: 'Under Review', timestamp: '2026-11-17T08:45:00.000Z', note: 'Priority escalated to Urgent.' },
        { stage: 'Assigned', timestamp: '2026-11-17T09:10:00.000Z', note: 'Assigned to On-duty Plumber.' },
        { stage: 'In Progress', timestamp: '2026-11-17T11:00:00.000Z', note: 'Repair underway.' },
        { stage: 'Resolved', timestamp: '2026-11-17T16:45:00.000Z', note: 'Sign-off complete with estate inspection.' }
      ],
      createdAt: '2026-11-17T08:15:00.000Z'
    },
    {
      id: 'cf_104',
      title: 'Seminar Hall 4 Projector HDMI Cable Damaged',
      category: 'Classroom Infra',
      block: 'Lecture Complex B, Hall 4',
      campus: 'Main Academic Area',
      priority: 'Low',
      status: 'Under Review',
      statusIndex: 1,
      upvotes: 14,
      upvotedBy: [],
      reportedBy: 'usr_student_1',
      reporterName: 'Aryan Sharma',
      isAnonymous: false,
      description: 'The ceiling mount HDMI cable head is bent and flickers intermittently during club presentations and lab lectures.',
      photoUrl: '',
      timeline: [
        { stage: 'Reported', timestamp: '2026-11-20T11:20:00.000Z', note: 'Logged by student club organizers.' },
        { stage: 'Under Review', timestamp: '2026-11-20T13:00:00.000Z', note: 'Audio-Visual desk evaluating replacement cable stock.' }
      ],
      createdAt: '2026-11-20T11:20:00.000Z'
    }
  ];
  ticketsDB.writeAtomic(tickets);

  // 5. SEED CAMPUS SERVICES DIRECTORY
  const services = [
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
      address: 'Shop 4, University Commercial Complex, Gate 1',
      featured: true,
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
      address: 'Plot 12, Student Colony Road',
      featured: true,
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
      address: 'Metro Pillar 142, Main Road',
      featured: true,
      image: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'srv_4',
      name: 'Scholar\'s Haven Premium PG & Co-Living',
      category: 'PG & Accommodation',
      rating: 4.6,
      reviewsCount: 76,
      distance: '350m from Campus Boundary',
      phone: '+91 98334 55667',
      whatsapp: '919833455667',
      discountBadge: 'Zero Brokerage + 5% Semester Discount',
      hours: '24/7 Desk',
      description: 'Fully furnished AC rooms, 300 Mbps fiber Wi-Fi, 3 daily meals, bi-weekly housekeeping, power backup, and CCTV security.',
      address: 'Shanti Kunj, Sector 15',
      featured: false,
      image: 'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=500&auto=format&fit=crop&q=80'
    }
  ];
  servicesDB.writeAtomic(services);

  // 6. SEED EVENTS & HACKATHONS
  const events = [
    {
      id: 'evt_1',
      title: 'DTU Sprint National Hackathon 2026',
      category: 'Hackathon',
      organizer: 'IEEE & ACM Student Chapter',
      date: 'Dec 12 - Dec 14, 2026',
      time: '36 Hours Non-stop',
      venue: 'Dr. B.R. Ambedkar Auditorium & Virtual',
      mode: 'Hybrid',
      prizePool: '₹1,50,000 INR',
      teamsRegistered: 124,
      maxTeams: 200,
      bannerImage: '/assets/diverse-students.png',
      description: 'India\'s premier collegiate sprint. Build solutions addressing Smart Education, AI for Healthcare, FinTech, and Sustainable Campus Green Infrastructure.',
      registeredUsers: ['usr_student_1'],
      tags: ['Hackathon', 'Cash Prize', 'Goodies', 'Mentorship']
    },
    {
      id: 'evt_2',
      title: 'Cracking Placement Interviews: From Campus to Tier-1 Startups',
      category: 'Placement & Career',
      organizer: 'Training & Placement Cell',
      date: 'Nov 28, 2026',
      time: '5:00 PM - 7:30 PM IST',
      venue: 'Virtual (Google Meet Live Stream)',
      mode: 'Online',
      prizePool: 'Certificate + Free Resume Review',
      teamsRegistered: 340,
      maxTeams: 500,
      bannerImage: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=80',
      description: 'Interactive fireside chat with DTU and IIT alumni now working as Senior Software Engineers at Google, Uber, and Microsoft. Live DSA mock interview walkthrough.',
      registeredUsers: ['usr_student_1'],
      tags: ['Interview Prep', 'Alumni', 'Career Advice']
    },
    {
      id: 'evt_3',
      title: 'Campus Pitch Fest: Student Founders & Angel Investors',
      category: 'Entrepreneurship',
      organizer: 'E-Cell Innovation Incubator',
      date: 'Dec 05, 2026',
      time: '10:00 AM - 4:00 PM IST',
      venue: 'Convention Center Hall 1',
      mode: 'In-Person',
      prizePool: '₹5,00,000 Seed Grant Pool',
      teamsRegistered: 38,
      maxTeams: 50,
      bannerImage: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=500&auto=format&fit=crop&q=80',
      description: 'Showcase your prototype to prominent angel syndicates, venture partners, and successful student startup alumni. Get direct grant funding and incubation support.',
      registeredUsers: [],
      tags: ['Pitching', 'Funding', 'Startup']
    }
  ];
  eventsDB.writeAtomic(events);

  // 7. SEED ANNOUNCEMENTS
  const announcements = [
    {
      id: 'anc_1',
      title: 'CampusFix Winter Maintenance Drive Scheduled',
      author: 'Prof. Ananya Iyer (Dean of Student Welfare)',
      date: '2026-11-20',
      content: 'Routine HVAC servicing and high-speed Wi-Fi router firmware upgrades will take place across all academic blocks this coming weekend.'
    },
    {
      id: 'anc_2',
      title: 'Pre-Placement Drive Registrations Now Open for 2027 Batch',
      author: 'Placement & Industry Liaison Cell',
      date: '2026-11-18',
      content: 'All 6th semester eligible students must verify their college roll numbers, CGPA, and resume link on the CampusConnect student dashboard.'
    }
  ];
  announcementsDB.writeAtomic(announcements);

  console.log('CampusConnect database seeded successfully!');
}

module.exports = { seedDatabase };
