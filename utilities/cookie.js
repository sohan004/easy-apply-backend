const setCookie = (res, name, value, duration) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
    maxAge: duration,
  };

  res.cookie(name, value, options);
};

const clearCookie = async (res, name) => {
  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  };

  res.clearCookie(name, options);
};



const getCookie = async (req, name) => {
  const data = await req.cookies[name];
  return data || null;
};


module.exports = {
    setCookie,
    clearCookie,
    getCookie,
}