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
  role: string;
  token: string;
}

export interface CreateLeason {
  title: string;
  description: string;
  date: string;
  initialTime: string;
  finalTime: string;
  mentorId: string;
}

export interface MentorId {
  mentorId: string;
}

export interface LeasonListResponse {
  id: string;
  title: string;
  description: string;
  date: string;
  initialTime: string;
  finalTime: string;
}
