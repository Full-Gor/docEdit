import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Mic, Calendar, MapPin, Users, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function ConferenceProgramTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Programme Conférence 2024');
  const [company, setCompany] = useState('Mon Entreprise');
  const [conferenceName, setConferenceName] = useState('Tech Innovation Summit');
  const [date, setDate] = useState('10-12 Avril 2024');
  const [location, setLocation] = useState('Centre de Conférences Paris');
  const [description, setDescription] = useState('Conférence internationale sur les innovations technologiques...');
  const [isPreview, setIsPreview] = useState(false);
  
  const [sessions, setSessions] = useState([
    { id: 1, time: '09h00', title: 'Ouverture & Keynote', speaker: 'Dr. Jean Dupont', room: 'Auditorium A', desc: 'Introduction et vision d\'avenir' },
    { id: 2, time: '10h30', title: 'Panel Innovation', speaker: 'Marie Martin', room: 'Salle B', desc: 'Table ronde sur les nouvelles technologies' },
    { id: 3, time: '14h00', title: 'Workshop IA', speaker: 'Pierre Dubois', room: 'Lab Tech', desc: 'Atelier pratique sur l\'intelligence artificielle' },
    { id: 4, time: '16h00', title: 'Networking', speaker: 'Tous', room: 'Hall Principal', desc: 'Échanges et rencontres professionnelles' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setConferenceName(savedDoc.conferenceName || conferenceName);
        setDate(savedDoc.date || date);
        setLocation(savedDoc.location || location);
        setDescription(savedDoc.description || description);
        if (savedDoc.sessions) {
          setSessions(savedDoc.sessions);
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

  const updateSession = (id: number, field: 'time' | 'title' | 'speaker' | 'room' | 'desc', value: string) => {
    setSessions(prev => 
      prev.map(session => 
        session.id === id 
          ? { ...session, [field]: value }
          : session
      )
    );
  };

  const addSession = () => {
    const newId = Math.max(...sessions.map(s => s.id)) + 1;
    setSessions(prev => [...prev, {
      id: newId,
      time: '17h00',
      title: 'Nouvelle Session',
      speaker: 'Intervenant',
      room: 'Salle',
      desc: 'Description de la session'
    }]);
  };

  const removeSession = (id: number) => {
    setSessions(prev => prev.filter(session => session.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'conference-program',
        title,
        company,
        conferenceName,
        date,
        location,
        description,
        sessions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre programme de conférence a été sauvegardé localement.',
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
            <p><strong>Template:</strong> conference-program.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Programme</Text>
          <View style={styles.sparklesIcon}>
            <Mic size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#10B981', '#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.conferenceCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.conferenceTitle}>{title}</Text>
              <Text style={styles.conferenceName}>{conferenceName}</Text>
              <View style={styles.conferenceDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <MapPin size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{location}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Description */}
          <View style={styles.conferenceSection}>
            <Text style={styles.sectionTitle}>Description de la Conférence</Text>
            <View style={styles.descriptionCard}>
              <Text style={styles.descriptionText}>{description}</Text>
            </View>
          </View>
          
          {/* Sessions */}
          <View style={styles.conferenceSection}>
            <Text style={styles.sectionTitle}>Programme des Sessions</Text>
            {sessions.map((session, index) => (
              <View key={session.id} style={styles.sessionCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.sessionHeader}
                >
                  <Text style={styles.sessionTime}>{session.time}</Text>
                  <Text style={styles.sessionTitle}>{session.title}</Text>
                  <View style={styles.sessionInfo}>
                    <View style={styles.sessionDetail}>
                      <Users size={16} color="#FFFFFF" />
                      <Text style={styles.sessionSpeaker}>{session.speaker}</Text>
                    </View>
                    <View style={styles.sessionDetail}>
                      <MapPin size={16} color="#FFFFFF" />
                      <Text style={styles.sessionRoom}>{session.room}</Text>
                    </View>
                  </View>
                  <Text style={styles.sessionDesc}>{session.desc}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.conferenceFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Programme organisé avec professionnalisme</Text>
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
        <Text style={styles.headerTitle}>Créer un Programme de Conférence</Text>
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
              <Text style={styles.fieldLabel}>Titre du programme</Text>
              <Text style={styles.fieldHint}>Titre principal de la conférence</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Programme Conférence 2024"
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
              <Text style={styles.fieldLabel}>Nom de la conférence</Text>
              <Text style={styles.fieldHint}>Nom spécifique de la conférence</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={conferenceName}
              onChangeText={setConferenceName}
              placeholder="Ex: Tech Innovation Summit"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date de la conférence</Text>
              <Text style={styles.fieldHint}>Période de la conférence</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
              placeholder="Ex: 10-12 Avril 2024"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Lieu de la conférence</Text>
              <Text style={styles.fieldHint}>Adresse ou nom du lieu</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Centre de Conférences Paris"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Description de la conférence</Text>
              <Text style={styles.fieldHint}>Description générale de l'événement</Text>
            </View>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Décrivez votre conférence..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Sessions */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Sessions de la Conférence</Text>
            <TouchableOpacity onPress={addSession} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {sessions.map((session, index) => (
            <View key={session.id} style={styles.sessionEditor}>
              <View style={styles.sessionHeader}>
                <Text style={styles.sessionNumber}>Session {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeSession(session.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Heure</Text>
                <TextInput
                  style={styles.textInput}
                  value={session.time}
                  onChangeText={(value) => updateSession(session.id, 'time', value)}
                  placeholder="Ex: 09h00"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Titre de la session</Text>
                <TextInput
                  style={styles.textInput}
                  value={session.title}
                  onChangeText={(value) => updateSession(session.id, 'title', value)}
                  placeholder="Ex: Ouverture & Keynote"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Intervenant</Text>
                <TextInput
                  style={styles.textInput}
                  value={session.speaker}
                  onChangeText={(value) => updateSession(session.id, 'speaker', value)}
                  placeholder="Ex: Dr. Jean Dupont"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Salle</Text>
                <TextInput
                  style={styles.textInput}
                  value={session.room}
                  onChangeText={(value) => updateSession(session.id, 'room', value)}
                  placeholder="Ex: Auditorium A"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Description</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={session.desc}
                  onChangeText={(value) => updateSession(session.id, 'desc', value)}
                  placeholder="Ex: Introduction et vision d'avenir"
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
            <Mic size={24} color="#10B981" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '🎤', title: 'Sessions Structurées', desc: 'Programme détaillé et organisé' },
            { icon: '👨‍🏫', title: 'Intervenants', desc: 'Experts et spécialistes' },
            { icon: '⏰', title: 'Planning Précis', desc: 'Timing et horaires détaillés' },
            { icon: '🏢', title: 'Salles Définies', desc: 'Localisation des sessions' },
            { icon: '📋', title: 'Suivi Conférence', desc: 'Évaluation et feedback' },
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
    height: 120,
    textAlignVertical: 'top',
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
    backgroundColor: '#D1FAE5',
  },
  sessionEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sessionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
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
  conferenceCover: {
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
  conferenceTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  conferenceName: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  conferenceDetails: {
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
  conferenceSection: {
    marginBottom: 32,
  },
  descriptionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  descriptionText: {
    fontSize: 16,
    color: '#374151',
    lineHeight: 24,
  },
  sessionCard: {
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
  sessionHeader: {
    padding: 16,
  },
  sessionTime: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  sessionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  sessionInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  sessionDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  sessionSpeaker: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  sessionRoom: {
    fontSize: 14,
    color: '#FFFFFF',
  },
  sessionDesc: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  conferenceFooter: {
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