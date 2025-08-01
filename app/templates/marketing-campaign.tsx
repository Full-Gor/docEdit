import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Megaphone, Calendar, Target, TrendingUp, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function MarketingCampaignTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Campagne Marketing');
  const [company, setCompany] = useState('Mon Entreprise');
  const [campaignName, setCampaignName] = useState('Lancement Produit Q1');
  const [manager, setManager] = useState('Marie Dupont');
  const [startDate, setStartDate] = useState('01/02/2024');
  const [endDate, setEndDate] = useState('31/03/2024');
  const [budget, setBudget] = useState('50 000 €');
  const [isPreview, setIsPreview] = useState(false);
  
  const [objectives, setObjectives] = useState([
    { id: 1, objective: 'Augmenter la notoriété de 25%', target: '25%', icon: '🎯' },
    { id: 2, objective: 'Générer 500 nouveaux leads', target: '500', icon: '📈' },
    { id: 3, objective: 'Améliorer le taux de conversion', target: '15%', icon: '💼' },
    { id: 4, objective: 'Renforcer la présence digitale', target: '100%', icon: '🌐' },
  ]);

  const [channels, setChannels] = useState([
    { id: 1, channel: 'Réseaux sociaux', budget: '15 000 €', reach: '50K', icon: '📱' },
    { id: 2, channel: 'Google Ads', budget: '20 000 €', reach: '100K', icon: '🔍' },
    { id: 3, channel: 'Email marketing', budget: '5 000 €', reach: '25K', icon: '📧' },
    { id: 4, channel: 'Influenceurs', budget: '10 000 €', reach: '75K', icon: '⭐' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setCampaignName(savedDoc.campaignName || campaignName);
        setManager(savedDoc.manager || manager);
        setStartDate(savedDoc.startDate || startDate);
        setEndDate(savedDoc.endDate || endDate);
        setBudget(savedDoc.budget || budget);
        if (savedDoc.objectives) {
          setObjectives(savedDoc.objectives);
        }
        if (savedDoc.channels) {
          setChannels(savedDoc.channels);
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

  const updateObjective = (id: number, field: 'objective' | 'target' | 'icon', value: string) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === id 
          ? { ...obj, [field]: value }
          : obj
      )
    );
  };

  const addObjective = () => {
    const newId = Math.max(...objectives.map(o => o.id)) + 1;
    setObjectives(prev => [...prev, {
      id: newId,
      objective: 'Nouvel objectif',
      target: '0%',
      icon: '🎯'
    }]);
  };

  const removeObjective = (id: number) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
  };

  const updateChannel = (id: number, field: 'channel' | 'budget' | 'reach' | 'icon', value: string) => {
    setChannels(prev => 
      prev.map(channel => 
        channel.id === id 
          ? { ...channel, [field]: value }
          : channel
      )
    );
  };

  const addChannel = () => {
    const newId = Math.max(...channels.map(c => c.id)) + 1;
    setChannels(prev => [...prev, {
      id: newId,
      channel: 'Nouveau canal',
      budget: '0 €',
      reach: '0',
      icon: '📱'
    }]);
  };

  const removeChannel = (id: number) => {
    setChannels(prev => prev.filter(channel => channel.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'marketing-campaign',
        title,
        company,
        campaignName,
        manager,
        startDate,
        endDate,
        budget,
        objectives,
        channels,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre campagne marketing a été sauvegardée localement.',
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
            <p><strong>Template:</strong> marketing-campaign.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de la Campagne</Text>
          <View style={styles.sparklesIcon}>
            <Megaphone size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.campaignCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.campaignTitle}>{title}</Text>
              <Text style={styles.campaignSubtitle}>{campaignName}</Text>
              <View style={styles.campaignDetails}>
                <View style={styles.detailItem}>
                  <Target size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{manager}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{startDate} - {endDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <TrendingUp size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Budget : {budget}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Objectives */}
          <View style={styles.campaignSection}>
            <Text style={styles.sectionTitle}>Objectifs de la Campagne</Text>
            {objectives.map((objective, index) => (
              <View key={objective.id} style={styles.objectiveCard}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.objectiveHeader}
                >
                  <Text style={styles.objectiveIcon}>{objective.icon}</Text>
                  <Text style={styles.objectiveText}>{objective.objective}</Text>
                  <Text style={styles.objectiveTarget}>Cible : {objective.target}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Channels */}
          <View style={styles.campaignSection}>
            <Text style={styles.sectionTitle}>Canaux de Diffusion</Text>
            {channels.map((channel, index) => (
              <View key={channel.id} style={styles.channelCard}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.channelHeader}
                >
                  <Text style={styles.channelIcon}>{channel.icon}</Text>
                  <Text style={styles.channelName}>{channel.channel}</Text>
                  <View style={styles.channelDetails}>
                    <Text style={styles.channelBudget}>Budget : {channel.budget}</Text>
                    <Text style={styles.channelReach}>Portée : {channel.reach}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.campaignFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Campagne marketing générée avec stratégie</Text>
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
        <Text style={styles.headerTitle}>Créer une Campagne Marketing</Text>
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
              <Text style={styles.fieldLabel}>Titre de la campagne</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Campagne Marketing"
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
              <Text style={styles.fieldLabel}>Nom de la campagne</Text>
              <Text style={styles.fieldHint}>Nom spécifique de la campagne</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={campaignName}
              onChangeText={setCampaignName}
              placeholder="Ex: Lancement Produit Q1"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Responsable</Text>
              <Text style={styles.fieldHint}>Chef de projet marketing</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={manager}
              onChangeText={setManager}
              placeholder="Ex: Marie Dupont"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date de début</Text>
              <Text style={styles.fieldHint}>Date de lancement</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="Ex: 01/02/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date de fin</Text>
              <Text style={styles.fieldHint}>Date de fin de campagne</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={endDate}
              onChangeText={setEndDate}
              placeholder="Ex: 31/03/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Budget total</Text>
              <Text style={styles.fieldHint}>Budget alloué à la campagne</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={budget}
              onChangeText={setBudget}
              placeholder="Ex: 50 000 €"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Objectives */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Objectifs de la Campagne</Text>
            <TouchableOpacity onPress={addObjective} style={styles.addButton}>
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {objectives.map((objective, index) => (
            <View key={objective.id} style={styles.objectiveEditor}>
              <View style={styles.objectiveHeader}>
                <Text style={styles.objectiveNumber}>Objectif {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeObjective(objective.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={objective.icon}
                  onChangeText={(value) => updateObjective(objective.id, 'icon', value)}
                  placeholder="Ex: 🎯"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Objectif</Text>
                <TextInput
                  style={styles.textInput}
                  value={objective.objective}
                  onChangeText={(value) => updateObjective(objective.id, 'objective', value)}
                  placeholder="Ex: Augmenter la notoriété de 25%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Cible</Text>
                <TextInput
                  style={styles.textInput}
                  value={objective.target}
                  onChangeText={(value) => updateObjective(objective.id, 'target', value)}
                  placeholder="Ex: 25%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Channels */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Canaux de Diffusion</Text>
            <TouchableOpacity onPress={addChannel} style={styles.addButton}>
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {channels.map((channel, index) => (
            <View key={channel.id} style={styles.channelEditor}>
              <View style={styles.channelHeader}>
                <Text style={styles.channelNumber}>Canal {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeChannel(channel.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={channel.icon}
                  onChangeText={(value) => updateChannel(channel.id, 'icon', value)}
                  placeholder="Ex: 📱"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Canal</Text>
                <TextInput
                  style={styles.textInput}
                  value={channel.channel}
                  onChangeText={(value) => updateChannel(channel.id, 'channel', value)}
                  placeholder="Ex: Réseaux sociaux"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Budget</Text>
                <TextInput
                  style={styles.textInput}
                  value={channel.budget}
                  onChangeText={(value) => updateChannel(channel.id, 'budget', value)}
                  placeholder="Ex: 15 000 €"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Portée</Text>
                <TextInput
                  style={styles.textInput}
                  value={channel.reach}
                  onChangeText={(value) => updateChannel(channel.id, 'reach', value)}
                  placeholder="Ex: 50K"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Megaphone size={24} color="#2563EB" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '🎯', title: 'Objectifs Définis', desc: 'Cibles mesurables et SMART' },
            { icon: '📊', title: 'Canaux Multiples', desc: 'Diffusion multi-plateformes' },
            { icon: '💰', title: 'Gestion Budget', desc: 'Allocation par canal' },
            { icon: '📈', title: 'Suivi Performance', desc: 'Métriques et KPIs' },
            { icon: '📅', title: 'Planning', desc: 'Calendrier de campagne' },
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
    backgroundColor: '#DBEAFE',
  },
  objectiveEditor: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  objectiveHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  objectiveNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  channelEditor: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  channelNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
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
  campaignCover: {
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
  campaignTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  campaignSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  campaignDetails: {
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
  campaignSection: {
    marginBottom: 32,
  },
  objectiveCard: {
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
  objectiveHeader: {
    padding: 16,
  },
  objectiveIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  objectiveText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  objectiveTarget: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  channelCard: {
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
  channelHeader: {
    padding: 16,
  },
  channelIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  channelName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  channelDetails: {
    gap: 4,
  },
  channelBudget: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  channelReach: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  campaignFooter: {
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