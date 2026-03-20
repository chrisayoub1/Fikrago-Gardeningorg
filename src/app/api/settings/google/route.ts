import { NextResponse } from "next/server";

// GET /api/settings/google - Get Google OAuth URLs for setup
export async function GET() {
  // Use the configured NEXTAUTH_URL
  const baseUrl = process.env.NEXTAUTH_URL || "https://t1xd62bua560-d.space.z.ai";
  
  return NextResponse.json({
    instructions: [
      "1. Go to Google Cloud Console: https://console.cloud.google.com/",
      "2. Select your project",
      "3. Go to 'APIs & Services' > 'Credentials'",
      "4. Click on your OAuth 2.0 Client ID to edit it",
      "5. Add the following URLs to the appropriate sections:",
    ],
    authorizedJavascriptOrigins: [
      baseUrl,
    ],
    authorizedRedirectUris: [
      `${baseUrl}/api/auth/callback/google`,
    ],
    note: "Make sure these URLs are added to your Google Cloud Console OAuth settings for Google Sign-In to work.",
  });
}
