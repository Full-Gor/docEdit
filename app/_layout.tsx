import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';

export default function RootLayout() {
  useFrameworkReady();

  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-report" options={{ headerShown: false }} />
        <Stack.Screen name="templates/press-release" options={{ headerShown: false }} />
        <Stack.Screen name="templates/newsletter" options={{ headerShown: false }} />
        <Stack.Screen name="templates/event-invitation" options={{ headerShown: false }} />
        <Stack.Screen name="templates/job-offer" options={{ headerShown: false }} />
        <Stack.Screen name="templates/onboarding-guide" options={{ headerShown: false }} />
        <Stack.Screen name="templates/marketing-campaign" options={{ headerShown: false }} />
        <Stack.Screen name="templates/marketing-email" options={{ headerShown: false }} />
        <Stack.Screen name="templates/sales-brochure" options={{ headerShown: false }} />
        <Stack.Screen name="templates/social-media-post" options={{ headerShown: false }} />
        <Stack.Screen name="templates/promotional-flyer" options={{ headerShown: false }} />
        <Stack.Screen name="templates/marketing-report" options={{ headerShown: false }} />
        <Stack.Screen name="templates/satisfaction-survey" options={{ headerShown: false }} />
        <Stack.Screen name="templates/registration-form" options={{ headerShown: false }} />
        <Stack.Screen name="templates/feedback-form" options={{ headerShown: false }} />
        <Stack.Screen name="templates/contact-form" options={{ headerShown: false }} />
        <Stack.Screen name="templates/compliance-form" options={{ headerShown: false }} />
        <Stack.Screen name="templates/service-request" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-report-v2" options={{ headerShown: false }} />
        <Stack.Screen name="templates/press-release-v2" options={{ headerShown: false }} />
        <Stack.Screen name="templates/newsletter-v2" options={{ headerShown: false }} />
        <Stack.Screen name="templates/onboarding-guide-v2" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-report-v3" options={{ headerShown: false }} />
        <Stack.Screen name="templates/press-release-v3" options={{ headerShown: false }} />
        <Stack.Screen name="templates/newsletter-v3" options={{ headerShown: false }} />
        <Stack.Screen name="templates/onboarding-guide-v3" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-report-v4" options={{ headerShown: false }} />
        <Stack.Screen name="templates/press-release-v4" options={{ headerShown: false }} />
        <Stack.Screen name="templates/newsletter-v4" options={{ headerShown: false }} />
        <Stack.Screen name="templates/onboarding-guide-v4" options={{ headerShown: false }} />
        <Stack.Screen name="saved-documents" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}