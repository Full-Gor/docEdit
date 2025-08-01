import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface PDFData {
  title: string;
  content: string;
  author?: string;
  date?: string;
  company?: string;
}

export const generateHTML = (data: PDFData): string => {
  return `
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title}</title>
        <style>
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                margin: 0;
                padding: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                border-radius: 10px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                overflow: hidden;
            }
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 40px;
                text-align: center;
            }
            .title {
                font-size: 2.5em;
                margin: 0 0 10px 0;
                font-weight: bold;
            }
            .subtitle {
                font-size: 1.2em;
                opacity: 0.9;
                margin: 0;
            }
            .meta {
                margin-top: 20px;
                font-size: 0.9em;
                opacity: 0.8;
            }
            .content {
                padding: 40px;
                line-height: 1.6;
                color: #333;
            }
            .content h1, .content h2, .content h3 {
                color: #667eea;
                margin-top: 30px;
                margin-bottom: 15px;
            }
            .content p {
                margin-bottom: 15px;
            }
            .footer {
                background: #f8f9fa;
                padding: 20px;
                text-align: center;
                color: #666;
                font-size: 0.9em;
            }
            .company-info {
                background: #e9ecef;
                padding: 15px;
                border-radius: 5px;
                margin: 20px 0;
            }
            @media print {
                body {
                    background: white;
                }
                .container {
                    box-shadow: none;
                }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1 class="title">${data.title}</h1>
                ${data.subtitle ? `<p class="subtitle">${data.subtitle}</p>` : ''}
                <div class="meta">
                    ${data.author ? `<p><strong>Auteur:</strong> ${data.author}</p>` : ''}
                    ${data.date ? `<p><strong>Date:</strong> ${data.date}</p>` : ''}
                    ${data.company ? `<p><strong>Entreprise:</strong> ${data.company}</p>` : ''}
                </div>
            </div>
            <div class="content">
                ${data.content}
            </div>
            <div class="footer">
                <p>Document généré par docEdit</p>
                <p>© ${new Date().getFullYear()} - Tous droits réservés</p>
            </div>
        </div>
    </body>
    </html>
  `;
};

export const generatePDF = async (data: PDFData): Promise<string> => {
  try {
    const html = generateHTML(data);
    const { uri } = await Print.printToFileAsync({ html });
    return uri;
  } catch (error) {
    console.error('Erreur lors de la génération PDF:', error);
    throw error;
  }
};

export const sharePDF = async (data: PDFData): Promise<void> => {
  try {
    const pdfUri = await generatePDF(data);
    
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        dialogTitle: `Partager ${data.title}`,
      });
    } else {
      console.log('Le partage n\'est pas disponible sur cette plateforme');
    }
  } catch (error) {
    console.error('Erreur lors du partage PDF:', error);
    throw error;
  }
};

export const savePDF = async (data: PDFData): Promise<string> => {
  try {
    const pdfUri = await generatePDF(data);
    return pdfUri;
  } catch (error) {
    console.error('Erreur lors de la sauvegarde PDF:', error);
    throw error;
  }
}; 