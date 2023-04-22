import { Message, MessageFrom } from "@/model/messages";
import { Avatar, Box, Stack, Typography } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./message.module.css";
import { TypeAnimation } from "react-type-animation";
import React from "react";

type MessageDisplayProps = {
  index: number;
  message: Message;
};

/**
 * A single display message in a chat like stack of messages.
 */
export default function MessageDisplay({
  message,
  index,
}: MessageDisplayProps) {
  const displayText = buildInnerMessage(message);
  const [initialTyped, setInitialTyped] = React.useState(false);
  return (
    <Box
      className={index % 2 ? styles.response : ""}
      sx={{ display: "flex", justifyContent: "center" }}
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
                  <Typography sx={{ fontFamily: "Meows" }}>A</Typography>
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

type MessageProps = {
  message: Message;
};

/**
 * Just the text of the message.
 */
function buildInnerMessage(message: Message) {
  return message.content.map((word, i) => word.text).join(" ");
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
