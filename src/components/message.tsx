import { Message, MessageFrom } from "@/model/messages";
import { Avatar, Box, Stack, Typography } from "@mui/joy";
import PersonIcon from "@mui/icons-material/Person";
import styles from "./message.module.css";

type MessageProps = {
  index: number;
  message: Message;
};

/**
 * A single display message in a chat like stack of messages.
 */
export default function MessageDisplay({ message, index }: MessageProps) {
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
        <Stack direction="row" sx={{ paddingTop: 0 }}>
          {message.content.map((word, i) => (
            <Typography
              key={i}
              level="body1"
              sx={{ fontFamily: word.type === "caticon" ? "Meows" : undefined }}
            >
              {word.text}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Box>
  );
}

/**
 * Moodicons. CatStyle.
 */
const CatMoodRange = ["😻", "😽", "😺", "😾", "😿", "🙀"];

type FromProps = {
  message: Message;
};

/**
 * Message from source. Considers the sentiment, from low 'bad' to high 'good'.
 */
function From({ message }: FromProps) {
  const mood =
    CatMoodRange[
      Math.round((1 - message.sentiment) * (CatMoodRange.length - 1))
    ];
  if (message.from === "human") {
    return <PersonIcon />;
  } else {
    return <Typography level="h4">{mood}</Typography>;
  }
}
