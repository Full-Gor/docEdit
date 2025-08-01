import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Settings, User, Calendar, Clock, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ServiceRequestTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Demande de Service');
  const [company, setCompany] = useState('Mon Entreprise');
  const [requestTitle, setRequestTitle] = useState('Support IT Q1 2024');
  const [author, setAuthor] = useState('Équipe IT');
  const [date, setDate] = useState('15/01/2024');
  const [priority, setPriority] = useState('Normale');
  const [isPreview, setIsPreview] = useState(false);
  
  const [requestFields, setRequestFields] = useState([
    { id: 1, field: 'Nom demandeur', required: 'Obligatoire', type: 'Texte', icon: '👤' },
    { id: 2, field: 'Service demandé', required: 'Obligatoire', type: 'Sélection', icon: '🔧' },
    { id: 3, field: 'Description', required: 'Obligatoire', type: 'Zone texte', icon: '📝' },
    { id: 4, field: 'Urgence', required: 'Obligatoire', type: 'Sélection', icon: '⚡' },
  ]);

  const [serviceCategories, setServiceCategories] = useState([
    { id: 1, category: 'Support technique', status: 'En cours', icon: '💻' },
    { id: 2, category: 'Maintenance', status: 'Planifié', icon: '🔧' },
    { id: 3, category: 'Formation', status: 'Disponible', icon: '🎓' },
    { id: 4, category: 'Équipement', status: 'En attente', icon: '🖥️' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setRequestTitle(savedDoc.requestTitle || requestTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setPriority(savedDoc.priority || priority);
        if (savedDoc.requestFields) {
          setRequestFields(savedDoc.requestFields);
        }
        if (savedDoc.serviceCategories) {
          setServiceCategories(savedDoc.serviceCategories);
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

  const updateRequestField = (id: number, field: 'field' | 'required' | 'type' | 'icon', value: string) => {
    setRequestFields(prev => 
      prev.map(rField => 
        rField.id === id 
          ? { ...rField, [field]: value }
          : rField
      )
    );
  };

  const addRequestField = () => {
    const newId = Math.max(...requestFields.map(r => r.id)) + 1;
    setRequestFields(prev => [...prev, {
      id: newId,
      field: 'Nouveau champ',
      required: 'Optionnel',
      type: 'Texte',
      icon: '📝'
    }]);
  };

  const removeRequestField = (id: number) => {
    setRequestFields(prev => prev.filter(rField => rField.id !== id));
  };

  const updateServiceCategory = (id: number, field: 'category' | 'status' | 'icon', value: string) => {
    setServiceCategories(prev => 
      prev.map(sCat => 
        sCat.id === id 
          ? { ...sCat, [field]: value }
          : sCat
      )
    );
  };

  const addServiceCategory = () => {
    const newId = Math.max(...serviceCategories.map(s => s.id)) + 1;
    setServiceCategories(prev => [...prev, {
      id: newId,
      category: 'Nouvelle catégorie',
      status: 'Disponible',
      icon: '📋'
    }]);
  };

  const removeServiceCategory = (id: number) => {
    setServiceCategories(prev => prev.filter(sCat => sCat.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'service-request',
        title,
        company,
        requestTitle,
        author,
        date,
        priority,
        requestFields,
        serviceCategories,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre demande de service a été sauvegardée localement.',
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
            <p><strong>Template:</strong> service-request.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de la Demande</Text>
          <View style={styles.sparklesIcon}>
            <Settings size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#06B6D4', '#0891B2', '#0E7490']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.requestCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.requestTitle}>{title}</Text>
              <Text style={styles.requestSubtitle}>{requestTitle}</Text>
              <View style={styles.requestDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Priorité : {priority}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Request Fields */}
          <View style={styles.requestSection}>
            <Text style={styles.sectionTitle}>Champs de Demande</Text>
            {requestFields.map((field, index) => (
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
          
          {/* Service Categories */}
          <View style={styles.requestSection}>
            <Text style={styles.sectionTitle}>Catégories de Service</Text>
            {serviceCategories.map((category, index) => (
              <View key={category.id} style={styles.categoryCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.categoryHeader}
                >
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryName}>{category.category}</Text>
                  <Text style={styles.categoryStatus}>Statut : {category.status}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.requestFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Demande de service générée avec précision</Text>
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
        <Text style={styles.headerTitle}>Créer une Demande de Service</Text>
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
              <Text style={styles.fieldLabel}>Titre de la demande</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Demande de Service"
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
              <Text style={styles.fieldLabel}>Titre de la demande</Text>
              <Text style={styles.fieldHint}>Titre spécifique de la demande</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={requestTitle}
              onChangeText={setRequestTitle}
              placeholder="Ex: Support IT Q1 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable de la demande</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe IT"
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
              <Text style={styles.fieldLabel}>Priorité</Text>
              <Text style={styles.fieldHint}>Niveau de priorité</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={priority}
              onChangeText={setPriority}
              placeholder="Ex: Normale, Urgente, Faible"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Request Fields */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Champs de Demande</Text>
            <TouchableOpacity onPress={addRequestField} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {requestFields.map((field, index) => (
            <View key={field.id} style={styles.fieldEditor}>
              <View style={styles.fieldHeader}>
                <Text style={styles.fieldNumber}>Champ {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeRequestField(field.id)}
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
                  onChangeText={(value) => updateRequestField(field.id, 'icon', value)}
                  placeholder="Ex: 👤"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom du champ</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.field}
                  onChangeText={(value) => updateRequestField(field.id, 'field', value)}
                  placeholder="Ex: Nom demandeur"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Type</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.type}
                  onChangeText={(value) => updateRequestField(field.id, 'type', value)}
                  placeholder="Ex: Texte, Sélection, Zone texte"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Obligatoire</Text>
                <TextInput
                  style={styles.textInput}
                  value={field.required}
                  onChangeText={(value) => updateRequestField(field.id, 'required', value)}
                  placeholder="Ex: Obligatoire, Optionnel"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Service Categories */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Catégories de Service</Text>
            <TouchableOpacity onPress={addServiceCategory} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {serviceCategories.map((category, index) => (
            <View key={category.id} style={styles.categoryEditor}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryNumber}>Catégorie {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeServiceCategory(category.id)}
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
                  onChangeText={(value) => updateServiceCategory(category.id, 'icon', value)}
                  placeholder="Ex: 💻"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom de la catégorie</Text>
                <TextInput
                  style={styles.textInput}
                  value={category.category}
                  onChangeText={(value) => updateServiceCategory(category.id, 'category', value)}
                  placeholder="Ex: Support technique"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Statut</Text>
                <TextInput
                  style={styles.textInput}
                  value={category.status}
                  onChangeText={(value) => updateServiceCategory(category.id, 'status', value)}
                  placeholder="Ex: En cours, Planifié, Disponible"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Settings size={24} color="#06B6D4" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '⚡', title: 'Gestion Priorités', desc: 'Niveaux d\'urgence configurables' },
            { icon: '📊', title: 'Suivi Statuts', desc: 'Évolution des demandes' },
            { icon: '🔧', title: 'Services Multiples', desc: 'Catégories personnalisables' },
            { icon: '📱', title: 'Notifications', desc: 'Alertes automatiques' },
            { icon: '📈', title: 'Analytics', desc: 'Statistiques de service' },
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
  categoryEditor: {
    backgroundColor: '#EDE9FE',
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
  requestCover: {
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
  requestTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  requestSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  requestDetails: {
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
  requestSection: {
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
  categoryStatus: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  requestFooter: {
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