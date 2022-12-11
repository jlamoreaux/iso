import Event, { IEvent, IEventDocument } from "../model/Event";

const DALEvent = {
  getEvent: async (id: string): Promise<IEventDocument | null> => {
    return await Event.findById(id);
  },
  createEvent: async (event: IEvent): Promise<IEventDocument> => {
    return await Event.create(event);
  },
  updateEvent: async (id: string, event: IEvent): Promise<IEventDocument | null> => {
    return await Event.findByIdAndUpdate(id, event, {
      new: true,
    });
  },
  deleteEvent: async (id: string): Promise<IEventDocument | null> => {
    return await Event.findByIdAndRemove(id);
  },
  getEventsByPhotographer: async (photographerId: string): Promise<IEventDocument[]> => {
    return await Event.find({
      photographer: photographerId,
    });
  },
  getEventsByRegionAndDate: async (region: string, date: Date): Promise<IEventDocument[]> => {
    return await Event.find({
      region,
      date,
    });
  },
  getEventsByRegion: async (region: string): Promise<IEventDocument[]> => {
    return await Event.find({
      region,
    });
  },
};

export default DALEvent;
