export interface RegisterMentor {
  email: string;
  name: string;
  lastName: string;
  password: string;
  birthDate: string;
  socialMedias: string;
  description: string;
  state: string;
  nationality: string;
  token: string;
}

export interface CreateLesson {
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  mentorId: string;
  presentCode: string;
  maxGuest: number;
  additionalLinks?: string[];
}

export interface MentorId {
  mentorId: string;
}

export interface PaginatedLeasonListResponse {
  content: LeasonListResponse[];
  size: number;
  total: number;
  totalPages: number;
  currentPage: number;
  nextPage: string | null;
  previousPage: string | null;
}

export interface LeasonListResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  maxGuest: number;
  mentorName: string;
}

export interface LeasonDetailsResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  presentCode: string;
  endTime: string;
  mentorName: string;
  additionalLinks?: string[];
  maxGuest: number;
  link: string;
  presentCodeFilled: boolean;
  mentorId: string;
}

export interface MentorFeedback {
  id?: string;
  mentoredId: string;
  didactics: number;
  subjectMastery: number;
  punctuality: number;
  communication: number;
  engagement: number;
  feedback: string;
}

export interface MentorProfile {
  id: string;
  name: string;
  state: string;
  nationality: string;
  linkedin: string;
  description: string;
}
