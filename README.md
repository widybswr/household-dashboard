# HomeHub - Household & Meal Planner Website

A modern, responsive household management dashboard and meal planner designed for couples, families, and apartments.

## ✨ Features

- **Home Overview Hub**: Today's meals, overdue recurring chores, upcoming bills within 7 days, and quick grocery capture.
- **Weekly Meal Planner & Recipe Box**: 7-day grid (breakfast, lunch, dinner) with notes and saved favorite recipes with ingredient tags.
- **ART & Recurring Chores Engine**:
  - Automatically calculates days elapsed since last completed vs. interval (e.g. *Change bedsheets every 14 days*, *Wash towels every 5 days*, *AC filter every 60 days*).
  - **ART Helper Mode**: High-contrast, clean view optimized for domestic helpers (ART) or printing.
  - 1-click routine reset button.
- **Bills & Payment Dates**: Track monthly fixed commitments (Apartment IPL, PLN Token/Electricity, PAM Water, Internet, Streaming) with due dates, autodebit flags, and paid/unpaid toggles.
- **Needs & "To-Buy" List**: Categorized shopping checklist (Groceries, Household consumables, Pantry staples, Reno items) with store tags and urgency flags.
- **Apartment Manual & Emergency Contacts**:
  - 1-click Wi-Fi password copy and smart door lock access.
  - Emergency building contacts (Security, Engineering Handyman, Management).
  - Main water shutoff valve instructions and circuit breaker guide.
- **Renovation & Home Improvement**: Room-by-room checklist with estimated budget vs actual spend.

## 🚀 Tech Stack

- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Persistence**: Local storage sync (ready for Supabase multi-user cloud integration)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run local development server
npm run dev

# Build for production (Vercel ready)
npm run build
```
