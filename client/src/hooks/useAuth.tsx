import { useState, useEffect } from 'react';
import axios from 'axios';
import useStore from "../store/useStore";

const SERVER: string = 'https://localhost:7000/api';

interface UseAuthReturn {
    isAuthenticated: boolean;
    loading: boolean;
}

const useAuth = (token: string): UseAuthReturn => {
    const [loading, setLoading] = useState<boolean>(true);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);


    // @ts-ignore
    const { userId, setId, myAccount, setMyAccount } = useStore();

    useEffect(() => {
        const verifyToken = async () => {
            // Logic nếu token không tồn tại
            if (!token) {
                setIsAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                const url = `${SERVER}/user/validate`;
                const res = await axios.get(url, {
                    headers: { authorization: `Bearer ${token}` },
                });
                console.log("result validate: ", res)
                if (res.status === 200) {
                    const data = res.data.data;
                    setMyAccount(data);
                    setId(data.id);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (err) {
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        verifyToken();
    }, [token, setId, setMyAccount]);


    return { isAuthenticated, loading };
};

export default useAuth;
