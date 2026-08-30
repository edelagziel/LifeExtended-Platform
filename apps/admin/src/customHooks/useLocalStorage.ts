import { useState } from "react";

export function useLocalStorage<T>(key: string, initialValue: T) {
  // 1. אתחול: מנסים לקרוא מהזיכרון, אם אין - לוקחים את הדיפולט
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      // אם יש משהו בזיכרון, נחזיר אותו (אחרי המרה מ-string)
      // אם אין כלום, נחזיר את initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  // 2. פונקציית שמירה מיוחדת (שגם מעדכנת את הזיכרון וגם את ריאקט)
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // טיפול במקרה שקיבלנו פונקציה (כמו ב-useState רגיל)
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // א. שמירה ב-State של ריאקט (כדי שהמסך יתעדכן)
      setStoredValue(valueToStore);
      
      // ב. שמירה במחסן של הדפדפן (כדי שנזכור לפעם הבאה) -> זה החלק שהיה חסר לך!
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.log(error);
    }
  };

  return [storedValue, setValue] as const;
}