import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Mail, Image, Link, Sparkles, ChevronRight, Plus, X } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function NewsletterTemplate() {
  const [subject, setSubject] = useState('Newsletter mensuelle - Novembre 2024');
  const [preheader, setPreheader] = useState('Découvrez nos dernières actualités et innovations');
  const [mainTitle, setMainTitle] = useState('Nos Actualités du Mois');
  const [mainContent, setMainContent] = useState('Découvrez les dernières nouvelles de notre entreprise, nos innovations et les projets qui façonnent notre avenir...');
  const [companyName, setCompanyName] = useState('Mon Entreprise');
  const [sections, setSections] = useState([
    { id: '1', title: 'Nouveau Produit Lancé', content: 'Nous sommes fiers d\'annoncer le lancement de notre dernier produit révolutionnaire...', link: '/news/product-launch' },
    { id: '2', title: 'Équipe en Expansion', content: 'Nous accueillons de nouveaux talents qui renforcent notre équipe...', link: '/news/team-expansion' },
    { id: '3', title: 'Certification Obtenue', content: 'Notre engagement pour l\'excellence a été reconnu avec cette nouvelle certification...', link: '/news/certification' },
  ]);
  const [isPreview, setIsPreview] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const addSection = () => {
    setSections([...sections, { 
      id: Date.now().toString(), 
      title: 'Nouvelle Section', 
      content: 'Contenu de la nouvelle section...',
      link: '/news/new-section'
    }]);
  };

  const updateSection = (id: string, field: 'title' | 'content', value: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const navigateToNews = (link: string) => {
    // Navigation vers la page de news
    console.log('Navigation vers:', link);
    // router.push(link); // Décommentez quand les pages news seront créées
  };

  if (isPreview) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.previewHeader}
        >
          <TouchableOpacity onPress={togglePreview} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Aperçu Newsletter</Text>
          <View style={styles.sparklesIcon}>
            <Sparkles size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#10B981', '#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.newsletterCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Mail size={48} color="#FFFFFF" />
              <Text style={styles.newsletterBadge}>NEWSLETTER</Text>
              <Text style={styles.newsletterTitle}>{mainTitle}</Text>
              <Text style={styles.newsletterSubtitle}>{preheader}</Text>
              <View style={styles.companyBadge}>
                <Text style={styles.newsletterCompany}>{companyName}</Text>
              </View>
            </View>
          </LinearGradient>
          
          {/* Main Content */}
          <View style={styles.newsletterSection}>
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              style={styles.sectionIcon}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Contenu Principal</Text>
            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{mainContent}</Text>
            </View>
          </View>
          
          {/* News Sections */}
          <View style={styles.newsletterSection}>
            <Text style={styles.sectionTitle}>Actualités</Text>
            {sections.map((section, index) => (
              <TouchableOpacity 
                key={section.id} 
                style={styles.newsCard}
                onPress={() => navigateToNews(section.link)}
              >
                <LinearGradient
                  colors={[
                    ['#6366F1', '#4F46E5'],
                    ['#10B981', '#059669'],
                    ['#F59E0B', '#D97706'],
                    ['#EC4899', '#DB2777'],
                    ['#8B5CF6', '#7C3AED'],
                    ['#EF4444', '#DC2626'],
                  ][index % 6]}
                  style={styles.newsGradient}
                >
                  <View style={styles.newsContent}>
                    <View>
                      <Text style={styles.newsTitle}>{section.title}</Text>
                      <Text style={styles.newsDesc}>{section.content}</Text>
                    </View>
                    <ChevronRight size={24} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* CTA Section */}
          <View style={styles.newsletterSection}>
            <Text style={styles.sectionTitle}>Appel à l'Action</Text>
            <TouchableOpacity style={styles.ctaCard}>
              <LinearGradient
                colors={['#F59E0B', '#D97706']}
                style={styles.ctaGradient}
              >
                <Text style={styles.ctaText}>En savoir plus</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          
          {/* Footer */}
          <View style={styles.newsletterFooter}>
            <Text style={styles.footerText}>© 2024 {companyName}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Newsletter générée avec professionnalisme</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer une Newsletter</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButton}>
            <Eye size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Save size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.editorContent} showsVerticalScrollIndicator={false}>
        <View style={styles.editorCard}>
          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Nom de l'entreprise</Text>
              <Text style={styles.fieldHint}>Sera affiché dans l'en-tête</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={companyName}
              onChangeText={setCompanyName}
              placeholder="Ex: TechCorp Industries"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Objet de l'email</Text>
              <Text style={styles.fieldHint}>Titre visible dans la boîte de réception</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={subject}
              onChangeText={setSubject}
              placeholder="Ex: Newsletter mensuelle - Novembre 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Pré-header</Text>
              <Text style={styles.fieldHint}>Texte de prévisualisation dans l'email</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={preheader}
              onChangeText={setPreheader}
              placeholder="Ex: Découvrez nos dernières actualités"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Titre principal</Text>
              <Text style={styles.fieldHint}>Titre accrocheur de la newsletter</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={mainTitle}
              onChangeText={setMainTitle}
              placeholder="Ex: Nos Actualités du Mois"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Contenu principal</Text>
              <Text style={styles.fieldHint}>Introduction ou message principal</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={mainContent}
              onChangeText={setMainContent}
              placeholder="Décrivez vos actualités principales..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Sections de News - Modifiables */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Actualités</Text>
            <TouchableOpacity onPress={addSection} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {sections.map((section, index) => (
            <View key={section.id} style={styles.newsEditor}>
              <View style={styles.newsHeader}>
                <Text style={styles.newsNumber}>Actualité {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeSection(section.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre de l'actualité</Text>
                <TextInput
                  style={styles.textInput}
                  value={section.title}
                  onChangeText={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Ex: Nouveau Produit Lancé"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={section.content}
                  onChangeText={(value) => updateSection(section.id, 'content', value)}
                  placeholder="Ex: Nous sommes fiers d'annoncer..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Sparkles size={24} color="#10B981" />
            <Text style={styles.featuresTitle}>Conseils de Rédaction</Text>
          </View>
          
          {[
            { icon: '📧', title: 'Objet Accrocheur', desc: 'Titre court et percutant pour l\'email' },
            { icon: '📝', title: 'Contenu Clair', desc: 'Messages concis et faciles à lire' },
            { icon: '🎯', title: 'Call-to-Action', desc: 'Boutons d\'action clairs et visibles' },
            { icon: '📱', title: 'Responsive', desc: 'Design adapté mobile et desktop' },
            { icon: '🔗', title: 'Liens Utiles', desc: 'Navigation vers les pages détaillées' },
          ].map((tip, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{tip.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{tip.title}</Text>
                <Text style={styles.featureDesc}>{tip.desc}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  actionButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  editorContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  editorCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  formSection: {
    marginBottom: 28,
  },
  labelContainer: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  fieldHint: {
    fontSize: 13,
    color: '#64748B',
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  textArea: {
    height: 140,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  smallTextArea: {
    height: 80,
    paddingTop: 16,
    textAlignVertical: 'top',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  addButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
  },
  newsEditor: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  newsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  newsNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#F8FAFC',
    padding: 16,
    borderRadius: 14,
    gap: 16,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  featureDesc: {
    fontSize: 13,
    color: '#64748B',
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  previewTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    marginLeft: 16,
    letterSpacing: 0.3,
  },
  sparklesIcon: {
    padding: 8,
  },
  previewContent: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  newsletterCover: {
    height: 420,
    position: 'relative',
    overflow: 'hidden',
  },
  coverPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  coverCircle1: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    top: -100,
    right: -100,
  },
  coverCircle2: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    bottom: -50,
    left: -50,
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  newsletterBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 16,
    opacity: 0.9,
  },
  newsletterTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  newsletterSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  companyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  newsletterCompany: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  newsletterSection: {
    paddingHorizontal: 20,
    paddingVertical: 32,
  },
  sectionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  contentText: {
    fontSize: 17,
    color: '#475569',
    lineHeight: 28,
  },
  newsCard: {
    marginBottom: 16,
  },
  newsGradient: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  newsContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  newsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  newsDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  ctaCard: {
    marginTop: 16,
  },
  ctaGradient: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  ctaText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newsletterFooter: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
}); 