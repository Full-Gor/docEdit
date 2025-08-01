import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { FileText, Building, BookOpen, UserCheck } from 'lucide-react-native';
import { router } from 'expo-router';

const institutionalDocuments = [
  {
    id: 1,
    title: 'Rapport annuel',
    description: 'Template professionnel pour rapport d\'activité',
    icon: FileText,
    color: '#2563EB',
    route: '/templates/annual-report'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Modèle structuré pour vos annonces officielles',
    icon: Building,
    color: '#10B981',
    route: '/templates/press-release'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template moderne pour vos communications',
    icon: BookOpen,
    color: '#F97316',
    route: '/templates/newsletter'
  },
  {
    id: 4,
    title: 'Guide d\'accueil',
    description: 'Livret d\'accueil nouveaux collaborateurs',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide'
  }
];

const institutionalChoice2Documents = [
  {
    id: 1,
    title: 'Rapport Annuel',
    description: 'Template vide pour rapport annuel',
    icon: FileText,
    color: '#2563EB',
    route: '/templates/annual-report-v2'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Template vide pour communiqué de presse',
    icon: Building,
    color: '#10B981',
    route: '/templates/press-release-v2'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template vide pour newsletter',
    icon: BookOpen,
    color: '#F97316',
    route: '/templates/newsletter-v2'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil',
    description: 'Template vide pour guide d\'accueil',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide-v2'
  }
];

const institutionalChoice3Documents = [
  {
    id: 1,
    title: 'Rapport Annuel',
    description: 'Template vide pour votre code personnalisé',
    icon: FileText,
    color: '#2563EB',
    route: '/templates/annual-report-v3'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Template vide pour votre code personnalisé',
    icon: Building,
    color: '#10B981',
    route: '/templates/press-release-v3'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template vide pour votre code personnalisé',
    icon: BookOpen,
    color: '#F97316',
    route: '/templates/newsletter-v3'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil',
    description: 'Template vide pour votre code personnalisé',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide-v3'
  }
];

const institutionalChoice4Documents = [
  {
    id: 1,
    title: 'Rapport Annuel',
    description: 'Template vide pour votre code personnalisé',
    icon: FileText,
    color: '#2563EB',
    route: '/templates/annual-report-v4'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Template vide pour votre code personnalisé',
    icon: Building,
    color: '#10B981',
    route: '/templates/press-release-v4'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template vide pour votre code personnalisé',
    icon: BookOpen,
    color: '#F97316',
    route: '/templates/newsletter-v4'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil',
    description: 'Template vide pour votre code personnalisé',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide-v4'
  }
];

const institutionalChoice5Documents = [
  {
    id: 1,
    title: 'Rapport Annuel',
    description: 'Template vide pour votre code personnalisé',
    icon: FileText,
    color: '#2563EB',
    route: '/templates/annual-report-v5'
  },
  {
    id: 2,
    title: 'Communiqué de Presse',
    description: 'Template vide pour votre code personnalisé',
    icon: Building,
    color: '#10B981',
    route: '/templates/press-release-v5'
  },
  {
    id: 3,
    title: 'Newsletter',
    description: 'Template vide pour votre code personnalisé',
    icon: BookOpen,
    color: '#F97316',
    route: '/templates/newsletter-v5'
  },
  {
    id: 4,
    title: 'Guide d\'Accueil',
    description: 'Template vide pour votre code personnalisé',
    icon: UserCheck,
    color: '#8B5CF6',
    route: '/templates/onboarding-guide-v5'
  }
];

export default function InstitutionalScreen() {
  const [selectedTemplateChoice, setSelectedTemplateChoice] = useState(1);

  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  const handleTemplateChoice = (choice: number) => {
    setSelectedTemplateChoice(choice);
  };

  const getCurrentDocuments = () => {
    if (selectedTemplateChoice === 1) {
      return institutionalDocuments;
    } else if (selectedTemplateChoice === 2) {
      return institutionalChoice2Documents;
    } else if (selectedTemplateChoice === 3) {
      return institutionalChoice3Documents;
    } else if (selectedTemplateChoice === 4) {
      return institutionalChoice4Documents;
    } else {
      return institutionalChoice5Documents;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F8FAFC', '#E2E8F0']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Documents Institutionnels</Text>
        <Text style={styles.headerSubtitle}>Templates professionnels pour votre communication</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
            <TouchableOpacity
              style={[
                styles.templateChoice,
                selectedTemplateChoice === 4 && styles.templateChoiceActive
              ]}
              onPress={() => handleTemplateChoice(4)}
            >
              <Text style={[
                styles.templateChoiceText,
                selectedTemplateChoice === 4 && styles.templateChoiceTextActive
              ]}>
                Choix 4
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.templateChoice,
                selectedTemplateChoice === 5 && styles.templateChoiceActive
              ]}
              onPress={() => handleTemplateChoice(5)}
            >
              <Text style={[
                styles.templateChoiceText,
                selectedTemplateChoice === 5 && styles.templateChoiceTextActive
              ]}>
                Choix 5
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
  templateSection: {
    marginBottom: 24,
  },
  templateChoices: {
    flexDirection: 'row',
    gap: 6, // Réduit encore plus pour 4 boutons
  },
  templateChoice: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10, // Réduit encore plus
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  templateChoiceActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  templateChoiceText: {
    fontSize: 13, // Réduit encore plus
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
});