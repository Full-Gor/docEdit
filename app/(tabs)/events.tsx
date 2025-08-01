import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar, Mail, Heart, Users, Megaphone, Award, FileText, Globe, Target } from 'lucide-react-native';
import { router } from 'expo-router';

const eventDocuments = [
  {
    id: 1,
    title: 'Invitation événement',
    description: 'Invitations élégantes pour vos événements',
    icon: Mail,
    color: '#2563EB',
    route: '/templates/event-invitation'
  },
  {
    id: 2,
    title: 'Programme conférence',
    description: 'Planning détaillé et agenda professionnel',
    icon: Calendar,
    color: '#10B981',
    route: '/templates/conference-program'
  },
  {
    id: 3,
    title: 'Carte de vœux',
    description: 'Vœux d\'entreprise personnalisés',
    icon: Heart,
    color: '#F97316',
    route: '/templates/greeting-card'
  },
  {
    id: 4,
    title: 'Séminaire entreprise',
    description: 'Organisation de séminaires et formations',
    icon: Users,
    color: '#8B5CF6',
    route: '/templates/seminar-plan'
  },
  {
    id: 5,
    title: 'Lancement produit',
    description: 'Événement de lancement de produit',
    icon: Megaphone,
    color: '#F59E0B',
    route: '/templates/product-launch'
  },
  {
    id: 6,
    title: 'Soirée de gala',
    description: 'Organisation de soirées prestigieuses',
    icon: Award,
    color: '#EF4444',
    route: '/templates/gala-event'
  }
];

const templateChoice2Documents = [
  {
    id: 1,
    title: 'Rapport Annuel',
    description: 'Template vide pour rapport annuel',
    icon: Calendar,
    color: '#2563EB',
    route: '/templates/annual-report-v2'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Template vide pour communiqué de presse',
    icon: Mail,
    color: '#10B981',
    route: '/templates/press-release-v2'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template vide pour newsletter',
    icon: Heart,
    color: '#F97316',
    route: '/templates/newsletter-v2'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil',
    description: 'Template vide pour guide d\'accueil',
    icon: Users,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide-v2'
  }
];

const templateChoice3Documents = [
  {
    id: 1,
    title: 'Rapport Annuel V3',
    description: 'Template avancé pour rapport annuel',
    icon: FileText,
    color: '#06B6D4',
    route: '/templates/annual-report-v3'
  },
  {
    id: 2,
    title: 'Communiqué de Presse V3',
    description: 'Template avancé pour communiqué de presse',
    icon: Globe,
    color: '#EC4899',
    route: '/templates/press-release-v3'
  },
  {
    id: 3,
    title: 'Newsletter V3',
    description: 'Template avancé pour newsletter',
    icon: Target,
    color: '#84CC16',
    route: '/templates/newsletter-v3'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil V3',
    description: 'Template avancé pour guide d\'accueil',
    icon: Users,
    color: '#F97316',
    route: '/templates/onboarding-guide-v3'
  }
];

export default function EventsScreen() {
  const [selectedTemplateChoice, setSelectedTemplateChoice] = useState(1);

  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  const handleTemplateChoice = (choice: number) => {
    setSelectedTemplateChoice(choice);
  };

  const getCurrentDocuments = () => {
    switch (selectedTemplateChoice) {
      case 1:
        return eventDocuments;
      case 2:
        return templateChoice2Documents;
      case 3:
        return templateChoice3Documents;
      default:
        return eventDocuments;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Communication Événementielle</Text>
        <Text style={styles.headerSubtitle}>Templates pour vos événements et célébrations</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.upcomingEvents}>
          <Text style={styles.sectionTitle}>Événements à venir</Text>
          <TouchableOpacity style={styles.eventCard}>
            <View style={styles.eventDate}>
              <Text style={styles.eventDay}>15</Text>
              <Text style={styles.eventMonth}>DÉC</Text>
            </View>
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>Conférence Annuelle 2024</Text>
              <Text style={styles.eventLocation}>Paris • 250 participants</Text>
            </View>
          </TouchableOpacity>
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
            <TouchableOpacity
              style={[
                styles.templateChoice,
                selectedTemplateChoice === 3 && styles.templateChoiceActive
              ]}
              onPress={() => handleTemplateChoice(3)}
            >
              <Text style={[
                styles.templateChoiceText,
                selectedTemplateChoice === 3 && styles.templateChoiceTextActive
              ]}>
                Choix 3
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
  upcomingEvents: {
    marginBottom: 24,
  },
  templateSection: {
    marginBottom: 24,
  },
  templateChoices: {
    flexDirection: 'row',
    gap: 8,
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
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  templateChoiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  templateChoiceTextActive: {
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
    marginTop: 8,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  eventDate: {
    width: 60,
    height: 60,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  eventDay: {
    fontSize: 20,
    fontWeight: '700',
    color: '#2563EB',
  },
  eventMonth: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  eventInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  eventLocation: {
    fontSize: 14,
    color: '#6B7280',
  },
});