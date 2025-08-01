import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, TrendingUp, User, Calendar, BarChart3, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function MarketingReportTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Rapport Marketing');
  const [company, setCompany] = useState('Mon Entreprise');
  const [reportTitle, setReportTitle] = useState('Analyse Q1 2024');
  const [analyst, setAnalyst] = useState('Équipe Marketing');
  const [date, setDate] = useState('15/01/2024');
  const [period, setPeriod] = useState('Q1 2024');
  const [isPreview, setIsPreview] = useState(false);
  
  const [metrics, setMetrics] = useState([
    { id: 1, metric: 'Taux de conversion', value: '3.2%', trend: '+15%', icon: '📈' },
    { id: 2, metric: 'Coût par acquisition', value: '45€', trend: '-8%', icon: '💰' },
    { id: 3, metric: 'Taux d\'engagement', value: '4.8%', trend: '+22%', icon: '👥' },
    { id: 4, metric: 'ROI marketing', value: '320%', trend: '+18%', icon: '📊' },
  ]);

  const [campaigns, setCampaigns] = useState([
    { id: 1, name: 'Campagne Google Ads', budget: '15 000€', results: '2.5K leads', performance: 'Excellent', icon: '🔍' },
    { id: 2, name: 'Campagne Facebook', budget: '8 000€', results: '1.8K leads', performance: 'Bon', icon: '📱' },
    { id: 3, name: 'Email marketing', budget: '2 000€', results: '500 leads', performance: 'Moyen', icon: '📧' },
    { id: 4, name: 'Influenceurs', budget: '5 000€', results: '800 leads', performance: 'Bon', icon: '⭐' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setReportTitle(savedDoc.reportTitle || reportTitle);
        setAnalyst(savedDoc.analyst || analyst);
        setDate(savedDoc.date || date);
        setPeriod(savedDoc.period || period);
        if (savedDoc.metrics) {
          setMetrics(savedDoc.metrics);
        }
        if (savedDoc.campaigns) {
          setCampaigns(savedDoc.campaigns);
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

  const updateMetric = (id: number, field: 'metric' | 'value' | 'trend' | 'icon', value: string) => {
    setMetrics(prev => 
      prev.map(metric => 
        metric.id === id 
          ? { ...metric, [field]: value }
          : metric
      )
    );
  };

  const addMetric = () => {
    const newId = Math.max(...metrics.map(m => m.id)) + 1;
    setMetrics(prev => [...prev, {
      id: newId,
      metric: 'Nouvelle métrique',
      value: '0%',
      trend: '+0%',
      icon: '📊'
    }]);
  };

  const removeMetric = (id: number) => {
    setMetrics(prev => prev.filter(metric => metric.id !== id));
  };

  const updateCampaign = (id: number, field: 'name' | 'budget' | 'results' | 'performance' | 'icon', value: string) => {
    setCampaigns(prev => 
      prev.map(campaign => 
        campaign.id === id 
          ? { ...campaign, [field]: value }
          : campaign
      )
    );
  };

  const addCampaign = () => {
    const newId = Math.max(...campaigns.map(c => c.id)) + 1;
    setCampaigns(prev => [...prev, {
      id: newId,
      name: 'Nouvelle campagne',
      budget: '0€',
      results: '0 leads',
      performance: 'À évaluer',
      icon: '📈'
    }]);
  };

  const removeCampaign = (id: number) => {
    setCampaigns(prev => prev.filter(campaign => campaign.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'marketing-report',
        title,
        company,
        reportTitle,
        analyst,
        date,
        period,
        metrics,
        campaigns,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre rapport marketing a été sauvegardé localement.',
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
            <p><strong>Template:</strong> marketing-report.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Rapport</Text>
          <View style={styles.sparklesIcon}>
            <TrendingUp size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#06B6D4', '#0891B2', '#0E7490']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reportCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.reportTitle}>{title}</Text>
              <Text style={styles.reportSubtitle}>{reportTitle}</Text>
              <View style={styles.reportDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{analyst}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <BarChart3 size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{period}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Metrics */}
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Métriques Clés</Text>
            {metrics.map((metric, index) => (
              <View key={metric.id} style={styles.metricCard}>
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.metricHeader}
                >
                  <Text style={styles.metricIcon}>{metric.icon}</Text>
                  <Text style={styles.metricName}>{metric.metric}</Text>
                  <Text style={styles.metricValue}>{metric.value}</Text>
                  <Text style={styles.metricTrend}>{metric.trend}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Campaigns */}
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Analyse des Campagnes</Text>
            {campaigns.map((campaign, index) => (
              <View key={campaign.id} style={styles.campaignCard}>
                <LinearGradient
                  colors={['#06B6D4', '#0891B2']}
                  style={styles.campaignHeader}
                >
                  <Text style={styles.campaignIcon}>{campaign.icon}</Text>
                  <Text style={styles.campaignName}>{campaign.name}</Text>
                  <View style={styles.campaignDetails}>
                    <Text style={styles.campaignBudget}>Budget : {campaign.budget}</Text>
                    <Text style={styles.campaignResults}>Résultats : {campaign.results}</Text>
                    <Text style={styles.campaignPerformance}>Performance : {campaign.performance}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.reportFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Rapport marketing généré avec précision</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#06B6D4', '#0891B2']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Rapport Marketing</Text>
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
              <Text style={styles.fieldLabel}>Titre du rapport</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Rapport Marketing"
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
              <Text style={styles.fieldLabel}>Titre du rapport</Text>
              <Text style={styles.fieldHint}>Titre spécifique de l'analyse</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={reportTitle}
              onChangeText={setReportTitle}
              placeholder="Ex: Analyse Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Analyste</Text>
              <Text style={styles.fieldHint}>Responsable de l'analyse</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={analyst}
              onChangeText={setAnalyst}
              placeholder="Ex: Équipe Marketing"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldHint}>Date de création du rapport</Text>
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
              <Text style={styles.fieldLabel}>Période analysée</Text>
              <Text style={styles.fieldHint}>Période couverte par le rapport</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={period}
              onChangeText={setPeriod}
              placeholder="Ex: Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Metrics */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Métriques Clés</Text>
            <TouchableOpacity onPress={addMetric} style={styles.addButton}>
              <Plus size={20} color="#06B6D4" />
            </TouchableOpacity>
          </View>
          
          {metrics.map((metric, index) => (
            <View key={metric.id} style={styles.metricEditor}>
              <View style={styles.metricHeader}>
                <Text style={styles.metricNumber}>Métrique {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeMetric(metric.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={metric.icon}
                  onChangeText={(value) => updateMetric(metric.id, 'icon', value)}
                  placeholder="Ex: 📈"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Métrique</Text>
                <TextInput
                  style={styles.textInput}
                  value={metric.metric}
                  onChangeText={(value) => updateMetric(metric.id, 'metric', value)}
                  placeholder="Ex: Taux de conversion"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={metric.value}
                  onChangeText={(value) => updateMetric(metric.id, 'value', value)}
                  placeholder="Ex: 3.2%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Tendance</Text>
                <TextInput
                  style={styles.textInput}
                  value={metric.trend}
                  onChangeText={(value) => updateMetric(metric.id, 'trend', value)}
                  placeholder="Ex: +15%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Campaigns */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Analyse des Campagnes</Text>
            <TouchableOpacity onPress={addCampaign} style={styles.addButton}>
              <Plus size={20} color="#06B6D4" />
            </TouchableOpacity>
          </View>
          
          {campaigns.map((campaign, index) => (
            <View key={campaign.id} style={styles.campaignEditor}>
              <View style={styles.campaignHeader}>
                <Text style={styles.campaignNumber}>Campagne {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeCampaign(campaign.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaign.icon}
                  onChangeText={(value) => updateCampaign(campaign.id, 'icon', value)}
                  placeholder="Ex: 🔍"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom de la campagne</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaign.name}
                  onChangeText={(value) => updateCampaign(campaign.id, 'name', value)}
                  placeholder="Ex: Campagne Google Ads"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Budget</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaign.budget}
                  onChangeText={(value) => updateCampaign(campaign.id, 'budget', value)}
                  placeholder="Ex: 15 000€"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Résultats</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaign.results}
                  onChangeText={(value) => updateCampaign(campaign.id, 'results', value)}
                  placeholder="Ex: 2.5K leads"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Performance</Text>
                <TextInput
                  style={styles.textInput}
                  value={campaign.performance}
                  onChangeText={(value) => updateCampaign(campaign.id, 'performance', value)}
                  placeholder="Ex: Excellent, Bon, Moyen"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <TrendingUp size={24} color="#06B6D4" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📊', title: 'Métriques Détaillées', desc: 'KPIs et indicateurs' },
            { icon: '📈', title: 'Analyses Tendances', desc: 'Évolutions temporelles' },
            { icon: '🎯', title: 'Campagnes', desc: 'Performance par canal' },
            { icon: '💰', title: 'ROI Marketing', desc: 'Retour sur investissement' },
            { icon: '📋', title: 'Rapports Structurés', desc: 'Présentation claire' },
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
    backgroundColor: '#CFFAFE',
  },
  metricEditor: {
    backgroundColor: '#CFFAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  metricNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0E7490',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  campaignEditor: {
    backgroundColor: '#CFFAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  campaignHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  campaignNumber: {
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
  reportCover: {
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
  reportTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  reportSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  reportDetails: {
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
  reportSection: {
    marginBottom: 32,
  },
  metricCard: {
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
  metricHeader: {
    padding: 16,
  },
  metricIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  metricName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  metricValue: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
    marginBottom: 4,
  },
  metricTrend: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  campaignCard: {
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
  campaignHeader: {
    padding: 16,
  },
  campaignIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  campaignName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  campaignDetails: {
    gap: 4,
  },
  campaignBudget: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  campaignResults: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  campaignPerformance: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  reportFooter: {
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