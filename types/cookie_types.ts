export interface Cookie_Bases {
    light: number;
    dark: number;
}

export interface Cookies_Data {
    COOKIE_BASES: Cookie_Bases;
    COOKIE_ADDONS: Cookie_Addons;
}

export interface Cookie_Addons {
    chocolate: number;
    sprinkles: number;
    honey: number;
    cranberries: number;
    coconut: number;
}

export type CookieBasesAsType = keyof Cookie_Bases;
export type CookieAddonsAsType = keyof Cookie_Addons;