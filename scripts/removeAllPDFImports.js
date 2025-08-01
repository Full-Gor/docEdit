const fs = require('fs');
const path = require('path');

// Fonction pour supprimer tous les imports PDF
function removeAllPDFImports(content) {
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    // Supprimer toutes les lignes d'import PDF
    return !line.includes('import { sharePDF, PDFData } from \'../../utils/pdfGenerator\';');
  });
  
  return cleanedLines.join('\n');
}

// Fonction pour nettoyer un fichier
function cleanFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = removeAllPDFImports(content);
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`✅ ${path.basename(filePath)} nettoyé`);
  } catch (error) {
    console.error(`❌ Erreur lors du nettoyage de ${filePath}:`, error.message);
  }
}

// Liste de tous les templates
const templates = [
  'annual-report.tsx',
  'annual-report-v2.tsx',
  'annual-report-v3.tsx',
  'annual-report-v4.tsx',
  'annual-report-v5.tsx',
  'press-release.tsx',
  'press-release-v2.tsx',
  'press-release-v3.tsx',
  'press-release-v4.tsx',
  'press-release-v5.tsx',
  'newsletter.tsx',
  'newsletter-v2.tsx',
  'newsletter-v3.tsx',
  'newsletter-v4.tsx',
  'newsletter-v5.tsx',
  'onboarding-guide.tsx',
  'onboarding-guide-v2.tsx',
  'onboarding-guide-v3.tsx',
  'onboarding-guide-v4.tsx',
  'onboarding-guide-v5.tsx',
  'sales-brochure.tsx',
  'meeting-minutes.tsx',
  'marketing-report.tsx',
  'marketing-campaign.tsx',
  'marketing-email.tsx',
  'leave-request.tsx',
  'work-contract.tsx',
  'job-offer.tsx',
  'training-plan.tsx',
  'cv.tsx',
  'feedback-form.tsx',
  'satisfaction-survey.tsx',
  'registration-form.tsx',
  'contact-form.tsx',
  'compliance-form.tsx',
  'service-request.tsx',
  'team-update.tsx',
  'social-media-post.tsx',
  'promotional-flyer.tsx',
  'product-launch.tsx',
  'seminar-plan.tsx',
  'conference-program.tsx',
  'gala-event.tsx',
  'greeting-card.tsx',
  'internal-announcement.tsx',
  'internal-memo.tsx',
  'internal-newsletter.tsx',
  'company-policy.tsx',
  'annual-review.tsx'
];

// Exécuter le nettoyage
console.log('🧹 Suppression de tous les imports PDF mal placés...\n');

templates.forEach(template => {
  const templatePath = path.join(__dirname, '..', 'app', 'templates', template);
  if (fs.existsSync(templatePath)) {
    cleanFile(templatePath);
  } else {
    console.log(`⚠️  Template non trouvé: ${template}`);
  }
});

console.log('\n✅ Nettoyage terminé !'); 