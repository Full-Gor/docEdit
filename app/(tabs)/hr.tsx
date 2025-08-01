import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Briefcase, FileText, Award, Calendar, Users, User } from 'lucide-react-native';
import { router } from 'expo-router';

const hrDocuments = [
  {
    id: 1,
    title: 'Offre d\'emploi',
    description: 'Annonces de recrutement attractives',
    icon: Briefcase,
    color: '#2563EB',
    route: '/templates/job-offer'
  },
  {
    id: 2,
    title: 'Contrat de travail',
    description: 'Modèles de contrats professionnels',
    icon: FileText,
    color: '#8B5CF6',
    route: '/templates/work-contract'
  },
  {
    id: 3,
    title: 'Évaluation annuelle',
    description: 'Formulaires d\'évaluation des performances',
    icon: Award,
    color: '#F59E0B',
    route: '/templates/annual-review'
  },
  {
    id: 4,
    title: 'Demande de congés',
    description: 'Formulaire de demande de congés',
    icon: Calendar,
    color: '#EF4444',
    route: '/templates/leave-request'
  },
  {
    id: 5,
    title: 'Plan de formation',
    description: 'Organisation des formations internes',
    icon: Users,
    color: '#06B6D4',
    route: '/templates/training-plan'
  },
  {
    id: 6,
    title: 'CV',
    description: 'Modèle de CV professionnel',
    icon: User,
    color: '#10B981',
    route: '/templates/cv'
  }
];

const hrChoice2Documents = [
  {
    id: 1,
    title: 'Offre d\'emploi',
    description: 'Template vide pour votre code personnalisé',
    icon: Briefcase,
    color: '#2563EB',
    route: '/templates/job-offer-blank'
  },
  {
    id: 2,
    title: 'Contrat de travail',
    description: 'Template vide pour votre code personnalisé',
    icon: FileText,
    color: '#8B5CF6',
    route: '/templates/work-contract-blank'
  },
  {
    id: 3,
    title: 'Évaluation annuelle',
    description: 'Template vide pour votre code personnalisé',
    icon: Award,
    color: '#F59E0B',
    route: '/templates/annual-review-blank'
  },
  {
    id: 4,
    title: 'Demande de congés',
    description: 'Template vide pour votre code personnalisé',
    icon: Calendar,
    color: '#EF4444',
    route: '/templates/leave-request-blank'
  },
  {
    id: 5,
    title: 'Plan de formation',
    description: 'Template vide pour votre code personnalisé',
    icon: Users,
    color: '#06B6D4',
    route: '/templates/training-plan-blank'
  },
  {
    id: 6,
    title: 'CV',
    description: 'CV Blueprint technique',
    icon: User,
    color: '#10B981',
    route: '/templates/cv-v2'
  }
];

export default function HRScreen() {
  const [selectedTemplateChoice, setSelectedTemplateChoice] = useState(1);
  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  const handleTemplateChoice = (choice: number) => {
    setSelectedTemplateChoice(choice);
  };

  const getCurrentDocuments = () => {
    if (selectedTemplateChoice === 1) {
      return hrDocuments;
    } else {
      return hrChoice2Documents;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEF7FF', '#F3E8FF']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Ressources Humaines</Text>
        <Text style={styles.headerSubtitle}>Documents RH et recrutement</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>125</Text>
            <Text style={styles.statLabel}>Employés</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Postes ouverts</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Satisfaction</Text>
          </View>
        </View>

        {/* Section Template */}
        <View style={styles.templateSection}>
          <Text style={styles.sectionTitle}>Template</Text>
          <View style={styles.templateChoices}>
            <TouchableOpacity
              style={[
                styles.templateChoice,
                selectedTemplateChoice === 1 && styles.templateChoiceActive
              ]}
              onPress={() => handleTemplateChoice(1)}
            >
              <Text style={[
                styles.templateChoiceText,
                selectedTemplateChoice === 1 && styles.templateChoiceTextActive
              ]}>
                Choix 1
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.templateChoice,
                selectedTemplateChoice === 2 && styles.templateChoiceActive
              ]}
              onPress={() => handleTemplateChoice(2)}
            >
              <Text style={[
                styles.templateChoiceText,
                selectedTemplateChoice === 2 && styles.templateChoiceTextActive
              ]}>
                Choix 2
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Templates disponibles</Text>
        <View style={styles.grid}>
          {getCurrentDocuments().map((doc) => {
            const IconComponent = doc.icon;
            return (
              <TouchableOpacity
                key={doc.id}
                style={styles.card}
                onPress={() => handleDocumentPress(doc.route)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: `${doc.color}15` }]}>
                  <IconComponent size={28} color={doc.color} />
                </View>
                <Text style={styles.cardTitle}>{doc.title}</Text>
                <Text style={styles.cardDescription}>{doc.description}</Text>
                <View style={styles.cardFooter}>
                  <Text style={[styles.createButton, { color: doc.color }]}>Créer</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '400',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingTop: 8,
  },
  card: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#F1F5F9',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 16,
  },
  cardFooter: {
    alignItems: 'flex-end',
  },
  createButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#8B5CF6',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 8,
  },
  templateSection: {
    marginBottom: 24,
  },
  templateChoices: {
    flexDirection: 'row',
    gap: 12,
  },
  templateChoice: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  templateChoiceActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  templateChoiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  templateChoiceTextActive: {
    color: '#FFFFFF',
  },
});