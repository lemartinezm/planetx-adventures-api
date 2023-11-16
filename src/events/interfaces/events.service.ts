import { PaginatedResponse } from 'src/interfaces/response.interface';
import { event as EventModel, user as UserModel } from '@prisma/client';

export interface FindAllQueryParams {
  page: number;
  elementsPerPage: number;
}

export type FindAllResponse = PaginatedResponse<
  Array<
    Omit<EventModel, 'created_by' | 'created_at'> & {
      user: Pick<UserModel, 'id' | 'email'>;
      count: {
        eventLikes: number;
        eventViews: number;
        votes: number;
      };
    }
  >
>;

export interface LikeEventParams {
  eventId: number;
  userId: number;
}

export interface CommentEventParams {
  eventId: number;
  userId: number;
  comment: string;
}

export interface VoteEventParams {
  eventId: number;
  userId: number;
  vote: number;
}
