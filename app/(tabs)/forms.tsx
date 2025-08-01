import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ClipboardList, FileCheck, FormInput, Database, Shield, Settings } from 'lucide-react-native';
import { router } from 'expo-router';

const formDocuments = [
  {
    id: 1,
    title: 'Enquête satisfaction',
    description: 'Collectez les retours de vos clients',
    icon: ClipboardList,
    color: '#2563EB',
    route: '/templates/satisfaction-survey'
  },
  {
    id: 2,
    title: 'Formulaire d\'inscription',
    description: 'Inscriptions événements et formations',
    icon: FormInput,
    color: '#10B981',
    route: '/templates/registration-form'
  },
  {
    id: 3,
    title: 'Formulaire de feedback',
    description: 'Recueillez les avis et suggestions',
    icon: FileCheck,
    color: '#8B5CF6',
    route: '/templates/feedback-form'
  },
  {
    id: 4,
    title: 'Formulaire de contact',
    description: 'Facilitez la prise de contact',
    icon: Database,
    color: '#F59E0B',
    route: '/templates/contact-form'
  },
  {
    id: 5,
    title: 'Formulaire de conformité',
    description: 'Documents de conformité RGPD',
    icon: Shield,
    color: '#EF4444',
    route: '/templates/compliance-form'
  },
  {
    id: 6,
    title: 'Demande de service',
    description: 'Gestion des demandes internes',
    icon: Settings,
    color: '#06B6D4',
    route: '/templates/service-request'
  }
];

export default function FormsScreen() {
  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FAFAFA', '#E4E4E7']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Formulaires & Guides</Text>
        <Text style={styles.headerSubtitle}>Documents administratifs et informatifs</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <ClipboardList size={24} color="#2563EB" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Formulaires actifs</Text>
          </View>
          <View style={styles.statCard}>
            <FileCheck size={24} color="#10B981" />
            <Text style={styles.statNumber}>1.8K</Text>
            <Text style={styles.statLabel}>Réponses</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Types de formulaires</Text>
        <View style={styles.grid}>
          {formDocuments.map((doc) => {
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
    gap: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
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
    color: '#1E293B',
    marginTop: 12,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
});