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
        let isMounted = true; // Đảm bảo chỉ thực hiện nếu component còn mounted
        const verifyToken = async () => {
            if (!token) {
                if (isMounted) {
                    setIsAuthenticated(false);
                    setLoading(false);
                }
                return;
            }

            try {
                // console.log("1times")
                const url = `${SERVER}/user/validate`;
                const res = await axios.get(url, {
                    headers: { authorization: `Bearer ${token}` },
                });
                if (isMounted) {
                    if (res.status === 200) {
                        const data = res.data.data;
                        setMyAccount(data);
                        setId(data.id);
                        setIsAuthenticated(true);
                    } else {
                        setIsAuthenticated(false);
                    }
                }
            } catch (err) {
                if (isMounted) setIsAuthenticated(false);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        verifyToken();

        return () => {
            isMounted = false; // Cleanup khi component bị unmount
        };
    }, [token, setId, setMyAccount]);


    return { isAuthenticated, loading };
};

export default useAuth;
