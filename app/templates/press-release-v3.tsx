import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Plus, X, Moon, Sun, Layers, Video, Image, Music, Play, Mic, Camera, Headphones, Radio } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function PressReleaseV3Template() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Communiqué de Presse');
  const [company, setCompany] = useState('Mon Entreprise');
  const [headline, setHeadline] = useState('Titre accrocheur de votre annonce...');
  const [content, setContent] = useState('Contenu détaillé de votre communiqué...');
  const [isPreview, setIsPreview] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState(0);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;
  
  // State variables pour les médias
  const [mediaAssets, setMediaAssets] = useState([
    { id: 1, title: 'Vidéo Présentation', desc: 'Vidéo corporate 2min', icon: Video, gradient: ['#667EEA', '#764BA2'] },
    { id: 2, title: 'Photos Produit', desc: 'Galerie haute qualité', icon: Image, gradient: ['#F093FB', '#F5576C'] },
    { id: 3, title: 'Podcast Interview', desc: 'Entretien exclusif', icon: Mic, gradient: ['#4FACFE', '#00F2FE'] },
    { id: 4, title: 'Infographie', desc: 'Données visuelles', icon: Camera, gradient: ['#FA709A', '#FEE140'] },
  ]);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
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
    const icons = [Video, Image, Music, Play, Mic, Camera, Headphones, Radio];
    const gradients = [
      ['#667EEA', '#764BA2'],
      ['#F093FB', '#F5576C'],
      ['#4FACFE', '#00F2FE'],
      ['#FA709A', '#FEE140'],
      ['#30CFD0', '#330867'],
      ['#A8EDEA', '#FED6E3'],
    ];
    
    setMediaAssets(prev => [...prev, {
      id: newId,
      title: 'Nouveau Média',
      desc: 'Description du média',
      icon: icons[Math.floor(Math.random() * icons.length)],
      gradient: gradients[Math.floor(Math.random() * gradients.length)],
    }]);
  };

  const removeMediaAsset = (id: number) => {
    setMediaAssets(prev => prev.filter(asset => asset.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'press-release',
        title,
        company,
        headline,
        content,
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
        'Impossible de sauvegarder le document.',
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
            <p><strong>Template:</strong> press-release-v3.tsx</p>
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

  // Animation d'entrée
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 1,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 20,
        friction: 7,
        delay: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (isPreview) {
    return (
      <SafeAreaView style={[styles.container, isDarkMode && styles.containerDark]}>
        {/* Floating Header Glassmorphism */}
        <BlurView intensity={80} style={styles.floatingHeader}>
          <TouchableOpacity onPress={togglePreview} style={styles.floatingBackButton}>
            <X size={20} color={isDarkMode ? '#FFFFFF' : '#1E293B'} />
          </TouchableOpacity>
          <View style={styles.floatingTitle}>
            <Video size={20} color="#8B5CF6" />
            <Text style={[styles.floatingTitleText, isDarkMode && styles.textDark]}>Prévisualisation Média</Text>
          </View>
          <TouchableOpacity onPress={toggleDarkMode} style={styles.floatingThemeButton}>
            {isDarkMode ? <Sun size={20} color="#FCD34D" /> : <Moon size={20} color="#6366F1" />}
          </TouchableOpacity>
        </BlurView>
        
        <ScrollView 
          style={styles.previewScrollView}
          showsVerticalScrollIndicator={false}
          pagingEnabled
          horizontal={false}
        >
          {/* Hero Section Média */}
          <LinearGradient
            colors={isDarkMode ? ['#0F172A', '#1E293B', '#334155'] : ['#FFFFFF', '#F8FAFC', '#F1F5F9']}
            style={styles.heroSection}
          >
            <Animated.View style={[styles.heroContent, { opacity: fadeAnim }]}>
              <View style={styles.heroOrb}>
                <LinearGradient
                  colors={['#8B5CF6', '#6366F1', '#3B82F6']}
                  style={styles.orbGradient}
                >
                  <Video size={40} color="#FFFFFF" />
                </LinearGradient>
              </View>
              
              <Text style={[styles.heroYear, isDarkMode && styles.textDark]}>COMMUNIQUÉ</Text>
              <Text style={[styles.heroTitle, isDarkMode && styles.textDark]}>{title}</Text>
              <Text style={[styles.heroCompany, isDarkMode && styles.heroCompanyDark]}>{company}</Text>
              
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>{mediaAssets.length}</Text>
                  <Text style={styles.heroStatLabel}>Médias</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>24h</Text>
                  <Text style={styles.heroStatLabel}>Diffusion</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatNumber}>∞</Text>
                  <Text style={styles.heroStatLabel}>Reach</Text>
                </View>
              </View>
            </Animated.View>
          </LinearGradient>
          
          {/* Message Immersif */}
          <View style={[styles.immersiveSection, isDarkMode && styles.immersiveSectionDark]}>
            <Animated.View 
              style={[
                styles.messageContainer,
                {
                  transform: [
                    { translateY: slideAnim.interpolate({ inputRange: [0, 1], outputRange: [50, 0] }) },
                    { scale: scaleAnim }
                  ]
                }
              ]}
            >
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.messageGradientBorder}
              >
                <View style={[styles.messageInner, isDarkMode && styles.messageInnerDark]}>
                  <Text style={styles.messageQuoteMark}>"</Text>
                  <Text style={[styles.messageText, isDarkMode && styles.textDark]}>{headline}</Text>
                  <View style={styles.messageAuthor}>
                    <View style={styles.authorAvatar}>
                      <Text style={styles.authorInitial}>CP</Text>
                    </View>
                    <View>
                      <Text style={[styles.authorName, isDarkMode && styles.textDark]}>Service Presse</Text>
                      <Text style={styles.authorTitle}>Communication</Text>
                    </View>
                  </View>
                </View>
              </LinearGradient>
            </Animated.View>
          </View>
          
          {/* Assets Média Stack */}
          <View style={[styles.achievementsStackSection, isDarkMode && styles.achievementsStackSectionDark]}>
            <Text style={[styles.sectionTitleFuture, isDarkMode && styles.textDark]}>Assets Média</Text>
            
            <View style={styles.cardsStack}>
              {mediaAssets.map((asset, index) => {
                const Icon = asset.icon;
                return (
                  <Animated.View
                    key={asset.id}
                    style={[
                      styles.stackCard,
                      {
                        transform: [
                          { translateY: index * 15 },
                          { scale: 1 - (index * 0.05) },
                          { rotateZ: `${index * 2}deg` }
                        ],
                        zIndex: mediaAssets.length - index,
                      }
                    ]}
                  >
                    <LinearGradient
                      colors={asset.gradient}
                      style={styles.stackCardGradient}
                    >
                      <View style={styles.stackCardContent}>
                        <View style={styles.stackCardIcon}>
                          <Icon size={32} color="#FFFFFF" />
                        </View>
                        <Text style={styles.stackCardTitle}>{asset.title}</Text>
                        <Text style={styles.stackCardDesc}>{asset.desc}</Text>
                        <View style={styles.stackCardBadge}>
                          <Text style={styles.stackCardBadgeText}>{`0${index + 1}`}</Text>
                        </View>
                      </View>
                    </LinearGradient>
                  </Animated.View>
                );
              })}
            </View>
          </View>
          
          {/* Footer Futuriste */}
          <LinearGradient
            colors={isDarkMode ? ['#1E293B', '#0F172A'] : ['#F8FAFC', '#FFFFFF']}
            style={styles.footerFuture}
          >
            <View style={styles.footerOrbSmall}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.footerOrbGradient}
              />
            </View>
            <Text style={[styles.footerYear, isDarkMode && styles.textDark]}>© 2024 {company}</Text>
            <Text style={styles.footerTagline}>Communiqué officiel • Diffusion immédiate</Text>
            <View style={styles.footerDots}>
              <View style={[styles.footerDot, styles.footerDotActive]} />
              <View style={styles.footerDot} />
              <View style={styles.footerDot} />
            </View>
          </LinearGradient>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Mode Édition Futuriste
  return (
    <SafeAreaView style={styles.container}>
      {/* Header Glassmorphism */}
      <BlurView intensity={100} style={styles.headerGlass}>
        <TouchableOpacity onPress={handleGoBack} style={styles.glassButton}>
          <ArrowLeft size={20} color="#6366F1" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Video size={20} color="#8B5CF6" />
          <Text style={styles.headerTitleGlass}>Éditeur Média</Text>
        </View>
        <View style={styles.headerActionsGlass}>
          <TouchableOpacity onPress={togglePreview} style={styles.glassButton}>
            <Eye size={18} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.glassButton}>
            <Save size={18} color="#6366F1" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shareDocument} style={styles.glassButton}>
            <Share size={18} color="#6366F1" />
          </TouchableOpacity>
        </View>
      </BlurView>

      <ScrollView style={styles.editorScroll} showsVerticalScrollIndicator={false}>
        {/* Section Navigation */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.sectionNav}
          contentContainerStyle={styles.sectionNavContent}
        >
          {['Général', 'Contenu', 'Médias', 'Design'].map((section, index) => (
            <TouchableOpacity
              key={section}
              onPress={() => setActiveSection(index)}
              style={[
                styles.sectionNavItem,
                activeSection === index && styles.sectionNavItemActive
              ]}
            >
              <Text style={[
                styles.sectionNavText,
                activeSection === index && styles.sectionNavTextActive
              ]}>{section}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Card Glassmorphism principale */}
        <View style={styles.editorMainCard}>
          <LinearGradient
            colors={['#8B5CF6', '#6366F1']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.cardGradientBorder}
          >
            <View style={styles.cardInner}>
              <View style={styles.cardHeader}>
                <View style={styles.cardHeaderIcon}>
                  <Video size={24} color="#8B5CF6" />
                </View>
                <Text style={styles.cardHeaderTitle}>Informations Presse</Text>
              </View>

              <View style={styles.inputGroupFuture}>
                <Text style={styles.inputLabelFuture}>Titre du Communiqué</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputFuture}
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ex: Lancement nouveau produit"
                    placeholderTextColor="#94A3B8"
                  />
                  <View style={styles.inputIconRight}>
                    <Video size={16} color="#8B5CF6" />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroupFuture}>
                <Text style={styles.inputLabelFuture}>Nom de l'Entreprise</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.inputFuture}
                    value={company}
                    onChangeText={setCompany}
                    placeholder="Ex: TechCorp Industries"
                    placeholderTextColor="#94A3B8"
                  />
                  <View style={styles.inputIconRight}>
                    <Camera size={16} color="#8B5CF6" />
                  </View>
                </View>
              </View>

              <View style={styles.inputGroupFuture}>
                <Text style={styles.inputLabelFuture}>Titre Accrocheur</Text>
                <View style={styles.textAreaWrapper}>
                  <TextInput
                    style={styles.textAreaFuture}
                    value={headline}
                    onChangeText={setHeadline}
                    placeholder="Titre qui attire l'attention..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <View style={styles.inputGroupFuture}>
                <Text style={styles.inputLabelFuture}>Contenu Détaillé</Text>
                <View style={styles.textAreaWrapper}>
                  <TextInput
                    style={styles.textAreaFuture}
                    value={content}
                    onChangeText={setContent}
                    placeholder="Contenu complet du communiqué..."
                    placeholderTextColor="#94A3B8"
                    multiline
                    numberOfLines={8}
                    textAlignVertical="top"
                  />
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Assets Média Timeline */}
        <View style={styles.achievementsTimeline}>
          <View style={styles.timelineHeader}>
            <Text style={styles.sectionTitleEditor}>Assets Média</Text>
            <TouchableOpacity onPress={addMediaAsset} style={styles.addButtonFuture}>
              <LinearGradient
                colors={['#8B5CF6', '#6366F1']}
                style={styles.addButtonGradient}
              >
                <Plus size={16} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {mediaAssets.map((asset, index) => {
            const Icon = asset.icon;
            return (
              <View key={asset.id} style={styles.timelineItemEdit}>
                <View style={styles.timelineNumber}>
                  <Text style={styles.timelineNumberText}>{`0${index + 1}`}</Text>
                </View>
                
                <View style={styles.timelineCard}>
                  <LinearGradient
                    colors={asset.gradient}
                    style={styles.timelineIconGradient}
                  >
                    <Icon size={20} color="#FFFFFF" />
                  </LinearGradient>
                  
                  <View style={styles.timelineInputs}>
                    <TextInput
                      style={styles.timelineTitleInput}
                      value={asset.title}
                      onChangeText={(value) => updateMediaAsset(asset.id, 'title', value)}
                      placeholder="Titre"
                      placeholderTextColor="#94A3B8"
                    />
                    <TextInput
                      style={styles.timelineDescInput}
                      value={asset.desc}
                      onChangeText={(value) => updateMediaAsset(asset.id, 'desc', value)}
                      placeholder="Description"
                      placeholderTextColor="#94A3B8"
                    />
                  </View>
                  
                  <TouchableOpacity 
                    onPress={() => removeMediaAsset(asset.id)}
                    style={styles.timelineDelete}
                  >
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </View>

        {/* Features Premium */}
        <View style={styles.featuresGrid}>
          <Text style={styles.sectionTitleEditor}>Capacités Média</Text>
          
          <View style={styles.featuresRow}>
            {[
              { icon: Video, title: 'Vidéo HD', desc: 'Qualité professionnelle', color: '#FBBF24' },
              { icon: Image, title: 'Photos Pro', desc: 'Résolution optimale', color: '#10B981' },
              { icon: Mic, title: 'Audio Studio', desc: 'Son haute fidélité', color: '#3B82F6' },
              { icon: Play, title: 'Streaming', desc: 'Diffusion live', color: '#8B5CF6' },
            ].map((feature, index) => {
              const Icon = feature.icon;
              return (
                <View key={index} style={styles.featureCardFuture}>
                  <View style={[styles.featureIconBox, { backgroundColor: feature.color + '20' }]}>
                    <Icon size={24} color={feature.color} />
                  </View>
                  <Text style={styles.featureCardTitle}>{feature.title}</Text>
                  <Text style={styles.featureCardDesc}>{feature.desc}</Text>
                </View>
              );
            })}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  containerDark: {
    backgroundColor: '#0F172A',
  },
  
  // Glassmorphism Header
  headerGlass: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(226, 232, 240, 0.5)',
  },
  glassButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(248, 250, 252, 0.8)',
    borderWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.5)',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  headerTitleGlass: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    letterSpacing: 0.5,
  },
  headerActionsGlass: {
    flexDirection: 'row',
    gap: 8,
  },
  
  // Floating Header Preview
  floatingHeader: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    zIndex: 100,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  floatingBackButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
  },
  floatingTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  floatingTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  floatingThemeButton: {
    padding: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
  },
  
  // Editor Scroll
  editorScroll: {
    flex: 1,
  },
  
  // Section Navigation
  sectionNav: {
    height: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  sectionNavContent: {
    paddingHorizontal: 20,
    alignItems: 'center',
    gap: 24,
  },
  sectionNavItem: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  sectionNavItemActive: {
    backgroundColor: '#6366F1',
  },
  sectionNavText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  sectionNavTextActive: {
    color: '#FFFFFF',
  },
  
  // Main Editor Card
  editorMainCard: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  cardGradientBorder: {
    padding: 2,
    borderRadius: 20,
  },
  cardInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 24,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    gap: 12,
  },
  cardHeaderIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  
  // Futuristic Inputs
  inputGroupFuture: {
    marginBottom: 20,
  },
  inputLabelFuture: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  inputWrapper: {
    position: 'relative',
  },
  inputFuture: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingRight: 48,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    fontWeight: '500',
  },
  inputIconRight: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  textAreaWrapper: {
    position: 'relative',
  },
  textAreaFuture: {
    backgroundColor: '#F8FAFC',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 14,
    fontSize: 16,
    color: '#1E293B',
    height: 120,
    textAlignVertical: 'top',
  },
  
  // Achievements Timeline
  achievementsTimeline: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitleEditor: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  addButtonFuture: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  addButtonGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineItemEdit: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  timelineNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#1E293B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineNumberText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  timelineCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  timelineIconGradient: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timelineInputs: {
    flex: 1,
    gap: 8,
  },
  timelineTitleInput: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timelineDescInput: {
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  timelineDelete: {
    padding: 8,
  },
  
  // Features Grid
  featuresGrid: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  featuresRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCardFuture: {
    width: (width - 52) / 2,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  featureCardDesc: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center',
  },
  
  // Preview Mode Styles
  previewScrollView: {
    flex: 1,
  },
  
  // Hero Section
  heroSection: {
    minHeight: height * 0.9,
    paddingTop: 120,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroOrb: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  orbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#6366F1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
  },
  heroYear: {
    fontSize: 16,
    fontWeight: '400',
    color: '#64748B',
    letterSpacing: 4,
    marginBottom: 8,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -1,
  },
  heroCompany: {
    fontSize: 20,
    fontWeight: '600',
    color: '#6366F1',
    marginBottom: 32,
  },
  heroCompanyDark: {
    color: '#8B5CF6',
  },
  heroStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(241, 245, 249, 0.8)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 24,
    gap: 24,
  },
  heroStatItem: {
    alignItems: 'center',
  },
  heroStatNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  heroStatLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  heroStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: '#E2E8F0',
  },
  
  // Immersive Section
  immersiveSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FAFBFC',
  },
  immersiveSectionDark: {
    backgroundColor: '#1E293B',
  },
  messageContainer: {
    maxWidth: width - 40,
  },
  messageGradientBorder: {
    padding: 2,
    borderRadius: 24,
  },
  messageInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 22,
    padding: 32,
    position: 'relative',
  },
  messageInnerDark: {
    backgroundColor: '#0F172A',
  },
  messageQuoteMark: {
    position: 'absolute',
    top: -20,
    left: 20,
    fontSize: 80,
    color: '#E2E8F0',
    fontWeight: '300',
  },
  messageText: {
    fontSize: 18,
    color: '#475569',
    lineHeight: 30,
    fontStyle: 'italic',
    marginBottom: 24,
    paddingTop: 20,
  },
  messageAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  authorAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#6366F1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitial: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  authorTitle: {
    fontSize: 14,
    color: '#64748B',
  },
  
  // Achievements Stack
  achievementsStackSection: {
    paddingVertical: 80,
    paddingHorizontal: 20,
    backgroundColor: '#FAFBFC',
    minHeight: 600,
  },
  achievementsStackSectionDark: {
    backgroundColor: '#1E293B',
  },
  sectionTitleFuture: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 48,
    letterSpacing: -0.5,
  },
  cardsStack: {
    height: 400,
    position: 'relative',
    marginTop: 40,
  },
  stackCard: {
    position: 'absolute',
    width: width - 60,
    left: 10,
  },
  stackCardGradient: {
    borderRadius: 24,
    padding: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  stackCardContent: {
    alignItems: 'center',
  },
  stackCardIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  stackCardTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  stackCardDesc: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    textAlign: 'center',
    marginBottom: 16,
  },
  stackCardBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stackCardBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  // Footer Future
  footerFuture: {
    paddingVertical: 80,
    alignItems: 'center',
    position: 'relative',
  },
  footerOrbSmall: {
    position: 'absolute',
    top: 40,
    right: 40,
    width: 80,
    height: 80,
  },
  footerOrbGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 40,
    opacity: 0.3,
  },
  footerYear: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  footerTagline: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 24,
  },
  footerDots: {
    flexDirection: 'row',
    gap: 8,
  },
  footerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E2E8F0',
  },
  footerDotActive: {
    backgroundColor: '#6366F1',
    width: 24,
  },
  
  // Dark mode text
  textDark: {
    color: '#FFFFFF',
  },
}); 