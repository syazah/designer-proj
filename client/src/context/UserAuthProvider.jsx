import { createContext, useEffect, useState } from "react";

// Create context
const UserAuthContext = createContext(null);

function UserAuthProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(() => {
    const storedUser = sessionStorage.getItem("userData");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const userType = user?.isAdmin ? 5 : user?.isBusiness ? 8 : 6;
  useEffect(() => {
    if (user) {
      try {
        sessionStorage.setItem("userData", JSON.stringify(user));
      } catch (error) {
        console.error("Failed to save user data to localStorage:", error);
      }
    } else {
      sessionStorage.removeItem("userData");
    }
  }, [user]);

  useEffect(() => {
    try {
      const storedUser = sessionStorage.getItem("userData");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      sessionStorage.removeItem("userData"); // Clean up if corrupted
    } finally {
      setLoading(false);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Render a loading state while initializing
  }

  return (
    <UserAuthContext.Provider value={{ user, setUser, userType }}>
      {children}
    </UserAuthContext.Provider>
  );
}

export { UserAuthProvider, UserAuthContext };
