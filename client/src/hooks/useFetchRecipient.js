import { useEffect, useState } from "react";
import { baseUrl, getRequest } from "../utils/services";

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [setError] = useState(null);

  const recipientId = chat?.members.find((id) => id !== user?._id);

  //RECUPERA DATOS DEL DESTINATARIO
  useEffect(() => {
    const getUser = async () => {
      if (!recipientId) return null;

      const response = await getRequest(`${baseUrl}/users/find/${recipientId}`);

      if (response.error) {
        return setError(response);
      }
      setRecipientUser(response);
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
