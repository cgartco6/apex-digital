export const getStorageKey = (role, key) => `${role}_${key}`;

export const saveToLocal = (role, key, data) => {
    localStorage.setItem(getStorageKey(role, key), JSON.stringify(data));
};

export const loadFromLocal = (role, key, defaultValue) => {
    const raw = localStorage.getItem(getStorageKey(role, key));
    return raw ? JSON.parse(raw) : defaultValue;
};
