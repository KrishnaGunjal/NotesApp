# Notes App – React Native + Supabase

This is a simple **Notes application** built using **React Native** and **Supabase** as part of a technical assignment.
The goal of this project was to demonstrate real-world fundamentals such as authentication, secure CRUD operations, basic UI handling, and delivering a working Android APK.

---

## Features

### Authentication

* Email and password based **Sign Up**
* Email and password based **Login**
* **Logout**
* User session is persisted, so the user stays logged in even after restarting the app

### Notes

* Create notes
* Edit existing notes
* Delete notes
* View a list of notes
* Notes are strictly **user-specific** (each user can only see their own notes)

### Additional Feature

* **Search notes by title** (client-side search)

---

## Tech Stack

* React Native
* Supabase

  * Authentication
  * PostgreSQL database
* Android APK build

No other backend services are used.

---

## Supabase Database Schema

### Table: `notess`

| Field      | Type      | Description                   |
| ---------- | --------- | ----------------------------- |
| id         | uuid      | Primary key                   |
| title      | text      | Note title                    |
| content    | text      | Note content                  |
| user_id    | uuid      | References authenticated user |
| created_at | timestamp | Note creation time            |
| updated_at | timestamp | Last update time              |

---

## Security (Row Level Security)

Row Level Security (RLS) is enabled on the `notess` table to ensure proper data isolation.

Policies ensure that:

* Users can read only their own notes
* Users can insert notes only for themselves
* Users can update only their own notes
* Users can delete only their own notes

This guarantees that notes are never shared across users.

---

## Authentication Handling

* Authentication is handled using Supabase email/password auth
* User session is stored using `AsyncStorage`
* On app launch, the existing session is checked
* Logged-in users remain authenticated after restarting the app

---

## UI & UX

* Clean and readable UI
* Login screen shows a loader while waiting for Supabase responses
* Buttons are disabled during API calls to avoid multiple requests
* Notes list is easy to read and interact with
* Logout action is placed in the header for better UX

The UI is intentionally kept simple and functional rather than overly styled.
