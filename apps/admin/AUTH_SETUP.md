# AWS Cognito Authentication - הגדרה והסבר 🔐

## מה עשינו?

יצרנו מערכת התחברות מלאה עם AWS Cognito שכוללת:

### 1. **Auth Service** (`src/services/authService.ts`)
שירות מרכזי שמטפל בכל פעולות האימות:
- ✅ `authSignUp` - הרשמת משתמש חדש
- ✅ `authConfirmSignUp` - אימות קוד שנשלח למייל
- ✅ `authSignIn` - התחברות משתמש קיים
- ✅ `authSignOut` - התנתקות
- ✅ `authGetCurrentUser` - קבלת פרטי משתמש מחובר
- ✅ `authCheckAuth` - בדיקה אם משתמש מחובר

### 2. **דפי אימות**

#### **RegisterPage** (`src/pages/Register/`)
- דף הרשמה עם אימות טופס
- שליחת בקשה ל-Cognito להרשמה
- מעבר אוטומטי לדף אימות קוד

#### **ConfirmSignUpPage** (`src/pages/ConfirmSignUp/`)
- דף אימות קוד (6 ספרות)
- אפשרות לשלוח קוד מחדש
- מעבר להתחברות לאחר אימות מוצלח

#### **LoginPage** (`src/pages/Login/`)
- דף התחברות פשוט ונקי
- טיפול בשגיאות (משתמש לא מאומת, סיסמה שגויה וכו')
- שמירת session ב-UserContext

### 3. **ProtectedRoute** (`src/routes/ProtectedRoute.jsx`)
- בודק אימות אמיתי מ-Cognito בכל טעינת דף
- מגן על דפים שדורשים התחברות (Dashboard)
- מפנה ל-Login אם המשתמש לא מחובר

### 4. **AdminNavbar** - כפתור Logout
- הוספנו כפתור יציאה במערכת הניהול
- מנקה את ה-session ומחזיר להתחברות

---

## איך זה עובד? (Flow)

### תהליך הרשמה:
1. משתמש ממלא טופס הרשמה → `/register`
2. הטופס שולח בקשה ל-Cognito (`authSignUp`)
3. Cognito שולח קוד אימות למייל
4. מעבר לדף אימות → `/confirm-signup`
5. משתמש מזין קוד בן 6 ספרות
6. לאחר אימות מוצלח → מעבר ל-`/login`

### תהליך התחברות:
1. משתמש ממלא email + password → `/login`
2. הטופס שולח בקשה ל-Cognito (`authSignIn`)
3. אם מוצלח:
   - שמירת session ב-UserContext
   - מעבר ל-Dashboard → `/dashboard`
4. אם נכשל:
   - הצגת שגיאה (סיסמה שגויה / לא מאומת)

### הגנה על דפים:
- כל דף מוגן עטוף ב-`<ProtectedRoute>`
- בכניסה לדף, בדיקה אוטומטית מול Cognito
- אם לא מחובר → הפניה ל-`/login`

---

## הגדרות Cognito

הפרטים מוגדרים ב-`src/aws/amplify.ts`:

```typescript
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: "eu-west-1_hNKfDgfvm",
      userPoolClientId: "3obrh7pt768esr9hhcnrmicajt",
    },
  },
  // ... שאר ההגדרות
});
```

---

## איך להתחיל?

### 1. **הרץ את השרת**
```bash
npm run dev
```

### 2. **נווט לדף ההרשמה**
```
http://localhost:5173/register
```

### 3. **הירשם**
- הזן email + password (לפחות 6 תווים)
- לחץ "Create Account"

### 4. **בדוק את המייל**
- Cognito שולח קוד בן 6 ספרות
- הזן את הקוד בדף האימות

### 5. **התחבר**
- אחרי אימות, תועבר ל-Login
- הכנס email + password
- תיכנס ל-Dashboard!

---

## בעיות נפוצות ופתרונות

### ❌ "User is not confirmed"
**פתרון:** לא אימתת את המייל. חזור ל-`/confirm-signup` והזן את הקוד.

### ❌ "Incorrect username or password"
**פתרון:** סיסמה או email שגויים. נסה שוב או עשה Reset Password (אפשר להוסיף בעתיד).

### ❌ "Code expired"
**פתרון:** לחץ על "Resend Code" בדף האימות.

### ❌ "Password did not conform with policy"
**פתרון:** Cognito דורש סיסמה חזקה (אורך מינימלי, אותיות גדולות, מספרים וכו'). בדוק את ה-Policy ב-AWS Console.

---

## מה עושים עכשיו?

### אם אתה רוצה לבדוק:
1. פתח את הדפדפן ב-`http://localhost:5173`
2. תיכנס אוטומטית ל-`/login`
3. לחץ "Sign up" והירשם
4. בדוק את המייל שלך
5. אמת את הקוד
6. התחבר!

### אם אתה רוצה להוסיף פיצ'רים:
- **Forgot Password** - שחזור סיסמה
- **Social Login** - Google, Facebook וכו'
- **Multi-Factor Authentication (MFA)**
- **User Attributes** - שדות נוספים (שם, גיל וכו')

---

## מבנה קבצים

```
src/
├── aws/
│   └── amplify.ts              # הגדרות Amplify + Cognito
├── services/
│   └── authService.ts          # פונקציות אימות
├── pages/
│   ├── Register/               # דף הרשמה
│   ├── ConfirmSignUp/          # דף אימות קוד
│   └── Login/                  # דף התחברות
├── routes/
│   └── ProtectedRoute.jsx      # הגנה על דפים
├── context/
│   └── UserContext.tsx         # מצב גלובלי של משתמש
└── app/
    └── router.tsx              # נתיבי האפליקציה
```

---

## שאלות? בעיות?

אם משהו לא עובד, בדוק:
1. ✅ הרצת `npm install`?
2. ✅ השרת רץ (`npm run dev`)?
3. ✅ פתחת את הקונסול (F12) לבדיקת שגיאות?
4. ✅ AWS Cognito מוגדר נכון?

---

**נוצר בתאריך:** 30 ינואר 2026  
**גרסה:** 1.0  
**מערכת:** React + AWS Amplify + Cognito
