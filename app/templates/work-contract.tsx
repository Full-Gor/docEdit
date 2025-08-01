import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, FileText, User, Calendar, DollarSign, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function WorkContractTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Contrat de Travail');
  const [company, setCompany] = useState('Mon Entreprise');
  const [employeeName, setEmployeeName] = useState('Jean Dupont');
  const [position, setPosition] = useState('Développeur Full Stack');
  const [startDate, setStartDate] = useState('01/01/2024');
  const [salary, setSalary] = useState('45 000€');
  const [contractType, setContractType] = useState('CDI');
  const [isPreview, setIsPreview] = useState(false);
  
  const [clauses, setClauses] = useState([
    { id: 1, title: 'Durée du contrat', content: 'Contrat à durée indéterminée', icon: '📅' },
    { id: 2, title: 'Fonctions', content: 'Développement d\'applications web et mobile', icon: '💼' },
    { id: 3, title: 'Lieu de travail', content: 'Bureau principal - Télétravail possible', icon: '🏢' },
    { id: 4, title: 'Horaires', content: '35h/semaine - Lundi au Vendredi', icon: '⏰' },
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
        setStartDate(savedDoc.startDate || startDate);
        setSalary(savedDoc.salary || salary);
        setContractType(savedDoc.contractType || contractType);
        if (savedDoc.clauses) {
          setClauses(savedDoc.clauses);
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

  const updateClause = (id: number, field: 'title' | 'content' | 'icon', value: string) => {
    setClauses(prev => 
      prev.map(clause => 
        clause.id === id 
          ? { ...clause, [field]: value }
          : clause
      )
    );
  };

  const addClause = () => {
    const newId = Math.max(...clauses.map(c => c.id)) + 1;
    setClauses(prev => [...prev, {
      id: newId,
      title: 'Nouvelle clause',
      content: 'Contenu de la clause',
      icon: '📋'
    }]);
  };

  const removeClause = (id: number) => {
    setClauses(prev => prev.filter(clause => clause.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'work-contract',
        title,
        company,
        employeeName,
        position,
        startDate,
        salary,
        contractType,
        clauses,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre contrat de travail a été sauvegardé localement.',
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
            <p><strong>Template:</strong> work-contract.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Contrat</Text>
          <View style={styles.sparklesIcon}>
            <FileText size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED', '#6D28D9']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.contractCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.contractTitle}>{title}</Text>
              <Text style={styles.companyName}>{company}</Text>
              <View style={styles.contractDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{employeeName}</Text>
                </View>
                <View style={styles.detailItem}>
                  <FileText size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{position}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Début : {startDate}</Text>
                </View>
                <View style={styles.detailItem}>
                  <DollarSign size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{salary}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Clauses */}
          <View style={styles.contractSection}>
            <Text style={styles.sectionTitle}>Clauses du Contrat</Text>
            {clauses.map((clause, index) => (
              <View key={clause.id} style={styles.clauseCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.clauseHeader}
                >
                  <Text style={styles.clauseIcon}>{clause.icon}</Text>
                  <Text style={styles.clauseTitle}>{clause.title}</Text>
                  <Text style={styles.clauseContent}>{clause.content}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.contractFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Contrat généré avec professionnalisme</Text>
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
        <Text style={styles.headerTitle}>Créer un Contrat de Travail</Text>
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
              <Text style={styles.fieldLabel}>Titre du contrat</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Contrat de Travail"
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
              <Text style={styles.fieldLabel}>Date de début</Text>
              <Text style={styles.fieldHint}>Date d'entrée en fonction</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="Ex: 01/01/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Salaire</Text>
              <Text style={styles.fieldHint}>Rémunération annuelle</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={salary}
              onChangeText={setSalary}
              placeholder="Ex: 45 000€"
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
        </View>

        {/* Clauses */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Clauses du Contrat</Text>
            <TouchableOpacity onPress={addClause} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {clauses.map((clause, index) => (
            <View key={clause.id} style={styles.clauseEditor}>
              <View style={styles.clauseHeader}>
                <Text style={styles.clauseNumber}>Clause {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeClause(clause.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={clause.icon}
                  onChangeText={(value) => updateClause(clause.id, 'icon', value)}
                  placeholder="Ex: 📅"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre de la clause</Text>
                <TextInput
                  style={styles.textInput}
                  value={clause.title}
                  onChangeText={(value) => updateClause(clause.id, 'title', value)}
                  placeholder="Ex: Durée du contrat"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Contenu</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={clause.content}
                  onChangeText={(value) => updateClause(clause.id, 'content', value)}
                  placeholder="Ex: Contrat à durée indéterminée"
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
            <FileText size={24} color="#8B5CF6" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📋', title: 'Contrat Structuré', desc: 'Format professionnel légal' },
            { icon: '👤', title: 'Informations Employé', desc: 'Données personnelles complètes' },
            { icon: '💼', title: 'Clauses Détaillées', desc: 'Conditions d\'emploi précises' },
            { icon: '📅', title: 'Dates Importantes', desc: 'Périodes et échéances' },
            { icon: '💰', title: 'Rémunération', desc: 'Salaire et avantages sociaux' },
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
    backgroundColor: '#EDE9FE',
  },
  clauseEditor: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  clauseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  clauseNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B21B6',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
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
  contractCover: {
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
  contractTitle: {
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
  contractDetails: {
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
  contractSection: {
    marginBottom: 32,
  },
  clauseCard: {
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
  clauseHeader: {
    padding: 16,
  },
  clauseIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  clauseTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  clauseContent: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  contractFooter: {
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