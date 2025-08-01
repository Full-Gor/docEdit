import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, ClipboardList, User, Calendar, Star, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SatisfactionSurveyTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Enquête Satisfaction');
  const [company, setCompany] = useState('Mon Entreprise');
  const [surveyTitle, setSurveyTitle] = useState('Satisfaction Client Q1 2024');
  const [author, setAuthor] = useState('Équipe Marketing');
  const [date, setDate] = useState('15/01/2024');
  const [targetAudience, setTargetAudience] = useState('Clients existants');
  const [isPreview, setIsPreview] = useState(false);
  
  const [questions, setQuestions] = useState([
    { id: 1, question: 'Quelle est votre satisfaction globale ?', type: 'Échelle', options: '1-5', icon: '⭐' },
    { id: 2, question: 'Recommanderiez-vous nos services ?', type: 'Oui/Non', options: 'Oui, Non, Peut-être', icon: '👍' },
    { id: 3, question: 'Quels aspects à améliorer ?', type: 'Texte libre', options: 'Commentaires', icon: '💬' },
    { id: 4, question: 'Notez notre support client', type: 'Échelle', options: '1-10', icon: '📞' },
  ]);

  const [demographics, setDemographics] = useState([
    { id: 1, category: 'Âge', options: '18-25, 26-35, 36-50, 50+', icon: '👤' },
    { id: 2, category: 'Profession', options: 'Salarié, Indépendant, Étudiant, Retraité', icon: '💼' },
    { id: 3, category: 'Fréquence d\'utilisation', options: 'Quotidien, Hebdomadaire, Mensuel, Occasionnel', icon: '📅' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setSurveyTitle(savedDoc.surveyTitle || surveyTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setTargetAudience(savedDoc.targetAudience || targetAudience);
        if (savedDoc.questions) {
          setQuestions(savedDoc.questions);
        }
        if (savedDoc.demographics) {
          setDemographics(savedDoc.demographics);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du document sauvegardé:', error);
      }
    }
  }, [params.savedDocument]);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const updateQuestion = (id: number, field: 'question' | 'type' | 'options' | 'icon', value: string) => {
    setQuestions(prev => 
      prev.map(question => 
        question.id === id 
          ? { ...question, [field]: value }
          : question
      )
    );
  };

  const addQuestion = () => {
    const newId = Math.max(...questions.map(q => q.id)) + 1;
    setQuestions(prev => [...prev, {
      id: newId,
      question: 'Nouvelle question',
      type: 'Échelle',
      options: '1-5',
      icon: '❓'
    }]);
  };

  const removeQuestion = (id: number) => {
    setQuestions(prev => prev.filter(question => question.id !== id));
  };

  const updateDemographic = (id: number, field: 'category' | 'options' | 'icon', value: string) => {
    setDemographics(prev => 
      prev.map(demo => 
        demo.id === id 
          ? { ...demo, [field]: value }
          : demo
      )
    );
  };

  const addDemographic = () => {
    const newId = Math.max(...demographics.map(d => d.id)) + 1;
    setDemographics(prev => [...prev, {
      id: newId,
      category: 'Nouvelle catégorie',
      options: 'Option 1, Option 2, Option 3',
      icon: '📊'
    }]);
  };

  const removeDemographic = (id: number) => {
    setDemographics(prev => prev.filter(demo => demo.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'satisfaction-survey',
        title,
        company,
        surveyTitle,
        author,
        date,
        targetAudience,
        questions,
        demographics,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre enquête satisfaction a été sauvegardée localement.',
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
            <p><strong>Template:</strong> satisfaction-survey.tsx</p>
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
        <LinearGradient
          colors={['#0F172A', '#1E293B']}
          style={styles.previewHeader}
        >
          <TouchableOpacity onPress={togglePreview} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Aperçu de l'Enquête</Text>
          <View style={styles.sparklesIcon}>
            <ClipboardList size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.surveyCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.surveyTitle}>{title}</Text>
              <Text style={styles.surveySubtitle}>{surveyTitle}</Text>
              <View style={styles.surveyDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Star size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{targetAudience}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Questions */}
          <View style={styles.surveySection}>
            <Text style={styles.sectionTitle}>Questions de l'Enquête</Text>
            {questions.map((question, index) => (
              <View key={question.id} style={styles.questionCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.questionHeader}
                >
                  <Text style={styles.questionIcon}>{question.icon}</Text>
                  <Text style={styles.questionText}>{question.question}</Text>
                  <Text style={styles.questionType}>Type : {question.type}</Text>
                  <Text style={styles.questionOptions}>Options : {question.options}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Demographics */}
          <View style={styles.surveySection}>
            <Text style={styles.sectionTitle}>Données Démographiques</Text>
            {demographics.map((demo, index) => (
              <View key={demo.id} style={styles.demoCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.demoHeader}
                >
                  <Text style={styles.demoIcon}>{demo.icon}</Text>
                  <Text style={styles.demoCategory}>{demo.category}</Text>
                  <Text style={styles.demoOptions}>{demo.options}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.surveyFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Enquête satisfaction générée avec précision</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#2563EB', '#1D4ED8']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer une Enquête Satisfaction</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButton}>
            <Eye size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.actionButton}>
            <Save size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareDocument} style={styles.actionButton}>
            <Share size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.editorContent} showsVerticalScrollIndicator={false}>
        <View style={styles.editorCard}>
          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Titre de l'enquête</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Enquête Satisfaction"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Nom de l'entreprise</Text>
              <Text style={styles.fieldHint}>Nom de votre entreprise</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={company}
              onChangeText={setCompany}
              placeholder="Ex: Mon Entreprise"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Titre de l'enquête</Text>
              <Text style={styles.fieldHint}>Titre spécifique de l'enquête</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={surveyTitle}
              onChangeText={setSurveyTitle}
              placeholder="Ex: Satisfaction Client Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable de l'enquête</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe Marketing"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldHint}>Date de création</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
              placeholder="Ex: 15/01/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Audience cible</Text>
              <Text style={styles.fieldHint}>Public visé par l'enquête</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={targetAudience}
              onChangeText={setTargetAudience}
              placeholder="Ex: Clients existants"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Questions */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Questions de l'Enquête</Text>
            <TouchableOpacity onPress={addQuestion} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {questions.map((question, index) => (
            <View key={question.id} style={styles.questionEditor}>
              <View style={styles.questionHeader}>
                <Text style={styles.questionNumber}>Question {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeQuestion(question.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={question.icon}
                  onChangeText={(value) => updateQuestion(question.id, 'icon', value)}
                  placeholder="Ex: ⭐"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Question</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={question.question}
                  onChangeText={(value) => updateQuestion(question.id, 'question', value)}
                  placeholder="Ex: Quelle est votre satisfaction globale ?"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={question.type}
                  onChangeText={(value) => updateQuestion(question.id, 'type', value)}
                  placeholder="Ex: Échelle, Oui/Non, Texte libre"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Options</Text>
                <TextInput
                  style={styles.textInput}
                  value={question.options}
                  onChangeText={(value) => updateQuestion(question.id, 'options', value)}
                  placeholder="Ex: 1-5, Oui/Non/Peut-être"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Demographics */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Données Démographiques</Text>
            <TouchableOpacity onPress={addDemographic} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {demographics.map((demo, index) => (
            <View key={demo.id} style={styles.demoEditor}>
              <View style={styles.demoHeader}>
                <Text style={styles.demoNumber}>Catégorie {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeDemographic(demo.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={demo.icon}
                  onChangeText={(value) => updateDemographic(demo.id, 'icon', value)}
                  placeholder="Ex: 👤"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Catégorie</Text>
                <TextInput
                  style={styles.textInput}
                  value={demo.category}
                  onChangeText={(value) => updateDemographic(demo.id, 'category', value)}
                  placeholder="Ex: Âge"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Options</Text>
                <TextInput
                  style={styles.textInput}
                  value={demo.options}
                  onChangeText={(value) => updateDemographic(demo.id, 'options', value)}
                  placeholder="Ex: 18-25, 26-35, 36-50, 50+"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <ClipboardList size={24} color="#2563EB" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📊', title: 'Questions Variées', desc: 'Échelles, choix multiples, texte libre' },
            { icon: '👥', title: 'Données Démographiques', desc: 'Analyse par segments' },
            { icon: '📈', title: 'Analyses Avancées', desc: 'Statistiques et tendances' },
            { icon: '🔄', title: 'Suivi Temporel', desc: 'Comparaisons périodiques' },
            { icon: '📱', title: 'Multi-Support', desc: 'Mobile, web, papier' },
          ].map((feature, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{feature.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.desc}</Text>
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
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  backButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
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
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  formSection: {
    marginBottom: 20,
  },
  labelContainer: {
    marginBottom: 8,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  fieldHint: {
    fontSize: 14,
    color: '#64748B',
  },
  textInput: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
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
    backgroundColor: '#D1FAE5',
  },
  questionEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  questionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  demoEditor: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  demoNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B21B6',
  },
  featuresCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginLeft: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginRight: 16,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  featureDesc: {
    fontSize: 14,
    color: '#64748B',
  },
  // Preview styles
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    justifyContent: 'space-between',
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  sparklesIcon: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
  },
  previewContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  surveyCover: {
    height: 400,
    borderRadius: 24,
    marginBottom: 32,
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
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  coverCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  coverContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  surveyTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  surveySubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  surveyDetails: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  surveySection: {
    marginBottom: 32,
  },
  questionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  questionHeader: {
    padding: 16,
  },
  questionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  questionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  questionType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  questionOptions: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  demoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    overflow: 'hidden',
  },
  demoHeader: {
    padding: 16,
  },
  demoIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  demoCategory: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  demoOptions: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  surveyFooter: {
    alignItems: 'center',
    paddingVertical: 32,
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