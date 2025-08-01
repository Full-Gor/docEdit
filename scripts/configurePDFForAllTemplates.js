const fs = require('fs');
const path = require('path');

// Liste des templates à configurer
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

// Fonction pour ajouter l'import PDF
function addPDFImport(content) {
  const importLine = "import { sharePDF, PDFData } from '../../utils/pdfGenerator';";
  
  // Vérifier si l'import existe déjà
  if (content.includes('import { sharePDF, PDFData }')) {
    return content;
  }
  
  // Ajouter l'import après les autres imports
  const lines = content.split('\n');
  let insertIndex = -1;
  
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('import') && !lines[i].includes('sharePDF')) {
      insertIndex = i + 1;
    }
  }
  
  if (insertIndex === -1) {
    // Si pas d'import trouvé, ajouter au début
    lines.unshift(importLine);
  } else {
    lines.splice(insertIndex, 0, importLine);
  }
  
  return lines.join('\n');
}

// Fonction pour remplacer la fonction shareDocument
function replaceShareDocument(content, templateName) {
  const oldPattern = /const shareDocument = async \(\) => \{[\s\S]*?Alert\.alert\([\s\S]*?'Fonctionnalité de partage à implémenter\.'[\s\S]*?\};/;
  
  const newShareDocument = `const shareDocument = async () => {
    try {
      Alert.alert(
        'Génération PDF',
        'Génération du PDF en cours...',
        [{ text: 'OK' }]
      );

      const pdfData: PDFData = {
        title: title || 'Document',
        author: 'docEdit',
        date: new Date().toLocaleDateString('fr-FR'),
        content: \`
          <h1>\${title || 'Document'}</h1>
          <p>Ce document a été généré avec docEdit.</p>
          <p>Contenu du document :</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Template:</strong> ${templateName}</p>
            <p><strong>Date de génération:</strong> \${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <p>Document généré automatiquement par l'application docEdit.</p>
        \`
      };

      await sharePDF(pdfData);
      
      Alert.alert(
        'Succès',
        'Le PDF a été généré et partagé avec succès !',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Erreur lors du partage:', error);
      Alert.alert(
        'Erreur',
        'Impossible de générer ou partager le PDF.',
        [{ text: 'OK' }]
      );
    }
  };`;

  return content.replace(oldPattern, newShareDocument);
}

// Fonction principale
function configureTemplate(templatePath) {
  try {
    const content = fs.readFileSync(templatePath, 'utf8');
    
    // Ajouter l'import PDF
    let updatedContent = addPDFImport(content);
    
    // Remplacer la fonction shareDocument
    const templateName = path.basename(templatePath);
    updatedContent = replaceShareDocument(updatedContent, templateName);
    
    // Écrire le fichier modifié
    fs.writeFileSync(templatePath, updatedContent);
    
    console.log(`✅ ${templateName} configuré pour PDF`);
  } catch (error) {
    console.error(`❌ Erreur lors de la configuration de ${templatePath}:`, error.message);
  }
}

// Exécuter la configuration
console.log('🚀 Configuration PDF pour tous les templates...\n');

templates.forEach(template => {
  const templatePath = path.join(__dirname, '..', 'app', 'templates', template);
  if (fs.existsSync(templatePath)) {
    configureTemplate(templatePath);
  } else {
    console.log(`⚠️  Template non trouvé: ${template}`);
  }
});

console.log('\n✅ Configuration PDF terminée !'); 