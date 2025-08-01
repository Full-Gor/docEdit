const fs = require('fs');
const path = require('path');

// Fonction pour ajouter l'import PDF au bon endroit
function addPDFImport(content) {
  const lines = content.split('\n');
  
  // Vérifier si l'import existe déjà
  const hasImport = lines.some(line => 
    line.includes('import { sharePDF, PDFData } from \'../../utils/pdfGenerator\';')
  );
  
  if (hasImport) {
    return content; // Déjà présent
  }
  
  // Trouver l'index après les autres imports
  let insertIndex = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import') && !lines[i].includes('sharePDF')) {
      insertIndex = i + 1;
    }
  }
  
  if (insertIndex === -1) {
    // Si pas d'import trouvé, ajouter au début
    lines.unshift("import { sharePDF, PDFData } from '../../utils/pdfGenerator';");
  } else {
    lines.splice(insertIndex, 0, "import { sharePDF, PDFData } from '../../utils/pdfGenerator';");
  }
  
  return lines.join('\n');
}

// Fonction pour configurer un fichier
function configureFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const updatedContent = addPDFImport(content);
    fs.writeFileSync(filePath, updatedContent);
    console.log(`✅ ${path.basename(filePath)} configuré`);
  } catch (error) {
    console.error(`❌ Erreur lors de la configuration de ${filePath}:`, error.message);
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

// Exécuter la configuration
console.log('🔧 Ajout des imports PDF...\n');

templates.forEach(template => {
  const templatePath = path.join(__dirname, '..', 'app', 'templates', template);
  if (fs.existsSync(templatePath)) {
    configureFile(templatePath);
  } else {
    console.log(`⚠️  Template non trouvé: ${template}`);
  }
});

console.log('\n✅ Configuration terminée !'); 