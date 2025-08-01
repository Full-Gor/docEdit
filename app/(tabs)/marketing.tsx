import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Zap, FileText, Image, Megaphone, Mail, TrendingUp } from 'lucide-react-native';
import { router } from 'expo-router';

const marketingDocuments = [
  {
    id: 1,
    title: 'Campagne marketing',
    description: 'Planifiez vos campagnes publicitaires',
    icon: Megaphone,
    color: '#2563EB',
    route: '/templates/marketing-campaign'
  },
  {
    id: 2,
    title: 'Email marketing',
    description: 'Templates d\'emails promotionnels',
    icon: Mail,
    color: '#10B981',
    route: '/templates/marketing-email'
  },
  {
    id: 3,
    title: 'Brochure commerciale',
    description: 'Présentation détaillée produits/services',
    icon: FileText,
    color: '#8B5CF6',
    route: '/templates/sales-brochure'
  },
  {
    id: 4,
    title: 'Post réseaux sociaux',
    description: 'Contenu pour médias sociaux',
    icon: Image,
    color: '#F59E0B',
    route: '/templates/social-media-post'
  },
  {
    id: 5,
    title: 'Flyer promotionnel',
    description: 'Supports promotionnels percutants',
    icon: Zap,
    color: '#EF4444',
    route: '/templates/promotional-flyer'
  },
  {
    id: 6,
    title: 'Rapport marketing',
    description: 'Analyse des performances',
    icon: TrendingUp,
    color: '#06B6D4',
    route: '/templates/marketing-report'
  }
];

export default function MarketingScreen() {
  const handleDocumentPress = (route: string) => {
    router.push(route as any);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FFF7ED', '#FED7AA']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Marketing & Promotion</Text>
        <Text style={styles.headerSubtitle}>Supports marketing et communication externe</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.metricsContainer}>
          <View style={styles.metricCard}>
            <TrendingUp size={20} color="#10B981" />
            <Text style={styles.metricValue}>+32%</Text>
            <Text style={styles.metricLabel}>Engagement</Text>
          </View>
          <View style={styles.metricCard}>
            <Mail size={20} color="#F59E0B" />
            <Text style={styles.metricValue}>24%</Text>
            <Text style={styles.metricLabel}>Taux ouverture</Text>
          </View>
          <View style={styles.metricCard}>
            <Zap size={20} color="#2563EB" />
            <Text style={styles.metricValue}>8.5K</Text>
            <Text style={styles.metricLabel}>Leads</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Créer un document</Text>
        <View style={styles.grid}>
          {marketingDocuments.map((doc) => {
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
  metricsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    marginTop: 8,
    gap: 8,
  },
  metricCard: {
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
  metricValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
});