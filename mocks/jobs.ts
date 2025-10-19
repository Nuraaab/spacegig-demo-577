export type JobType = 'full-time' | 'part-time' | 'contract' | 'internship';
export type PayCadence = 'hour' | 'week' | 'month' | 'year';
export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'temporary' | 'internship';
export type Modality = 'onsite' | 'remote' | 'hybrid';
export type Seniority = 'intern' | 'junior' | 'mid' | 'senior' | 'lead';

export interface JobOpening {
  id?: string;
  company: {
    name: string;
    logoUrl?: string;
    contactName: string;
    contactEmail: string;
    contactPhone?: string;
    website?: string;
  };
  role: {
    title: string;
    category: string;
    seniority: Seniority;
    type: EmploymentType;
    description: string;
  };
  location: {
    modality: Modality;
    primary?: string;
    regions?: string[];
    schedule?: { days: string[]; start?: string; end?: string; weekends?: boolean };
  };
  compensation: {
    currency: string;
    payType: 'hourly' | 'salary';
    min: number;
    max: number;
    cadence: PayCadence;
    benefits?: string[];
    equity?: string;
  };
  requirements: {
    years?: string;
    mustHave: string[];
    niceToHave?: string[];
    certifications?: string[];
    authRequired?: boolean;
  };
  screening: {
    method: 'in_app' | 'external' | 'email';
    externalUrl?: string;
    email?: string;
    questions?: { id: string; type: 'short' | 'mc' | 'yn'; prompt: string; options?: string[] }[];
    resumeRequired?: boolean;
    quickApply?: boolean;
  };
  timestamps?: { createdAt: string; updatedAt: string };
  status?: 'draft' | 'published';
  images?: string[];
  featured?: boolean;
}

export type BoostTier = 'none' | 'basic' | 'featured' | 'premium';

export interface BoostDetails {
  tier: BoostTier;
  startDate?: string;
  endDate?: string;
  impressions?: number;
  views?: number;
  cost?: number;
}

export interface Job {
  id: string;
  title: string;
  company: string;
  description: string;
  salary: {
    min: number;
    max: number;
  };
  jobType: JobType;
  location: {
    city: string;
    state: string;
    country: string;
    remote: boolean;
  };
  requirements: string[];
  benefits: string[];
  images: string[];
  featured: boolean;
  boost?: BoostDetails;
  ownerId?: string;
}

export const mockJobs: Job[] = [
  {
    id: '1',
    title: 'Senior Software Engineer',
    company: 'TechCorp Inc.',
    description: 'We are looking for an experienced Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable web applications using modern technologies.',
    salary: {
      min: 120000,
      max: 180000,
    },
    jobType: 'full-time',
    location: {
      city: 'San Francisco',
      state: 'CA',
      country: 'United States',
      remote: true,
    },
    requirements: [
      '5+ years of software development experience',
      'Strong knowledge of React, Node.js, and TypeScript',
      'Experience with cloud platforms (AWS, GCP, or Azure)',
      'Excellent problem-solving skills',
    ],
    benefits: [
      'Health insurance',
      '401(k) matching',
      'Remote work',
      'Flexible hours',
      'Professional development budget',
    ],
    images: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
    ],
    featured: true,
  },
  {
    id: '2',
    title: 'Product Designer',
    company: 'Design Studio',
    description: 'Join our creative team as a Product Designer. You will work on exciting projects for top-tier clients, creating beautiful and functional user experiences.',
    salary: {
      min: 90000,
      max: 130000,
    },
    jobType: 'full-time',
    location: {
      city: 'New York',
      state: 'NY',
      country: 'United States',
      remote: false,
    },
    requirements: [
      '3+ years of product design experience',
      'Proficiency in Figma and Adobe Creative Suite',
      'Strong portfolio demonstrating UX/UI skills',
      'Experience with design systems',
    ],
    benefits: [
      'Health insurance',
      'Dental and vision',
      'Gym membership',
      'Creative workspace',
      'Team outings',
    ],
    images: [
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=800',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800',
    ],
    featured: true,
  },
  {
    id: '3',
    title: 'Marketing Manager',
    company: 'Growth Marketing Co.',
    description: 'We are seeking a talented Marketing Manager to lead our marketing initiatives and drive growth. You will develop and execute marketing strategies across multiple channels.',
    salary: {
      min: 80000,
      max: 110000,
    },
    jobType: 'full-time',
    location: {
      city: 'Austin',
      state: 'TX',
      country: 'United States',
      remote: true,
    },
    requirements: [
      '4+ years of marketing experience',
      'Strong analytical and strategic thinking skills',
      'Experience with digital marketing tools',
      'Excellent communication skills',
    ],
    benefits: [
      'Health insurance',
      'Remote work',
      'Unlimited PTO',
      'Stock options',
      'Professional development',
    ],
    images: [
      'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800',
      'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=800',
    ],
    featured: false,
  },
  {
    id: '4',
    title: 'Data Scientist',
    company: 'AI Innovations',
    description: 'Join our data science team to work on cutting-edge machine learning projects. You will analyze large datasets and build predictive models to solve complex business problems.',
    salary: {
      min: 130000,
      max: 170000,
    },
    jobType: 'full-time',
    location: {
      city: 'Seattle',
      state: 'WA',
      country: 'United States',
      remote: true,
    },
    requirements: [
      'PhD or Masters in Computer Science, Statistics, or related field',
      'Strong programming skills in Python and R',
      'Experience with ML frameworks (TensorFlow, PyTorch)',
      'Excellent analytical skills',
    ],
    benefits: [
      'Health insurance',
      'Remote work',
      '401(k) matching',
      'Learning budget',
      'Conference attendance',
    ],
    images: [
      'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
    ],
    featured: true,
  },
  {
    id: '5',
    title: 'Customer Success Manager',
    company: 'SaaS Solutions',
    description: 'We are looking for a Customer Success Manager to ensure our clients achieve their goals using our platform. You will build strong relationships and drive customer satisfaction.',
    salary: {
      min: 70000,
      max: 95000,
    },
    jobType: 'full-time',
    location: {
      city: 'Boston',
      state: 'MA',
      country: 'United States',
      remote: false,
    },
    requirements: [
      '2+ years of customer success experience',
      'Strong interpersonal skills',
      'Experience with CRM tools',
      'Problem-solving mindset',
    ],
    benefits: [
      'Health insurance',
      'Dental and vision',
      'Commuter benefits',
      'Team events',
      'Career growth opportunities',
    ],
    images: [
      'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=800',
      'https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?w=800',
    ],
    featured: false,
  },
];

export const JOB_CATEGORIES = [
  'Engineering',
  'Design',
  'Product',
  'Marketing',
  'Sales',
  'Operations',
  'Customer Success',
  'Finance',
  'Human Resources',
  'Legal',
  'Other',
];

export const COMMON_BENEFITS = [
  'Health insurance',
  'Dental insurance',
  'Vision insurance',
  '401(k) matching',
  'Remote work',
  'Flexible hours',
  'Unlimited PTO',
  'Paid time off',
  'Professional development',
  'Stock options',
  'Gym membership',
  'Commuter benefits',
  'Equipment stipend',
  'Home office budget',
  'Parental leave',
  'Mental health support',
];
