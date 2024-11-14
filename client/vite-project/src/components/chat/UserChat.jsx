import { Stack } from "react-bootstrap";
import { useFetchRecipientUser } from "../../hooks/useFetchRecipient";
import { useContext } from "react";
import { ChatContext } from "../../context/ChatContext";
import moment from "moment";

const UserChat = ({
  chat,
  user,
  lastMessage,
  messageDate,
  notificationCount,
}) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUsers } = useContext(ChatContext);

  const isOnline = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
    >
      <div className="d-flex">
        <div className="me-2">{recipientUser?.name?.[0]} </div>

        <div className="text-content">
          <div className="name">{recipientUser?.name} </div>
          <div className="text">{lastMessage}</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">{moment(messageDate).format("DD/MM/YYYY")}</div>
        <div className="this-user-notifications">{notificationCount}</div>
        <div className={isOnline ? "user-online" : ""}></div>
      </div>
    </Stack>
  );
};

export default UserChat;
