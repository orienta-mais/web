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
  link: string;
}
