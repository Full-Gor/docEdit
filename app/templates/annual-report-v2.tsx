import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, TrendingUp, Users, Target, Award, Sparkles, ChevronRight, Plus, X, FileText, BarChart3, Calendar, Briefcase } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AnnualReportTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Rapport Annuel 2024');
  const [company, setCompany] = useState('Mon Entreprise');
  const [introduction, setIntroduction] = useState('Cette année a été marquée par une croissance exceptionnelle et des réalisations remarquables...');
  const [isPreview, setIsPreview] = useState(false);
  
  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setIntroduction(savedDoc.introduction || introduction);
        
        if (savedDoc.metrics) {
          setMetricGrowthNumber(savedDoc.metrics.growth?.number || metricGrowthNumber);
          setMetricGrowthLabel(savedDoc.metrics.growth?.label || metricGrowthLabel);
          setMetricGrowthSubtext(savedDoc.metrics.growth?.subtext || metricGrowthSubtext);
          
          setMetricEmployeesNumber(savedDoc.metrics.employees?.number || metricEmployeesNumber);
          setMetricEmployeesLabel(savedDoc.metrics.employees?.label || metricEmployeesLabel);
          setMetricEmployeesSubtext(savedDoc.metrics.employees?.subtext || metricEmployeesSubtext);
          
          setMetricSatisfactionNumber(savedDoc.metrics.satisfaction?.number || metricSatisfactionNumber);
          setMetricSatisfactionLabel(savedDoc.metrics.satisfaction?.label || metricSatisfactionLabel);
          setMetricSatisfactionSubtext(savedDoc.metrics.satisfaction?.subtext || metricSatisfactionSubtext);
          
          setMetricAwardsNumber(savedDoc.metrics.awards?.number || metricAwardsNumber);
          setMetricAwardsLabel(savedDoc.metrics.awards?.label || metricAwardsLabel);
          setMetricAwardsSubtext(savedDoc.metrics.awards?.subtext || metricAwardsSubtext);
        }
        
        if (savedDoc.achievements) {
          setAchievements(savedDoc.achievements);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du document sauvegardé:', error);
      }
    }
  }, [params.savedDocument]);
  
  // State variables pour les métriques
  const [metricGrowthNumber, setMetricGrowthNumber] = useState('+25%');
  const [metricGrowthLabel, setMetricGrowthLabel] = useState('Croissance');
  const [metricGrowthSubtext, setMetricGrowthSubtext] = useState('vs 2023');
  
  const [metricEmployeesNumber, setMetricEmployeesNumber] = useState('150+');
  const [metricEmployeesLabel, setMetricEmployeesLabel] = useState('Collaborateurs');
  const [metricEmployeesSubtext, setMetricEmployeesSubtext] = useState('Équipe talentueuse');
  
  const [metricSatisfactionNumber, setMetricSatisfactionNumber] = useState('98%');
  const [metricSatisfactionLabel, setMetricSatisfactionLabel] = useState('Satisfaction');
  const [metricSatisfactionSubtext, setMetricSatisfactionSubtext] = useState('Clients satisfaits');
  
  const [metricAwardsNumber, setMetricAwardsNumber] = useState('12');
  const [metricAwardsLabel, setMetricAwardsLabel] = useState('Prix reçus');
  const [metricAwardsSubtext, setMetricAwardsSubtext] = useState('Excellence reconnue');
  
  // State variables pour les réalisations majeures
  const [achievements, setAchievements] = useState([
    { id: 1, title: 'Expansion Internationale', desc: '3 nouveaux marchés conquis', color: ['#6366F1', '#4F46E5'], link: '/projects/expansion' },
    { id: 2, title: 'Innovation Produit', desc: '5 lancements révolutionnaires', color: ['#10B981', '#059669'], link: '/projects/innovation' },
    { id: 3, title: 'Certification ISO 14001', desc: 'Excellence environnementale', color: ['#F59E0B', '#D97706'], link: '/projects/certification' },
    { id: 4, title: 'Programme RSE', desc: 'Impact social renforcé', color: ['#EC4899', '#DB2777'], link: '/projects/rse' },
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const updateAchievement = (id: number, field: 'title' | 'desc', value: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, [field]: value }
          : achievement
      )
    );
  };

  const addAchievement = () => {
    const newId = Math.max(...achievements.map(a => a.id)) + 1;
    const colors = [
      ['#6366F1', '#4F46E5'],
      ['#10B981', '#059669'],
      ['#F59E0B', '#D97706'],
      ['#EC4899', '#DB2777'],
      ['#8B5CF6', '#7C3AED'],
      ['#EF4444', '#DC2626'],
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setAchievements(prev => [...prev, {
      id: newId,
      title: 'Nouvelle Réalisation',
      desc: 'Description de la réalisation',
      color: randomColor,
      link: '/projects/new'
    }]);
  };

  const removeAchievement = (id: number) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  const navigateToProject = (link: string) => {
    console.log('Navigation vers:', link);
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'annual-report',
        title,
        company,
        introduction,
        metrics: {
          growth: { number: metricGrowthNumber, label: metricGrowthLabel, subtext: metricGrowthSubtext },
          employees: { number: metricEmployeesNumber, label: metricEmployeesLabel, subtext: metricEmployeesSubtext },
          satisfaction: { number: metricSatisfactionNumber, label: metricSatisfactionLabel, subtext: metricSatisfactionSubtext },
          awards: { number: metricAwardsNumber, label: metricAwardsLabel, subtext: metricAwardsSubtext },
        },
        achievements,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre rapport annuel a été sauvegardé localement.',
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
            <p><strong>Template:</strong> annual-report-v2.tsx</p>
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
                <Text style={styles.taglineMinimal}>Innovation</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Croissance</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Excellence</Text>
              </View>
            </View>
          </View>
          
          {/* Message Section */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <FileText size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Message du Directeur</Text>
            </View>
            <View style={styles.messageBoxMinimal}>
              <Text style={styles.messageQuote}>"</Text>
              <Text style={styles.messageTextMinimal}>{introduction}</Text>
              <View style={styles.signatureMinimal}>
                <View style={styles.signatureLineMinimal} />
                <Text style={styles.signatureNameMinimal}>Direction Générale</Text>
              </View>
            </View>
          </View>
          
          {/* Metrics Grid Minimaliste */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <BarChart3 size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Performance 2024</Text>
            </View>
            <View style={styles.metricsContainerMinimal}>
              <View style={[styles.metricBoxMinimal, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.metricValueMinimal}>{metricGrowthNumber}</Text>
                <Text style={styles.metricLabelMinimal}>{metricGrowthLabel}</Text>
                <Text style={styles.metricSubMinimal}>{metricGrowthSubtext}</Text>
              </View>
              
              <View style={[styles.metricBoxMinimal, { borderLeftColor: '#3B82F6' }]}>
                <Text style={styles.metricValueMinimal}>{metricEmployeesNumber}</Text>
                <Text style={styles.metricLabelMinimal}>{metricEmployeesLabel}</Text>
                <Text style={styles.metricSubMinimal}>{metricEmployeesSubtext}</Text>
              </View>
              
              <View style={[styles.metricBoxMinimal, { borderLeftColor: '#8B5CF6' }]}>
                <Text style={styles.metricValueMinimal}>{metricSatisfactionNumber}</Text>
                <Text style={styles.metricLabelMinimal}>{metricSatisfactionLabel}</Text>
                <Text style={styles.metricSubMinimal}>{metricSatisfactionSubtext}</Text>
              </View>
              
              <View style={[styles.metricBoxMinimal, { borderLeftColor: '#EC4899' }]}>
                <Text style={styles.metricValueMinimal}>{metricAwardsNumber}</Text>
                <Text style={styles.metricLabelMinimal}>{metricAwardsLabel}</Text>
                <Text style={styles.metricSubMinimal}>{metricAwardsSubtext}</Text>
              </View>
            </View>
          </View>
          
          {/* Achievements Timeline */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <Award size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Réalisations Clés</Text>
            </View>
            <View style={styles.timelineContainer}>
              {achievements.map((achievement, index) => (
                <TouchableOpacity 
                  key={achievement.id}
                  style={styles.timelineItem}
                  onPress={() => navigateToProject(achievement.link)}
                >
                  <View style={styles.timelineLeft}>
                    <View style={[styles.timelineDot, { backgroundColor: achievement.color[0] }]} />
                    {index < achievements.length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={styles.timelineContent}>
                    <Text style={styles.timelineTitle}>{achievement.title}</Text>
                    <Text style={styles.timelineDesc}>{achievement.desc}</Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Footer Minimaliste */}
          <View style={styles.footerMinimal}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerTextMinimal}>© 2024 {company}</Text>
            <Text style={styles.footerSubMinimal}>Rapport généré avec excellence</Text>
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
        <Text style={styles.headerTitleMinimal}>Rapport Annuel</Text>
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
            <Text style={styles.inputLabel}>Titre du rapport</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Rapport Annuel 2024"
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
            <Text style={styles.inputLabel}>Message d'introduction</Text>
            <TextInput
              style={[styles.input, styles.textAreaMinimal]}
              value={introduction}
              onChangeText={setIntroduction}
              placeholder="Décrivez les points forts de l'année..."
              placeholderTextColor="#CBD5E1"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Métriques - Design Cards */}
        <View style={styles.metricsSection}>
          <View style={styles.cardIconHeader}>
            <BarChart3 size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Indicateurs de performance</Text>
          </View>
          
          <View style={styles.metricsGrid}>
            {/* Métrique 1 */}
            <View style={styles.metricEditCard}>
              <View style={styles.metricIconCircle}>
                <TrendingUp size={16} color="#10B981" />
              </View>
              <Text style={styles.metricCardTitle}>Croissance</Text>
              <TextInput
                style={styles.metricInput}
                value={metricGrowthNumber}
                onChangeText={setMetricGrowthNumber}
                placeholder="Valeur"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricGrowthLabel}
                onChangeText={setMetricGrowthLabel}
                placeholder="Label"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricGrowthSubtext}
                onChangeText={setMetricGrowthSubtext}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Métrique 2 */}
            <View style={styles.metricEditCard}>
              <View style={styles.metricIconCircle}>
                <Users size={16} color="#3B82F6" />
              </View>
              <Text style={styles.metricCardTitle}>Équipe</Text>
              <TextInput
                style={styles.metricInput}
                value={metricEmployeesNumber}
                onChangeText={setMetricEmployeesNumber}
                placeholder="Valeur"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricEmployeesLabel}
                onChangeText={setMetricEmployeesLabel}
                placeholder="Label"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricEmployeesSubtext}
                onChangeText={setMetricEmployeesSubtext}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Métrique 3 */}
            <View style={styles.metricEditCard}>
              <View style={styles.metricIconCircle}>
                <Target size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.metricCardTitle}>Objectifs</Text>
              <TextInput
                style={styles.metricInput}
                value={metricSatisfactionNumber}
                onChangeText={setMetricSatisfactionNumber}
                placeholder="Valeur"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricSatisfactionLabel}
                onChangeText={setMetricSatisfactionLabel}
                placeholder="Label"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricSatisfactionSubtext}
                onChangeText={setMetricSatisfactionSubtext}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Métrique 4 */}
            <View style={styles.metricEditCard}>
              <View style={styles.metricIconCircle}>
                <Award size={16} color="#EC4899" />
              </View>
              <Text style={styles.metricCardTitle}>Récompenses</Text>
              <TextInput
                style={styles.metricInput}
                value={metricAwardsNumber}
                onChangeText={setMetricAwardsNumber}
                placeholder="Valeur"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricAwardsLabel}
                onChangeText={setMetricAwardsLabel}
                placeholder="Label"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.metricInputSmall}
                value={metricAwardsSubtext}
                onChangeText={setMetricAwardsSubtext}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>
        </View>

        {/* Réalisations - Liste épurée */}
        <View style={styles.achievementsSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.cardIconHeader}>
              <Award size={24} color="#64748B" />
              <Text style={styles.cardHeaderText}>Réalisations majeures</Text>
            </View>
            <TouchableOpacity onPress={addAchievement} style={styles.addButtonMinimal}>
              <Plus size={16} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          {achievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.achievementEditItem}>
              <View style={styles.achievementEditHeader}>
                <View style={styles.achievementNumber}>
                  <Text style={styles.achievementNumberText}>{index + 1}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeAchievement(achievement.id)}
                  style={styles.deleteButton}
                >
                  <X size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.achievementTitleInput}
                value={achievement.title}
                onChangeText={(value) => updateAchievement(achievement.id, 'title', value)}
                placeholder="Titre de la réalisation"
                placeholderTextColor="#CBD5E1"
              />
              
              <TextInput
                style={styles.achievementDescInput}
                value={achievement.desc}
                onChangeText={(value) => updateAchievement(achievement.id, 'desc', value)}
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
            <Sparkles size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Caractéristiques</Text>
          </View>
          
          <View style={styles.featuresList}>
            {[
              { icon: <Briefcase size={18} color="#6366F1" />, title: 'Design Moderne', desc: 'Mise en page professionnelle' },
              { icon: <BarChart3 size={18} color="#6366F1" />, title: 'Visualisations', desc: 'Graphiques et métriques' },
              { icon: <FileText size={18} color="#6366F1" />, title: 'Sections Dynamiques', desc: 'Contenu personnalisable' },
              { icon: <Calendar size={18} color="#6366F1" />, title: 'Export HD', desc: 'Format PDF haute résolution' },
              { icon: <Target size={18} color="#6366F1" />, title: 'Sécurisé', desc: 'Protection des données' },
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
  
  // Metrics Section
  metricsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  metricEditCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  metricIconCircle: {
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
  metricCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  metricInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
    textAlign: 'center',
  },
  metricInputSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
    textAlign: 'center',
  },
  
  // Achievements Section
  achievementsSection: {
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
  achievementEditItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  achievementEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  achievementNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  achievementTitleInput: {
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
  achievementDescInput: {
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
  
  // Metrics Container Minimal
  metricsContainerMinimal: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricBoxMinimal: {
    width: (width - 64) / 2,
    backgroundColor: '#FAFBFC',
    padding: 20,
    borderLeftWidth: 4,
  },
  metricValueMinimal: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  metricLabelMinimal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 2,
  },
  metricSubMinimal: {
    fontSize: 11,
    color: '#94A3B8',
  },
  
  // Timeline
  timelineContainer: {
    paddingLeft: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  timelineLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingTop: -4,
  },
  timelineTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  timelineDesc: {
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