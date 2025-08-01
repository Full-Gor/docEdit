import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, FormInput, User, Calendar, Mail, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function RegistrationFormTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Formulaire d\'Inscription');
  const [company, setCompany] = useState('Mon Entreprise');
  const [eventName, setEventName] = useState('Formation Marketing Digital');
  const [organizer, setOrganizer] = useState('Équipe Formation');
  const [date, setDate] = useState('15/01/2024');
  const [deadline, setDeadline] = useState('10/01/2024');
  const [isPreview, setIsPreview] = useState(false);
  
  const [personalFields, setPersonalFields] = useState([
    { id: 1, field: 'Nom complet', required: 'Obligatoire', type: 'Texte', icon: '👤' },
    { id: 2, field: 'Email', required: 'Obligatoire', type: 'Email', icon: '📧' },
    { id: 3, field: 'Téléphone', required: 'Optionnel', type: 'Téléphone', icon: '📞' },
    { id: 4, field: 'Entreprise', required: 'Optionnel', type: 'Texte', icon: '🏢' },
  ]);

  const [eventDetails, setEventDetails] = useState([
    { id: 1, detail: 'Date de naissance', required: 'Obligatoire', type: 'Date', icon: '🎂' },
    { id: 2, detail: 'Profession', required: 'Obligatoire', type: 'Sélection', icon: '💼' },
    { id: 3, detail: 'Expérience', required: 'Optionnel', type: 'Texte libre', icon: '📝' },
    { id: 4, detail: 'Motivations', required: 'Obligatoire', type: 'Zone texte', icon: '💭' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setEventName(savedDoc.eventName || eventName);
        setOrganizer(savedDoc.organizer || organizer);
        setDate(savedDoc.date || date);
        setDeadline(savedDoc.deadline || deadline);
        if (savedDoc.personalFields) {
          setPersonalFields(savedDoc.personalFields);
        }
        if (savedDoc.eventDetails) {
          setEventDetails(savedDoc.eventDetails);
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

  const updatePersonalField = (id: number, field: 'field' | 'required' | 'type' | 'icon', value: string) => {
    setPersonalFields(prev => 
      prev.map(pField => 
        pField.id === id 
          ? { ...pField, [field]: value }
          : pField
      )
    );
  };

  const addPersonalField = () => {
    const newId = Math.max(...personalFields.map(p => p.id)) + 1;
    setPersonalFields(prev => [...prev, {
      id: newId,
      field: 'Nouveau champ',
      required: 'Optionnel',
      type: 'Texte',
      icon: '📝'
    }]);
  };

  const removePersonalField = (id: number) => {
    setPersonalFields(prev => prev.filter(pField => pField.id !== id));
  };

  const updateEventDetail = (id: number, field: 'detail' | 'required' | 'type' | 'icon', value: string) => {
    setEventDetails(prev => 
      prev.map(eDetail => 
        eDetail.id === id 
          ? { ...eDetail, [field]: value }
          : eDetail
      )
    );
  };

  const addEventDetail = () => {
    const newId = Math.max(...eventDetails.map(e => e.id)) + 1;
    setEventDetails(prev => [...prev, {
      id: newId,
      detail: 'Nouveau détail',
      required: 'Optionnel',
      type: 'Texte',
      icon: '📋'
    }]);
  };

  const removeEventDetail = (id: number) => {
    setEventDetails(prev => prev.filter(eDetail => eDetail.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'registration-form',
        title,
        company,
        eventName,
        organizer,
        date,
        deadline,
        personalFields,
        eventDetails,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre formulaire d\'inscription a été sauvegardé localement.',
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
            <p><strong>Template:</strong> registration-form.tsx</p>
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
            <FormInput size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#10B981', '#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.formCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.formTitle}>{title}</Text>
              <Text style={styles.formSubtitle}>{eventName}</Text>
              <View style={styles.formDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{organizer}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Mail size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Date limite : {deadline}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Personal Fields */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            {personalFields.map((field, index) => (
              <View key={field.id} style={styles.fieldCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
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
          
          {/* Event Details */}
          <View style={styles.formSection}>
            <Text style={styles.sectionTitle}>Détails de l'Événement</Text>
            {eventDetails.map((detail, index) => (
              <View key={detail.id} style={styles.detailCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.detailHeader}
                >
                  <Text style={styles.detailIcon}>{detail.icon}</Text>
                  <Text style={styles.detailName}>{detail.detail}</Text>
                  <Text style={styles.detailType}>Type : {detail.type}</Text>
                  <Text style={styles.detailRequired}>{detail.required}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.formFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Formulaire d'inscription généré avec précision</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Formulaire d'Inscription</Text>
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
              placeholder="Ex: Formulaire d'Inscription"
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
              <Text style={styles.fieldLabel}>Nom de l'événement</Text>
              <Text style={styles.fieldHint}>Nom de l'événement ou formation</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={eventName}
              onChangeText={setEventName}
              placeholder="Ex: Formation Marketing Digital"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Organisateur</Text>
              <Text style={styles.fieldHint}>Responsable de l'événement</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={organizer}
              onChangeText={setOrganizer}
              placeholder="Ex: Équipe Formation"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date de l'événement</Text>
              <Text style={styles.fieldHint}>Date de l'événement</Text>
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
              <Text style={styles.fieldLabel}>Date limite d'inscription</Text>
              <Text style={styles.fieldHint}>Date limite pour s'inscrire</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={deadline}
              onChangeText={setDeadline}
              placeholder="Ex: 10/01/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Personal Fields */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Informations Personnelles</Text>
            <TouchableOpacity onPress={addPersonalField} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {personalFields.map((field, index) => (
            <View key={field.id} style={styles.fieldEditor}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldNumber}>Champ {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removePersonalField(field.id)}
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
                  onChangeText={(value) => updatePersonalField(field.id, 'icon', value)}
                  placeholder="Ex: 👤"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom du champ</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.field}
                  onChangeText={(value) => updatePersonalField(field.id, 'field', value)}
                  placeholder="Ex: Nom complet"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.type}
                  onChangeText={(value) => updatePersonalField(field.id, 'type', value)}
                  placeholder="Ex: Texte, Email, Téléphone"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Obligatoire</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.required}
                  onChangeText={(value) => updatePersonalField(field.id, 'required', value)}
                  placeholder="Ex: Obligatoire, Optionnel"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Event Details */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Détails de l'Événement</Text>
            <TouchableOpacity onPress={addEventDetail} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {eventDetails.map((detail, index) => (
            <View key={detail.id} style={styles.detailEditor}>
              <View style={styles.detailHeader}>
                <Text style={styles.detailNumber}>Détail {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeEventDetail(detail.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={detail.icon}
                  onChangeText={(value) => updateEventDetail(detail.id, 'icon', value)}
                  placeholder="Ex: 🎂"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom du détail</Text>
                <TextInput
                  style={styles.textInput}
                  value={detail.detail}
                  onChangeText={(value) => updateEventDetail(detail.id, 'detail', value)}
                  placeholder="Ex: Date de naissance"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={detail.type}
                  onChangeText={(value) => updateEventDetail(detail.id, 'type', value)}
                  placeholder="Ex: Date, Sélection, Texte libre"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Obligatoire</Text>
                <TextInput
                  style={styles.textInput}
                  value={detail.required}
                  onChangeText={(value) => updateEventDetail(detail.id, 'required', value)}
                  placeholder="Ex: Obligatoire, Optionnel"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <FormInput size={24} color="#10B981" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📝', title: 'Champs Personnalisables', desc: 'Ajout/suppression de champs' },
            { icon: '✅', title: 'Validation', desc: 'Champs obligatoires/optionnels' },
            { icon: '📱', title: 'Multi-Support', desc: 'Mobile, web, impression' },
            { icon: '📊', title: 'Collecte Données', desc: 'Export et analyse' },
            { icon: '🔒', title: 'Sécurité', desc: 'Protection des données' },
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
    backgroundColor: '#FEF3C7',
  },
  fieldEditor: {
    backgroundColor: '#FEF3C7',
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
    color: '#92400E',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  detailEditor: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailNumber: {
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
  formCover: {
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
  formTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  formSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  formDetails: {
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
  formSection: {
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
  detailCard: {
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
  detailHeader: {
    padding: 16,
  },
  detailIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  detailName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  detailType: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 4,
  },
  detailRequired: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formFooter: {
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