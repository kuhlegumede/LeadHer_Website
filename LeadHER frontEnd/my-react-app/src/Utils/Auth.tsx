export const logout = () =>{
   localStorage.removeItem("token");
   localStorage.removeItem("username");
   localStorage.removeItem("isAdmin");
   localStorage.removeItem("expiresAt");

   window.location.href = "/login"; // Redirect to login page after logout
};

export const isSessionExpired = () => {
    const token = localStorage.getItem("token");

    if (!token) {
        return false;
    }

    const expiresAt = localStorage.getItem("expiresAt");

    if (!expiresAt) {
        return true;
    }

    return Date.now() > Number(expiresAt);
};