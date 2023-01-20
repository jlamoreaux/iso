// gets all messages and adds replies to the source message
import mongoose from "mongoose";
import Message, { IMessageDocument } from "../models/Message";
import DALMessage from "../data/message";
import { config } from "dotenv";

config();
const isDryRun = false;

const addRepliesToSourceMessage = async (): Promise<void> => {
  const loggerMetadata = {
    function: "addRepliesToSourceMessage",
    numMessages: 0,
    isDryRun,
  };
  console.log("Adding replies to source message", loggerMetadata);
  try {
    console.log("Finding messages");
    const messages = await Message.find({ replyTo: { $ne: null } }).exec();
    const rootMessages: { [id: string]: IMessageDocument[] } = {};
    const totalReplies = messages.length;
    for (const message of messages) {
      console.log("Adding replies to source message");
      if (!message.replyTo) continue;
      const sourceMessage = await DALMessage.findById(message.replyTo);
      if (!sourceMessage) {
        console.log("Source message not found", {
          ...loggerMetadata,
          messageId: message.id,
        });
        continue;
      }
      console.log("Source message found", { sourceMessage: sourceMessage.id });
      if (!sourceMessage.replies) {
        sourceMessage.replies = [];
      }
      if (rootMessages[sourceMessage.id]) {
        rootMessages[sourceMessage.id].push(message);
      } else {
        rootMessages[sourceMessage.id] = [message];
      }
      console.log("Reply and source message lookup completed", {
        ...loggerMetadata,
        messageId: message.id,
        sourceMessageId: sourceMessage.id,
      });
    }
    if (isDryRun) {
      return console.log("Dry run completed");
    }
    console.log("Adding replies to source message");
    for (const message in rootMessages) {
      rootMessages[message].forEach(async (reply) => {
        await DALMessage.addReply(message, reply);
      });
    }
    console.log("Replies added to source message", {
      ...loggerMetadata,
      rootMessages,
      totalReplies,
    });
  } catch (error) {
    console.log("An error occurred while adding replies to source message", {
      ...loggerMetadata,
      error: error as Error,
    });
  }
};

mongoose
  .set("strictQuery", true)
  .connect("mongodb://localhost:27017/iso_db")
  .then(() => {
    console.log("MongoDB Connected");
    addRepliesToSourceMessage();
  })
  .catch((err) => console.log(err));
