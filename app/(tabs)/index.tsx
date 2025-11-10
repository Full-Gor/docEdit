import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Users, Briefcase, Mail, Settings as SettingsIcon } from 'lucide-react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  const navigateToSettings = () => {
    router.push('/settings' as any);
  };

  const navigateToTab = (tabName: string) => {
    router.push(`/(tabs)/${tabName}` as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header simple sans animation */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>DocEdit</Text>
          <Text style={styles.headerYear}>2025</Text>
        </View>
        <TouchableOpacity onPress={navigateToSettings} style={styles.settingsButton}>
          <SettingsIcon size={24} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Présentation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bienvenue sur DocEdit</Text>
          <Text style={styles.sectionDescription}>
            Votre solution professionnelle pour la création et la gestion de documents d'entreprise.
            Créez, modifiez et partagez vos documents en toute simplicité.
          </Text>
        </View>

        {/* Section Catégories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Catégories de documents</Text>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('institutional')}
          >
            <View style={styles.categoryIcon}>
              <Briefcase size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Documents Institutionnels</Text>
              <Text style={styles.categoryDescription}>
                Rapports annuels, communiqués de presse, newsletters et guides d'accueil
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('events')}
          >
            <View style={styles.categoryIcon}>
              <Users size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Événements</Text>
              <Text style={styles.categoryDescription}>
                Invitations, programmes de conférences et cartes de vœux professionnelles
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('hr')}
          >
            <View style={styles.categoryIcon}>
              <FileText size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Ressources Humaines</Text>
              <Text style={styles.categoryDescription}>
                Offres d'emploi, contrats de travail, évaluations et plans de formation
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('internal')}
          >
            <View style={styles.categoryIcon}>
              <Mail size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Communications Internes</Text>
              <Text style={styles.categoryDescription}>
                Notes de service, comptes-rendus de réunion et annonces internes
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('marketing')}
          >
            <View style={styles.categoryIcon}>
              <Briefcase size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Marketing</Text>
              <Text style={styles.categoryDescription}>
                Campagnes marketing, emails professionnels et brochures commerciales
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoryCard}
            onPress={() => navigateToTab('forms')}
          >
            <View style={styles.categoryIcon}>
              <FileText size={24} color="#1E293B" />
            </View>
            <View style={styles.categoryContent}>
              <Text style={styles.categoryTitle}>Documents Administratifs</Text>
              <Text style={styles.categoryDescription}>
                Formulaires, enquêtes de satisfaction et demandes de service
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section Fonctionnalités */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Fonctionnalités principales</Text>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              Création rapide de documents professionnels à partir de modèles prêts à l'emploi
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              Sauvegarde locale de vos documents pour un accès hors ligne
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              Export et partage de documents au format PDF
            </Text>
          </View>

          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>
              Interface simple et intuitive adaptée aux professionnels
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>© 2025 DocEdit - Solution professionnelle de gestion documentaire</Text>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerYear: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#64748B',
    lineHeight: 24,
  },
  categoryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  categoryContent: {
    flex: 1,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  featureBullet: {
    fontSize: 16,
    color: '#1E293B',
    marginRight: 8,
    fontWeight: '600',
  },
  featureText: {
    flex: 1,
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerText: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
});
