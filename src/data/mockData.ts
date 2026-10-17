import { Researcher, Project, NotificationItem } from "../types";

export const initialResearchers: Researcher[] = [
  {
    id: 1,
    name: "Dr. Aris Thorne",
    email: "aris.thorne@prayas.edu",
    role: "Faculty",
    department: "Computer Science & Engineering",
    designation: "Associate Professor",
    bio: "Specializes in explainable artificial intelligence, NLP, and multimodal biomedical knowledge graphs.",
    interests: ["Natural Language Processing", "Knowledge Graphs", "Healthcare AI", "Deep Learning"],
    skills: ["Python", "PyTorch", "Transformers", "Knowledge Representation", "SPARQL"]
  },
  {
    id: 2,
    name: "Dr. Kavita Raman",
    email: "kavita.raman@prayas.edu",
    role: "Faculty",
    department: "Biotechnology & Biomedical Engineering",
    designation: "Professor & Department Chair",
    bio: "Pioneering research in genomic data analytics, targeted drug discovery, and clinical trials modeling.",
    interests: ["Genomics", "Targeted Therapeutics", "Computational Biology", "Bioinformatics"],
    skills: ["Bioinformatics", "R", "Statistical Genomics", "Python", "Molecular Modeling"]
  },
  {
    id: 3,
    name: "Devansh Mehta",
    email: "devansh.m@prayas.edu",
    role: "Researcher",
    department: "Data Science & AI",
    designation: "Lead Research Fellow",
    bio: "Focuses on distributed machine learning systems, privacy-preserving federated algorithms, and edge AI.",
    interests: ["Federated Learning", "Edge Computing", "Data Security", "Optimization"],
    skills: ["Python", "C++", "Distributed Systems", "PyTorch", "Docker"]
  },
  {
    id: 4,
    name: "Ananya Sen",
    email: "ananya.sen@prayas.edu",
    role: "Student",
    department: "Electronics & Communication",
    designation: "Master's Scholar",
    bio: "Exploring IoT sensor networks for environmental monitoring, smart grids, and signal processing.",
    interests: ["IoT Sensors", "Signal Processing", "Smart Agriculture", "Embedded Systems"],
    skills: ["Embedded C", "Python", "Signal Processing", "MATLAB", "Sensor Fusion"]
  }
];

export const initialProjects: Project[] = [
  {
    id: 1,
    title: "Interdisciplinary Genomic Pattern Mining using Deep Multimodal Graphs",
    abstract: "Connecting deep language models and graph neural networks with high-throughput genomic sequencing data to identify therapeutic targets for rare genetic mutations.",
    department: "Biotechnology & Biomedical Engineering",
    lead_id: 2,
    lead_name: "Dr. Kavita Raman",
    status: "Recruiting",
    tags: ["Genomics", "Healthcare AI", "Deep Learning", "Computational Biology"],
    required_skills: ["Python", "PyTorch", "Bioinformatics", "Transformers"],
    open_positions: 2
  },
  {
    id: 2,
    title: "Privacy-Preserving Collaborative Learning for Cross-Department Health Data",
    abstract: "Developing federated learning protocols enabling secure collaborative inference between academic medical centers without raw data exposure.",
    department: "Computer Science & Engineering",
    lead_id: 1,
    lead_name: "Dr. Aris Thorne",
    status: "Recruiting",
    tags: ["Federated Learning", "Data Security", "Distributed Systems", "Optimization"],
    required_skills: ["Python", "Distributed Systems", "PyTorch", "Docker"],
    open_positions: 3
  },
  {
    id: 3,
    title: "Low-Power Autonomous Edge Sensing Nodes for Ecological Field Stations",
    abstract: "Deploying energy-harvesting mesh networks for continuous real-time biodiversity and microclimate observation across forestry reserves.",
    department: "Electronics & Communication",
    lead_id: 4,
    lead_name: "Ananya Sen",
    status: "In Progress",
    tags: ["IoT Sensors", "Smart Agriculture", "Signal Processing"],
    required_skills: ["Embedded C", "Sensor Fusion", "Python"],
    open_positions: 1
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: "notif-1",
    title: "New Interdisciplinary Match",
    message: "Dr. Kavita Raman's Genomic project matches your expertise in Transformers & PyTorch (92% match score).",
    type: "match",
    timestamp: "10 mins ago",
    read: false
  },
  {
    id: "notif-2",
    title: "Collaboration Request Received",
    message: "Devansh Mehta requested to join 'Privacy-Preserving Collaborative Learning'.",
    type: "collab",
    timestamp: "2 hours ago",
    read: false
  }
];
