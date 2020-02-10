const generateMessage = (name, text) => {
  return {
    name,
    message: text,
    createdAt: new Date().getTime()
  };
};

const generatelocationMessage = (name, latitude, longitude) => {
  return {
    name,
    url: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

export { generateMessage, generatelocationMessage };
