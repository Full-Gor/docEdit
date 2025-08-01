import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Animated, PanResponder, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, TrendingUp, Users, Target, Award, Sparkles, ChevronRight, Plus, X, Moon, Sun, Layers, Zap, Globe, Activity, Atom, Orbit, Rocket, Compass, Grid3x3, Hexagon, FileText, Calendar, MapPin, Phone, Mail, MessageSquare, UserCheck, BookOpen } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function OnboardingGuideTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Guide d\'Accueil');
  const [company, setCompany] = useState('Nexus Corp');
  const [introduction, setIntroduction] = useState('Bienvenue dans notre équipe ! Ce guide vous accompagnera...');
  const [isPreview, setIsPreview] = useState(false);
  
  // Animation simple pour la transition
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // États des métriques avec structure hexagonale
  const [hexMetrics, setHexMetrics] = useState([
    { id: 'welcome', value: '100%', label: 'Accueil', color: '#8B5CF6', icon: UserCheck },
    { id: 'training', value: '5h', label: 'Formation', color: '#10B981', icon: BookOpen },
    { id: 'integration', value: '2j', label: 'Intégration', color: '#3B82F6', icon: Users },
    { id: 'support', value: '24/7', label: 'Support', color: '#F59E0B', icon: MessageSquare },
    { id: 'satisfaction', value: '95%', label: 'Satisfaction', color: '#EF4444', icon: Award },
    { id: 'retention', value: '98%', label: 'Rétention', color: '#06B6D4', icon: TrendingUp },
  ]);
  
  // Constellations de réalisations
  const [constellations, setConstellations] = useState([
    {
      id: 'process',
      name: 'Processus d\'Intégration',
      stars: [
        { x: 0.3, y: 0.2, size: 'large', title: 'Accueil Premier Jour', desc: 'Cérémonie d\'accueil' },
        { x: 0.7, y: 0.3, size: 'medium', title: 'Formation Métier', desc: '5 modules' },
        { x: 0.5, y: 0.6, size: 'large', title: 'Mentorat', desc: 'Accompagnement personnalisé' },
        { x: 0.2, y: 0.7, size: 'small', title: 'Évaluation', desc: 'Bilan 30 jours' },
      ],
      color: '#8B5CF6',
    },
    {
      id: 'resources',
      name: 'Ressources Disponibles',
      stars: [
        { x: 0.6, y: 0.2, size: 'large', title: 'Documentation', desc: 'Wiki complet' },
        { x: 0.3, y: 0.5, size: 'medium', title: 'Outils', desc: 'Suite logicielle' },
        { x: 0.8, y: 0.6, size: 'medium', title: 'Communauté', desc: 'Slack dédié' },
      ],
      color: '#10B981',
    },
  ]);
  
  // Charger les données sauvegardées
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setIntroduction(savedDoc.introduction || introduction);
        if (savedDoc.hexMetrics) setHexMetrics(savedDoc.hexMetrics);
        if (savedDoc.constellations) setConstellations(savedDoc.constellations);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
      }
    }
  }, [params.savedDocument]);
  
  // Animation de transition simple
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isPreview]);
  
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
        type: 'onboarding-guide-orbital',
        title,
        company,
        introduction,
        hexMetrics,
        constellations,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert('Synchronisation réussie', 'Données sauvegardées dans le cloud quantique.', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Erreur', 'Perturbation dans le champ quantique.', [{ text: 'OK' }]);
    }
  };
  
  const updateHexMetric = (id: string, field: string, value: string) => {
    setHexMetrics(prev => 
      prev.map(metric => 
        metric.id === id ? { ...metric, [field]: value } : metric
      )
    );
  };
  
  const updateConstellation = (constellationId: string, starIndex: number, field: string, value: any) => {
    setConstellations(prev => 
      prev.map(constellation => 
        constellation.id === constellationId 
          ? {
              ...constellation,
              stars: constellation.stars.map((star, index) => 
                index === starIndex ? { ...star, [field]: value } : star
              )
            }
          : constellation
      )
    );
  };
  
  if (isPreview) {
    return (
      <SafeAreaView style={styles.previewContainer}>
        {/* Header minimaliste avec thème néon */}
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={togglePreview} style={styles.previewBackButton}>
            <View style={styles.neonBorder}>
              <X size={20} color="#8B5CF6" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.previewTitle}>
            <Layers size={20} color="#10B981" />
            <Text style={styles.previewTitleText}>Mode Visualisation</Text>
          </View>
          
          <View style={styles.previewActions}>
            <TouchableOpacity style={styles.neonButton}>
              <Save size={18} color="#8B5CF6" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.neonButton}>
              <Share size={18} color="#8B5CF6" />
            </TouchableOpacity>
          </View>
        </View>
        
        <ScrollView 
          style={styles.previewScroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Page de couverture */}
          <View style={styles.coverPage}>
            <LinearGradient
              colors={['#0a0a0f', '#1a1a2e']}
              style={styles.coverGradient}
            >
              <View style={styles.coverDecoration}>
                <View style={styles.neonAccent} />
                <View style={styles.neonAccentRight} />
              </View>
              
              <View style={styles.coverContent}>
                <View style={styles.coverIcon}>
                  <LinearGradient
                    colors={['#8B5CF633', '#10B98133']}
                    style={styles.coverIconGradient}
                  >
                    <UserCheck size={48} color="#8B5CF6" />
                  </LinearGradient>
                </View>
                
                <Text style={styles.coverYear}>2024</Text>
                <Text style={styles.coverTitle}>{title}</Text>
                <View style={styles.coverDivider} />
                <Text style={styles.coverCompany}>{company}</Text>
                
                <View style={styles.coverStats}>
                  <View style={styles.coverStat}>
                    <Text style={styles.coverStatNumber}>30j</Text>
                    <Text style={styles.coverStatLabel}>Programme</Text>
                  </View>
                  <View style={styles.coverStatDivider} />
                  <View style={styles.coverStat}>
                    <Text style={styles.coverStatNumber}>100%</Text>
                    <Text style={styles.coverStatLabel}>Succès</Text>
                  </View>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          {/* Message d'introduction */}
          <View style={styles.introSection}>
            <View style={styles.introCard}>
              <View style={styles.introQuote}>
                <Text style={styles.quoteMarkLeft}>"</Text>
                <Text style={styles.introText}>{introduction}</Text>
                <Text style={styles.quoteMarkRight}>"</Text>
              </View>
              
              <View style={styles.introFooter}>
                <View style={styles.introAuthor}>
                  <View style={styles.authorBadge}>
                    <Text style={styles.authorInitials}>RH</Text>
                  </View>
                  <View>
                    <Text style={styles.authorName}>Ressources Humaines</Text>
                    <Text style={styles.authorRole}>Accompagnement Talent</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
          
          {/* Métriques clés */}
          <View style={styles.metricsContainer}>
            <Text style={styles.sectionTitle}>Indicateurs de Performance</Text>
            
            <View style={styles.metricsGrid}>
              {hexMetrics.map((metric, index) => {
                const Icon = metric.icon;
                return (
                  <View key={metric.id} style={styles.metricCard}>
                    <LinearGradient
                      colors={['#1a1a2e', '#0a0a0f']}
                      style={styles.metricGradient}
                    >
                      <View style={[styles.metricIcon, { backgroundColor: metric.color + '20' }]}>
                        <Icon size={24} color={metric.color} />
                      </View>
                      <Text style={[styles.metricValue, { color: metric.color }]}>{metric.value}</Text>
                      <Text style={styles.metricLabel}>{metric.label}</Text>
                      <View style={[styles.metricAccent, { backgroundColor: metric.color }]} />
                    </LinearGradient>
                  </View>
                );
              })}
            </View>
          </View>
          
          {/* Réalisations majeures */}
          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Réalisations Stratégiques</Text>
            
            {constellations.map((constellation) => (
              <View key={constellation.id} style={styles.achievementGroup}>
                <View style={styles.achievementHeader}>
                  <View style={[styles.achievementDot, { backgroundColor: constellation.color }]} />
                  <Text style={[styles.achievementGroupTitle, { color: constellation.color }]}>
                    {constellation.name}
                  </Text>
                </View>
                
                <View style={styles.achievementsList}>
                  {constellation.stars.map((star, index) => (
                    <View key={index} style={styles.achievementItem}>
                      <View style={styles.achievementNumber}>
                        <Text style={styles.achievementNumberText}>{`0${index + 1}`}</Text>
                      </View>
                      <View style={styles.achievementContent}>
                        <Text style={styles.achievementTitle}>{star.title}</Text>
                        <Text style={styles.achievementDesc}>{star.desc}</Text>
                      </View>
                      <ChevronRight size={16} color={constellation.color} />
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
          
          {/* Footer professionnel */}
          <View style={styles.footer}>
            <LinearGradient
              colors={['#1a1a2e', '#0a0a0f']}
              style={styles.footerGradient}
            >
              <View style={styles.footerContent}>
                <View style={styles.footerLogo}>
                  <Hexagon size={32} color="#8B5CF6" />
                </View>
                <Text style={styles.footerText}>{company} © 2024</Text>
                <Text style={styles.footerSubtext}>Guide d'Accueil - Document Interne</Text>
                <View style={styles.footerLine} />
                <Text style={styles.footerPage}>Accueil • Formation • Intégration</Text>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
  
  // Mode Édition Futuriste
  return (
    <SafeAreaView style={styles.editorContainer}>
      {/* Header Command Center */}
      <LinearGradient
        colors={['#1a1a2e', '#16213e']}
        style={styles.commandHeader}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.commandButton}>
          <ArrowLeft size={20} color="#8B5CF6" />
        </TouchableOpacity>
        
        <View style={styles.commandCenter}>
          <Orbit size={24} color="#10B981" />
          <Text style={styles.commandTitle}>Centre de Commande</Text>
        </View>
        
        <View style={styles.commandActions}>
          <TouchableOpacity onPress={togglePreview} style={styles.commandButton}>
            <Eye size={18} color="#8B5CF6" />
          </TouchableOpacity>
          <TouchableOpacity onPress={saveDocument} style={styles.commandButton}>
            <Save size={18} color="#8B5CF6" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      
      <ScrollView style={styles.editorScroll} showsVerticalScrollIndicator={false}>
        {/* Panel de contrôle principal */}
        <View style={styles.controlPanel}>
          <LinearGradient
            colors={['#8B5CF622', '#10B98122']}
            style={styles.panelGradient}
          >
            <View style={styles.panelHeader}>
              <UserCheck size={20} color="#8B5CF6" />
              <Text style={styles.panelTitle}>Configuration Onboarding</Text>
            </View>
            
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Titre du Guide</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.cosmicInput}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="Titre du guide..."
                  placeholderTextColor="#666"
                />
                <Rocket size={16} color="#8B5CF6" style={styles.inputIcon} />
              </View>
            </View>
            
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Organisation</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.cosmicInput}
                  value={company}
                  onChangeText={setCompany}
                  placeholder="Nom de l'entreprise..."
                  placeholderTextColor="#666"
                />
                <Globe size={16} color="#8B5CF6" style={styles.inputIcon} />
              </View>
            </View>
            
            <View style={styles.inputField}>
              <Text style={styles.inputLabel}>Message de Bienvenue</Text>
              <TextInput
                style={[styles.cosmicInput, styles.cosmicTextArea]}
                value={introduction}
                onChangeText={setIntroduction}
                placeholder="Message d'accueil..."
                placeholderTextColor="#666"
                multiline
                numberOfLines={4}
              />
            </View>
          </LinearGradient>
        </View>
        
        {/* Grille Hexagonale Éditable */}
        <View style={styles.hexEditorSection}>
          <Text style={styles.editorSectionTitle}>Matrice Hexagonale</Text>
          
          <View style={styles.hexEditorGrid}>
            {hexMetrics.map((metric) => {
              const Icon = metric.icon;
              return (
                <View key={metric.id} style={styles.hexEditorItem}>
                  <LinearGradient
                    colors={[metric.color + '33', metric.color + '11']}
                    style={styles.hexEditorCard}
                  >
                    <Icon size={20} color={metric.color} />
                    <TextInput
                      style={[styles.hexInput, { color: metric.color }]}
                      value={metric.value}
                      onChangeText={(value) => updateHexMetric(metric.id, 'value', value)}
                      placeholder="Valeur"
                      placeholderTextColor={metric.color + '66'}
                    />
                    <TextInput
                      style={[styles.hexLabelInput]}
                      value={metric.label}
                      onChangeText={(value) => updateHexMetric(metric.id, 'label', value)}
                      placeholder="Label"
                      placeholderTextColor="#666"
                    />
                  </LinearGradient>
                </View>
              );
            })}
          </View>
        </View>
        
        {/* Éditeur de Constellations */}
        <View style={styles.constellationEditor}>
          <Text style={styles.editorSectionTitle}>Cartographie Onboarding</Text>
          
          {constellations.map((constellation) => (
            <View key={constellation.id} style={styles.constellationEditorCard}>
              <LinearGradient
                colors={[constellation.color + '22', '#000011']}
                style={styles.constellationEditorGradient}
              >
                <Text style={[styles.constellationEditorName, { color: constellation.color }]}>
                  {constellation.name}
                </Text>
                
                {constellation.stars.map((star, index) => (
                  <View key={index} style={styles.starEditor}>
                    <View style={[styles.starEditorDot, { backgroundColor: constellation.color }]} />
                    <View style={styles.starEditorInputs}>
                      <TextInput
                        style={styles.starEditorInput}
                        value={star.title}
                        onChangeText={(value) => updateConstellation(constellation.id, index, 'title', value)}
                        placeholder="Étape"
                        placeholderTextColor="#666"
                      />
                      <TextInput
                        style={styles.starEditorInput}
                        value={star.desc}
                        onChangeText={(value) => updateConstellation(constellation.id, index, 'desc', value)}
                        placeholder="Description"
                        placeholderTextColor="#666"
                      />
                    </View>
                  </View>
                ))}
              </LinearGradient>
            </View>
          ))}
        </View>
        
        {/* Tableau de Bord Quantique */}
        <View style={styles.quantumDashboard}>
          <Text style={styles.editorSectionTitle}>Tableau Quantique</Text>
          
          <View style={styles.quantumGrid}>
            {[
              { icon: Grid3x3, label: 'Étapes', value: '12', color: '#8B5CF6' },
              { icon: Orbit, label: 'Durée', value: '30j', color: '#10B981' },
              { icon: Atom, label: 'Formation', value: '5h', color: '#3B82F6' },
              { icon: Zap, label: 'Support', value: '24/7', color: '#F59E0B' },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <View key={index} style={styles.quantumCard}>
                  <LinearGradient
                    colors={[item.color + '44', item.color + '11']}
                    style={styles.quantumCardGradient}
                  >
                    <Icon size={24} color={item.color} />
                    <Text style={[styles.quantumValue, { color: item.color }]}>{item.value}</Text>
                    <Text style={styles.quantumLabel}>{item.label}</Text>
                  </LinearGradient>
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
  // Conteneurs principaux
  editorContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  
  // Mode Éditeur
  commandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  commandButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  commandCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  commandTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  commandActions: {
    flexDirection: 'row',
    gap: 12,
  },
  
  editorScroll: {
    flex: 1,
  },
  
  // Panneau de contrôle
  controlPanel: {
    margin: 20,
  },
  panelGradient: {
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  panelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  
  inputField: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#8B5CF6',
    marginBottom: 8,
    letterSpacing: 1,
  },
  inputContainer: {
    position: 'relative',
  },
  cosmicInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingRight: 40,
    paddingVertical: 14,
    fontSize: 16,
    color: '#FFFFFF',
  },
  cosmicTextArea: {
    height: 100,
    textAlignVertical: 'top',
    paddingRight: 16,
  },
  inputIcon: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -8 }],
  },
  
  // Éditeur Hexagonal
  hexEditorSection: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  editorSectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 20,
    letterSpacing: 1,
  },
  hexEditorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  hexEditorItem: {
    width: (width - 52) / 2,
  },
  hexEditorCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  hexInput: {
    fontSize: 18,
    fontWeight: '700',
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    minWidth: 80,
  },
  hexLabelInput: {
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  
  // Éditeur de Constellations
  constellationEditor: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  constellationEditorCard: {
    marginBottom: 20,
  },
  constellationEditorGradient: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  constellationEditorName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  starEditor: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  starEditorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  starEditorInputs: {
    flex: 1,
    gap: 8,
  },
  starEditorInput: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#FFFFFF',
  },
  
  // Tableau de bord quantique
  quantumDashboard: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  quantumGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  quantumCard: {
    width: (width - 52) / 2,
  },
  quantumCardGradient: {
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  quantumValue: {
    fontSize: 24,
    fontWeight: '800',
  },
  quantumLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    letterSpacing: 1,
  },
  
  // NOUVEAU MODE PREVIEW PROFESSIONNEL
  previewContainer: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  
  // Header Preview
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#0a0a0f',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 92, 246, 0.1)',
  },
  previewBackButton: {
    padding: 8,
  },
  neonBorder: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
  },
  previewTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  previewTitleText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  previewActions: {
    flexDirection: 'row',
    gap: 12,
  },
  neonButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.3)',
    backgroundColor: 'rgba(139, 92, 246, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  previewScroll: {
    flex: 1,
  },
  
  // Page de couverture
  coverPage: {
    height: height,
    marginBottom: 40,
  },
  coverGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  coverDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  neonAccent: {
    position: 'absolute',
    top: 60,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#8B5CF6',
    opacity: 0.1,
    transform: [{ scale: 2 }],
  },
  neonAccentRight: {
    position: 'absolute',
    bottom: 60,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: '#10B981',
    opacity: 0.1,
    transform: [{ scale: 2 }],
  },
  coverContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  coverIcon: {
    width: 120,
    height: 120,
    marginBottom: 32,
  },
  coverIconGradient: {
    flex: 1,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  coverYear: {
    fontSize: 18,
    fontWeight: '300',
    color: '#8B5CF6',
    letterSpacing: 6,
    marginBottom: 16,
  },
  coverTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -1,
  },
  coverDivider: {
    width: 80,
    height: 2,
    backgroundColor: '#10B981',
    marginVertical: 20,
  },
  coverCompany: {
    fontSize: 24,
    fontWeight: '300',
    color: '#10B981',
    letterSpacing: 3,
    marginBottom: 48,
  },
  coverStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  coverStat: {
    alignItems: 'center',
  },
  coverStatNumber: {
    fontSize: 28,
    fontWeight: '800',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  coverStatLabel: {
    fontSize: 12,
    color: '#AAAAAA',
    letterSpacing: 0.5,
  },
  coverStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginHorizontal: 32,
  },
  
  // Section Introduction
  introSection: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: '#0a0a0f',
  },
  introCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 20,
    padding: 32,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  introQuote: {
    position: 'relative',
    marginBottom: 32,
  },
  quoteMarkLeft: {
    position: 'absolute',
    top: -20,
    left: -10,
    fontSize: 60,
    color: '#8B5CF6',
    opacity: 0.3,
  },
  quoteMarkRight: {
    position: 'absolute',
    bottom: -40,
    right: -10,
    fontSize: 60,
    color: '#8B5CF6',
    opacity: 0.3,
  },
  introText: {
    fontSize: 18,
    lineHeight: 30,
    color: '#FFFFFF',
    fontStyle: 'italic',
    paddingHorizontal: 20,
  },
  introFooter: {
    alignItems: 'flex-end',
  },
  introAuthor: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  authorBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    borderWidth: 1,
    borderColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  authorInitials: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  authorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  authorRole: {
    fontSize: 12,
    color: '#8B5CF6',
    opacity: 0.8,
  },
  
  // Section Métriques
  metricsContainer: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: '#0f0f1a',
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 40,
    letterSpacing: -0.5,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: (width - 100) / 3,
    minWidth: 150,
  },
  metricGradient: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  metricIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  metricValue: {
    fontSize: 32,
    fontWeight: '800',
    marginBottom: 8,
  },
  metricLabel: {
    fontSize: 14,
    color: '#AAAAAA',
    letterSpacing: 0.5,
  },
  metricAccent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 3,
  },
  
  // Section Réalisations
  achievementsSection: {
    paddingHorizontal: 40,
    paddingVertical: 60,
    backgroundColor: '#0a0a0f',
  },
  achievementGroup: {
    marginBottom: 40,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  achievementDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  achievementGroupTitle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  achievementsList: {
    gap: 16,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a2e',
    borderRadius: 16,
    padding: 20,
    gap: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  achievementNumber: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  achievementNumberText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8B5CF6',
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  achievementDesc: {
    fontSize: 14,
    color: '#AAAAAA',
  },
  
  // Footer
  footer: {
    marginTop: 40,
  },
  footerGradient: {
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  footerContent: {
    alignItems: 'center',
  },
  footerLogo: {
    marginBottom: 20,
  },
  footerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#AAAAAA',
    marginBottom: 20,
  },
  footerLine: {
    width: 60,
    height: 1,
    backgroundColor: '#8B5CF6',
    marginBottom: 20,
  },
  footerPage: {
    fontSize: 12,
    color: '#8B5CF6',
    letterSpacing: 2,
  },
}); 