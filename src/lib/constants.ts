export const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;

export const SCOPES = [
  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/calendar.readonly",
].join(" ");

declare global {
  interface Window {
    gapi: any;
    google: any;
  }
}
