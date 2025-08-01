import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, TrendingUp, Users, Target, Award, Sparkles, ChevronRight, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { sharePDF, PDFData } from '../../utils/pdfGenerator';

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
    // Navigation vers la page du projet
    console.log('Navigation vers:', link);
    // router.push(link); // Décommentez quand les pages projets seront créées
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

      // Récupérer les documents existants
      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      
      // Ajouter le nouveau document
      documents.push(documentData);
      
      // Sauvegarder la liste mise à jour
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
        title: title,
        author: 'Direction Générale',
        date: new Date().toLocaleDateString('fr-FR'),
        company: company,
        content: `
          <h1>Rapport Annuel 2024</h1>
          <h2>Message du Directeur</h2>
          <p>${introduction}</p>
          
          <h2>Chiffres Clés 2024</h2>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0;">
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #10B981; font-size: 2em; margin: 0;">${metricGrowthNumber}</h3>
              <p><strong>${metricGrowthLabel}</strong></p>
              <p style="color: #666;">${metricGrowthSubtext}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #3B82F6; font-size: 2em; margin: 0;">${metricEmployeesNumber}</h3>
              <p><strong>${metricEmployeesLabel}</strong></p>
              <p style="color: #666;">${metricEmployeesSubtext}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #F59E0B; font-size: 2em; margin: 0;">${metricSatisfactionNumber}</h3>
              <p><strong>${metricSatisfactionLabel}</strong></p>
              <p style="color: #666;">${metricSatisfactionSubtext}</p>
            </div>
            <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
              <h3 style="color: #EC4899; font-size: 2em; margin: 0;">${metricAwardsNumber}</h3>
              <p><strong>${metricAwardsLabel}</strong></p>
              <p style="color: #666;">${metricAwardsSubtext}</p>
            </div>
          </div>
          
          <h2>Réalisations Majeures</h2>
          ${achievements.map(achievement => `
            <div style="background: linear-gradient(135deg, ${achievement.color[0]}, ${achievement.color[1]}); color: white; padding: 20px; border-radius: 10px; margin: 15px 0;">
              <h3 style="margin: 0 0 10px 0;">${achievement.title}</h3>
              <p style="margin: 0; opacity: 0.9;">${achievement.desc}</p>
            </div>
          `).join('')}
          
          <h2>Perspectives 2025</h2>
          <p>Notre entreprise continue son expansion avec des objectifs ambitieux pour l'année à venir. Nous nous engageons à maintenir notre excellence opérationnelle tout en innovant constamment pour répondre aux besoins de nos clients.</p>
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
            <Sparkles size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#EC4899']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.reportCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.reportYear}>2024</Text>
              <Text style={styles.reportTitle}>{title}</Text>
              <View style={styles.companyBadge}>
                <Text style={styles.reportCompany}>{company}</Text>
              </View>
              <Text style={styles.reportTagline}>Innovation • Croissance • Excellence</Text>
            </View>
          </LinearGradient>
          
          {/* Introduction Section */}
          <View style={styles.reportSection}>
            <LinearGradient
              colors={['#FBBF24', '#F59E0B']}
              style={styles.sectionIcon}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Message du Directeur</Text>
            <View style={styles.messageCard}>
              <Text style={styles.messageText}>{introduction}</Text>
              <View style={styles.signatureContainer}>
                <View style={styles.signatureLine} />
                <Text style={styles.signatureText}>Direction Générale</Text>
              </View>
            </View>
          </View>
          
          {/* Key Metrics */}
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Chiffres Clés 2024</Text>
            <View style={styles.metricsGrid}>
              <LinearGradient
                colors={['#10B981', '#059669']}
                style={styles.metricCard}
              >
                <TrendingUp size={32} color="#FFFFFF" />
                <Text style={styles.metricNumber}>{metricGrowthNumber}</Text>
                <Text style={styles.metricLabel}>{metricGrowthLabel}</Text>
                <Text style={styles.metricSubtext}>{metricGrowthSubtext}</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#3B82F6', '#2563EB']}
                style={styles.metricCard}
              >
                <Users size={32} color="#FFFFFF" />
                <Text style={styles.metricNumber}>{metricEmployeesNumber}</Text>
                <Text style={styles.metricLabel}>{metricEmployeesLabel}</Text>
                <Text style={styles.metricSubtext}>{metricEmployeesSubtext}</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.metricCard}
              >
                <Target size={32} color="#FFFFFF" />
                <Text style={styles.metricNumber}>{metricSatisfactionNumber}</Text>
                <Text style={styles.metricLabel}>{metricSatisfactionLabel}</Text>
                <Text style={styles.metricSubtext}>{metricSatisfactionSubtext}</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#EC4899', '#DB2777']}
                style={styles.metricCard}
              >
                <Award size={32} color="#FFFFFF" />
                <Text style={styles.metricNumber}>{metricAwardsNumber}</Text>
                <Text style={styles.metricLabel}>{metricAwardsLabel}</Text>
                <Text style={styles.metricSubtext}>{metricAwardsSubtext}</Text>
              </LinearGradient>
            </View>
          </View>
          
          {/* Achievements */}
          <View style={styles.reportSection}>
            <Text style={styles.sectionTitle}>Nos Réalisations Majeures</Text>
            {achievements.map((achievement, index) => (
              <TouchableOpacity 
                key={achievement.id} 
                style={styles.achievementCard}
                onPress={() => navigateToProject(achievement.link)}
              >
                <LinearGradient
                  colors={achievement.color}
                  style={styles.achievementGradient}
                >
                  <View style={styles.achievementContent}>
                    <View>
                      <Text style={styles.achievementTitle}>{achievement.title}</Text>
                      <Text style={styles.achievementDesc}>{achievement.desc}</Text>
                    </View>
                    <ChevronRight size={24} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.reportFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Rapport généré avec excellence</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Rapport Annuel</Text>
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
              <Text style={styles.fieldHint}>Titre principal affiché sur la couverture</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Rapport Annuel 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Nom de l'entreprise</Text>
              <Text style={styles.fieldHint}>Sera affiché en évidence</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={company}
              onChangeText={setCompany}
              placeholder="Ex: TechCorp Industries"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Message d'introduction</Text>
              <Text style={styles.fieldHint}>Message du directeur ou introduction générale</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={introduction}
              onChangeText={setIntroduction}
              placeholder="Décrivez les points forts de l'année..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Métriques Clés - Section Modifiable */}
        <View style={styles.editorCard}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>📊 Métriques Clés</Text>
            <Text style={styles.cardSubtitle}>Personnalisez vos 4 indicateurs principaux</Text>
          </View>
          
          {/* Métrique 1 - Croissance */}
          <View style={styles.metricEditSection}>
            <View style={styles.metricEditHeader}>
              <View style={[styles.metricEditIcon, { backgroundColor: '#10B981' }]}>
                <TrendingUp size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricEditTitle}>Métrique 1 - Croissance</Text>
            </View>
            <View style={styles.metricEditRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.miniLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricGrowthNumber}
                  onChangeText={setMetricGrowthNumber}
                  placeholder="+25%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.miniLabel}>Label</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricGrowthLabel}
                  onChangeText={setMetricGrowthLabel}
                  placeholder="Croissance"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.miniLabel}>Sous-texte</Text>
              <TextInput
                style={styles.textInput}
                value={metricGrowthSubtext}
                onChangeText={setMetricGrowthSubtext}
                placeholder="vs 2023"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
          
          {/* Métrique 2 - Employés */}
          <View style={styles.metricEditSection}>
            <View style={styles.metricEditHeader}>
              <View style={[styles.metricEditIcon, { backgroundColor: '#3B82F6' }]}>
                <Users size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricEditTitle}>Métrique 2 - Équipe</Text>
            </View>
            <View style={styles.metricEditRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.miniLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricEmployeesNumber}
                  onChangeText={setMetricEmployeesNumber}
                  placeholder="150+"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.miniLabel}>Label</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricEmployeesLabel}
                  onChangeText={setMetricEmployeesLabel}
                  placeholder="Collaborateurs"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.miniLabel}>Sous-texte</Text>
              <TextInput
                style={styles.textInput}
                value={metricEmployeesSubtext}
                onChangeText={setMetricEmployeesSubtext}
                placeholder="Équipe talentueuse"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
          
          {/* Métrique 3 - Satisfaction */}
          <View style={styles.metricEditSection}>
            <View style={styles.metricEditHeader}>
              <View style={[styles.metricEditIcon, { backgroundColor: '#8B5CF6' }]}>
                <Target size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricEditTitle}>Métrique 3 - Satisfaction</Text>
            </View>
            <View style={styles.metricEditRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.miniLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricSatisfactionNumber}
                  onChangeText={setMetricSatisfactionNumber}
                  placeholder="98%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.miniLabel}>Label</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricSatisfactionLabel}
                  onChangeText={setMetricSatisfactionLabel}
                  placeholder="Satisfaction"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.miniLabel}>Sous-texte</Text>
              <TextInput
                style={styles.textInput}
                value={metricSatisfactionSubtext}
                onChangeText={setMetricSatisfactionSubtext}
                placeholder="Clients satisfaits"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
          
          {/* Métrique 4 - Prix */}
          <View style={styles.metricEditSection}>
            <View style={styles.metricEditHeader}>
              <View style={[styles.metricEditIcon, { backgroundColor: '#EC4899' }]}>
                <Award size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.metricEditTitle}>Métrique 4 - Récompenses</Text>
            </View>
            <View style={styles.metricEditRow}>
              <View style={[styles.formSection, { flex: 1, marginRight: 8 }]}>
                <Text style={styles.miniLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricAwardsNumber}
                  onChangeText={setMetricAwardsNumber}
                  placeholder="12"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={[styles.formSection, { flex: 1, marginLeft: 8 }]}>
                <Text style={styles.miniLabel}>Label</Text>
                <TextInput
                  style={styles.textInput}
                  value={metricAwardsLabel}
                  onChangeText={setMetricAwardsLabel}
                  placeholder="Prix reçus"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
            <View style={styles.formSection}>
              <Text style={styles.miniLabel}>Sous-texte</Text>
              <TextInput
                style={styles.textInput}
                value={metricAwardsSubtext}
                onChangeText={setMetricAwardsSubtext}
                placeholder="Excellence reconnue"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>
        </View>

        {/* Réalisations Majeures - Section Modifiable */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Réalisations Majeures</Text>
            <TouchableOpacity onPress={addAchievement} style={styles.addButton}>
              <Plus size={20} color="#6366F1" />
            </TouchableOpacity>
          </View>
          
          {achievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.achievementEditor}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementNumber}>Réalisation {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeAchievement(achievement.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre de la réalisation</Text>
                <TextInput
                  style={styles.textInput}
                  value={achievement.title}
                  onChangeText={(value) => updateAchievement(achievement.id, 'title', value)}
                  placeholder="Ex: Expansion Internationale"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={achievement.desc}
                  onChangeText={(value) => updateAchievement(achievement.id, 'desc', value)}
                  placeholder="Ex: 3 nouveaux marchés conquis"
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
            <Sparkles size={24} color="#6366F1" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '🎨', title: 'Design Moderne', desc: 'Mise en page professionnelle avec gradients' },
            { icon: '📊', title: 'Visualisations', desc: 'Graphiques et métriques animées' },
            { icon: '🎯', title: 'Sections Dynamiques', desc: 'Contenu modulaire et personnalisable' },
            { icon: '🌟', title: 'Export HD', desc: 'Format PDF haute résolution' },
            { icon: '🔒', title: 'Sécurisé', desc: 'Protection des données confidentielles' },
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
  cardHeader: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#64748B',
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
  miniLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    marginBottom: 8,
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
  metricEditSection: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  metricEditHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  metricEditIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricEditTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#1E293B',
  },
  metricEditRow: {
    flexDirection: 'row',
    gap: 0,
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
  achievementEditor: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#E2E8F0',
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  achievementNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6366F1',
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
  reportCover: {
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
  reportYear: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    letterSpacing: 4,
    marginBottom: 16,
    fontWeight: '600',
  },
  reportTitle: {
    fontSize: 36,
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
    marginBottom: 16,
  },
  reportCompany: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  reportTagline: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    letterSpacing: 1,
    marginTop: 8,
  },
  reportSection: {
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
  messageCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  messageText: {
    fontSize: 17,
    color: '#475569',
    lineHeight: 28,
    marginBottom: 24,
    fontStyle: 'italic',
  },
  signatureContainer: {
    alignItems: 'flex-end',
  },
  signatureLine: {
    width: 120,
    height: 2,
    backgroundColor: '#E2E8F0',
    marginBottom: 8,
  },
  signatureText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  metricCard: {
    width: (width - 56) / 2,
    padding: 24,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  metricNumber: {
    fontSize: 36,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 12,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  metricSubtext: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  achievementCard: {
    marginBottom: 16,
  },
  achievementGradient: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  achievementContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  reportFooter: {
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