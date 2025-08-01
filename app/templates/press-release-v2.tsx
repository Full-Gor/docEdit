import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Video, Image, Music, Play, Plus, X, FileText, BarChart3, Calendar, Briefcase } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function PressReleaseV2Template() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Communiqué de Presse');
  const [company, setCompany] = useState('Mon Entreprise');
  const [introduction, setIntroduction] = useState('Nous sommes ravis d\'annoncer une nouvelle importante pour notre entreprise...');
  const [isPreview, setIsPreview] = useState(false);
  
  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setIntroduction(savedDoc.introduction || introduction);
        
        if (savedDoc.mediaAssets) {
          setMediaAssets(savedDoc.mediaAssets);
        }
      } catch (error) {
        console.error('Erreur lors du chargement du document sauvegardé:', error);
      }
    }
  }, [params.savedDocument]);
  
  // State variables pour les assets média
  const [mediaAssets, setMediaAssets] = useState([
    { id: 1, title: 'Vidéo de présentation', desc: 'Vidéo corporate 2min', type: 'video', color: ['#6366F1', '#4F46E5'], link: '/media/video' },
    { id: 2, title: 'Photos produit', desc: 'Galerie d\'images HD', type: 'image', color: ['#10B981', '#059669'], link: '/media/photos' },
    { id: 3, title: 'Podcast interview', desc: 'Interview CEO 15min', type: 'audio', color: ['#F59E0B', '#D97706'], link: '/media/podcast' },
    { id: 4, title: 'Démo interactive', desc: 'Démonstration produit', type: 'interactive', color: ['#EC4899', '#DB2777'], link: '/media/demo' },
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const updateMediaAsset = (id: number, field: 'title' | 'desc', value: string) => {
    setMediaAssets(prev => 
      prev.map(asset => 
        asset.id === id 
          ? { ...asset, [field]: value }
          : asset
      )
    );
  };

  const addMediaAsset = () => {
    const newId = Math.max(...mediaAssets.map(a => a.id)) + 1;
    const colors = [
      ['#6366F1', '#4F46E5'],
      ['#10B981', '#059669'],
      ['#F59E0B', '#D97706'],
      ['#EC4899', '#DB2777'],
      ['#8B5CF6', '#7C3AED'],
      ['#EF4444', '#DC2626'],
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    setMediaAssets(prev => [...prev, {
      id: newId,
      title: 'Nouvel Asset Média',
      desc: 'Description de l\'asset',
      type: 'video',
      color: randomColor,
      link: '/media/new'
    }]);
  };

  const removeMediaAsset = (id: number) => {
    setMediaAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const navigateToMedia = (link: string) => {
    console.log('Navigation vers:', link);
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'press-release-v2',
        title,
        company,
        introduction,
        mediaAssets,
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
            <p><strong>Template:</strong> press-release-v2.tsx</p>
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
        {/* Header minimaliste */}
        <View style={styles.previewHeaderMinimal}>
          <TouchableOpacity onPress={togglePreview} style={styles.closePreviewButton}>
            <X size={20} color="#1E293B" />
          </TouchableOpacity>
          <Text style={styles.previewMode}>Mode Aperçu</Text>
        </View>
        
        <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
          {/* Cover minimaliste */}
          <View style={styles.coverMinimal}>
            <View style={styles.coverDecoration}>
              <View style={styles.decorLine1} />
              <View style={styles.decorLine2} />
              <View style={styles.decorLine3} />
            </View>
            
            <View style={styles.coverContentMinimal}>
              <Text style={styles.yearMinimal}>2024</Text>
              <View style={styles.titleDivider} />
              <Text style={styles.titleMinimal}>{title}</Text>
              <Text style={styles.companyMinimal}>{company}</Text>
              <View style={styles.taglineContainer}>
                <Text style={styles.taglineMinimal}>Communication</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Média</Text>
                <View style={styles.taglineDot} />
                <Text style={styles.taglineMinimal}>Presse</Text>
              </View>
            </View>
          </View>
          
          {/* Message Section */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <FileText size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Communiqué Officiel</Text>
            </View>
            <View style={styles.messageBoxMinimal}>
              <Text style={styles.messageQuote}>"</Text>
              <Text style={styles.messageTextMinimal}>{introduction}</Text>
              <View style={styles.signatureMinimal}>
                <View style={styles.signatureLineMinimal} />
                <Text style={styles.signatureNameMinimal}>Service Communication</Text>
              </View>
            </View>
          </View>
          
          {/* Media Assets Grid */}
          <View style={styles.sectionMinimal}>
            <View style={styles.sectionHeaderMinimal}>
              <Video size={20} color="#1E293B" />
              <Text style={styles.sectionTitleMinimal}>Assets Média</Text>
            </View>
            <View style={styles.mediaContainerMinimal}>
              {mediaAssets.map((asset, index) => (
                <TouchableOpacity 
                  key={asset.id}
                  style={styles.mediaItem}
                  onPress={() => navigateToMedia(asset.link)}
                >
                  <View style={styles.mediaLeft}>
                    <View style={[styles.mediaDot, { backgroundColor: asset.color[0] }]} />
                    {index < mediaAssets.length - 1 && <View style={styles.mediaLine} />}
                  </View>
                  <View style={styles.mediaContent}>
                    <Text style={styles.mediaTitle}>{asset.title}</Text>
                    <Text style={styles.mediaDesc}>{asset.desc}</Text>
                  </View>
                  <Play size={16} color="#94A3B8" />
                </TouchableOpacity>
              ))}
            </View>
          </View>
          
          {/* Footer Minimaliste */}
          <View style={styles.footerMinimal}>
            <View style={styles.footerDivider} />
            <Text style={styles.footerTextMinimal}>© 2024 {company}</Text>
            <Text style={styles.footerSubMinimal}>Communiqué généré avec excellence</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header épuré */}
      <View style={styles.headerMinimal}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButtonMinimal}>
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitleMinimal}>Communiqué de Presse</Text>
        <View style={styles.headerActionsMinimal}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButtonMinimal}>
            <Eye size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.actionButtonMinimal}>
            <Save size={18} color="#64748B" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareDocument} style={styles.actionButtonMinimal}>
            <Share size={18} color="#64748B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Informations principales */}
        <View style={styles.mainCard}>
          <View style={styles.cardIconHeader}>
            <FileText size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Informations principales</Text>
          </View>
          
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Titre du communiqué</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Communiqué de Presse"
              placeholderTextColor="#CBD5E1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Entreprise</Text>
            <TextInput
              style={styles.input}
              value={company}
              onChangeText={setCompany}
              placeholder="Ex: TechCorp Industries"
              placeholderTextColor="#CBD5E1"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Message principal</Text>
            <TextInput
              style={[styles.input, styles.textAreaMinimal]}
              value={introduction}
              onChangeText={setIntroduction}
              placeholder="Décrivez votre annonce..."
              placeholderTextColor="#CBD5E1"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Assets Média - Design Cards */}
        <View style={styles.mediaSection}>
          <View style={styles.cardIconHeader}>
            <Video size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Assets Média</Text>
          </View>
          
          <View style={styles.mediaGrid}>
            {/* Asset 1 */}
            <View style={styles.mediaEditCard}>
              <View style={styles.mediaIconCircle}>
                <Video size={16} color="#10B981" />
              </View>
              <Text style={styles.mediaCardTitle}>Vidéo</Text>
              <TextInput
                style={styles.mediaInput}
                value={mediaAssets[0]?.title || ''}
                onChangeText={(value) => updateMediaAsset(1, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.mediaInputSmall}
                value={mediaAssets[0]?.desc || ''}
                onChangeText={(value) => updateMediaAsset(1, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Asset 2 */}
            <View style={styles.mediaEditCard}>
              <View style={styles.mediaIconCircle}>
                <Image size={16} color="#3B82F6" />
              </View>
              <Text style={styles.mediaCardTitle}>Images</Text>
              <TextInput
                style={styles.mediaInput}
                value={mediaAssets[1]?.title || ''}
                onChangeText={(value) => updateMediaAsset(2, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.mediaInputSmall}
                value={mediaAssets[1]?.desc || ''}
                onChangeText={(value) => updateMediaAsset(2, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Asset 3 */}
            <View style={styles.mediaEditCard}>
              <View style={styles.mediaIconCircle}>
                <Music size={16} color="#8B5CF6" />
              </View>
              <Text style={styles.mediaCardTitle}>Audio</Text>
              <TextInput
                style={styles.mediaInput}
                value={mediaAssets[2]?.title || ''}
                onChangeText={(value) => updateMediaAsset(3, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.mediaInputSmall}
                value={mediaAssets[2]?.desc || ''}
                onChangeText={(value) => updateMediaAsset(3, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>

            {/* Asset 4 */}
            <View style={styles.mediaEditCard}>
              <View style={styles.mediaIconCircle}>
                <Play size={16} color="#EC4899" />
              </View>
              <Text style={styles.mediaCardTitle}>Interactif</Text>
              <TextInput
                style={styles.mediaInput}
                value={mediaAssets[3]?.title || ''}
                onChangeText={(value) => updateMediaAsset(4, 'title', value)}
                placeholder="Titre"
                placeholderTextColor="#CBD5E1"
              />
              <TextInput
                style={styles.mediaInputSmall}
                value={mediaAssets[3]?.desc || ''}
                onChangeText={(value) => updateMediaAsset(4, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
              />
            </View>
          </View>
        </View>

        {/* Assets Média - Liste épurée */}
        <View style={styles.mediaAssetsSection}>
          <View style={styles.sectionHeaderRow}>
            <View style={styles.cardIconHeader}>
              <Video size={24} color="#64748B" />
              <Text style={styles.cardHeaderText}>Assets Média</Text>
            </View>
            <TouchableOpacity onPress={addMediaAsset} style={styles.addButtonMinimal}>
              <Plus size={16} color="#1E293B" />
            </TouchableOpacity>
          </View>
          
          {mediaAssets.map((asset, index) => (
            <View key={asset.id} style={styles.mediaAssetEditItem}>
              <View style={styles.mediaAssetEditHeader}>
                <View style={styles.mediaAssetNumber}>
                  <Text style={styles.mediaAssetNumberText}>{index + 1}</Text>
                </View>
                <TouchableOpacity 
                  onPress={() => removeMediaAsset(asset.id)}
                  style={styles.deleteButton}
                >
                  <X size={14} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <TextInput
                style={styles.mediaAssetTitleInput}
                value={asset.title}
                onChangeText={(value) => updateMediaAsset(asset.id, 'title', value)}
                placeholder="Titre de l'asset"
                placeholderTextColor="#CBD5E1"
              />
              
              <TextInput
                style={styles.mediaAssetDescInput}
                value={asset.desc}
                onChangeText={(value) => updateMediaAsset(asset.id, 'desc', value)}
                placeholder="Description"
                placeholderTextColor="#CBD5E1"
                multiline
                numberOfLines={2}
              />
            </View>
          ))}
        </View>

        {/* Features - Design minimaliste */}
        <View style={styles.featuresMinimal}>
          <View style={styles.cardIconHeader}>
            <Video size={24} color="#64748B" />
            <Text style={styles.cardHeaderText}>Caractéristiques</Text>
          </View>
          
          <View style={styles.featuresList}>
            {[
              { icon: <Video size={18} color="#6366F1" />, title: 'Multimédia', desc: 'Support vidéo, image, audio' },
              { icon: <Image size={18} color="#6366F1" />, title: 'HD Quality', desc: 'Résolution haute définition' },
              { icon: <Music size={18} color="#6366F1" />, title: 'Audio Pro', desc: 'Qualité audio professionnelle' },
              { icon: <Play size={18} color="#6366F1" />, title: 'Interactif', desc: 'Contenu interactif' },
              { icon: <FileText size={18} color="#6366F1" />, title: 'Sécurisé', desc: 'Protection des médias' },
            ].map((feature, index) => (
              <View key={index} style={styles.featureItemMinimal}>
                <View style={styles.featureIconBox}>
                  {feature.icon}
                </View>
                <View style={styles.featureTextBox}>
                  <Text style={styles.featureTitleMinimal}>{feature.title}</Text>
                  <Text style={styles.featureDescMinimal}>{feature.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFBFC',
  },
  
  // Header minimaliste
  headerMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  backButtonMinimal: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  headerTitleMinimal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    flex: 1,
    marginLeft: 16,
  },
  headerActionsMinimal: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButtonMinimal: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  
  // Content
  scrollContent: {
    flex: 1,
  },
  
  // Main Card
  mainCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 20,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  cardIconHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  cardHeaderText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // Inputs
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  textAreaMinimal: {
    height: 120,
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  
  // Media Section
  mediaSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  mediaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  mediaEditCard: {
    width: (width - 64) / 2,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mediaIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mediaCardTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 12,
  },
  mediaInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  mediaInputSmall: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  
  // Media Assets Section
  mediaAssetsSection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  addButtonMinimal: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mediaAssetEditItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  mediaAssetEditHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  mediaAssetNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mediaAssetNumberText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  deleteButton: {
    padding: 4,
    borderRadius: 4,
  },
  mediaAssetTitleInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  mediaAssetDescInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: '#64748B',
    textAlignVertical: 'top',
  },
  
  // Features Minimal
  featuresMinimal: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 24,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  featuresList: {
    gap: 12,
  },
  featureItemMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureTextBox: {
    flex: 1,
  },
  featureTitleMinimal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  featureDescMinimal: {
    fontSize: 12,
    color: '#94A3B8',
  },
  
  // Preview Mode
  previewHeaderMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  closePreviewButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  previewMode: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    marginLeft: 16,
  },
  previewScroll: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  
  // Cover Minimal
  coverMinimal: {
    height: 400,
    backgroundColor: '#FAFBFC',
    position: 'relative',
    overflow: 'hidden',
  },
  coverDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorLine1: {
    position: 'absolute',
    top: 50,
    left: -50,
    right: -50,
    height: 1,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '15deg' }],
  },
  decorLine2: {
    position: 'absolute',
    bottom: 100,
    left: -50,
    right: -50,
    height: 1,
    backgroundColor: '#E2E8F0',
    transform: [{ rotate: '-10deg' }],
  },
  decorLine3: {
    position: 'absolute',
    top: '50%',
    right: -100,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  coverContentMinimal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  yearMinimal: {
    fontSize: 14,
    fontWeight: '400',
    color: '#94A3B8',
    letterSpacing: 4,
    marginBottom: 16,
  },
  titleDivider: {
    width: 40,
    height: 2,
    backgroundColor: '#1E293B',
    marginBottom: 16,
  },
  titleMinimal: {
    fontSize: 32,
    fontWeight: '300',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  companyMinimal: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 24,
  },
  taglineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  taglineMinimal: {
    fontSize: 12,
    color: '#94A3B8',
    letterSpacing: 1,
  },
  taglineDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
  },
  
  // Sections Minimal
  sectionMinimal: {
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  sectionHeaderMinimal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  sectionTitleMinimal: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
  },
  
  // Message Box
  messageBoxMinimal: {
    backgroundColor: '#FAFBFC',
    borderLeftWidth: 3,
    borderLeftColor: '#E2E8F0',
    padding: 24,
    position: 'relative',
  },
  messageQuote: {
    position: 'absolute',
    top: -10,
    left: 10,
    fontSize: 60,
    color: '#E2E8F0',
    fontWeight: '300',
  },
  messageTextMinimal: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 26,
    fontStyle: 'italic',
    marginBottom: 20,
  },
  signatureMinimal: {
    alignItems: 'flex-end',
  },
  signatureLineMinimal: {
    width: 80,
    height: 1,
    backgroundColor: '#CBD5E1',
    marginBottom: 6,
  },
  signatureNameMinimal: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  
  // Media Container Minimal
  mediaContainerMinimal: {
    paddingLeft: 8,
  },
  mediaItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  mediaLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  mediaDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  mediaLine: {
    width: 1,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
  },
  mediaContent: {
    flex: 1,
    paddingTop: -4,
  },
  mediaTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  mediaDesc: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Footer Minimal
  footerMinimal: {
    alignItems: 'center',
    paddingVertical: 40,
    backgroundColor: '#FAFBFC',
  },
  footerDivider: {
    width: 40,
    height: 1,
    backgroundColor: '#E2E8F0',
    marginBottom: 16,
  },
  footerTextMinimal: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubMinimal: {
    fontSize: 11,
    color: '#94A3B8',
  },
}); 