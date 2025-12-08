export interface CountMentors {
  mentors?: number | null;
}

export interface CountMentoreds {
  mentoreds?: number | null;
}

export interface CountLessons {
  countUpcomingLessons?: number | null;
  countUnavailableLessons?: number | null;
}

export interface CountStateList {
  total: CountState[];
}
export interface CountState {
  state: string;
  totalRegistered: number;
}
