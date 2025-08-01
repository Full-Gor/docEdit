import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, FileText, User, Calendar, Star, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SalesBrochureTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Brochure Commerciale');
  const [company, setCompany] = useState('Mon Entreprise');
  const [productName, setProductName] = useState('Solution Premium Pro');
  const [author, setAuthor] = useState('Équipe Commerciale');
  const [date, setDate] = useState('15/01/2024');
  const [version, setVersion] = useState('v2.1');
  const [isPreview, setIsPreview] = useState(false);
  
  const [features, setFeatures] = useState([
    { id: 1, feature: 'Interface intuitive', benefit: 'Facilité d\'utilisation', icon: '🎯' },
    { id: 2, feature: 'Sécurité avancée', benefit: 'Protection des données', icon: '🔒' },
    { id: 3, feature: 'Support 24/7', benefit: 'Assistance continue', icon: '📞' },
    { id: 4, feature: 'Intégration API', benefit: 'Connectivité complète', icon: '🔗' },
  ]);

  const [testimonials, setTestimonials] = useState([
    { id: 1, name: 'Jean Dupont', company: 'TechCorp', quote: 'Solution exceptionnelle !', rating: 5, icon: '⭐' },
    { id: 2, name: 'Marie Martin', company: 'InnovSoft', quote: 'Très satisfaite du service', rating: 5, icon: '⭐' },
    { id: 3, name: 'Pierre Bernard', company: 'DataFlow', quote: 'Recommandé sans hésitation', rating: 5, icon: '⭐' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setProductName(savedDoc.productName || productName);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setVersion(savedDoc.version || version);
        if (savedDoc.features) {
          setFeatures(savedDoc.features);
        }
        if (savedDoc.testimonials) {
          setTestimonials(savedDoc.testimonials);
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

  const updateFeature = (id: number, field: 'feature' | 'benefit' | 'icon', value: string) => {
    setFeatures(prev => 
      prev.map(feature => 
        feature.id === id 
          ? { ...feature, [field]: value }
          : feature
      )
    );
  };

  const addFeature = () => {
    const newId = Math.max(...features.map(f => f.id)) + 1;
    setFeatures(prev => [...prev, {
      id: newId,
      feature: 'Nouvelle fonctionnalité',
      benefit: 'Avantage client',
      icon: '✨'
    }]);
  };

  const removeFeature = (id: number) => {
    setFeatures(prev => prev.filter(feature => feature.id !== id));
  };

  const updateTestimonial = (id: number, field: 'name' | 'company' | 'quote' | 'icon', value: string) => {
    setTestimonials(prev => 
      prev.map(testimonial => 
        testimonial.id === id 
          ? { ...testimonial, [field]: value }
          : testimonial
      )
    );
  };

  const addTestimonial = () => {
    const newId = Math.max(...testimonials.map(t => t.id)) + 1;
    setTestimonials(prev => [...prev, {
      id: newId,
      name: 'Nouveau client',
      company: 'Entreprise',
      quote: 'Témoignage client',
      rating: 5,
      icon: '⭐'
    }]);
  };

  const removeTestimonial = (id: number) => {
    setTestimonials(prev => prev.filter(testimonial => testimonial.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'sales-brochure',
        title,
        company,
        productName,
        author,
        date,
        version,
        features,
        testimonials,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre brochure commerciale a été sauvegardée localement.',
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
            <p><strong>Template:</strong> sales-brochure.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de la Brochure</Text>
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
            style={styles.brochureCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.brochureTitle}>{title}</Text>
              <Text style={styles.productName}>{productName}</Text>
              <View style={styles.brochureDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Star size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Version {version}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Features */}
          <View style={styles.brochureSection}>
            <Text style={styles.sectionTitle}>Fonctionnalités Principales</Text>
            {features.map((feature, index) => (
              <View key={feature.id} style={styles.featureCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.featureHeader}
                >
                  <Text style={styles.featureIcon}>{feature.icon}</Text>
                  <Text style={styles.featureName}>{feature.feature}</Text>
                  <Text style={styles.featureBenefit}>{feature.benefit}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Testimonials */}
          <View style={styles.brochureSection}>
            <Text style={styles.sectionTitle}>Témoignages Clients</Text>
            {testimonials.map((testimonial, index) => (
              <View key={testimonial.id} style={styles.testimonialCard}>
                <LinearGradient
                  colors={['#8B5CF6', '#7C3AED']}
                  style={styles.testimonialHeader}
                >
                  <Text style={styles.testimonialIcon}>{testimonial.icon}</Text>
                  <Text style={styles.testimonialQuote}>"{testimonial.quote}"</Text>
                  <Text style={styles.testimonialName}>{testimonial.name}</Text>
                  <Text style={styles.testimonialCompany}>{testimonial.company}</Text>
                  <Text style={styles.testimonialRating}>{'⭐'.repeat(testimonial.rating)}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.brochureFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Brochure commerciale générée avec professionnalisme</Text>
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
        <Text style={styles.headerTitle}>Créer une Brochure Commerciale</Text>
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
              <Text style={styles.fieldLabel}>Titre de la brochure</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Brochure Commerciale"
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
              <Text style={styles.fieldLabel}>Nom du produit/service</Text>
              <Text style={styles.fieldHint}>Nom du produit présenté</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={productName}
              onChangeText={setProductName}
              placeholder="Ex: Solution Premium Pro"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable de la brochure</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={author}
              onChangeText={setAuthor}
              placeholder="Ex: Équipe Commerciale"
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
              <Text style={styles.fieldLabel}>Version</Text>
              <Text style={styles.fieldHint}>Numéro de version</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={version}
              onChangeText={setVersion}
              placeholder="Ex: v2.1"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Features */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fonctionnalités Principales</Text>
            <TouchableOpacity onPress={addFeature} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {features.map((feature, index) => (
            <View key={feature.id} style={styles.featureEditor}>
              <View style={styles.featureHeader}>
                <Text style={styles.featureNumber}>Fonctionnalité {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeFeature(feature.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={feature.icon}
                  onChangeText={(value) => updateFeature(feature.id, 'icon', value)}
                  placeholder="Ex: 🎯"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Fonctionnalité</Text>
                <TextInput
                  style={styles.textInput}
                  value={feature.feature}
                  onChangeText={(value) => updateFeature(feature.id, 'feature', value)}
                  placeholder="Ex: Interface intuitive"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Avantage client</Text>
                <TextInput
                  style={styles.textInput}
                  value={feature.benefit}
                  onChangeText={(value) => updateFeature(feature.id, 'benefit', value)}
                  placeholder="Ex: Facilité d'utilisation"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Testimonials */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Témoignages Clients</Text>
            <TouchableOpacity onPress={addTestimonial} style={styles.addButton}>
              <Plus size={20} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
          
          {testimonials.map((testimonial, index) => (
            <View key={testimonial.id} style={styles.testimonialEditor}>
              <View style={styles.testimonialHeader}>
                <Text style={styles.testimonialNumber}>Témoignage {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeTestimonial(testimonial.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={testimonial.icon}
                  onChangeText={(value) => updateTestimonial(testimonial.id, 'icon', value)}
                  placeholder="Ex: ⭐"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom du client</Text>
                <TextInput
                  style={styles.textInput}
                  value={testimonial.name}
                  onChangeText={(value) => updateTestimonial(testimonial.id, 'name', value)}
                  placeholder="Ex: Jean Dupont"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Entreprise</Text>
                <TextInput
                  style={styles.textInput}
                  value={testimonial.company}
                  onChangeText={(value) => updateTestimonial(testimonial.id, 'company', value)}
                  placeholder="Ex: TechCorp"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Témoignage</Text>
                <TextInput
                  style={[styles.textInput, styles.textArea]}
                  value={testimonial.quote}
                  onChangeText={(value) => updateTestimonial(testimonial.id, 'quote', value)}
                  placeholder="Ex: Solution exceptionnelle !"
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
            { icon: '✨', title: 'Fonctionnalités', desc: 'Présentation des avantages' },
            { icon: '⭐', title: 'Témoignages', desc: 'Preuves sociales' },
            { icon: '📊', title: 'Données Concrètes', desc: 'Chiffres et métriques' },
            { icon: '🎨', title: 'Design Attractif', desc: 'Présentation professionnelle' },
            { icon: '📱', title: 'Format Adaptatif', desc: 'Compatible tous supports' },
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
    height: 100,
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
  featureEditor: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  featureHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  featureNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5B21B6',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  testimonialEditor: {
    backgroundColor: '#EDE9FE',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  testimonialHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  testimonialNumber: {
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
  brochureCover: {
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
  brochureTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  productName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  brochureDetails: {
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
  brochureSection: {
    marginBottom: 32,
  },
  featureCard: {
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
  featureHeader: {
    padding: 16,
  },
  featureIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  featureName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  featureBenefit: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  testimonialCard: {
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
  testimonialHeader: {
    padding: 16,
  },
  testimonialIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  testimonialQuote: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    fontStyle: 'italic',
  },
  testimonialName: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  testimonialCompany: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  testimonialRating: {
    fontSize: 16,
    color: '#FCD34D',
  },
  brochureFooter: {
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