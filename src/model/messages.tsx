import { useList } from "react-use";

/**
 * Who sent ye?
 */
export type MessageFrom = "human" | "cat";

/**
 * Words have display styles to be just plain text
 * or font driven icons.
 */
export type WordType = "text" | "caticon";

/**
 * Words make up a message. Not just using a plain string
 * here since we can have variable words + icons.
 */
export type Word = {
  text: string;
  type: WordType;
};

/**
 * Message. Not message.
 */
export type Message = {
  from: MessageFrom;
  sentiment?: number;
  content: Word[];
};

/**
 * Hook into the data model and keep track of a list of messages.
 */
export function useMessages() {
  const [messages, { push }] = useList<Message>([
    {
      content: [{ text: "make me a sample", type: "text" }],
      sentiment: 0.5,
      from: "human",
    },
    {
      content: [{ text: "make me a sample", type: "text" }],
      sentiment: 1.0,
      from: "cat",
    },
  ]);

  return {
    messages,
    push,
  };
}
