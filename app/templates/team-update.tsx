import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Users, User, Calendar, TrendingUp, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function TeamUpdateTemplate() {
  const params = useLocalSearchParams();
  const [title, setTitle] = useState('Mise à Jour Équipe');
  const [company, setCompany] = useState('Mon Entreprise');
  const [updateTitle, setUpdateTitle] = useState('Sprint 15 - Avancement Projet');
  const [teamLead, setTeamLead] = useState('Marie Dupont');
  const [date, setDate] = useState('15/01/2024');
  const [period, setPeriod] = useState('Semaine 3');
  const [isPreview, setIsPreview] = useState(false);
  
  const [teamMembers, setTeamMembers] = useState([
    { id: 1, name: 'Jean Martin', role: 'Développeur Frontend', status: 'En cours', progress: '75%', icon: '👨‍💻' },
    { id: 2, name: 'Sophie Bernard', role: 'Designer UI/UX', status: 'Terminé', progress: '100%', icon: '🎨' },
    { id: 3, name: 'Pierre Dubois', role: 'Développeur Backend', status: 'En cours', progress: '60%', icon: '⚙️' },
    { id: 4, name: 'Anne Moreau', role: 'Product Owner', status: 'En attente', progress: '25%', icon: '📋' },
  ]);

  const [achievements, setAchievements] = useState([
    { id: 1, achievement: 'Interface utilisateur finalisée', impact: 'Élevé', icon: '✅' },
    { id: 2, achievement: 'API backend 80% complète', impact: 'Moyen', icon: '🔧' },
    { id: 3, achievement: 'Tests unitaires implémentés', impact: 'Élevé', icon: '🧪' },
    { id: 4, achievement: 'Documentation mise à jour', impact: 'Faible', icon: '📚' },
  ]);

  const [challenges, setChallenges] = useState([
    { id: 1, challenge: 'Intégration API externe', solution: 'Recherche alternative', priority: 'Haute', icon: '⚠️' },
    { id: 2, challenge: 'Performance mobile', solution: 'Optimisation en cours', priority: 'Moyenne', icon: '📱' },
    { id: 3, challenge: 'Compatibilité navigateurs', solution: 'Tests supplémentaires', priority: 'Basse', icon: '🌐' },
  ]);

  // Charger les données sauvegardées si elles existent
  useEffect(() => {
    if (params.savedDocument) {
      try {
        const savedDoc = JSON.parse(params.savedDocument as string);
        setTitle(savedDoc.title || title);
        setCompany(savedDoc.company || company);
        setUpdateTitle(savedDoc.updateTitle || updateTitle);
        setTeamLead(savedDoc.teamLead || teamLead);
        setDate(savedDoc.date || date);
        setPeriod(savedDoc.period || period);
        if (savedDoc.teamMembers) {
          setTeamMembers(savedDoc.teamMembers);
        }
        if (savedDoc.achievements) {
          setAchievements(savedDoc.achievements);
        }
        if (savedDoc.challenges) {
          setChallenges(savedDoc.challenges);
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

  const updateTeamMember = (id: number, field: 'name' | 'role' | 'status' | 'progress' | 'icon', value: string) => {
    setTeamMembers(prev => 
      prev.map(member => 
        member.id === id 
          ? { ...member, [field]: value }
          : member
      )
    );
  };

  const addTeamMember = () => {
    const newId = Math.max(...teamMembers.map(m => m.id)) + 1;
    setTeamMembers(prev => [...prev, {
      id: newId,
      name: 'Nouveau membre',
      role: 'Rôle',
      status: 'En cours',
      progress: '0%',
      icon: '👤'
    }]);
  };

  const removeTeamMember = (id: number) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id));
  };

  const updateAchievement = (id: number, field: 'achievement' | 'impact' | 'icon', value: string) => {
    setAchievements(prev => 
      prev.map(achievement => 
        achievement.id === id 
          ? { ...achievement, [field]: value }
          : achievement
      )
    );
  };

  const addAchievement = () => {
    const newId = Math.max(...achievements.map(a => a.id)) + 1;
    setAchievements(prev => [...prev, {
      id: newId,
      achievement: 'Nouvelle réalisation',
      impact: 'Moyen',
      icon: '✅'
    }]);
  };

  const removeAchievement = (id: number) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  const updateChallenge = (id: number, field: 'challenge' | 'solution' | 'priority' | 'icon', value: string) => {
    setChallenges(prev => 
      prev.map(challenge => 
        challenge.id === id 
          ? { ...challenge, [field]: value }
          : challenge
      )
    );
  };

  const addChallenge = () => {
    const newId = Math.max(...challenges.map(c => c.id)) + 1;
    setChallenges(prev => [...prev, {
      id: newId,
      challenge: 'Nouveau défi',
      solution: 'Solution en cours',
      priority: 'Moyenne',
      icon: '⚠️'
    }]);
  };

  const removeChallenge = (id: number) => {
    setChallenges(prev => prev.filter(challenge => challenge.id !== id));
  };

  const saveDocument = async () => {
    try {
      const documentData = {
        id: Date.now().toString(),
        type: 'team-update',
        title,
        company,
        updateTitle,
        teamLead,
        date,
        period,
        teamMembers,
        achievements,
        challenges,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const existingDocuments = await AsyncStorage.getItem('documents');
      const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
      documents.push(documentData);
      await AsyncStorage.setItem('documents', JSON.stringify(documents));
      
      Alert.alert(
        'Sauvegarde réussie',
        'Votre mise à jour d\'équipe a été sauvegardée localement.',
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
            <p><strong>Template:</strong> team-update.tsx</p>
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
          <Text style={styles.previewTitle}>Aperçu de la Mise à Jour</Text>
          <View style={styles.sparklesIcon}>
            <Users size={20} color="#FCD34D" />
          </View>
        </LinearGradient>
        
        <ScrollView style={styles.previewContent} showsVerticalScrollIndicator={false}>
          {/* Cover Page */}
          <LinearGradient
            colors={['#F59E0B', '#D97706', '#B45309']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.updateCover}
          >
            <View style={styles.coverPattern}>
              <View style={styles.coverCircle1} />
              <View style={styles.coverCircle2} />
            </View>
            <View style={styles.coverContent}>
              <Text style={styles.updateTitle}>{title}</Text>
              <Text style={styles.updateSubtitle}>{updateTitle}</Text>
              <View style={styles.updateDetails}>
                <View style={styles.detailItem}>
                  <User size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{teamLead}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Calendar size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{date}</Text>
                </View>
                <View style={styles.detailItem}>
                  <TrendingUp size={20} color="#FFFFFF" />
                  <Text style={styles.detailText}>{period}</Text>
                </View>
              </View>
            </View>
          </LinearGradient>
          
          {/* Team Members */}
          <View style={styles.updateSection}>
            <Text style={styles.sectionTitle}>Membres de l'Équipe</Text>
            {teamMembers.map((member, index) => (
              <View key={member.id} style={styles.memberCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.memberHeader}
                >
                  <Text style={styles.memberIcon}>{member.icon}</Text>
                  <Text style={styles.memberName}>{member.name}</Text>
                  <Text style={styles.memberRole}>{member.role}</Text>
                  <View style={styles.memberStatus}>
                    <Text style={styles.memberStatusText}>{member.status}</Text>
                    <Text style={styles.memberProgress}>{member.progress}</Text>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Achievements */}
          <View style={styles.updateSection}>
            <Text style={styles.sectionTitle}>Réalisations</Text>
            {achievements.map((achievement, index) => (
              <View key={achievement.id} style={styles.achievementCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.achievementHeader}
                >
                  <Text style={styles.achievementIcon}>{achievement.icon}</Text>
                  <Text style={styles.achievementText}>{achievement.achievement}</Text>
                  <Text style={styles.achievementImpact}>Impact : {achievement.impact}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Challenges */}
          <View style={styles.updateSection}>
            <Text style={styles.sectionTitle}>Défis et Solutions</Text>
            {challenges.map((challenge, index) => (
              <View key={challenge.id} style={styles.challengeCard}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={styles.challengeHeader}
                >
                  <Text style={styles.challengeIcon}>{challenge.icon}</Text>
                  <Text style={styles.challengeText}>{challenge.challenge}</Text>
                  <Text style={styles.challengeSolution}>Solution : {challenge.solution}</Text>
                  <Text style={styles.challengePriority}>Priorité : {challenge.priority}</Text>
                </LinearGradient>
              </View>
            ))}
          </View>
          
          {/* Footer */}
          <View style={styles.updateFooter}>
            <Text style={styles.footerText}>© 2024 {company}. Tous droits réservés.</Text>
            <Text style={styles.footerSubtext}>Mise à jour générée avec précision</Text>
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
        <Text style={styles.headerTitle}>Créer une Mise à Jour Équipe</Text>
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
              <Text style={styles.fieldLabel}>Titre de la mise à jour</Text>
              <Text style={styles.fieldHint}>Titre principal du document</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={title}
              onChangeText={setTitle}
              placeholder="Ex: Mise à Jour Équipe"
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
              <Text style={styles.fieldLabel}>Titre de la mise à jour</Text>
              <Text style={styles.fieldHint}>Sujet spécifique</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={updateTitle}
              onChangeText={setUpdateTitle}
              placeholder="Ex: Sprint 15 - Avancement Projet"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Chef d'équipe</Text>
              <Text style={styles.fieldHint}>Responsable de l'équipe</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={teamLead}
              onChangeText={setTeamLead}
              placeholder="Ex: Marie Dupont"
              placeholderTextColor="#94A3B8"
            />
          </View>

          <View style={styles.formSection}>
            <View style={styles.labelContainer}>
              <Text style={styles.fieldLabel}>Date</Text>
              <Text style={styles.fieldHint}>Date de la mise à jour</Text>
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
              <Text style={styles.fieldLabel}>Période</Text>
              <Text style={styles.fieldHint}>Période concernée</Text>
            </View>
            <TextInput
              style={styles.textInput}
              value={period}
              onChangeText={setPeriod}
              placeholder="Ex: Semaine 3"
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Team Members */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Membres de l'Équipe</Text>
            <TouchableOpacity onPress={addTeamMember} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {teamMembers.map((member, index) => (
            <View key={member.id} style={styles.memberEditor}>
              <View style={styles.memberHeader}>
                <Text style={styles.memberNumber}>Membre {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeTeamMember(member.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={member.icon}
                  onChangeText={(value) => updateTeamMember(member.id, 'icon', value)}
                  placeholder="Ex: 👨‍💻"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Nom</Text>
                <TextInput
                  style={styles.textInput}
                  value={member.name}
                  onChangeText={(value) => updateTeamMember(member.id, 'name', value)}
                  placeholder="Ex: Jean Martin"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Rôle</Text>
                <TextInput
                  style={styles.textInput}
                  value={member.role}
                  onChangeText={(value) => updateTeamMember(member.id, 'role', value)}
                  placeholder="Ex: Développeur Frontend"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Statut</Text>
                <TextInput
                  style={styles.textInput}
                  value={member.status}
                  onChangeText={(value) => updateTeamMember(member.id, 'status', value)}
                  placeholder="Ex: En cours, Terminé, En attente"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Progression</Text>
                <TextInput
                  style={styles.textInput}
                  value={member.progress}
                  onChangeText={(value) => updateTeamMember(member.id, 'progress', value)}
                  placeholder="Ex: 75%"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Réalisations</Text>
            <TouchableOpacity onPress={addAchievement} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {achievements.map((achievement, index) => (
            <View key={achievement.id} style={styles.achievementEditor}>
              <View style={styles.achievementHeader}>
                <Text style={styles.achievementNumber}>Réalisation {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeAchievement(achievement.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={achievement.icon}
                  onChangeText={(value) => updateAchievement(achievement.id, 'icon', value)}
                  placeholder="Ex: ✅"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Réalisation</Text>
                <TextInput
                  style={styles.textInput}
                  value={achievement.achievement}
                  onChangeText={(value) => updateAchievement(achievement.id, 'achievement', value)}
                  placeholder="Ex: Interface utilisateur finalisée"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Impact</Text>
                <TextInput
                  style={styles.textInput}
                  value={achievement.impact}
                  onChangeText={(value) => updateAchievement(achievement.id, 'impact', value)}
                  placeholder="Ex: Élevé, Moyen, Faible"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        {/* Challenges */}
        <View style={styles.editorCard}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Défis et Solutions</Text>
            <TouchableOpacity onPress={addChallenge} style={styles.addButton}>
              <Plus size={20} color="#F59E0B" />
            </TouchableOpacity>
          </View>
          
          {challenges.map((challenge, index) => (
            <View key={challenge.id} style={styles.challengeEditor}>
              <View style={styles.challengeHeader}>
                <Text style={styles.challengeNumber}>Défi {index + 1}</Text>
                <TouchableOpacity 
                  onPress={() => removeChallenge(challenge.id)}
                  style={styles.removeButton}
                >
                  <X size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Icône</Text>
                <TextInput
                  style={styles.textInput}
                  value={challenge.icon}
                  onChangeText={(value) => updateChallenge(challenge.id, 'icon', value)}
                  placeholder="Ex: ⚠️"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Défi</Text>
                <TextInput
                  style={styles.textInput}
                  value={challenge.challenge}
                  onChangeText={(value) => updateChallenge(challenge.id, 'challenge', value)}
                  placeholder="Ex: Intégration API externe"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Solution</Text>
                <TextInput
                  style={styles.textInput}
                  value={challenge.solution}
                  onChangeText={(value) => updateChallenge(challenge.id, 'solution', value)}
                  placeholder="Ex: Recherche alternative"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              
              <View style={styles.formSection}>
                <Text style={styles.fieldLabel}>Priorité</Text>
                <TextInput
                  style={styles.textInput}
                  value={challenge.priority}
                  onChangeText={(value) => updateChallenge(challenge.id, 'priority', value)}
                  placeholder="Ex: Haute, Moyenne, Basse"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.featuresCard}>
          <View style={styles.featuresHeader}>
            <Users size={24} color="#F59E0B" />
            <Text style={styles.featuresTitle}>Caractéristiques Premium</Text>
          </View>
          
          {[
            { icon: '👥', title: 'Suivi Équipe', desc: 'Progression individuelle' },
            { icon: '✅', title: 'Réalisations', desc: 'Accomplissements détaillés' },
            { icon: '⚠️', title: 'Gestion Défis', desc: 'Problèmes et solutions' },
            { icon: '📊', title: 'Métriques', desc: 'Indicateurs de performance' },
            { icon: '🔄', title: 'Mise à Jour', desc: 'Suivi régulier des projets' },
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
  memberEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  memberNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  removeButton: {
    padding: 4,
    borderRadius: 8,
    backgroundColor: '#FEE2E2',
  },
  achievementEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  achievementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  achievementNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
  },
  challengeEditor: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  challengeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  challengeNumber: {
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
  updateCover: {
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
  updateTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 16,
  },
  updateSubtitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  updateDetails: {
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
  updateSection: {
    marginBottom: 32,
  },
  memberCard: {
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
  memberHeader: {
    padding: 16,
  },
  memberIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  memberName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  memberRole: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 8,
  },
  memberStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  memberStatusText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  memberProgress: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: '600',
  },
  achievementCard: {
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
  achievementHeader: {
    padding: 16,
  },
  achievementIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  achievementText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  achievementImpact: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  challengeCard: {
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
  challengeHeader: {
    padding: 16,
  },
  challengeIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  challengeText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  challengeSolution: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 4,
  },
  challengePriority: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  updateFooter: {
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