import { useList } from "react-use";
import { useSentiment } from "./sentiment";
import { buildResponse } from "@/components/message";

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
  const [messages, { push }] = useList<Message>([]);

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
    push(buildResponse(fromHuman));
  };

  return {
    loading,
    messages,
    humanAsks,
  };
}
