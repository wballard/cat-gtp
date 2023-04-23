import { useList } from "react-use";
import { useSentiment } from "./sentiment";

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
 * Message. Not message.
 */
export type Message = {
  from: MessageFrom;
  sentiment?: number;
  content: string;
};

/**
 * Hook into the data model and keep track of a list of messages.
 */
export function useMessages() {
  const { loading, predict } = useSentiment();
  const [messages, { push }] = useList<Message>([
    {
      content: "make me a sample",
      sentiment: 0.5,
      from: "human",
    },
    {
      content: "I am from the cat, meow",
      sentiment: 1.0,
      from: "cat",
    },
  ]);

  /**
   * Ahh, sweet 👥, asking the 🐈‍⬛ for wisdom.
   *
   */
  const humanAsks = (text: string) => {
    // make a human message
    const fromHuman: Message = {
      from: "human",
      content: text,
      sentiment: predict(text)?.score,
    };
    push(fromHuman);
    // and the cat responds
    const fromCat: Message = {
      from: "cat",
      content: "meow",
      sentiment: fromHuman.sentiment,
    };
    push(fromCat);
  };

  return {
    loading,
    messages,
    humanAsks,
  };
}
