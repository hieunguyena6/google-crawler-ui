const checkLogin = () => !!localStorage.getItem("token");
const getUsername = () => localStorage.getItem("username");

export { checkLogin, getUsername };
