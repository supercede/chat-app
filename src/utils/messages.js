const generateMessage = text => {
  return {
    message: text,
    createdAt: new Date().getTime()
  };
};

const generatelocationMessage = (latitude, longitude) => {
  return {
    url: `https://google.com/maps?q=${latitude},${longitude}`,
    createdAt: new Date().getTime()
  };
};

export { generateMessage, generatelocationMessage };
