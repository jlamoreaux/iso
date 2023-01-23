// eventComment data service

import logger from "../utils/logger";
import EventComment, { EventCommentDocument, IEventComment } from "../models/EventComment";

export const DALEventComment = {
  create: async ({
    text,
    photographer,
    event,
  }: Pick<IEventComment, "text" | "photographer" | "event">): Promise<EventCommentDocument> => {
    const eventComment = new EventComment({
      text,
      photographer,
      event,
    });
    await eventComment.save();
    logger.info("Comment successfully created", { text, photographer, event });
    return eventComment;
  },
  update: async (id: string, eventComment: IEventComment): Promise<EventCommentDocument | null> => {
    return await EventComment.findByIdAndUpdate(id, eventComment, {
      new: true,
    });
  },
  delete: async (id: string): Promise<EventCommentDocument | null> => {
    return await EventComment.findByIdAndUpdate(id, { deleted: true }, { new: true });
  },
  findByEventId: async (eventId: string): Promise<EventCommentDocument[]> => {
    return await EventComment.find({ event: eventId });
  },
};
