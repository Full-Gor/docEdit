import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Clipboard, Users, Calendar, Clock, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function MeetingMinutesTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Compte-rendu de Réunion');
  const [company, setCompany] = useState('Mon Entreprise');
  const [meetingTitle, setMeetingTitle] = useState('Réunion Équipe Projet');
  const [date, setDate] = useState('15/01/2024');
  const [time, setTime] = useState('14:00 - 16:00');
  const [location, setLocation] = useState('Salle de conférence A');
  const [facilitator, setFacilitator] = useState('Marie Dupont');
  const [isPreview, setIsPreview] = useState(false);
  
  const [participants, setParticipants] = useState([
    { id: 1, name: 'Jean Martin', role: 'Chef de projet', present: true },
    { id: 2, name: 'Sophie Bernard', role: 'Développeur', present: true },
    { id: 3, name: 'Pierre Dubois', role: 'Designer', present: false },
    { id: 4, name: 'Anne Moreau', role: 'Product Owner', present: true },
  ]);

  const [agenda, setAgenda] = useState([
    { id: 1, topic: 'Point sur l\'avancement', duration: '30 min', status: 'Terminé', icon: '📊' },
    { id: 2, topic: 'Problèmes rencontrés', duration: '45 min', status: 'En cours', icon: '⚠️' },
    { id: 3, topic: 'Planning prochain sprint', duration: '30 min', status: 'À faire', icon: '📅' },
    { id: 4, topic: 'Questions diverses', duration: '15 min', status: 'À faire', icon: '❓' },
  ]);

  const [decisions, setDecisions] = useState([
    { id: 1, decision: 'Adoption de la nouvelle méthodologie', responsible: 'Jean Martin', deadline: '30/01/2024', icon: '✅' },
    { id: 2, decision: 'Achat de nouveaux outils', responsible: 'Sophie Bernard', deadline: '15/02/2024', icon: '🛠️' },
    { id: 3, decision: 'Formation équipe', responsible: 'Anne Moreau', deadline: '01/03/2024', icon: '📚' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setMeetingTitle(savedDoc.meetingTitle || meetingTitle);
        setDate(savedDoc.date || date);
        setTime(savedDoc.time || time);
        setLocation(savedDoc.location || location);
        setFacilitator(savedDoc.facilitator || facilitator);
        if (savedDoc.participants) {
          setParticipants(savedDoc.participants);
        }
        if (savedDoc.agenda) {
          setAgenda(savedDoc.agenda);
        }
        if (savedDoc.decisions) {
          setDecisions(savedDoc.decisions);
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

  const updateParticipant = (id: number, field: 'name' | 'role', value: string) => {
    setParticipants(prev => 
      prev.map(participant => 
        participant.id === id 
          ? { ...participant, [field]: value }
          : participant
      )
    );
  };

  const toggleParticipantPresence = (id: number) => {
    setParticipants(prev => 
      prev.map(participant => 
        participant.id === id 
          ? { ...participant, present: !participant.present }
          : participant
      )
    );
  };

  const addParticipant = () => {
    const newId = Math.max(...participants.map(p => p.id)) + 1;
    setParticipants(prev => [...prev, {
      id: newId,
      name: 'Nouveau participant',
      role: 'Rôle',
      present: true
    }]);
  };

  const removeParticipant = (id: number) => {
    setParticipants(prev => prev.filter(participant => participant.id !== id));
  };

  const updateAgendaItem = (id: number, field: 'topic' | 'duration' | 'status' | 'icon', value: string) => {
    setAgenda(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const addAgendaItem = () => {
    const newId = Math.max(...agenda.map(a => a.id)) + 1;
    setAgenda(prev => [...prev, {
      id: newId,
      topic: 'Nouveau point',
      duration: '15 min',
      status: 'À faire',
      icon: '📝'
    }]);
  };

  const removeAgendaItem = (id: number) => {
    setAgenda(prev => prev.filter(item => item.id !== id));
  };

  const updateDecision = (id: number, field: 'decision' | 'responsible' | 'deadline' | 'icon', value: string) => {
    setDecisions(prev => 
      prev.map(decision => 
        decision.id === id 
          ? { ...decision, [field]: value }
          : decision
      )
    );
  };

  const addDecision = () => {
    const newId = Math.max(...decisions.map(d => d.id)) + 1;
    setDecisions(prev => [...prev, {
      id: newId,
      decision: 'Nouvelle décision',
      responsible: 'Responsable',
      deadline: '01/01/2024',
      icon: '✅'
    }]);
  };

  const removeDecision = (id: number) => {
    setDecisions(prev => prev.filter(decision => decision.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'meeting-minutes',
        title,
        company,
        meetingTitle,
        date,
        time,
        location,
        facilitator,
        participants,
        agenda,
        decisions,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre compte-rendu de réunion a été sauvegardé localement.',
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
            <p><strong>Template:</strong> meeting-minutes.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu du Compte-rendu</Text>
          <View style={styles.sparklesIcon}>
            <Clipboard size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#10B981', '#059669', '#047857']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.minutesCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.minutesTitle}>{title}</Text>
              <Text style={styles.meetingTitle}>{meetingTitle}</Text>
              <View style={styles.minutesDetails}>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Clock size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{time}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Users size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>Facilitateur : {facilitator}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Participants */}
          <View style={styles.minutesSection}>
            <Text style={styles.sectionTitle}>Participants</Text>
            {participants.map((participant, index) => (
              <View key={participant.id} style={styles.participantCard}>
                <LinearGradient
                  colors={participant.present ? ['#10B981', '#059669'] : ['#6B7280', '#4B5563']}
                  style={styles.participantHeader}
                >
                  <Text style={styles.participantIcon}>👤</Text>
                  <Text style={styles.participantName}>{participant.name}</Text>
                  <Text style={styles.participantRole}>{participant.role}</Text>
                  <Text style={styles.participantStatus}>
                    {participant.present ? 'Présent' : 'Absent'}
                  </Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Agenda */}
          <View style={styles.minutesSection}>
            <Text style={styles.sectionTitle}>Ordre du Jour</Text>
            {agenda.map((item, index) => (
              <View key={item.id} style={styles.agendaCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.agendaHeader}
                >
                  <Text style={styles.agendaIcon}>{item.icon}</Text>
                  <Text style={styles.agendaTopic}>{item.topic}</Text>
                  <View style={styles.agendaDetails}>
                    <Text style={styles.agendaDuration}>{item.duration}</Text>
                    <Text style={styles.agendaStatus}>{item.status}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Decisions */}
          <View style={styles.minutesSection}>
            <Text style={styles.sectionTitle}>Décisions Prises</Text>
            {decisions.map((decision, index) => (
              <View key={decision.id} style={styles.decisionCard}>
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  style={styles.decisionHeader}
                >
                  <Text style={styles.decisionIcon}>{decision.icon}</Text>
                  <Text style={styles.decisionText}>{decision.decision}</Text>
                  <View style={styles.decisionDetails}>
                    <Text style={styles.decisionResponsible}>Responsable : {decision.responsible}</Text>
                    <Text style={styles.decisionDeadline}>Échéance : {decision.deadline}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.minutesFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Compte-rendu généré avec précision</Text>
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
        <Text style={styles.headerTitle}>Créer un Compte-rendu</Text>
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
              <Text style={styles.fieldLabel}>Titre du compte-rendu</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Compte-rendu de Réunion"
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
              <Text style={styles.fieldLabel}>Titre de la réunion</Text>
              <Text style={styles.fieldHint}>Sujet principal de la réunion</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={meetingTitle}
              onChangeText={setMeetingTitle}
              placeholder="Ex: Réunion Équipe Projet"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldHint}>Date de la réunion</Text>
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
              <Text style={styles.fieldLabel}>Heure</Text>
              <Text style={styles.fieldHint}>Horaires de la réunion</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={time}
              onChangeText={setTime}
              placeholder="Ex: 14:00 - 16:00"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Lieu</Text>
              <Text style={styles.fieldHint}>Lieu de la réunion</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Ex: Salle de conférence A"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Facilitateur</Text>
              <Text style={styles.fieldHint}>Animateur de la réunion</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={facilitator}
              onChangeText={setFacilitator}
              placeholder="Ex: Marie Dupont"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Participants */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Participants</Text>
            <TouchableOpacity onPress={addParticipant} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {participants.map((participant, index) => (
            <View key={participant.id} style={styles.participantEditor}>
              <View style={styles.participantHeader}>
                <Text style={styles.participantNumber}>Participant {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeParticipant(participant.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom</Text>
                <TextInput
                  style={styles.textInput}
                  value={participant.name}
                  onChangeText={(value) => updateParticipant(participant.id, 'name', value)}
                  placeholder="Ex: Jean Martin"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Rôle</Text>
                <TextInput
                  style={styles.textInput}
                  value={participant.role}
                  onChangeText={(value) => updateParticipant(participant.id, 'role', value)}
                  placeholder="Ex: Chef de projet"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <TouchableOpacity
                  style={[
                    styles.presenceButton,
                    participant.present && styles.presenceButtonActive
                  ]}
                  onPress={() => toggleParticipantPresence(participant.id)}
                >
                  <Text style={[
                    styles.presenceText,
                    participant.present && styles.presenceTextActive
                  ]}>
                    {participant.present ? '✅ Présent' : '❌ Absent'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Agenda */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Ordre du Jour</Text>
            <TouchableOpacity onPress={addAgendaItem} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {agenda.map((item, index) => (
            <View key={item.id} style={styles.agendaEditor}>
              <View style={styles.agendaHeader}>
                <Text style={styles.agendaNumber}>Point {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeAgendaItem(item.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.icon}
                  onChangeText={(value) => updateAgendaItem(item.id, 'icon', value)}
                  placeholder="Ex: 📊"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Sujet</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.topic}
                  onChangeText={(value) => updateAgendaItem(item.id, 'topic', value)}
                  placeholder="Ex: Point sur l'avancement"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Durée</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.duration}
                  onChangeText={(value) => updateAgendaItem(item.id, 'duration', value)}
                  placeholder="Ex: 30 min"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Statut</Text>
                <TextInput
                  style={styles.textInput}
                  value={item.status}
                  onChangeText={(value) => updateAgendaItem(item.id, 'status', value)}
                  placeholder="Ex: Terminé, En cours, À faire"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Decisions */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Décisions Prises</Text>
            <TouchableOpacity onPress={addDecision} style={styles.addButton}>
              <Plus size={20} color="#10B981" />
            </TouchableOpacity>
          </View>
          
          {decisions.map((decision, index) => (
            <View key={decision.id} style={styles.decisionEditor}>
              <View style={styles.decisionHeader}>
                <Text style={styles.decisionNumber}>Décision {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeDecision(decision.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={decision.icon}
                  onChangeText={(value) => updateDecision(decision.id, 'icon', value)}
                  placeholder="Ex: ✅"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Décision</Text>
                <TextInput
                  style={[styles.textInput, styles.smallTextArea]}
                  value={decision.decision}
                  onChangeText={(value) => updateDecision(decision.id, 'decision', value)}
                  placeholder="Ex: Adoption de la nouvelle méthodologie"
                  placeholderTextColor="#94A3B8"
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Responsable</Text>
                <TextInput
                  style={styles.textInput}
                  value={decision.responsible}
                  onChangeText={(value) => updateDecision(decision.id, 'responsible', value)}
                  placeholder="Ex: Jean Martin"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Échéance</Text>
                <TextInput
                  style={styles.textInput}
                  value={decision.deadline}
                  onChangeText={(value) => updateDecision(decision.id, 'deadline', value)}
                  placeholder="Ex: 30/01/2024"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Clipboard size={24} color="#10B981" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '👥', title: 'Participants Détaillés', desc: 'Liste complète avec rôles' },
            { icon: '📋', title: 'Ordre du Jour', desc: 'Points abordés et statuts' },
            { icon: '✅', title: 'Décisions Prises', desc: 'Actions et responsables' },
            { icon: '📅', title: 'Échéances', desc: 'Dates limites et suivi' },
            { icon: '📝', title: 'Format Professionnel', desc: 'Structure claire et lisible' },
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
    backgroundColor: '#D1FAE5',
  },
  participantEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  participantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  participantNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  presenceButton: {
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  presenceButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  presenceText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#64748B',
  },
  presenceTextActive: {
    color: '#FFFFFF',
  },
  agendaEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  agendaNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
  },
  decisionEditor: {
    backgroundColor: '#D1FAE5',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  decisionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  decisionNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#065F46',
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
  minutesCover: {
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
  minutesTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  meetingTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  minutesDetails: {
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
  minutesSection: {
    marginBottom: 32,
  },
  participantCard: {
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
  participantHeader: {
    padding: 16,
  },
  participantIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  participantName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  participantRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  participantStatus: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '600',
  },
  agendaCard: {
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
  agendaHeader: {
    padding: 16,
  },
  agendaIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  agendaTopic: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  agendaDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  agendaDuration: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  agendaStatus: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  decisionCard: {
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
  decisionHeader: {
    padding: 16,
  },
  decisionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  decisionText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  decisionDetails: {
    gap: 4,
  },
  decisionResponsible: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  decisionDeadline: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  minutesFooter: {
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