# AI Rules for Enfermagem Pro Project

This document outlines the technical stack and specific library usage guidelines for the "Enfermagem Pro" application. These rules are designed to maintain consistency, readability, and best practices across the codebase.

## Tech Stack Overview

*   **Frontend Framework**: React (version 18.x) for building the user interface.
*   **Language**: TypeScript for type safety and improved code quality.
*   **Build Tool**: Vite for a fast development experience and optimized builds.
*   **Styling**: Tailwind CSS for utility-first CSS styling, ensuring responsive and consistent designs.
*   **UI Component Library**: shadcn/ui, a collection of reusable components built on Radix UI and styled with Tailwind CSS.
*   **Routing**: React Router DOM for declarative navigation within the application.
*   **Icons**: Lucide React for a comprehensive set of customizable SVG icons.
*   **Data Fetching**: React Query for managing server state, caching, and asynchronous data operations.
*   **Form Management**: React Hook Form for efficient and flexible form handling, coupled with Zod for schema validation.
*   **Date Handling**: React Day Picker for date selection and date-fns for date manipulation utilities.

## Library Usage Rules

To ensure a cohesive and maintainable codebase, please adhere to the following guidelines when using libraries:

*   **UI Components**:
    *   **Always** prioritize `shadcn/ui` components for all UI elements (buttons, cards, inputs, dialogs, etc.).
    *   If a specific `shadcn/ui` component does not exist or requires significant customization, create a **new, separate component** in `src/components/` and style it using Tailwind CSS. **Never modify the `shadcn/ui` component files directly.**
*   **Styling**:
    *   **Exclusively** use Tailwind CSS classes for all styling. Avoid custom CSS files (beyond `src/index.css` for global styles) or inline styles unless absolutely necessary for dynamic values.
    *   Ensure designs are responsive by utilizing Tailwind's responsive utility classes.
*   **Routing**:
    *   Use `react-router-dom` for all application navigation. Define routes in `src/App.tsx`.
*   **Icons**:
    *   Use icons from the `lucide-react` library.
*   **Forms**:
    *   For any form creation and management, use `react-hook-form`.
    *   For form validation, use `zod` to define schemas.
*   **Data Fetching**:
    *   For managing server state and asynchronous data fetching, `react-query` is available.
    *   For local component state, use React's built-in `useState` and `useReducer` hooks.
*   **Toasts/Notifications**:
    *   Use `sonner` for simple, non-blocking toast notifications.
    *   Use `shadcn/ui/toast` (via `useToast` hook) for more traditional, dismissible toast messages.
*   **Date Pickers and Manipulation**:
    *   Use `react-day-picker` for any date input or selection UI.
    *   Use `date-fns` for all date formatting, parsing, and manipulation logic.