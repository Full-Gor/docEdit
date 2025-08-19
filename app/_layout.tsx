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
        <Stack.Screen name="templates/annual-report-v5" options={{ headerShown: false }} />
        <Stack.Screen name="templates/press-release-v5" options={{ headerShown: false }} />
        <Stack.Screen name="templates/newsletter-v5" options={{ headerShown: false }} />
        <Stack.Screen name="templates/onboarding-guide-v5" options={{ headerShown: false }} />
        <Stack.Screen name="templates/cv" options={{ headerShown: false }} />
        <Stack.Screen name="templates/cv-v2" options={{ headerShown: false }} />
        <Stack.Screen name="templates/work-contract" options={{ headerShown: false }} />
        <Stack.Screen name="templates/work-contract-blank" options={{ headerShown: false }} />
        <Stack.Screen name="templates/training-plan" options={{ headerShown: false }} />
        <Stack.Screen name="templates/training-plan-blank" options={{ headerShown: false }} />
        <Stack.Screen name="templates/team-update" options={{ headerShown: false }} />
        <Stack.Screen name="templates/seminar-plan" options={{ headerShown: false }} />
        <Stack.Screen name="templates/product-launch" options={{ headerShown: false }} />
        <Stack.Screen name="templates/meeting-minutes" options={{ headerShown: false }} />
        <Stack.Screen name="templates/leave-request" options={{ headerShown: false }} />
        <Stack.Screen name="templates/leave-request-blank" options={{ headerShown: false }} />
        <Stack.Screen name="templates/job-offer-blank" options={{ headerShown: false }} />
        <Stack.Screen name="templates/internal-newsletter" options={{ headerShown: false }} />
        <Stack.Screen name="templates/internal-memo" options={{ headerShown: false }} />
        <Stack.Screen name="templates/internal-announcement" options={{ headerShown: false }} />
        <Stack.Screen name="templates/greeting-card" options={{ headerShown: false }} />
        <Stack.Screen name="templates/gala-event" options={{ headerShown: false }} />
        <Stack.Screen name="templates/conference-program" options={{ headerShown: false }} />
        <Stack.Screen name="templates/company-policy" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-review" options={{ headerShown: false }} />
        <Stack.Screen name="templates/annual-review-blank" options={{ headerShown: false }} />
        <Stack.Screen name="saved-documents" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}