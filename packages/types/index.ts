export interface UserSession {
  userId: string;
  email: string;
  role: 'ATTENDEE' | 'ORGANIZER' | 'ADMIN';
}

export interface EventMetadata {
  eventId: string;
  organizerId: string;
  title: string;
  venueName: string;
  startTime: string;
  endTime: string;
  isPublished: boolean;
}
