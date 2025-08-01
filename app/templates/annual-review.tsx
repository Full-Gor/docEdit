import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Award, User, Calendar, Star, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AnnualReviewTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Évaluation Annuelle 2024');
  const [company, setCompany] = useState('Mon Entreprise');
  const [employeeName, setEmployeeName] = useState('Jean Dupont');
  const [position, setPosition] = useState('Développeur Full Stack');
  const [evaluationDate, setEvaluationDate] = useState('15/12/2024');
  const [evaluator, setEvaluator] = useState('Marie Martin');
  const [isPreview, setIsPreview] = useState(false);
  
  const [criteria, setCriteria] = useState([
    { id: 1, title: 'Compétences techniques', score: 4, comment: 'Excellente maîtrise des technologies', icon: '💻' },
    { id: 2, title: 'Travail en équipe', score: 5, comment: 'Collaboration exemplaire', icon: '👥' },
    { id: 3, title: 'Communication', score: 4, comment: 'Communication claire et efficace', icon: '💬' },
    { id: 4, title: 'Initiative', score: 3, comment: 'Bonne prise d\'initiative', icon: '🚀' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setEmployeeName(savedDoc.employeeName || employeeName);
        setPosition(savedDoc.position || position);
        setEvaluationDate(savedDoc.evaluationDate || evaluationDate);
        setEvaluator(savedDoc.evaluator || evaluator);
        if (savedDoc.criteria) {
          setCriteria(savedDoc.criteria);
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

  const updateCriteria = (id: number, field: 'title' | 'comment' | 'icon', value: string) => {
    setCriteria(prev => 
      prev.map(criterion => 
        criterion.id === id 
          ? { ...criterion, [field]: value }
          : criterion
      )
    );
  };

  const updateScore = (id: number, score: number) => {
    setCriteria(prev => 
      prev.map(criterion => 
        criterion.id === id 
          ? { ...criterion, score }
          : criterion
      )
    );
  };

  const addCriteria = () => {
    const newId = Math.max(...criteria.map(c => c.id)) + 1;
    setCriteria(prev => [...prev, {
      id: newId,
      title: 'Nouveau critère',
      score: 3,
      comment: 'Commentaire sur le critère',
      icon: '📋'
    }]);
  };

  const removeCriteria = (id: number) => {
    setCriteria(prev => prev.filter(criterion => criterion.id !== id));
  };

  const getScoreColor = (score: number) => {
    if (score >= 4) return '#10B981';
    if (score >= 3) return '#F59E0B';
    return '#EF4444';
  };

  const getScoreText = (score: number) => {
    if (score >= 4) return 'Excellent';
    if (score >= 3) return 'Bon';
    return 'À améliorer';
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'annual-review',
        title,
        company,
        employeeName,
        position,
        evaluationDate,
        evaluator,
        criteria,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre évaluation annuelle a été sauvegardée localement.',
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
            <p><strong>Template:</strong> annual-review.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de l'Évaluation</Text>
          <View style={styles.sparklesIcon}>
            <Award size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#F59E0B', '#D97706', '#B45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reviewCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.reviewTitle}>{title}</Text>
              <Text style={styles.companyName}>{company}</Text>
              <View style={styles.reviewDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{employeeName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Award size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{position}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{evaluationDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Évaluateur : {evaluator}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Criteria */}
          <View style={styles.reviewSection}>
            <Text style={styles.sectionTitle}>Critères d'Évaluation</Text>
            {criteria.map((criterion, index) => (
              <View key={criterion.id} style={styles.criteriaCard}>
                <LinearGradient
                  colors={[getScoreColor(criterion.score), getScoreColor(criterion.score)]}
                  style={styles.criteriaHeader}
                >
                  <Text style={styles.criteriaIcon}>{criterion.icon}</Text>
                  <Text style={styles.criteriaTitle}>{criterion.title}</Text>
                  <View style={styles.scoreContainer}>
                    <Text style={styles.scoreText}>{criterion.score}/5</Text>
                    <Text style={styles.scoreLabel}>{getScoreText(criterion.score)}</Text>
                  </View>
                  <Text style={styles.criteriaComment}>{criterion.comment}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.reviewFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Évaluation générée avec objectivité</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer une Évaluation Annuelle</Text>
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
              <Text style={styles.fieldLabel}>Titre de l'évaluation</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Évaluation Annuelle 2024"
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
              <Text style={styles.fieldLabel}>Nom de l'employé</Text>
              <Text style={styles.fieldHint}>Nom et prénom de l'employé</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={employeeName}
              onChangeText={setEmployeeName}
              placeholder="Ex: Jean Dupont"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Poste occupé</Text>
              <Text style={styles.fieldHint}>Intitulé du poste</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={position}
              onChangeText={setPosition}
              placeholder="Ex: Développeur Full Stack"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date d'évaluation</Text>
              <Text style={styles.fieldHint}>Date de l'évaluation</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={evaluationDate}
              onChangeText={setEvaluationDate}
              placeholder="Ex: 15/12/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Évaluateur</Text>
              <Text style={styles.fieldHint}>Nom de l'évaluateur</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={evaluator}
              onChangeText={setEvaluator}
              placeholder="Ex: Marie Martin"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Criteria */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Critères d'Évaluation</Text>
            <TouchableOpacity onPress={addCriteria} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {criteria.map((criterion, index) => (
            <View key={criterion.id} style={styles.criteriaEditor}>
              <View style={styles.criteriaHeader}>
                <Text style={styles.criteriaNumber}>Critère {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeCriteria(criterion.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={criterion.icon}
                  onChangeText={(value) => updateCriteria(criterion.id, 'icon', value)}
                  placeholder="Ex: 💻"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre du critère</Text>
                <TextInput
                  style={styles.textInput}
                  value={criterion.title}
                  onChangeText={(value) => updateCriteria(criterion.id, 'title', value)}
                  placeholder="Ex: Compétences techniques"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Note (1-5)</Text>
                <View style={styles.scoreInputContainer}>
                  {[1, 2, 3, 4, 5].map((score) => (
                    <TouchableOpacity
                      key={score}
                      style={[
                        styles.scoreButton,
                        criterion.score === score && styles.scoreButtonActive
                      ]}
                      onPress={() => updateScore(criterion.id, score)}
                    >
                      <Text style={[
                        styles.scoreButtonText,
                        criterion.score === score && styles.scoreButtonTextActive
                      ]}>
                        {score}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Commentaire</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={criterion.comment}
                  onChangeText={(value) => updateCriteria(criterion.id, 'comment', value)}
                  placeholder="Ex: Excellente maîtrise des technologies"
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
            <Award size={24} color="#F59E0B" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📊', title: 'Évaluation Structurée', desc: 'Critères objectifs et mesurables' },
            { icon: '⭐', title: 'Système de Notation', desc: 'Échelle de 1 à 5 claire' },
            { icon: '💬', title: 'Commentaires Détaillés', desc: 'Feedback constructif' },
            { icon: '📅', title: 'Suivi Annuel', desc: 'Évolution des performances' },
            { icon: '🎯', title: 'Objectifs Définis', desc: 'Plan d\'amélioration' },
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
  smallTextArea: {
    height: 80,
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
    backgroundColor: '#FEF3C7',
  },
  criteriaEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  criteriaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  criteriaNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  scoreInputContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  scoreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  scoreButtonActive: {
    backgroundColor: '#F59E0B',
    borderColor: '#F59E0B',
  },
  scoreButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  scoreButtonTextActive: {
    color: '#FFFFFF',
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
  reviewCover: {
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
  reviewTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  companyName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  reviewDetails: {
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
  reviewSection: {
    marginBottom: 32,
  },
  criteriaCard: {
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
  criteriaHeader: {
    padding: 16,
  },
  criteriaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  criteriaTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  scoreLabel: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  criteriaComment: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  reviewFooter: {
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