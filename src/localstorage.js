// Функция для установки значения в localStorage с заданным сроком хранения
export function setWithExpiry(key, value, ttl = 7 * 24 * 60 * 60 * 1000) {
    const item = {
        value: value,
        expiry: new Date().getTime() + ttl // Время жизни значения (ttl) в миллисекундах
    }
    localStorage.setItem(key, JSON.stringify(item));
}

// Функция для извлечения значения из localStorage
export function getWithExpiry(key) {
    const itemString = localStorage.getItem(key);
    if (!itemString) {
        return null;
    }
    const item = JSON.parse(itemString);
    const now = new Date().getTime();
    if (now > item.expiry) {
        localStorage.removeItem(key); // Удаляем значение из localStorage, если оно просрочено
        return null;
    }
    return item.value;
}