export const siteConfig = {
  name: "Ileana Temer",
  headline:
    "Computer Science Student | Full-Stack Developer | Software Engineering Fellow",
  intro:
    "I am a Computer Science student at CUNY Brooklyn College passionate about full-stack software engineering, building modern web applications, and creating polished user-focused digital experiences.",
  about:
    "I am a Computer Science student at CUNY Brooklyn College focused on full-stack software engineering. Through CUNY Tech Prep, Girls Who Code, and hands-on software projects, I've developed experience building web applications using React, TypeScript, Node.js, Express, FastAPI, and MongoDB. I enjoy taking ideas from concept to reality by building applications that are both polished for users and functional behind the scenes.",
  email: "ileanatemer@gmail.com",
  location: "New York, NY",
  resumePath: "/resume.pdf",
  social: {
    github: "https://github.com/ileanat",
    linkedin: "https://linkedin.com/in/ileana-temer",
  },
} as const;

export const navLinks = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Resume", href: "#resume" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
] as const;

export const skillCategories = [
  {
    label: "Languages",
    skills: ["Java", "JavaScript", "TypeScript", "C++"],
  },
  {
    label: "Frameworks & Tools",
    skills: [
      "React",
      "Node.js",
      "Express",
      "FastAPI",
      "MongoDB",
      "Git",
      "GitHub",
      "Tailwind CSS",
    ],
  },
  {
    label: "Other",
    skills: ["Microsoft Office", "Google Suite", "Russian Reading & Writing"],
  },
] as const;

export const experience = [
  {
    role: "Peer Tutor",
    company: "Brooklyn College SEEK",
    period: "March 2026 — Present",
    highlights: [
      "Provide individualized tutoring to students in Microsoft Office (Word, Excel, PowerPoint)",
      "Assist with assignments, projects, documents, spreadsheets, and presentations",
      "Simplify technical concepts for varying skill levels",
    ],
  },
  {
    role: "Club Connector",
    company: "Girls Who Code College Loop",
    period: "January 2026 — Present",
    highlights: [
      "Facilitated 15+ technical workshops",
      "Supported an inclusive learning community for 100+ women and non-binary students",
      "Coordinated outreach and digital marketing",
      "Increased member engagement by 45%",
    ],
  },
  {
    role: "Software Engineering Fellow",
    company: "CUNY Tech Prep",
    period: "July 2025 — Present",
    highlights: [
      "Built full-stack applications using React, Node.js, Express, and MongoDB",
      "Applied modern software engineering best practices",
    ],
  },
  {
    role: "Receptionist",
    company: "Oleg Katcher, MD",
    period: "July 2021 — Present",
    highlights: [
      "Managed 500+ patient records using Excel and eClinicalWorks",
      "Digitized 1,000+ patient files",
      "Improved retrieval efficiency by 40%",
      "Coordinated 30–80 daily patient interactions",
    ],
  },
] as const;

export const education = [
  {
    school: "CUNY Brooklyn College",
    degree: "Bachelor of Science in Computer Science",
    period: "Graduating May 2026",
    gpa: "3.4/4.0",
    honors: ["Dean's List (3x)"],
    coursework: [
      "Data Structures",
      "Algorithms",
      "Database Systems",
      "Operating Systems",
      "Computer Architecture",
      "Multimedia Computing",
      "Discrete Structures",
      "C++",
    ],
  },
] as const;

export const projects = [
  {
    title: "Intervue",
    description:
      "AI-powered mock interview platform that simulates realistic technical and behavioral interviews with adaptive questioning and personalized performance feedback.",
    tags: ["TypeScript", "React", "FastAPI", "MongoDB"],
    github: "https://github.com/justinyc1/intervue",
    demo: "https://www.intervue.org/",
  },
  {
    title: "ReviewRadar",
    description:
      "Full-stack review platform featuring a dynamic rating system, polished responsive UI, and collaborative development.",
    tags: ["TypeScript", "React", "Node.js", "Express.js", "MongoDB"],
    github: "https://github.com/ileanat/ReviewRadar",
    demo: "https://reviewradar-1.onrender.com/",
  },
  {
    title: "MarketHub",
    description:
      "E-commerce demo with hoverable category filtering, product generation API, and interactive search functionality.",
    tags: ["HTML", "CSS", "JavaScript", "Node.js", "Express"],
    github: null,
    demo: null,
  },
] as const;
