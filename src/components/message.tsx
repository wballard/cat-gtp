import { Message, MessageFrom } from "@/model/messages";
import { Avatar, Box, Stack, Typography } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./message.module.css";
import { TypeAnimation } from "react-type-animation";
import React from "react";
import prand from "pure-rand";
import stringHash from "@sindresorhus/string-hash";
import { SettingsSuggest } from "@mui/icons-material";

type MessageDisplayProps = {
  index: number;
  message: Message;
  scrollToMe: boolean;
};

/**
 * A single display message in a chat like stack of messages.
 */
export default function MessageDisplay({
  message,
  index,
  scrollToMe,
}: MessageDisplayProps) {
  const displayText = buildInnerMessage(message);
  const [initialTyped, setInitialTyped] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);
  const scrollMe = React.useCallback(
    (ref?: HTMLDivElement) => {
      if (ref && scrollToMe && !scrolled) {
        setScrolled(true);
        ref.scrollIntoView({
          behavior: "smooth",
          block: "end",
        });
      }
    },
    [scrollToMe, scrolled]
  );
  return (
    <Box
      className={index % 2 ? styles.response : ""}
      sx={{ display: "flex", justifyContent: "center" }}
      ref={(ref: HTMLDivElement) => scrollMe(ref)}
    >
      <Stack
        sx={{ width: 1, padding: 2, maxWidth: "40em", minWidth: "20em" }}
        direction="row"
        spacing={2}
      >
        <Avatar variant="plain">
          <From message={message} />
        </Avatar>
        <Box sx={{ paddingTop: 1 }}>
          {message.from === "cat" ? (
            <Typography>
              {initialTyped ? (
                <>
                  <Typography>{displayText}</Typography>
                  <Typography sx={{ fontFamily: "Meows" }}>
                    {buildTrailingMessage(message)}
                  </Typography>
                </>
              ) : (
                <TypeAnimation
                  sequence={[displayText, () => setInitialTyped(true), ""]}
                />
              )}
            </Typography>
          ) : (
            <Typography>{displayText}</Typography>
          )}
        </Box>
      </Stack>
    </Box>
  );
}

/**
 * Moodicons. CatStyle.
 */
const CatMoodRange = ["😻", "😽", "😺", "😾", "😿", "🙀"];
const CatIcons = "aAbBcC";
/**
 * Things cats say.
 */
const CatMessages = [
  "prrrrrrrrrrr prrrrrrr",
  "mew mew prrrr",
  "meow mow mow mow mewwwww",
  "mow ch ch ch ch ch meow",
  "mrrrrr",
  "rrrraaaaaaooooooo hssssssssssssssss",
];

type MessageProps = {
  message: Message;
};

/**
 * Just the text of the message.
 */
function buildInnerMessage(message: Message) {
  return message.content;
}

/**
 * A trailing bit of cat.
 */
function buildTrailingMessage(message: Message) {
  const rng = prand.mersenne(
    stringHash(message.content) + (message.sentiment ?? 0)
  );
  const pickACat = prand.unsafeUniformIntDistribution(
    0,
    CatIcons.length - 1,
    rng
  );
  return CatIcons[pickACat];
}

/**
 * Cat responds to human.
 */
export function buildResponse(fromHuman: Message): Message {
  const rng = prand.mersenne(
    stringHash(fromHuman.content) + (fromHuman.sentiment ?? 0)
  );
  const response =
    CatMessages[
      Math.round((1 - (fromHuman.sentiment ?? 1.0)) * (CatMessages.length - 1))
    ];
  return {
    content: response,
    sentiment: fromHuman.sentiment ?? 1,
    from: "cat",
  };
}

/**
 * Message from source. Considers the sentiment, from low 'bad' to high 'good'.
 */
function From({ message }: MessageProps) {
  const mood =
    CatMoodRange[
      Math.round((1 - (message.sentiment ?? 1.0)) * (CatMoodRange.length - 1))
    ];
  if (message.from === "human") {
    return <PersonIcon />;
  } else {
    return <Typography level="h4">{mood}</Typography>;
  }
}
