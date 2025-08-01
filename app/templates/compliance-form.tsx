import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Shield, User, Calendar, FileText, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ComplianceFormTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Formulaire de Conformité');
  const [company, setCompany] = useState('Mon Entreprise');
  const [complianceTitle, setComplianceTitle] = useState('Conformité RGPD Q1 2024');
  const [author, setAuthor] = useState('Équipe Juridique');
  const [date, setDate] = useState('15/01/2024');
  const [regulation, setRegulation] = useState('RGPD');
  const [isPreview, setIsPreview] = useState(false);
  
  const [complianceFields, setComplianceFields] = useState([
    { id: 1, field: 'Consentement', required: 'Obligatoire', type: 'Case à cocher', icon: '✅' },
    { id: 2, field: 'Finalité', required: 'Obligatoire', type: 'Texte libre', icon: '🎯' },
    { id: 3, field: 'Durée conservation', required: 'Obligatoire', type: 'Sélection', icon: '⏰' },
    { id: 4, field: 'Droits utilisateur', required: 'Obligatoire', type: 'Liste', icon: '👤' },
  ]);

  const [legalRequirements, setLegalRequirements] = useState([
    { id: 1, requirement: 'Transparence', status: 'Conforme', icon: '🔍' },
    { id: 2, requirement: 'Minimisation', status: 'À vérifier', icon: '📊' },
    { id: 3, requirement: 'Sécurité', status: 'Conforme', icon: '🔒' },
    { id: 4, requirement: 'Responsabilité', status: 'Conforme', icon: '📋' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setComplianceTitle(savedDoc.complianceTitle || complianceTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setRegulation(savedDoc.regulation || regulation);
        if (savedDoc.complianceFields) {
          setComplianceFields(savedDoc.complianceFields);
        }
        if (savedDoc.legalRequirements) {
          setLegalRequirements(savedDoc.legalRequirements);
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

  const updateComplianceField = (id: number, field: 'field' | 'required' | 'type' | 'icon', value: string) => {
    setComplianceFields(prev => 
      prev.map(cField => 
        cField.id === id 
          ? { ...cField, [field]: value }
          : cField
      )
    );
  };

  const addComplianceField = () => {
    const newId = Math.max(...complianceFields.map(c => c.id)) + 1;
    setComplianceFields(prev => [...prev, {
      id: newId,
      field: 'Nouveau champ',
      required: 'Optionnel',
      type: 'Texte',
      icon: '📝'
    }]);
  };

  const removeComplianceField = (id: number) => {
    setComplianceFields(prev => prev.filter(cField => cField.id !== id));
  };

  const updateLegalRequirement = (id: number, field: 'requirement' | 'status' | 'icon', value: string) => {
    setLegalRequirements(prev => 
      prev.map(lReq => 
        lReq.id === id 
          ? { ...lReq, [field]: value }
          : lReq
      )
    );
  };

  const addLegalRequirement = () => {
    const newId = Math.max(...legalRequirements.map(l => l.id)) + 1;
    setLegalRequirements(prev => [...prev, {
      id: newId,
      requirement: 'Nouvelle exigence',
      status: 'À vérifier',
      icon: '📋'
    }]);
  };

  const removeLegalRequirement = (id: number) => {
    setLegalRequirements(prev => prev.filter(lReq => lReq.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'compliance-form',
        title,
        company,
        complianceTitle,
        author,
        date,
        regulation,
        complianceFields,
        legalRequirements,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre formulaire de conformité a été sauvegardé localement.',
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
            <p><strong>Template:</strong> compliance-form.tsx</p>
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
            <Shield size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#EF4444', '#DC2626', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.complianceCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.complianceTitle}>{title}</Text>
              <Text style={styles.complianceSubtitle}>{complianceTitle}</Text>
              <View style={styles.complianceDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FileText size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{regulation}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Compliance Fields */}
          <View style={styles.complianceSection}>
            <Text style={styles.sectionTitle}>Champs de Conformité</Text>
            {complianceFields.map((field, index) => (
              <View key={field.id} style={styles.fieldCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.fieldHeader}
                >
                  <Text style={styles.fieldIcon}>{field.icon}</Text>
                  <Text style={styles.fieldName}>{field.field}</Text>
                  <Text style={styles.fieldType}>Type : {field.type}</Text>
                  <Text style={styles.fieldRequired}>{field.required}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Legal Requirements */}
          <View style={styles.complianceSection}>
            <Text style={styles.sectionTitle}>Exigences Légales</Text>
            {legalRequirements.map((requirement, index) => (
              <View key={requirement.id} style={styles.requirementCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.requirementHeader}
                >
                  <Text style={styles.requirementIcon}>{requirement.icon}</Text>
                  <Text style={styles.requirementName}>{requirement.requirement}</Text>
                  <Text style={styles.requirementStatus}>Statut : {requirement.status}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.complianceFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Formulaire de conformité généré avec précision</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#EF4444', '#DC2626']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Formulaire de Conformité</Text>
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
              placeholder="Ex: Formulaire de Conformité"
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
              <Text style={styles.fieldLabel}>Titre de la conformité</Text>
              <Text style={styles.fieldHint}>Titre spécifique de la conformité</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={complianceTitle}
              onChangeText={setComplianceTitle}
              placeholder="Ex: Conformité RGPD Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable de la conformité</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe Juridique"
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
              <Text style={styles.fieldLabel}>Réglementation</Text>
              <Text style={styles.fieldHint}>Réglementation concernée</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={regulation}
              onChangeText={setRegulation}
              placeholder="Ex: RGPD"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Compliance Fields */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Champs de Conformité</Text>
            <TouchableOpacity onPress={addComplianceField} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {complianceFields.map((field, index) => (
            <View key={field.id} style={styles.fieldEditor}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldNumber}>Champ {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeComplianceField(field.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.icon}
                  onChangeText={(value) => updateComplianceField(field.id, 'icon', value)}
                  placeholder="Ex: ✅"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom du champ</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.field}
                  onChangeText={(value) => updateComplianceField(field.id, 'field', value)}
                  placeholder="Ex: Consentement"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.type}
                  onChangeText={(value) => updateComplianceField(field.id, 'type', value)}
                  placeholder="Ex: Case à cocher, Texte libre"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Obligatoire</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.required}
                  onChangeText={(value) => updateComplianceField(field.id, 'required', value)}
                  placeholder="Ex: Obligatoire, Optionnel"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Legal Requirements */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Exigences Légales</Text>
            <TouchableOpacity onPress={addLegalRequirement} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {legalRequirements.map((requirement, index) => (
            <View key={requirement.id} style={styles.requirementEditor}>
              <View style={styles.requirementHeader}>
                <Text style={styles.requirementNumber}>Exigence {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeLegalRequirement(requirement.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={requirement.icon}
                  onChangeText={(value) => updateLegalRequirement(requirement.id, 'icon', value)}
                  placeholder="Ex: 🔍"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom de l'exigence</Text>
                <TextInput
                  style={styles.textInput}
                  value={requirement.requirement}
                  onChangeText={(value) => updateLegalRequirement(requirement.id, 'requirement', value)}
                  placeholder="Ex: Transparence"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Statut</Text>
                <TextInput
                  style={styles.textInput}
                  value={requirement.status}
                  onChangeText={(value) => updateLegalRequirement(requirement.id, 'status', value)}
                  placeholder="Ex: Conforme, À vérifier"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Shield size={24} color="#EF4444" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '🔒', title: 'Sécurité Renforcée', desc: 'Protection des données sensibles' },
            { icon: '📋', title: 'Conformité Légale', desc: 'Respect des réglementations' },
            { icon: '✅', title: 'Validation Automatique', desc: 'Vérification des champs' },
            { icon: '📊', title: 'Audit Trail', desc: 'Traçabilité des modifications' },
            { icon: '🛡️', title: 'Certification', desc: 'Standards internationaux' },
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
    backgroundColor: '#D1FAE5',
  },
  fieldEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fieldNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  requirementEditor: {
    backgroundColor: '#EDE9FE',
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
  complianceCover: {
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
  complianceTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  complianceSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  complianceDetails: {
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
  complianceSection: {
    marginBottom: 32,
  },
  fieldCard: {
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
  fieldHeader: {
    padding: 16,
  },
  fieldIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  fieldName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  fieldType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  fieldRequired: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
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
  },
  requirementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  requirementName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  requirementStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  complianceFooter: {
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