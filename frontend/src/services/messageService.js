import API from "./api";

export const getMessages = async () => {
  const res = await API.get("/messages");
  return res.data;
};

export const sendMessage = async (text) => {
  const res = await API.post("/messages", { text });
  return res.data;
};
