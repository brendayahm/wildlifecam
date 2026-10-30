# Wildlife-Smart Camera — AI camera starter

This is a working **starter app** with camera access, image upload, AI-assisted visual identification and before/after testing. It is not a validated species classifier or a wildlife rescue tool. AI can misidentify species and cannot determine whether an animal needs assistance from a single photo.

## Deploy on Vercel (recommended)
1. Create a new GitHub repository and upload the contents of this folder (including `public/`, `api/`, and `vercel.json`).
2. Visit https://vercel.com/new and import the repository. Leave the framework preset as **Other**; the provided `vercel.json` handles routing.
3. Add an environment variable in the Vercel project settings: `OPENAI_API_KEY` = your OpenAI API key (create one at https://platform.openai.com/api-keys). Optional: `OPENAI_MODEL` to override the default (`gpt-5.5`); choose a vision-capable model available to your account.
4. Deploy/redeploy. Open the HTTPS URL on your phone, grant camera permission, capture a distant photo, and tap **Identify wildlife with AI**.
5. iPhone: Safari > Share > Add to Home Screen. Android: Chrome menu > Add to Home screen / Install app.

OpenAI API calls may incur usage charges and require API credits. The API key must remain a server-side environment variable; NEVER paste it into HTML, frontend JS or GitHub.

## Local development
The simplest route is Vercel CLI: `npm install -g vercel`, then `vercel dev` in this directory with your server environment variable configured. The app should be opened on `http://localhost:3000` on the computer. For testing the camera on a separate phone, deploy to HTTPS first. Opening `index.html` directly will not enable the backend API.

## Important privacy and safety notes
- Each photo is sent to your serverless function and then to the OpenAI API when the user taps Identify. The starter app itself contains no database or photo storage.
- Avoid photos of people, addresses, or private information. Before sharing publicly, implement rate limits/abuse protection, privacy disclosure, and an appropriate usage budget.
- Camera access requires HTTPS (or localhost) and browser permission. Some phone browsers may prefer the photo upload/capture control.
- Do not act on a model guess as wildlife rescue advice. Keep a safe distance and consult trained local professionals for injured animals.
- The app shell may be cached offline, but AI identification requires internet connectivity.
