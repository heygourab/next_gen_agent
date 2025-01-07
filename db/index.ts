import { JSONFilePreset } from "lowdb/node";
import type { AImessage } from "../types";
import { randomUUID } from "node:crypto";

export type MessageWithMetaData = AImessage & {
  id: string;
  createdAt: string;
};

const addMetaData = (message: AImessage): MessageWithMetaData => ({
  id: randomUUID(),
  createdAt: new Date().toISOString(),
  ...message,
});

const removeMetaData = (message: MessageWithMetaData): AImessage => {
  const { id, createdAt, ...rest } = message;
  return rest;
};

type Data = {
  messages: MessageWithMetaData[];
};

const defaultData: Data = {
  messages: [],
};

const getDB = async () => await JSONFilePreset<Data>("./db.json", defaultData);

export const pushMessageToDB = async ({ message }: { message: AImessage }) => {
  const db = await getDB();
  db.data.messages.push(addMetaData(message));
  await db.write();
};

export const fetchMessagesFromDB = async () => {
  const db = await getDB();
  const messages = db.data.messages.map((message) => removeMetaData);
  return messages;
};

export const saveToolCallResponse = async ({
  tool_call_id,
  toolCallResponse,
}: {
  tool_call_id: string;
  toolCallResponse: string;
}) =>
  await pushMessageToDB({
    message: {
      role: "tool",
      content: toolCallResponse,
      tool_call_id: tool_call_id,
    },
  });
