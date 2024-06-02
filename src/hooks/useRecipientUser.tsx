import { useState } from "react";

function useRecipientUser() {
  const [recipientUser, setRecipientUser] = useState<string>("");
  const [chatSelected, setChatSelected] = useState<string>("");

  return { recipientUser, setRecipientUser, chatSelected, setChatSelected };
}

export default useRecipientUser;
