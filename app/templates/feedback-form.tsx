import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, FileCheck, User, Calendar, MessageSquare, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function FeedbackFormTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Formulaire de Feedback');
  const [company, setCompany] = useState('Mon Entreprise');
  const [feedbackTitle, setFeedbackTitle] = useState('Retour Client Q1 2024');
  const [author, setAuthor] = useState('Équipe Service Client');
  const [date, setDate] = useState('15/01/2024');
  const [targetService, setTargetService] = useState('Support client');
  const [isPreview, setIsPreview] = useState(false);
  
  const [feedbackCategories, setFeedbackCategories] = useState([
    { id: 1, category: 'Satisfaction générale', rating: '5 étoiles', icon: '⭐' },
    { id: 2, category: 'Qualité du service', rating: '4 étoiles', icon: '🎯' },
    { id: 3, category: 'Rapidité de réponse', rating: '5 étoiles', icon: '⚡' },
    { id: 4, category: 'Professionnalisme', rating: '5 étoiles', icon: '👔' },
  ]);

  const [improvementAreas, setImprovementAreas] = useState([
    { id: 1, area: 'Interface utilisateur', priority: 'Élevée', icon: '🖥️' },
    { id: 2, area: 'Temps de réponse', priority: 'Moyenne', icon: '⏰' },
    { id: 3, area: 'Documentation', priority: 'Faible', icon: '📚' },
    { id: 4, area: 'Formation équipe', priority: 'Élevée', icon: '🎓' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setFeedbackTitle(savedDoc.feedbackTitle || feedbackTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setTargetService(savedDoc.targetService || targetService);
        if (savedDoc.feedbackCategories) {
          setFeedbackCategories(savedDoc.feedbackCategories);
        }
        if (savedDoc.improvementAreas) {
          setImprovementAreas(savedDoc.improvementAreas);
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

  const updateFeedbackCategory = (id: number, field: 'category' | 'rating' | 'icon', value: string) => {
    setFeedbackCategories(prev => 
      prev.map(category => 
        category.id === id 
          ? { ...category, [field]: value }
          : category
      )
    );
  };

  const addFeedbackCategory = () => {
    const newId = Math.max(...feedbackCategories.map(f => f.id)) + 1;
    setFeedbackCategories(prev => [...prev, {
      id: newId,
      category: 'Nouvelle catégorie',
      rating: '3 étoiles',
      icon: '📊'
    }]);
  };

  const removeFeedbackCategory = (id: number) => {
    setFeedbackCategories(prev => prev.filter(category => category.id !== id));
  };

  const updateImprovementArea = (id: number, field: 'area' | 'priority' | 'icon', value: string) => {
    setImprovementAreas(prev => 
      prev.map(area => 
        area.id === id 
          ? { ...area, [field]: value }
          : area
      )
    );
  };

  const addImprovementArea = () => {
    const newId = Math.max(...improvementAreas.map(i => i.id)) + 1;
    setImprovementAreas(prev => [...prev, {
      id: newId,
      area: 'Nouvelle zone',
      priority: 'Moyenne',
      icon: '🔧'
    }]);
  };

  const removeImprovementArea = (id: number) => {
    setImprovementAreas(prev => prev.filter(area => area.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'feedback-form',
        title,
        company,
        feedbackTitle,
        author,
        date,
        targetService,
        feedbackCategories,
        improvementAreas,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre formulaire de feedback a été sauvegardé localement.',
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
            <p><strong>Template:</strong> feedback-form.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Formulaire</Text>
          <View style={styles.sparklesIcon}>
            <FileCheck size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.feedbackCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.feedbackTitle}>{title}</Text>
              <Text style={styles.feedbackSubtitle}>{feedbackTitle}</Text>
              <View style={styles.feedbackDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MessageSquare size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{targetService}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Feedback Categories */}
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Catégories de Feedback</Text>
            {feedbackCategories.map((category, index) => (
              <View key={category.id} style={styles.categoryCard}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.categoryHeader}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryRating}>{category.rating}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Improvement Areas */}
          <View style={styles.feedbackSection}>
            <Text style={styles.sectionTitle}>Zones d'Amélioration</Text>
            {improvementAreas.map((area, index) => (
              <View key={area.id} style={styles.areaCard}>
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.areaHeader}
                >
                  <Text style={styles.areaIcon}>{area.icon}</Text>
                  <Text style={styles.areaName}>{area.area}</Text>
                  <Text style={styles.areaPriority}>Priorité : {area.priority}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.feedbackFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Formulaire de feedback généré avec précision</Text>
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
        <Text style={styles.headerTitle}>Créer un Formulaire de Feedback</Text>
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
              <Text style={styles.fieldLabel}>Titre du formulaire</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Formulaire de Feedback"
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
              <Text style={styles.fieldLabel}>Titre du feedback</Text>
              <Text style={styles.fieldHint}>Titre spécifique du feedback</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={feedbackTitle}
              onChangeText={setFeedbackTitle}
              placeholder="Ex: Retour Client Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable du feedback</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe Service Client"
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
              <Text style={styles.fieldLabel}>Service cible</Text>
              <Text style={styles.fieldHint}>Service évalué</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={targetService}
              onChangeText={setTargetService}
              placeholder="Ex: Support client"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Feedback Categories */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories de Feedback</Text>
            <TouchableOpacity onPress={addFeedbackCategory} style={styles.addButton}>
              <Plus size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          {feedbackCategories.map((category, index) => (
            <View key={category.id} style={styles.categoryEditor}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryNumber}>Catégorie {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeFeedbackCategory(category.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={category.icon}
                  onChangeText={(value) => updateFeedbackCategory(category.id, 'icon', value)}
                  placeholder="Ex: ⭐"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom de la catégorie</Text>
                <TextInput
                  style={styles.textInput}
                  value={category.category}
                  onChangeText={(value) => updateFeedbackCategory(category.id, 'category', value)}
                  placeholder="Ex: Satisfaction générale"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Note</Text>
                <TextInput
                  style={styles.textInput}
                  value={category.rating}
                  onChangeText={(value) => updateFeedbackCategory(category.id, 'rating', value)}
                  placeholder="Ex: 5 étoiles"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Improvement Areas */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Zones d'Amélioration</Text>
            <TouchableOpacity onPress={addImprovementArea} style={styles.addButton}>
              <Plus size={20} color="#06B6D4" />
            </TouchableOpacity>
          </View>
          
          {improvementAreas.map((area, index) => (
            <View key={area.id} style={styles.areaEditor}>
              <View style={styles.areaHeader}>
                <Text style={styles.areaNumber}>Zone {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeImprovementArea(area.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={area.icon}
                  onChangeText={(value) => updateImprovementArea(area.id, 'icon', value)}
                  placeholder="Ex: 🖥️"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom de la zone</Text>
                <TextInput
                  style={styles.textInput}
                  value={area.area}
                  onChangeText={(value) => updateImprovementArea(area.id, 'area', value)}
                  placeholder="Ex: Interface utilisateur"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Priorité</Text>
                <TextInput
                  style={styles.textInput}
                  value={area.priority}
                  onChangeText={(value) => updateImprovementArea(area.id, 'priority', value)}
                  placeholder="Ex: Élevée, Moyenne, Faible"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <FileCheck size={24} color="#8B5CF6" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📊', title: 'Évaluation Multi-Critères', desc: 'Notation par catégories' },
            { icon: '🎯', title: 'Zones d\'Amélioration', desc: 'Identification des points faibles' },
            { icon: '📈', title: 'Suivi Évolutif', desc: 'Comparaison temporelle' },
            { icon: '💬', title: 'Commentaires Libres', desc: 'Feedback qualitatif' },
            { icon: '📱', title: 'Interface Intuitive', desc: 'Facilité d\'utilisation' },
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
    backgroundColor: '#FEE2E2',
  },
  categoryEditor: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  categoryNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  areaEditor: {
    backgroundColor: '#CFFAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  areaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  areaNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
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
  feedbackCover: {
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
  feedbackTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  feedbackSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  feedbackDetails: {
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
  feedbackSection: {
    marginBottom: 32,
  },
  categoryCard: {
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
  categoryHeader: {
    padding: 16,
  },
  categoryIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  categoryRating: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  areaCard: {
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
  areaHeader: {
    padding: 16,
  },
  areaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  areaName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  areaPriority: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  feedbackFooter: {
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