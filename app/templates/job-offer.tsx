import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Briefcase, MapPin, DollarSign, Clock, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function JobOfferTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Développeur Full Stack');
  const [company, setCompany] = useState('Mon Entreprise');
  const [location, setLocation] = useState('Paris, France');
  const [contractType, setContractType] = useState('CDI');
  const [salary, setSalary] = useState('45k€ - 65k€');
  const [description, setDescription] = useState('Nous recherchons un développeur Full Stack expérimenté...');
  const [isPreview, setIsPreview] = useState(false);
  
  const [requirements, setRequirements] = useState([
    { id: 1, text: 'Minimum 3 ans d\'expérience', icon: '⭐' },
    { id: 2, text: 'Maîtrise React/Node.js', icon: '💻' },
    { id: 3, text: 'Anglais courant', icon: '🌍' },
    { id: 4, text: 'Travail en équipe', icon: '👥' },
  ]);

  const [benefits, setBenefits] = useState([
    { id: 1, text: 'Télétravail possible', icon: '🏠' },
    { id: 2, text: 'Mutuelle complète', icon: '🏥' },
    { id: 3, text: 'Équipement fourni', icon: '💻' },
    { id: 4, text: 'Formation continue', icon: '📚' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setLocation(savedDoc.location || location);
        setContractType(savedDoc.contractType || contractType);
        setSalary(savedDoc.salary || salary);
        setDescription(savedDoc.description || description);
        if (savedDoc.requirements) {
          setRequirements(savedDoc.requirements);
        }
        if (savedDoc.benefits) {
          setBenefits(savedDoc.benefits);
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

  const updateRequirement = (id: number, field: 'text' | 'icon', value: string) => {
    setRequirements(prev => 
      prev.map(req => 
        req.id === id 
          ? { ...req, [field]: value }
          : req
      )
    );
  };

  const addRequirement = () => {
    const newId = Math.max(...requirements.map(r => r.id)) + 1;
    setRequirements(prev => [...prev, {
      id: newId,
      text: 'Nouvelle exigence',
      icon: '📋'
    }]);
  };

  const removeRequirement = (id: number) => {
    setRequirements(prev => prev.filter(req => req.id !== id));
  };

  const updateBenefit = (id: number, field: 'text' | 'icon', value: string) => {
    setBenefits(prev => 
      prev.map(benefit => 
        benefit.id === id 
          ? { ...benefit, [field]: value }
          : benefit
      )
    );
  };

  const addBenefit = () => {
    const newId = Math.max(...benefits.map(b => b.id)) + 1;
    setBenefits(prev => [...prev, {
      id: newId,
      text: 'Nouveau avantage',
      icon: '🎁'
    }]);
  };

  const removeBenefit = (id: number) => {
    setBenefits(prev => prev.filter(benefit => benefit.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'job-offer',
        title,
        company,
        location,
        contractType,
        salary,
        description,
        requirements,
        benefits,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre offre d\'emploi a été sauvegardée localement.',
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
            <p><strong>Template:</strong> job-offer.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de l'Offre</Text>
          <View style={styles.sparklesIcon}>
            <Briefcase size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.jobCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.jobTitle}>{title}</Text>
              <Text style={styles.companyName}>{company}</Text>
              <View style={styles.jobDetails}>
                <View style={styles.detailItem}>
                  <MapPin size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{location}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{contractType}</Text>
                </View>
                <View style={styles.detailItem}>
                  <DollarSign size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{salary}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Description */}
          <View style={styles.jobSection}>
            <Text style={styles.sectionTitle}>Description du Poste</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>
          
          {/* Requirements */}
          <View style={styles.jobSection}>
            <Text style={styles.sectionTitle}>Exigences</Text>
            {requirements.map((req, index) => (
              <View key={req.id} style={styles.requirementCard}>
                <LinearGradient
                  colors={['#2563EB', '#1D4ED8']}
                  style={styles.requirementHeader}
                >
                  <Text style={styles.requirementIcon}>{req.icon}</Text>
                  <Text style={styles.requirementText}>{req.text}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Benefits */}
          <View style={styles.jobSection}>
            <Text style={styles.sectionTitle}>Avantages</Text>
            {benefits.map((benefit, index) => (
              <View key={benefit.id} style={styles.benefitCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.benefitHeader}
                >
                  <Text style={styles.benefitIcon}>{benefit.icon}</Text>
                  <Text style={styles.benefitText}>{benefit.text}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.jobFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Offre d'emploi générée avec professionnalisme</Text>
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
        <Text style={styles.headerTitle}>Créer une Offre d'Emploi</Text>
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
              <Text style={styles.fieldLabel}>Titre du poste</Text>
              <Text style={styles.fieldHint}>Intitulé du poste recherché</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Développeur Full Stack"
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
              <Text style={styles.fieldLabel}>Localisation</Text>
              <Text style={styles.fieldHint}>Lieu du poste</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Paris, France"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Type de contrat</Text>
              <Text style={styles.fieldHint}>CDI, CDD, Stage, etc.</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={contractType}
              onChangeText={setContractType}
              placeholder="Ex: CDI"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Salaire</Text>
              <Text style={styles.fieldHint}>Fourchette salariale</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={salary}
              onChangeText={setSalary}
              placeholder="Ex: 45k€ - 65k€"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Description du poste</Text>
              <Text style={styles.fieldHint}>Description détaillée du poste</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez le poste..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={8}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Requirements */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exigences</Text>
            <TouchableOpacity onPress={addRequirement} style={styles.addButton}>
              <Plus size={20} color="#2563EB" />
            </TouchableOpacity>
          </View>
          
          {requirements.map((req, index) => (
            <View key={req.id} style={styles.requirementEditor}>
              <View style={styles.requirementHeader}>
                <Text style={styles.requirementNumber}>Exigence {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeRequirement(req.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={req.icon}
                  onChangeText={(value) => updateRequirement(req.id, 'icon', value)}
                  placeholder="Ex: ⭐"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Exigence</Text>
                <TextInput
                  style={styles.textInput}
                  value={req.text}
                  onChangeText={(value) => updateRequirement(req.id, 'text', value)}
                  placeholder="Ex: Minimum 3 ans d'expérience"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Avantages</Text>
            <TouchableOpacity onPress={addBenefit} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {benefits.map((benefit, index) => (
            <View key={benefit.id} style={styles.benefitEditor}>
              <View style={styles.benefitHeader}>
                <Text style={styles.benefitNumber}>Avantage {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeBenefit(benefit.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={benefit.icon}
                  onChangeText={(value) => updateBenefit(benefit.id, 'icon', value)}
                  placeholder="Ex: 🏠"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Avantage</Text>
                <TextInput
                  style={styles.textInput}
                  value={benefit.text}
                  onChangeText={(value) => updateBenefit(benefit.id, 'text', value)}
                  placeholder="Ex: Télétravail possible"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Briefcase size={24} color="#2563EB" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📋', title: 'Offre Structurée', desc: 'Format professionnel attractif' },
            { icon: '🎯', title: 'Exigences Claires', desc: 'Profil recherché détaillé' },
            { icon: '💼', title: 'Avantages Mis en Avant', desc: 'Bénéfices de l\'entreprise' },
            { icon: '📧', title: 'Partage Facile', desc: 'Envoi par email ou réseaux' },
            { icon: '✨', title: 'Design Moderne', desc: 'Interface attractive et lisible' },
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
    height: 120,
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
    backgroundColor: '#DBEAFE',
  },
  requirementEditor: {
    backgroundColor: '#DBEAFE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  requirementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  requirementNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E40AF',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  benefitEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  benefitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  benefitNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
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
  jobCover: {
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
  jobTitle: {
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
  jobDetails: {
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
  jobSection: {
    marginBottom: 32,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  requirementCard: {
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
  requirementHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  requirementIcon: {
    fontSize: 24,
  },
  requirementText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  benefitCard: {
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
  benefitHeader: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  benefitIcon: {
    fontSize: 24,
  },
  benefitText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  jobFooter: {
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