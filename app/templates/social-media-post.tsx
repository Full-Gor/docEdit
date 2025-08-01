import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Image, User, Calendar, Hash, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function SocialMediaPostTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Post Réseaux Sociaux');
  const [company, setCompany] = useState('Mon Entreprise');
  const [postTitle, setPostTitle] = useState('Nouveau produit disponible !');
  const [author, setAuthor] = useState('Équipe Marketing');
  const [date, setDate] = useState('15/01/2024');
  const [platform, setPlatform] = useState('Instagram');
  const [isPreview, setIsPreview] = useState(false);
  
  const [hashtags, setHashtags] = useState([
    { id: 1, tag: '#innovation', category: 'Technologie' },
    { id: 2, tag: '#nouveaute', category: 'Produit' },
    { id: 3, tag: '#qualite', category: 'Valeur' },
    { id: 4, tag: '#entreprise', category: 'Marque' },
  ]);

  const [callToAction, setCallToAction] = useState([
    { id: 1, action: 'Découvrir maintenant', link: 'https://lien.com', icon: '🔗' },
    { id: 2, action: 'En savoir plus', link: 'https://info.com', icon: '📖' },
    { id: 3, action: 'Commander', link: 'https://achat.com', icon: '🛒' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setPostTitle(savedDoc.postTitle || postTitle);
        setAuthor(savedDoc.author || author);
        setDate(savedDoc.date || date);
        setPlatform(savedDoc.platform || platform);
        if (savedDoc.hashtags) {
          setHashtags(savedDoc.hashtags);
        }
        if (savedDoc.callToAction) {
          setCallToAction(savedDoc.callToAction);
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

  const updateHashtag = (id: number, field: 'tag' | 'category', value: string) => {
    setHashtags(prev => 
      prev.map(hashtag => 
        hashtag.id === id 
          ? { ...hashtag, [field]: value }
          : hashtag
      )
    );
  };

  const addHashtag = () => {
    const newId = Math.max(...hashtags.map(h => h.id)) + 1;
    setHashtags(prev => [...prev, {
      id: newId,
      tag: '#nouveau',
      category: 'Catégorie'
    }]);
  };

  const removeHashtag = (id: number) => {
    setHashtags(prev => prev.filter(hashtag => hashtag.id !== id));
  };

  const updateCallToAction = (id: number, field: 'action' | 'link' | 'icon', value: string) => {
    setCallToAction(prev => 
      prev.map(cta => 
        cta.id === id 
          ? { ...cta, [field]: value }
          : cta
      )
    );
  };

  const addCallToAction = () => {
    const newId = Math.max(...callToAction.map(c => c.id)) + 1;
    setCallToAction(prev => [...prev, {
      id: newId,
      action: 'Nouvelle action',
      link: 'https://lien.com',
      icon: '🔗'
    }]);
  };

  const removeCallToAction = (id: number) => {
    setCallToAction(prev => prev.filter(cta => cta.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'social-media-post',
        title,
        company,
        postTitle,
        author,
        date,
        platform,
        hashtags,
        callToAction,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre post réseaux sociaux a été sauvegardé localement.',
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
            <p><strong>Template:</strong> social-media-post.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Post</Text>
          <View style={styles.sparklesIcon}>
            <Image size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#F59E0B', '#D97706', '#B45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.postCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.postTitle}>{title}</Text>
              <Text style={styles.postSubtitle}>{postTitle}</Text>
              <View style={styles.postDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{author}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Image size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{platform}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Hashtags */}
          <View style={styles.postSection}>
            <Text style={styles.sectionTitle}>Hashtags</Text>
            {hashtags.map((hashtag, index) => (
              <View key={hashtag.id} style={styles.hashtagCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.hashtagHeader}
                >
                  <Text style={styles.hashtagText}>{hashtag.tag}</Text>
                  <Text style={styles.hashtagCategory}>{hashtag.category}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Call to Action */}
          <View style={styles.postSection}>
            <Text style={styles.sectionTitle}>Call-to-Action</Text>
            {callToAction.map((cta, index) => (
              <View key={cta.id} style={styles.ctaCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.ctaHeader}
                >
                  <Text style={styles.ctaIcon}>{cta.icon}</Text>
                  <Text style={styles.ctaAction}>{cta.action}</Text>
                  <Text style={styles.ctaLink}>{cta.link}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.postFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Post réseaux sociaux généré avec engagement</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F59E0B', '#D97706']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Créer un Post Réseaux Sociaux</Text>
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
              <Text style={styles.fieldLabel}>Titre du post</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Post Réseaux Sociaux"
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
              <Text style={styles.fieldLabel}>Titre du post</Text>
              <Text style={styles.fieldHint}>Titre accrocheur du post</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={postTitle}
              onChangeText={setPostTitle}
              placeholder="Ex: Nouveau produit disponible !"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Auteur</Text>
              <Text style={styles.fieldHint}>Responsable du post</Text>
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
              <Text style={styles.fieldLabel}>Date de publication</Text>
              <Text style={styles.fieldHint}>Date prévue de publication</Text>
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
              <Text style={styles.fieldLabel}>Plateforme</Text>
              <Text style={styles.fieldHint}>Réseau social cible</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={platform}
              onChangeText={setPlatform}
              placeholder="Ex: Instagram, Facebook, LinkedIn"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Hashtags */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Hashtags</Text>
            <TouchableOpacity onPress={addHashtag} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {hashtags.map((hashtag, index) => (
            <View key={hashtag.id} style={styles.hashtagEditor}>
              <View style={styles.hashtagHeader}>
                <Text style={styles.hashtagNumber}>Hashtag {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeHashtag(hashtag.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Hashtag</Text>
                <TextInput
                  style={styles.textInput}
                  value={hashtag.tag}
                  onChangeText={(value) => updateHashtag(hashtag.id, 'tag', value)}
                  placeholder="Ex: #innovation"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Catégorie</Text>
                <TextInput
                  style={styles.textInput}
                  value={hashtag.category}
                  onChangeText={(value) => updateHashtag(hashtag.id, 'category', value)}
                  placeholder="Ex: Technologie"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Call to Action */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Call-to-Action</Text>
            <TouchableOpacity onPress={addCallToAction} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {callToAction.map((cta, index) => (
            <View key={cta.id} style={styles.ctaEditor}>
              <View style={styles.ctaHeader}>
                <Text style={styles.ctaNumber}>CTA {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeCallToAction(cta.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={cta.icon}
                  onChangeText={(value) => updateCallToAction(cta.id, 'icon', value)}
                  placeholder="Ex: 🔗"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Action</Text>
                <TextInput
                  style={styles.textInput}
                  value={cta.action}
                  onChangeText={(value) => updateCallToAction(cta.id, 'action', value)}
                  placeholder="Ex: Découvrir maintenant"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Lien</Text>
                <TextInput
                  style={styles.textInput}
                  value={cta.link}
                  onChangeText={(value) => updateCallToAction(cta.id, 'link', value)}
                  placeholder="Ex: https://lien.com"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Image size={24} color="#F59E0B" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '📱', title: 'Multi-Plateforme', desc: 'Adapté tous réseaux' },
            { icon: '🏷️', title: 'Hashtags Optimisés', desc: 'Visibilité maximale' },
            { icon: '🎯', title: 'Call-to-Action', desc: 'Actions claires' },
            { icon: '📊', title: 'Engagement', desc: 'Métriques de performance' },
            { icon: '🎨', title: 'Design Attractif', desc: 'Visuels percutants' },
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
  hashtagEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  hashtagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hashtagNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  ctaEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  ctaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  ctaNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
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
  postCover: {
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
  postTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  postSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  postDetails: {
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
  postSection: {
    marginBottom: 32,
  },
  hashtagCard: {
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
  hashtagHeader: {
    padding: 16,
  },
  hashtagText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  hashtagCategory: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  ctaCard: {
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
  ctaHeader: {
    padding: 16,
  },
  ctaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  ctaAction: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  ctaLink: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  postFooter: {
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