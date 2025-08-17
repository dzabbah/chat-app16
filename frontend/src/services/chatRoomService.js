import API from "./api";

export const getChatRooms = async () => {
  const res = await API.get("/chatrooms");
  return res.data;
};

export const createChatRoom = async (name) => {
  const res = await API.post("/chatrooms", { name });
  return res.data;
};

export const joinChatRoom = async (id) => {
  const res = await API.post(`/chatrooms/join/${id}`);
  return res.data;
};

export const leaveChatRoom = async (id) => {
  const res = await API.post(`/chatrooms/leave/${id}`);
  return res.data;
};
