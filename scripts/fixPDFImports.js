const fs = require('fs');
const path = require('path');

// Fonction pour corriger les imports mal placés
function fixPDFImports(content) {
  // Supprimer les imports mal placés dans le code
  const lines = content.split('\n');
  const cleanedLines = lines.filter(line => {
    // Garder toutes les lignes sauf les imports PDF mal placés
    return !line.includes('import { sharePDF, PDFData } from \'../../utils/pdfGenerator\';');
  });
  
  // Vérifier si l'import existe déjà au bon endroit
  const hasCorrectImport = cleanedLines.some(line => 
    line.includes('import { sharePDF, PDFData } from \'../../utils/pdfGenerator\';')
  );
  
  if (!hasCorrectImport) {
    // Ajouter l'import au bon endroit (après les autres imports)
    let insertIndex = -1;
    for (let i = 0; i < cleanedLines.length; i++) {
      if (cleanedLines[i].includes('import') && !cleanedLines[i].includes('sharePDF')) {
        insertIndex = i + 1;
      }
    }
    
    if (insertIndex === -1) {
      // Si pas d'import trouvé, ajouter au début
      cleanedLines.unshift("import { sharePDF, PDFData } from '../../utils/pdfGenerator';");
    } else {
      cleanedLines.splice(insertIndex, 0, "import { sharePDF, PDFData } from '../../utils/pdfGenerator';");
    }
  }
  
  return cleanedLines.join('\n');
}

// Fonction pour corriger un fichier
function fixFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const fixedContent = fixPDFImports(content);
    fs.writeFileSync(filePath, fixedContent);
    console.log(`✅ ${path.basename(filePath)} corrigé`);
  } catch (error) {
    console.error(`❌ Erreur lors de la correction de ${filePath}:`, error.message);
  }
}

// Liste des templates à vérifier
const templates = [
  'annual-report-v2.tsx',
  'annual-report-v3.tsx',
  'annual-report-v4.tsx',
  'annual-report-v5.tsx',
  'press-release-v2.tsx',
  'press-release-v3.tsx',
  'press-release-v4.tsx',
  'press-release-v5.tsx',
  'newsletter-v2.tsx',
  'newsletter-v3.tsx',
  'newsletter-v4.tsx',
  'newsletter-v5.tsx',
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

// Exécuter la correction
console.log('🔧 Correction des imports PDF mal placés...\n');

templates.forEach(template => {
  const templatePath = path.join(__dirname, '..', 'app', 'templates', template);
  if (fs.existsSync(templatePath)) {
    fixFile(templatePath);
  } else {
    console.log(`⚠️  Template non trouvé: ${template}`);
  }
});

console.log('\n✅ Correction terminée !'); 