# LifeExtended – React Demo Project

LifeExtended is a conceptual wellness-oriented application designed to help users monitor daily lifestyle factors and gain insights into their overall well-being.
The goal is to present information in a simple, visual and accessible way — such as daily load, fatigue, stability, and health-related indicators — based on data the user provides.

The system displays an overview dashboard, allows interaction through forms, and demonstrates how external research data can be integrated into a user-facing health application.
At this stage, LifeExtended serves primarily as a frontend prototype for exploring ideas in health tracking, user experience design, and data presentation.


This project is a small demo version of the future **LifeExtended** platform.  
The goal is to build three functional React pages as required in the assignment:

1. **Home Page (Content Page)**
2. **Form Page**
3. **API Page**

Each page demonstrates a different part of React fundamentals, including state management, props, forms, and fetching data from an API.

---

## 🏠 1. Home Page
**File:** `Home.jsx`

This page shows a small overview dashboard inspired by the LifeExtended concept  
(riskScore, load, fatigue, etc.).

### ✔ What it contains
- Uses **useState** to manage dashboard state.
- Renders a list of cards using **.map()**.
- Uses **props** to pass the card data to a child component (`StatCard.jsx`).
- Includes simple inline styling.

---

## 📝 2. Form Page
**File:** `FormPage.jsx` (or the name you used)

This page includes a user form (example: creating a new profile / logging parameters).

### ✔ Features
- At least **3 controlled inputs** using `useState`.
- Basic validation  
  Example:  
  - Name must be at least 3 characters  
  - Age must be a number  
- Validation messages shown to the user.
- On Submit → the form data is printed in the console (`console.log()`).

---

## 🌐 3. API Page
**File:** `ResearchFeed.jsx`

This page fetches real research data from the  
**EuropePMC API** related to Longevity and Healthy Aging.

### ✔ Features
- Uses **axios** to call a real API.
- Shows **loading** and **error** states.
- If data is available → displays a list using **.map()**.
- Each list item has a proper **key**.
- Each item is displayed through a child component:  
  `ResearchItem.jsx`

Displayed fields:
- Title  
- Abstract text (shortened)  
- Publication year  
- Button linking to the full study  

---

## 📦 Installation & Running

```bash
npm install
npm run dev
