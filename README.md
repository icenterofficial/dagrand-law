
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1eptWosu5qzdKbsPowSfUoNs3bAsBKvXd

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Database Setup (Supabase) - REQUIRED

To make the login and admin features work, you must configure Supabase correctly.

### 1. Database Schema
1. Go to your Supabase Project Dashboard > **SQL Editor**.
2. Open the file `supabase/schema.sql` in this project.
3. Copy the content.
4. Paste it into the SQL Editor.
5. **Important:** Update the email in the first command (`mathyousos5@gmail.com`) to your actual signed-up email address.
6. Click **Run**.

### 2. Authentication Settings (Fixes Login Issues)
1. Go to **Authentication > Providers > Email**.
2. Turn **OFF** "Confirm email" (Confirm email enabled = OFF).
   * *Why? This allows you to create users that can login immediately without waiting for an email.*
3. Go to **Authentication > URL Configuration**.
4. Add `http://localhost:3000` to the **Redirect URLs**.

### 3. Edge Functions (Fixes "Failed to fetch" on Admin Panel)
The Admin Panel uses a server-side function to manage users. You must deploy it.

**Option A: If you have Supabase CLI installed:**
1. Login: `npx supabase login`
2. Deploy: `npx supabase functions deploy admin-actions --no-verify-jwt`
3. Set Secrets:
   ```bash
   npx supabase secrets set SUPABASE_URL=your_project_url
   npx supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

**Option B: Manual Copy-Paste (Easiest for Web):**
1. Go to Supabase Dashboard > **Edge Functions**.
2. Create a new function named `admin-actions`.
3. Copy the code from `supabase/functions/admin-actions/index.ts`.
4. Paste it into the editor and **Deploy**.
5. Go to the function's **"Secrets"** (Environment Variables) section.
6. Add these two secrets (find values in Project Settings > API):
   - `SUPABASE_URL`: (Your Project URL)
   - `SUPABASE_SERVICE_ROLE_KEY`: (Your Service Role Secret - **Not** the Anon key)

### 4. Connect App
1. Open `src/lib/supabaseClient.ts`.
2. Replace the `SUPABASE_URL` and `SUPABASE_ANON_KEY` with your own project's credentials.
