
export interface TeamMember {
  name: string;
  name_cn?: string; // Optional Chinese Name
  role: string;
  role_cn?: string;
  languages: string;
  languages_cn?: string;
  bio: string[];
  bio_cn?: string[]; // Optional Chinese Bio
  education: string;
  education_cn?: string;
  contact: {
    phone: string;
    email: string;
  };
  image: string;
}

export interface PracticeArea {
  id: string;
  title: string;
  title_cn?: string;
  shortDescription: string;
  shortDescription_cn?: string;
  fullContent: string[]; 
  fullContent_cn?: string[];
  image?: string; // Added image for hover effect
}

export interface Author {
  id: string;
  name: string;
  avatar: string;
  role: string;
}

export interface LegalUpdate {
  id: string;
  date: string;
  title: string;
  title_cn?: string;
  summary: string;
  summary_cn?: string;
  category?: string; // Added Category field
  content: string[]; // Added full content array
  content_cn?: string[];
  image: string;
  authorId?: string;
  author?: Author;
}
