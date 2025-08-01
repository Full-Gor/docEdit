import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare, FileText, Bell, Newspaper, Users, Clipboard } from 'lucide-react-native';
import { router } from 'expo-router';

const internalDocuments = [
  {
    id: 1,
    title: 'Note de service',
    description: 'Communications internes officielles',
    icon: MessageSquare,
    color: '#2563EB',
    route: '/templates/internal-memo'
  },
  {
    id: 2,
    title: 'Compte-rendu de réunion',
    description: 'Documentation des décisions prises',
    icon: Clipboard,
    color: '#10B981',
    route: '/templates/meeting-minutes'
  },
  {
    id: 3,
    title: 'Annonce interne',
    description: 'Messages importants pour l\'équipe',
    icon: Bell,
    color: '#F97316',
    route: '/templates/internal-announcement'
  },
  {
    id: 4,
    title: 'Journal interne',
    description: 'Newsletter entreprise',
    icon: Newspaper,
    color: '#8B5CF6',
    route: '/templates/internal-newsletter'
  },
  {
    id: 5,
    title: 'Mise à jour d\'équipe',
    description: 'Actualités et progrès des projets',
    icon: Users,
    color: '#F59E0B',
    route: '/templates/team-update'
  },
  {
    id: 6,
    title: 'Politique d\'entreprise',
    description: 'Règles et procédures internes',
    icon: FileText,
    color: '#EF4444',
    route: '/templates/company-policy'
  }
];

export default function InternalScreen() {
  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#F0FDF4', '#DCFCE7']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Communication Interne</Text>
        <Text style={styles.headerSubtitle}>Documents pour la communication interne</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.quickStats}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Annonces actives</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Documents partagés</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Créer un document</Text>
        <View style={styles.grid}>
          {internalDocuments.map((doc) => {
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
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
    color: '#10B981',
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