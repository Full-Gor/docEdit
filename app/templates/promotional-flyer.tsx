import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Zap, User, Calendar, Tag, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PromotionalFlyerTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Flyer Promotionnel');
  const [company, setCompany] = useState('Mon Entreprise');
  const [offerTitle, setOfferTitle] = useState('Offre Spéciale -50%');
  const [author, setAuthor] = useState('Équipe Marketing');
  const [date, setDate] = useState('15/01/2024');
  const [validUntil, setValidUntil] = useState('31/01/2024');
  const [isPreview, setIsPreview] = useState(false);
  
  const [highlights, setHighlights] = useState([
    { id: 1, highlight: 'Réduction exceptionnelle', value: '-50%', icon: '💰' },
    { id: 2, highlight: 'Livraison gratuite', value: 'Gratuit', icon: '🚚' },
    { id: 3, highlight: 'Garantie étendue', value: '2 ans', icon: '🛡️' },
    { id: 4, highlight: 'Support premium', value: '24/7', icon: '📞' },
  ]);

  const [conditions, setConditions] = useState([
    { id: 1, condition: 'Offre limitée', detail: 'Jusqu\'au 31/01/2024', icon: '⏰' },
    { id: 2, condition: 'Stock limité', detail: 'Quantités limitées', icon: '📦' },
    { id: 3, condition: 'Code promo', detail: 'SPE50', icon: '🎫' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setOfferTitle(savedDoc.offerTitle || offerTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setValidUntil(savedDoc.validUntil || validUntil);
        if (savedDoc.highlights) {
          setHighlights(savedDoc.highlights);
        }
        if (savedDoc.conditions) {
          setConditions(savedDoc.conditions);
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

  const updateHighlight = (id: number, field: 'highlight' | 'value' | 'icon', value: string) => {
    setHighlights(prev => 
      prev.map(highlight => 
        highlight.id === id 
          ? { ...highlight, [field]: value }
          : highlight
      )
    );
  };

  const addHighlight = () => {
    const newId = Math.max(...highlights.map(h => h.id)) + 1;
    setHighlights(prev => [...prev, {
      id: newId,
      highlight: 'Nouveau point fort',
      value: 'Valeur',
      icon: '✨'
    }]);
  };

  const removeHighlight = (id: number) => {
    setHighlights(prev => prev.filter(highlight => highlight.id !== id));
  };

  const updateCondition = (id: number, field: 'condition' | 'detail' | 'icon', value: string) => {
    setConditions(prev => 
      prev.map(condition => 
        condition.id === id 
          ? { ...condition, [field]: value }
          : condition
      )
    );
  };

  const addCondition = () => {
    const newId = Math.max(...conditions.map(c => c.id)) + 1;
    setConditions(prev => [...prev, {
      id: newId,
      condition: 'Nouvelle condition',
      detail: 'Détail',
      icon: '📋'
    }]);
  };

  const removeCondition = (id: number) => {
    setConditions(prev => prev.filter(condition => condition.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'promotional-flyer',
        title,
        company,
        offerTitle,
        author,
        date,
        validUntil,
        highlights,
        conditions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre flyer promotionnel a été sauvegardé localement.',
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
            <p><strong>Template:</strong> promotional-flyer.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Flyer</Text>
          <View style={styles.sparklesIcon}>
            <Zap size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#EF4444', '#DC2626', '#B91C1C']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.flyerCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.flyerTitle}>{title}</Text>
              <Text style={styles.offerTitle}>{offerTitle}</Text>
              <View style={styles.flyerDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Tag size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Valide jusqu'au {validUntil}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Highlights */}
          <View style={styles.flyerSection}>
            <Text style={styles.sectionTitle}>Points Forts</Text>
            {highlights.map((highlight, index) => (
              <View key={highlight.id} style={styles.highlightCard}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.highlightHeader}
                >
                  <Text style={styles.highlightIcon}>{highlight.icon}</Text>
                  <Text style={styles.highlightText}>{highlight.highlight}</Text>
                  <Text style={styles.highlightValue}>{highlight.value}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Conditions */}
          <View style={styles.flyerSection}>
            <Text style={styles.sectionTitle}>Conditions</Text>
            {conditions.map((condition, index) => (
              <View key={condition.id} style={styles.conditionCard}>
                <LinearGradient
                  colors={['#EF4444', '#DC2626']}
                  style={styles.conditionHeader}
                >
                  <Text style={styles.conditionIcon}>{condition.icon}</Text>
                  <Text style={styles.conditionText}>{condition.condition}</Text>
                  <Text style={styles.conditionDetail}>{condition.detail}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.flyerFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Flyer promotionnel généré avec impact</Text>
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
        <Text style={styles.headerTitle}>Créer un Flyer Promotionnel</Text>
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
              <Text style={styles.fieldLabel}>Titre du flyer</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Flyer Promotionnel"
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
              <Text style={styles.fieldLabel}>Titre de l'offre</Text>
              <Text style={styles.fieldHint}>Titre accrocheur de l'offre</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={offerTitle}
              onChangeText={setOfferTitle}
              placeholder="Ex: Offre Spéciale -50%"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable de l'offre</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe Marketing"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date de création</Text>
              <Text style={styles.fieldHint}>Date de création du flyer</Text>
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
              <Text style={styles.fieldLabel}>Valide jusqu'au</Text>
              <Text style={styles.fieldHint}>Date de fin de validité</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={validUntil}
              onChangeText={setValidUntil}
              placeholder="Ex: 31/01/2024"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Highlights */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Points Forts</Text>
            <TouchableOpacity onPress={addHighlight} style={styles.addButton}>
              <Plus size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          {highlights.map((highlight, index) => (
            <View key={highlight.id} style={styles.highlightEditor}>
              <View style={styles.highlightHeader}>
                <Text style={styles.highlightNumber}>Point {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeHighlight(highlight.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={highlight.icon}
                  onChangeText={(value) => updateHighlight(highlight.id, 'icon', value)}
                  placeholder="Ex: 💰"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Point fort</Text>
                <TextInput
                  style={styles.textInput}
                  value={highlight.highlight}
                  onChangeText={(value) => updateHighlight(highlight.id, 'highlight', value)}
                  placeholder="Ex: Réduction exceptionnelle"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Valeur</Text>
                <TextInput
                  style={styles.textInput}
                  value={highlight.value}
                  onChangeText={(value) => updateHighlight(highlight.id, 'value', value)}
                  placeholder="Ex: -50%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Conditions */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Conditions</Text>
            <TouchableOpacity onPress={addCondition} style={styles.addButton}>
              <Plus size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
          
          {conditions.map((condition, index) => (
            <View key={condition.id} style={styles.conditionEditor}>
              <View style={styles.conditionHeader}>
                <Text style={styles.conditionNumber}>Condition {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeCondition(condition.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={condition.icon}
                  onChangeText={(value) => updateCondition(condition.id, 'icon', value)}
                  placeholder="Ex: ⏰"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Condition</Text>
                <TextInput
                  style={styles.textInput}
                  value={condition.condition}
                  onChangeText={(value) => updateCondition(condition.id, 'condition', value)}
                  placeholder="Ex: Offre limitée"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Détail</Text>
                <TextInput
                  style={styles.textInput}
                  value={condition.detail}
                  onChangeText={(value) => updateCondition(condition.id, 'detail', value)}
                  placeholder="Ex: Jusqu'au 31/01/2024"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Zap size={24} color="#EF4444" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '💰', title: 'Offres Attractives', desc: 'Promotions percutantes' },
            { icon: '⏰', title: 'Urgence', desc: 'Limitation temporelle' },
            { icon: '🎯', title: 'Call-to-Action', desc: 'Actions claires' },
            { icon: '📱', title: 'Multi-Support', desc: 'Compatible tous formats' },
            { icon: '🎨', title: 'Design Impactant', desc: 'Visuels accrocheurs' },
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
    backgroundColor: '#FEE2E2',
  },
  highlightEditor: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  highlightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  highlightNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  conditionEditor: {
    backgroundColor: '#FEE2E2',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  conditionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  conditionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#991B1B',
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
  flyerCover: {
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
  flyerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  offerTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  flyerDetails: {
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
  flyerSection: {
    marginBottom: 32,
  },
  highlightCard: {
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
  highlightHeader: {
    padding: 16,
  },
  highlightIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  highlightValue: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  conditionCard: {
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
  conditionHeader: {
    padding: 16,
  },
  conditionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  conditionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  conditionDetail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  flyerFooter: {
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