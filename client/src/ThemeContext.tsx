import   { createContext, useState, useEffect, ReactNode, FC } from 'react';
import themeManager from './ThemeManager.tsx';

// Định nghĩa kiểu dữ liệu cho themeManager
interface ThemeManagerType {
    getKey: () => string;
    getBackground: () => string;
    getText: () => string;
    getHint: () => string;
    getCaption: () => string;
    setTheme: (newTheme: string) => void;
}

// Định nghĩa kiểu dữ liệu cho context
interface ThemeContextType {
    currentTheme: ThemeManagerType;
    changeTheme: (themeName: string) => void;
}

// Khởi tạo context với giá trị mặc định
export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Props cho ThemeProvider
interface ThemeProviderProps {
    children: ReactNode;
}

// ThemeProvider với TypeScript
export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
    const [currentTheme, setCurrentTheme] = useState<ThemeManagerType>(themeManager);

    // Lấy theme từ localStorage khi ứng dụng khởi động
    useEffect(() => {
        const savedTheme = localStorage.getItem('app_theme');
        if (savedTheme) {
            themeManager.setTheme(savedTheme);
            setCurrentTheme({ ...themeManager }); // Cập nhật lại trạng thái để re-render
        }
    }, []);

    // Hàm để thay đổi theme và cập nhật vào localStorage
    const changeTheme = (themeName: string) => {
        themeManager.setTheme(themeName);
        setCurrentTheme({ ...themeManager }); // Cập nhật lại trạng thái để re-render
    };

    return (
        <ThemeContext.Provider value={{ currentTheme, changeTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
