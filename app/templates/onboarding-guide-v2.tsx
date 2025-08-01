import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Video, Image, Music, Play, Plus, X, FileText, BarChart3, Calendar, Briefcase } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function OnboardingGuideV2Template() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Guide d\'Accueil');
  const [company, setCompany] = useState('Mon Entreprise');
  const [introduction, setIntroduction] = useState('Bienvenue dans notre entreprise ! Ce guide vous accompagnera dans vos premiers pas...');
  const [isPreview, setIsPreview] = useState(false);
  
  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setIntroduction(savedDoc.introduction || introduction);
        
        if (savedDoc.onboardingSteps) {
          setOnboardingSteps(savedDoc.onboardingSteps);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du document sauvegardé:', error);
      }
    }
  }, [params.savedDocument]);
  
  // State variables pour les étapes d'onboarding
  const [onboardingSteps, setOnboardingSteps] = useState([
    { id: 1, title: 'Présentation équipe', desc: 'Rencontrez vos collègues', type: 'video', color: ['#6366F1', '#4F46E5'], link: '/onboarding/team' },
    { id: 2, title: 'Visite des locaux', desc: 'Découvrez votre environnement', type: 'image', color: ['#10B981', '#059669'], link: '/onboarding/office' },
    { id: 3, title: 'Formation outils', desc: 'Apprenez nos outils', type: 'audio', color: ['#F59E0B', '#D97706'], link: '/onboarding/tools' },
    { id: 4, title: 'Processus internes', desc: 'Comprendre nos processus', type: 'interactive', color: ['#EC4899', '#DB2777'], link: '/onboarding/process' },
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const updateOnboardingStep = (id: number, field: 'title' | 'desc', value: string) => {
    setOnboardingSteps(prev => 
      prev.map(step => 
        step.id === id 
          ? { ...step, [field]: value }
          : step
      )
    );
  };

  const addOnboardingStep = () => {
    const newId = Math.max(...onboardingSteps.map(s => s.id)) + 1;
    const colors = [
      ['#6366F1', '#4F46E5'],
      ['#10B981', '#059669'],
      ['#F59E0B', '#D97706'],
      ['#EC4899', '#DB2777'],
      ['#8B5CF6', '#7C3AED'],
      ['#EF4444', '#DC2626'],
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setOnboardingSteps(prev => [...prev, {
      id: newId,
      title: 'Nouvelle Étape',
      desc: 'Description de l\'étape',
      type: 'video',
      color: randomColor,
      link: '/onboarding/new'
    }]);
  };

  const removeOnboardingStep = (id: number) => {
    setOnboardingSteps(prev => prev.filter(step => step.id !== id));
  };

  const navigateToOnboarding = (link: string) => {
    console.log('Navigation vers:', link);
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'onboarding-guide-v2',
        title,
        company,
        introduction,
        onboardingSteps,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre guide d\'accueil a été sauvegardé localement.',
        [{ text: 'OK' }]
      );
      
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      Alert.alert(
        'Erreur',
        'Impossible de sauvegarder le document. Veuillez réessayer.',
        [{ text: 'OK' }]
      );
    }
  };

  const shareDocument = async () => {
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
        content: `
          <h1>${title || 'Document'}</h1>
          <p>Ce document a été généré avec docEdit.</p>
          <p>Contenu du document :</p>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Template:</strong> onboarding-guide-v2.tsx</p>
            <p><strong>Date de génération:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
          </div>
          <p>Document généré automatiquement par l'application docEdit.</p>
        `
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
  };

  if (isPreview) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Header minimaliste */}
        <View style={styles.previewHeaderMinimal}>
          <TouchableOpacity onPress={togglePreview} style={styles.closePreviewButton}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.previewMode}>Mode Aperçu</Text>
        </View>
        
        <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
          {/* Cover minimaliste */}
          <View style={styles.coverMinimal}>
            <View style={styles.coverDecoration}>
              <View style={styles.decorLine1} />
              <View style={styles.decorLine2} />
              <View style={styles.decorLine3} />
            </View>
            
            <View style={styles.coverContentMinimal}>
              <Text style={styles.yearMinimal}>2024</Text>
              <View style={styles.titleDivider} />
              <Text style={styles.titleMinimal}>{title}</Text>
              <Text style={styles.companyMinimal}>{company}</Text>
              <View style={styles.taglineContainer}>
                <Text style={styles.taglineMinimal}>Bienvenue</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Intégration</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Formation</Text>
              </View>
            </View>
          </View>
          
          {/* Message Section */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <FileText size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Message de Bienvenue</Text>
            </View>
            <View style={styles.messageBoxMinimal}>
              <Text style={styles.messageQuote}>"</Text>
              <Text style={styles.messageTextMinimal}>{introduction}</Text>
              <View style={styles.signatureMinimal}>
                <View style={styles.signatureLineMinimal} />
                <Text style={styles.signatureNameMinimal}>Équipe RH</Text>
              </View>
            </View>
          </View>
          
          {/* Onboarding Steps Grid */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <Video size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Étapes d'Intégration</Text>
            </View>
            <View style={styles.onboardingContainerMinimal}>
              {onboardingSteps.map((step, index) => (
                <TouchableOpacity 
                  key={step.id}
                  style={styles.onboardingItem}
                  onPress={() => navigateToOnboarding(step.link)}
                >
                  <View style={styles.onboardingLeft}>
                    <View style={[styles.onboardingDot, { backgroundColor: step.color[0] }]} />
                    {index < onboardingSteps.length - 1 && <View style={styles.onboardingLine} />}
                  </View>
                  <View style={styles.onboardingContent}>
                    <Text style={styles.onboardingTitle}>{step.title}</Text>
                    <Text style={styles.onboardingDesc}>{step.desc}</Text>
                  </View>
                  <Play size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Footer Minimaliste */}
          <View style={styles.footerMinimal}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerTextMinimal}>© 2024 {company}</Text>
            <Text style={styles.footerSubMinimal}>Guide généré avec excellence</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header épuré */}
      <View style={styles.headerMinimal}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButtonMinimal}>
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitleMinimal}>Guide d'Accueil</Text>
        <View style={styles.headerActionsMinimal}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButtonMinimal}>
            <Eye size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.actionButtonMinimal}>
            <Save size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareDocument} style={styles.actionButtonMinimal}>
            <Share size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Informations principales */}
        <View style={styles.mainCard}>
          <View style={styles.cardIconHeader}>
            <FileText size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Informations principales</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Titre du guide</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Guide d'Accueil"
              placeholderTextColor="#CBD5E1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Entreprise</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Ex: TechCorp Industries"
              placeholderTextColor="#CBD5E1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message de bienvenue</Text>
            <TextInput
              style={[styles.input, styles.textAreaMinimal]}
              value={introduction}
              onChangeText={setIntroduction}
              placeholder="Décrivez votre message de bienvenue..."
              placeholderTextColor="#CBD5E1"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Étapes d'Onboarding - Design Cards */}
        <View style={styles.onboardingSection}>
          <View style={styles.cardIconHeader}>
            <Video size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Étapes d'Onboarding</Text>
          </View>
          
          <View style={styles.onboardingGrid}>
            {/* Étape 1 */}
            <View style={styles.onboardingEditCard}>
              <View style={styles.onboardingIconCircle}>
                <Video size={16} color="#10B981" />
              </View>
              <Text style={styles.onboardingCardTitle}>Vidéo</Text>
              <TextInput
                style={styles.onboardingInput}
                value={onboardingSteps[0]?.title || ''}
                onChangeText={(value) => updateOnboardingStep(1, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.onboardingInputSmall}
                value={onboardingSteps[0]?.desc || ''}
                onChangeText={(value) => updateOnboardingStep(1, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Étape 2 */}
            <View style={styles.onboardingEditCard}>
              <View style={styles.onboardingIconCircle}>
                <Image size={16} color="#3B82F6" />
              </View>
              <Text style={styles.onboardingCardTitle}>Images</Text>
              <TextInput
                style={styles.onboardingInput}
                value={onboardingSteps[1]?.title || ''}
                onChangeText={(value) => updateOnboardingStep(2, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.onboardingInputSmall}
                value={onboardingSteps[1]?.desc || ''}
                onChangeText={(value) => updateOnboardingStep(2, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Étape 3 */}
            <View style={styles.onboardingEditCard}>
              <View style={styles.onboardingIconCircle}>
                <Music size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.onboardingCardTitle}>Audio</Text>
              <TextInput
                style={styles.onboardingInput}
                value={onboardingSteps[2]?.title || ''}
                onChangeText={(value) => updateOnboardingStep(3, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.onboardingInputSmall}
                value={onboardingSteps[2]?.desc || ''}
                onChangeText={(value) => updateOnboardingStep(3, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Étape 4 */}
            <View style={styles.onboardingEditCard}>
              <View style={styles.onboardingIconCircle}>
                <Play size={16} color="#EC4899" />
              </View>
              <Text style={styles.onboardingCardTitle}>Interactif</Text>
              <TextInput
                style={styles.onboardingInput}
                value={onboardingSteps[3]?.title || ''}
                onChangeText={(value) => updateOnboardingStep(4, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.onboardingInputSmall}
                value={onboardingSteps[3]?.desc || ''}
                onChangeText={(value) => updateOnboardingStep(4, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>
        </View>

        {/* Étapes d'Onboarding - Liste épurée */}
        <View style={styles.onboardingStepsSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.cardIconHeader}>
              <Video size={24} color="#64748B" />
              <Text style={styles.cardHeaderText}>Étapes d'Onboarding</Text>
            </View>
            <TouchableOpacity onPress={addOnboardingStep} style={styles.addButtonMinimal}>
              <Plus size={16} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          {onboardingSteps.map((step, index) => (
            <View key={step.id} style={styles.onboardingStepEditItem}>
              <View style={styles.onboardingStepEditHeader}>
                <View style={styles.onboardingStepNumber}>
                  <Text style={styles.onboardingStepNumberText}>{index + 1}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeOnboardingStep(step.id)}
                  style={styles.deleteButton}
                >
                  <X size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.onboardingStepTitleInput}
                value={step.title}
                onChangeText={(value) => updateOnboardingStep(step.id, 'title', value)}
                placeholder="Titre de l'étape"
                placeholderTextColor="#CBD5E1"
              />
              
              <TextInput
                style={styles.onboardingStepDescInput}
                value={step.desc}
                onChangeText={(value) => updateOnboardingStep(step.id, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
                multiline
                numberOfLines={2}
              />
            </View>
          ))}
        </View>

        {/* Features - Design minimaliste */}
        <View style={styles.featuresMinimal}>
          <View style={styles.cardIconHeader}>
            <Video size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Caractéristiques</Text>
          </View>
          
          <View style={styles.featuresList}>
            {[
              { icon: <Video size={18} color="#6366F1" />, title: 'Multimédia', desc: 'Support vidéo, image, audio' },
              { icon: <Image size={18} color="#6366F1" />, title: 'HD Quality', desc: 'Résolution haute définition' },
              { icon: <Music size={18} color="#6366F1" />, title: 'Audio Pro', desc: 'Qualité audio professionnelle' },
              { icon: <Play size={18} color="#6366F1" />, title: 'Interactif', desc: 'Contenu interactif' },
              { icon: <FileText size={18} color="#6366F1" />, title: 'Sécurisé', desc: 'Protection des médias' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItemMinimal}>
                <View style={styles.featureIconBox}>
                  {feature.icon}
                </View>
                <View style={styles.featureTextBox}>
                  <Text style={styles.featureTitleMinimal}>{feature.title}</Text>
                  <Text style={styles.featureDescMinimal}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  
  // Header minimaliste
  headerMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButtonMinimal: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  headerTitleMinimal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 16,
  },
  headerActionsMinimal: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonMinimal: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  
  // Content
  scrollContent: {
    flex: 1,
  },
  
  // Main Card
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  textAreaMinimal: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  
  // Onboarding Section
  onboardingSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  onboardingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  onboardingEditCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onboardingIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onboardingCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  onboardingInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  onboardingInputSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  
  // Onboarding Steps Section
  onboardingStepsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonMinimal: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onboardingStepEditItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  onboardingStepEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  onboardingStepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  onboardingStepNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  onboardingStepTitleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  onboardingStepDescInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#64748B',
    textAlignVertical: 'top',
  },
  
  // Features Minimal
  featuresMinimal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuresList: {
    gap: 12,
  },
  featureItemMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitleMinimal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  featureDescMinimal: {
    fontSize: 12,
    color: '#94A3B8',
  },
  
  // Preview Mode
  previewHeaderMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closePreviewButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  previewMode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 16,
  },
  previewScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Cover Minimal
  coverMinimal: {
    height: 400,
    backgroundColor: '#FAFBFC',
    position: 'relative',
    overflow: 'hidden',
  },
  coverDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorLine1: {
    position: 'absolute',
    top: 50,
    left: -50,
    right: -50,
    height: 1,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '15deg' }],
  },
  decorLine2: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    right: -50,
    height: 1,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '-10deg' }],
  },
  decorLine3: {
    position: 'absolute',
    top: '50%',
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coverContentMinimal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  yearMinimal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    letterSpacing: 4,
    marginBottom: 16,
  },
  titleDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#1E293B',
    marginBottom: 16,
  },
  titleMinimal: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  companyMinimal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 24,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taglineMinimal: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  
  // Sections Minimal
  sectionMinimal: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  sectionHeaderMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitleMinimal: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // Message Box
  messageBoxMinimal: {
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
    padding: 24,
    position: 'relative',
  },
  messageQuote: {
    position: 'absolute',
    top: -10,
    left: 10,
    fontSize: 60,
    color: '#E2E8F0',
    fontWeight: '300',
  },
  messageTextMinimal: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  signatureMinimal: {
    alignItems: 'flex-end',
  },
  signatureLineMinimal: {
    width: 80,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 6,
  },
  signatureNameMinimal: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  
  // Onboarding Container Minimal
  onboardingContainerMinimal: {
    paddingLeft: 8,
  },
  onboardingItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  onboardingLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  onboardingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  onboardingLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  onboardingContent: {
    flex: 1,
    paddingTop: -4,
  },
  onboardingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  onboardingDesc: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Footer Minimal
  footerMinimal: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FAFBFC',
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  footerTextMinimal: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubMinimal: {
    fontSize: 11,
    color: '#94A3B8',
  },
}); 