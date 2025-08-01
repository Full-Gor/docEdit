import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Users, BookOpen, Sparkles, ChevronRight, Plus, X, CheckCircle, Clock, Target } from 'lucide-react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function OnboardingGuideTemplate() {
  const [title, setTitle] = useState('Guide d\'Accueil - Nouveaux Collaborateurs');
  const [companyName, setCompanyName] = useState('Mon Entreprise');
  const [welcomeMessage, setWelcomeMessage] = useState('Bienvenue dans notre équipe ! Ce guide vous accompagnera dans vos premiers pas au sein de notre entreprise...');
  const [sections, setSections] = useState([
    { id: '1', title: 'Premier Jour', content: 'Présentation de l\'équipe, visite des locaux, remise des accès...', duration: '2h', link: '/onboarding/first-day' },
    { id: '2', title: 'Formation Produit', content: 'Découverte de nos produits et services, démonstrations...', duration: '4h', link: '/onboarding/product-training' },
    { id: '3', title: 'Processus Internes', content: 'Procédures, outils, communication, sécurité...', duration: '3h', link: '/onboarding/processes' },
    { id: '4', title: 'Intégration Équipe', content: 'Rencontres avec les collègues, mentorat, projets...', duration: '1 semaine', link: '/onboarding/team-integration' },
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
      content: 'Description de la nouvelle section...',
      duration: '1h',
      link: '/onboarding/new-section'
    }]);
  };

  const updateSection = (id: string, field: 'title' | 'content' | 'duration', value: string) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const navigateToOnboarding = (link: string) => {
    // Navigation vers la page d'onboarding
    console.log('Navigation vers:', link);
    // router.push(link); // Décommentez quand les pages onboarding seront créées
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
          <Text style={styles.previewTitle}>Aperçu Guide d'Accueil</Text>
          <View style={styles.sparklesIcon}>
            <Sparkles size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.guideCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Users size={48} color="#FFFFFF" />
              <Text style={styles.guideBadge}>GUIDE D'ACCUEIL</Text>
              <Text style={styles.guideTitle}>{title}</Text>
              <View style={styles.companyBadge}>
                <Text style={styles.guideCompany}>{companyName}</Text>
              </View>
            </View>
          </LinearGradient>
          
          {/* Welcome Message */}
          <View style={styles.guideSection}>
            <LinearGradient
              colors={['#F59E0B', '#D97706']}
              style={styles.sectionIcon}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Message de Bienvenue</Text>
            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{welcomeMessage}</Text>
            </View>
          </View>
          
          {/* Onboarding Steps */}
          <View style={styles.guideSection}>
            <Text style={styles.sectionTitle}>Étapes d'Intégration</Text>
            {sections.map((section, index) => (
              <TouchableOpacity 
                key={section.id} 
                style={styles.stepCard}
                onPress={() => navigateToOnboarding(section.link)}
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
                  style={styles.stepGradient}
                >
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <View style={styles.stepNumber}>
                        <Text style={styles.stepNumberText}>{index + 1}</Text>
                      </View>
                      <View style={styles.stepInfo}>
                        <Text style={styles.stepTitle}>{section.title}</Text>
                        <View style={styles.stepDuration}>
                          <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                          <Text style={styles.stepDurationText}>{section.duration}</Text>
                        </View>
                      </View>
                    </View>
                    <Text style={styles.stepDesc}>{section.content}</Text>
                    <ChevronRight size={24} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Success Indicators */}
          <View style={styles.guideSection}>
            <Text style={styles.sectionTitle}>Indicateurs de Succès</Text>
            <View style={styles.successGrid}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.successCard}
              >
                <CheckCircle size={32} color="#FFFFFF" />
                <Text style={styles.successNumber}>100%</Text>
                <Text style={styles.successLabel}>Taux d'Intégration</Text>
                <Text style={styles.successSubtext}>Collaborateurs satisfaits</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.successCard}
              >
                <Target size={32} color="#FFFFFF" />
                <Text style={styles.successNumber}>2 semaines</Text>
                <Text style={styles.successLabel}>Durée Moyenne</Text>
                <Text style={styles.successSubtext}>Intégration complète</Text>
              </LinearGradient>
            </View>
          </View>
          
          {/* Footer */}
          <View style={styles.guideFooter}>
            <Text style={styles.footerText}>© 2024 {companyName}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Guide généré avec soin pour votre réussite</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#8B5CF6', '#7C3AED']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Guide d'Accueil</Text>
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
              <Text style={styles.fieldLabel}>Titre du guide</Text>
              <Text style={styles.fieldHint}>Titre principal du guide d'accueil</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Guide d'Accueil - Nouveaux Collaborateurs"
              placeholderTextColor="#94A3B8"
            />
          </View>

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
              <Text style={styles.fieldLabel}>Message de bienvenue</Text>
              <Text style={styles.fieldHint}>Message d'accueil personnalisé</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={welcomeMessage}
              onChangeText={setWelcomeMessage}
              placeholder="Rédigez un message de bienvenue personnalisé..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Étapes d'Intégration - Modifiables */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Étapes d'Intégration</Text>
            <TouchableOpacity onPress={addSection} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {sections.map((section, index) => (
            <View key={section.id} style={styles.stepEditor}>
              <View style={styles.stepHeader}>
                <Text style={styles.stepNumber}>Étape {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeSection(section.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre de l'étape</Text>
                <TextInput
                  style={styles.textInput}
                  value={section.title}
                  onChangeText={(value) => updateSection(section.id, 'title', value)}
                  placeholder="Ex: Premier Jour"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={section.content}
                  onChangeText={(value) => updateSection(section.id, 'content', value)}
                  placeholder="Ex: Présentation de l'équipe, visite des locaux..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Durée estimée</Text>
                <TextInput
                  style={styles.textInput}
                  value={section.duration}
                  onChangeText={(value) => updateSection(section.id, 'duration', value)}
                  placeholder="Ex: 2h, 1 jour, 1 semaine..."
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Sparkles size={24} color="#8B5CF6" />
            <Text style={styles.featuresTitle}>Conseils d'Onboarding</Text>
          </View>
          
          {[
            { icon: '👋', title: 'Accueil Chaleureux', desc: 'Premier contact positif et rassurant' },
            { icon: '📋', title: 'Programme Structuré', desc: 'Étapes claires et progressives' },
            { icon: '🤝', title: 'Mentorat', desc: 'Accompagnement personnalisé' },
            { icon: '📚', title: 'Formation Continue', desc: 'Apprentissage progressif' },
            { icon: '🎯', title: 'Objectifs Clairs', desc: 'Attentes et résultats définis' },
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
  stepEditor: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  stepNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8B5CF6',
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
  guideCover: {
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
  guideBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 16,
    opacity: 0.9,
  },
  guideTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  companyBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 30,
  },
  guideCompany: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  guideSection: {
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
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  contentText: {
    fontSize: 17,
    color: '#475569',
    lineHeight: 28,
  },
  stepCard: {
    marginBottom: 16,
  },
  stepGradient: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  stepContent: {
    padding: 20,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  stepInfo: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  stepDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  stepDurationText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  stepDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
    marginBottom: 12,
  },
  successGrid: {
    flexDirection: 'row',
    gap: 16,
  },
  successCard: {
    flex: 1,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  successNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  successLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  successSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  guideFooter: {
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