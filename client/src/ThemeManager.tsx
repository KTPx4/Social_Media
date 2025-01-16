// themes.ts
interface Theme {
    key: string;
    background: string;
    textColor: string;
    hintColor: string;
    Caption: string;
    Border: string;
    card: string;
}

const themes: Record<string, Theme> = {
    theme_light: {
        key: 'theme_light',
        background: '#ffffff',
        textColor: '#000000',
        hintColor: '#9b9b9b',
        Caption: '#4b5563',
        Border: '#DEDEDE',
        card: "#ececec",
    },
    theme_dark: {
        key: 'theme_dark',
        background: '#0C0C0C',
        textColor: '#ffffff',
        hintColor: '#cfcfcf',
        Caption: '#dfdfdf',
        Border: '#1d1d1d',
        card: "#1e1e1e",
    },
};

// Hàm lấy theme từ localStorage hoặc mặc định là 'theme_light'
const getCurrentTheme = (): Theme => {
    const savedTheme = localStorage.getItem('app_theme');
    return themes[savedTheme as keyof typeof themes] || themes.theme_light;
};

// Đối tượng themeManager có các phương thức lấy mã màu dựa trên theme hiện tại
const themeManager = {
    getKey: (): string => getCurrentTheme().key,
    getBackground: (): string => getCurrentTheme().background,
    getText: (): string => getCurrentTheme().textColor,
    getHint: (): string => getCurrentTheme().hintColor,
    getCaption: (): string => getCurrentTheme().Caption,
    getBorder: ():string => getCurrentTheme().Border,
    getCard: (): string => getCurrentTheme().card,
    setTheme: (newTheme: string): void => {
        if (themes[newTheme]) {
            localStorage.setItem('app_theme', newTheme);
        }
    },
};

export default themeManager;
