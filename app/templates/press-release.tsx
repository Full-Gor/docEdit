import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Calendar, Building, Sparkles, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PressReleaseTemplate() {
  const [title, setTitle] = useState('Lancement d\'un nouveau produit révolutionnaire');
  const [subtitle, setSubtitle] = useState('Innovation technologique majeure pour l\'industrie');
  const [date, setDate] = useState(new Date().toLocaleDateString('fr-FR'));
  const [location, setLocation] = useState('Paris, France');
  const [content, setContent] = useState('Notre entreprise est fière d\'annoncer le lancement d\'un nouveau produit qui révolutionne le marché. Cette innovation majeure représente le fruit de plusieurs années de recherche et développement...');
  const [contact, setContact] = useState('Marie Dupont\nTéléphone: +33 1 23 45 67 89\nEmail: presse@entreprise.com');
  const [isPreview, setIsPreview] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'press-release',
        title,
        subtitle,
        date,
        location,
        content,
        contact,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));

      Alert.alert(
        'Sauvegarde réussie',
        'Votre communiqué de presse a été sauvegardé localement.',
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
          <Text style={styles.previewTitle}>Aperçu du Communiqué</Text>
          <View style={styles.sparklesIcon}>
            <Sparkles size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#2563EB', '#1D4ED8', '#1E40AF']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.releaseCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.releaseBadge}>COMMUNIQUÉ DE PRESSE</Text>
              <Text style={styles.releaseTitle}>{title}</Text>
              {subtitle && <Text style={styles.releaseSubtitle}>{subtitle}</Text>}
              <View style={styles.releaseMetadata}>
                <View style={styles.metadataItem}>
                  <Calendar size={16} color="#FFFFFF" />
                  <Text style={styles.metadataText}>{date}</Text>
                </View>
                {location && (
                  <View style={styles.metadataItem}>
                    <Building size={16} color="#FFFFFF" />
                    <Text style={styles.metadataText}>{location}</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
          
          {/* Content Section */}
          <View style={styles.releaseSection}>
            <LinearGradient
              colors={['#10B981', '#059669']}
              style={styles.sectionIcon}
            >
              <Sparkles size={24} color="#FFFFFF" />
            </LinearGradient>
            <Text style={styles.sectionTitle}>Contenu Principal</Text>
            <View style={styles.contentCard}>
              <Text style={styles.contentText}>{content}</Text>
            </View>
          </View>
          
          {/* Key Points */}
          <View style={styles.releaseSection}>
            <Text style={styles.sectionTitle}>Points Clés</Text>
            {[
              { title: 'Innovation Technologique', desc: 'Nouvelle approche révolutionnaire', color: ['#6366F1', '#4F46E5'] },
              { title: 'Impact Marché', desc: 'Transformation de l\'industrie', color: ['#10B981', '#059669'] },
              { title: 'Avantages Clients', desc: 'Expérience utilisateur améliorée', color: ['#F59E0B', '#D97706'] },
              { title: 'Perspectives Futures', desc: 'Développements à venir', color: ['#EC4899', '#DB2777'] },
            ].map((point, index) => (
              <TouchableOpacity key={index} style={styles.pointCard}>
                <LinearGradient
                  colors={point.color}
                  style={styles.pointGradient}
                >
                  <View style={styles.pointContent}>
                    <View>
                      <Text style={styles.pointTitle}>{point.title}</Text>
                      <Text style={styles.pointDesc}>{point.desc}</Text>
                    </View>
                    <ChevronRight size={24} color="#FFFFFF" />
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
          
          {/* Contact Section */}
          {contact && (
            <View style={styles.releaseSection}>
              <Text style={styles.sectionTitle}>Contact Presse</Text>
              <View style={styles.contactCard}>
                <Text style={styles.contactText}>{contact}</Text>
              </View>
            </View>
          )}
          
          {/* Footer */}
          <View style={styles.releaseFooter}>
            <Text style={styles.footerText}>© 2024 Communiqué de Presse. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Document généré avec professionnalisme</Text>
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
        <Text style={styles.headerTitle}>Créer un Communiqué de Presse</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButton}>
            <Eye size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.actionButton}>
            <Save size={22} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.editorContent} showsVerticalScrollIndicator={false}>
        <View style={styles.editorCard}>
          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Titre principal</Text>
              <Text style={styles.fieldHint}>Titre accrocheur et informatif</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Lancement d'un nouveau produit révolutionnaire"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Sous-titre (optionnel)</Text>
              <Text style={styles.fieldHint}>Information complémentaire</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={subtitle}
              onChangeText={setSubtitle}
              placeholder="Ex: Innovation technologique majeure"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formRow}>
            <View style={[styles.formSection, styles.halfWidth]}>
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>Date</Text>
                <Text style={styles.fieldHint}>Date de publication</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={date}
                onChangeText={setDate}
                placeholder="JJ/MM/AAAA"
                placeholderTextColor="#94A3B8"
              />
            </View>

            <View style={[styles.formSection, styles.halfWidth]}>
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>Lieu</Text>
                <Text style={styles.fieldHint}>Ville, Pays</Text>
              </View>
              <TextInput
                style={styles.textInput}
                value={location}
                onChangeText={setLocation}
                placeholder="Ex: Paris, France"
                placeholderTextColor="#94A3B8"
              />
            </View>
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Contenu principal</Text>
              <Text style={styles.fieldHint}>Rédigez le contenu de votre communiqué</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={content}
              onChangeText={setContent}
              placeholder="Rédigez le contenu de votre communiqué de presse..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={10}
              textAlignVertical="top"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Contact presse</Text>
              <Text style={styles.fieldHint}>Informations de contact</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.smallTextArea]}
              value={contact}
              onChangeText={setContact}
              placeholder="Nom, téléphone, email..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Sparkles size={24} color="#2563EB" />
            <Text style={styles.featuresTitle}>Conseils de Rédaction</Text>
          </View>
          
          {[
            { icon: '📰', title: 'Pyramide Inversée', desc: 'Commencez par l\'information la plus importante' },
            { icon: '❓', title: '5W', desc: 'Répondez aux Qui, Quoi, Quand, Où, Pourquoi' },
            { icon: '📝', title: 'Factuel', desc: 'Restez objectif et vérifiable' },
            { icon: '💬', title: 'Citations', desc: 'Incluez des citations si pertinent' },
            { icon: '🎯', title: 'Accrocheur', desc: 'Titre et début percutants' },
          ].map((tip, index) => (
            <View key={index} style={styles.featureItem}>
              <Text style={styles.featureIcon}>{tip.icon}</Text>
              <View style={styles.featureContent}>
                <Text style={styles.featureTitle}>{tip.title}</Text>
                <Text style={styles.featureDesc}>{tip.desc}</Text>
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
  formSection: {
    marginBottom: 28,
  },
  formRow: {
    flexDirection: 'row',
    gap: 16,
  },
  halfWidth: {
    flex: 1,
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
    height: 100,
    paddingTop: 16,
    textAlignVertical: 'top',
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
  releaseCover: {
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
  releaseBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 2,
    marginBottom: 24,
    opacity: 0.9,
  },
  releaseTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  releaseSubtitle: {
    fontSize: 18,
    color: '#FFFFFF',
    opacity: 0.9,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '500',
  },
  releaseMetadata: {
    flexDirection: 'row',
    gap: 20,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataText: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  releaseSection: {
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
  contentCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  contentText: {
    fontSize: 17,
    color: '#475569',
    lineHeight: 28,
  },
  pointCard: {
    marginBottom: 16,
  },
  pointGradient: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  pointContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  pointTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  pointDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.85)',
  },
  contactCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    elevation: 6,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
  },
  contactText: {
    fontSize: 16,
    color: '#475569',
    lineHeight: 24,
  },
  releaseFooter: {
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