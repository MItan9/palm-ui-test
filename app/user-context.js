import { createContext, useContext } from "react";
import { User } from "./lib/auth/user.service";

export const UserContext = createContext(User.ANONYMOUS);

export function useUserContext() {
  return useContext(UserContext);
}
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);

  // Функция для загрузки данных пользователя
  async function fetchUserData() {
    const axiosInstance = axios.create({ baseURL: '/bff/api' }); // Адаптируйте с вашим baseURL
    try {
      const response = await axiosInstance.get("/me");
      setUserData(response.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  // Вызываем функцию загрузки при монтировании компонента
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ userData, fetchUserData }}>
      {children}
    </UserContext.Provider>
  );
};

// Хук для использования контекста
export const useUser = () => useContext(UserContext);