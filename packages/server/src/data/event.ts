import Event, { IEvent, EventDocument } from "../models/Event";

const DALEvent = {
  getEvent: async (id: string): Promise<EventDocument | null> => {
    return await Event.findById(id);
  },
  create: async (event: IEvent): Promise<EventDocument> => {
    return await Event.create(event);
  },
  update: async (id: string, event: IEvent): Promise<EventDocument | null> => {
    return await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
  },
  delete: async (id: string): Promise<EventDocument | null> => {
    return await Event.findByIdAndRemove(id);
  },
  getEventsByPhotographer: async (photographerId: string): Promise<EventDocument[]> => {
    return await Event.find({
      photographer: photographerId,
    });
  },
  getEventsByRegionAndDate: async (region: string, date: Date): Promise<EventDocument[]> => {
    return await Event.find({
      region,
      date,
    });
  },
  getEventsByRegion: async (region: string): Promise<EventDocument[]> => {
    return await Event.find({
      region,
    });
  },
};

export default DALEvent;
