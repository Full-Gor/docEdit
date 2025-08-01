import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, FileText, Trash2, Eye, Calendar, Clock } from 'lucide-react-native';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

interface SavedDocument {
  id: string;
  type: string;
  title: string;
  company: string;
  createdAt: string;
  updatedAt: string;
}

export default function SavedDocumentsScreen() {
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSavedDocuments();
  }, []);

  const loadSavedDocuments = async () => {
    try {
      const savedDocuments = await AsyncStorage.getItem('documents');
      if (savedDocuments) {
        const parsedDocuments = JSON.parse(savedDocuments);
        setDocuments(parsedDocuments);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteDocument = async (documentId: string) => {
    Alert.alert(
      'Supprimer le document',
      'Êtes-vous sûr de vouloir supprimer ce document ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              const updatedDocuments = documents.filter(doc => doc.id !== documentId);
              await AsyncStorage.setItem('documents', JSON.stringify(updatedDocuments));
              setDocuments(updatedDocuments);
              Alert.alert('Succès', 'Document supprimé avec succès.');
            } catch (error) {
              console.error('Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Impossible de supprimer le document.');
            }
          }
        }
      ]
    );
  };

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case 'annual-report':
        return '📊';
      case 'press-release':
        return '📰';
      case 'newsletter':
        return '📧';
      case 'onboarding-guide':
        return '👋';
      case 'satisfaction-survey':
        return '📋';
      case 'registration-form':
        return '📝';
      case 'feedback-form':
        return '✅';
      case 'contact-form':
        return '📊';
      case 'compliance-form':
        return '🛡️';
      case 'service-request':
        return '⚙️';
      default:
        return '📄';
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case 'annual-report':
        return 'Rapport Annuel';
      case 'press-release':
        return 'Communiqué de Presse';
      case 'newsletter':
        return 'Newsletter';
      case 'onboarding-guide':
        return 'Guide d\'Accueil';
      case 'greeting-card':
        return 'Carte de Vœux';
      case 'seminar-plan':
        return 'Séminaire Entreprise';
      case 'product-launch':
        return 'Lancement Produit';
      case 'gala-event':
        return 'Soirée de Gala';
      case 'conference-program':
        return 'Programme Conférence';
      case 'job-offer':
        return 'Offre d\'Emploi';
      case 'work-contract':
        return 'Contrat de Travail';
      case 'annual-review':
        return 'Évaluation Annuelle';
      case 'leave-request':
        return 'Demande de Congés';
      case 'training-plan':
        return 'Plan de Formation';
      case 'internal-memo':
        return 'Note de Service';
      case 'meeting-minutes':
        return 'Compte-rendu de Réunion';
      case 'internal-announcement':
        return 'Annonce Interne';
      case 'internal-newsletter':
        return 'Journal Interne';
      case 'team-update':
        return 'Mise à Jour d\'Équipe';
      case 'company-policy':
        return 'Politique d\'Entreprise';
      case 'marketing-campaign':
        return 'Campagne Marketing';
      case 'marketing-email':
        return 'Email Marketing';
      case 'sales-brochure':
        return 'Brochure Commerciale';
      case 'social-media-post':
        return 'Post Réseaux Sociaux';
      case 'promotional-flyer':
        return 'Flyer Promotionnel';
                  case 'marketing-report':
              return 'Rapport Marketing';
            case 'satisfaction-survey':
              return 'Enquête Satisfaction';
            case 'registration-form':
              return 'Formulaire d\'Inscription';
            case 'feedback-form':
              return 'Formulaire de Feedback';
            case 'contact-form':
              return 'Formulaire de Contact';
            case 'compliance-form':
              return 'Formulaire de Conformité';
            case 'service-request':
              return 'Demande de Service';
            default:
              return 'Document';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleGoBack = () => {
    // Rediriger vers l'onglet principal au lieu de router.back()
    router.replace('/(tabs)/institutional');
  };

  const viewDocument = (document: SavedDocument) => {
    // Navigation vers le template correspondant avec les données
    switch (document.type) {
      case 'annual-report':
        router.push({
          pathname: '/templates/annual-report',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'press-release':
        router.push({
          pathname: '/templates/press-release',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'newsletter':
        router.push({
          pathname: '/templates/newsletter',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'onboarding-guide':
        router.push({
          pathname: '/templates/onboarding-guide',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'marketing-campaign':
        router.push({
          pathname: '/templates/marketing-campaign',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'marketing-email':
        router.push({
          pathname: '/templates/marketing-email',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'sales-brochure':
        router.push({
          pathname: '/templates/sales-brochure',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'social-media-post':
        router.push({
          pathname: '/templates/social-media-post',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
      case 'promotional-flyer':
        router.push({
          pathname: '/templates/promotional-flyer',
          params: { 
            savedDocument: JSON.stringify(document),
            isEditing: 'true'
          }
        });
        break;
                  case 'marketing-report':
              router.push({
                pathname: '/templates/marketing-report',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'satisfaction-survey':
              router.push({
                pathname: '/templates/satisfaction-survey',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'registration-form':
              router.push({
                pathname: '/templates/registration-form',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'feedback-form':
              router.push({
                pathname: '/templates/feedback-form',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'contact-form':
              router.push({
                pathname: '/templates/contact-form',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'compliance-form':
              router.push({
                pathname: '/templates/compliance-form',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            case 'service-request':
              router.push({
                pathname: '/templates/service-request',
                params: { 
                  savedDocument: JSON.stringify(document),
                  isEditing: 'true'
                }
              });
              break;
            default:
              Alert.alert(
          'Type non supporté',
          'Ce type de document n\'est pas encore supporté pour l\'édition.',
          [{ text: 'OK' }]
        );
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          style={styles.header}
        >
          <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Documents Sauvegardés</Text>
          <View style={styles.placeholder} />
        </LinearGradient>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Chargement...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#6366F1', '#8B5CF6']}
        style={styles.header}
      >
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Documents Sauvegardés</Text>
        <View style={styles.placeholder} />
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {documents.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FileText size={64} color="#94A3B8" />
            <Text style={styles.emptyTitle}>Aucun document sauvegardé</Text>
            <Text style={styles.emptySubtitle}>
              Vos documents sauvegardés apparaîtront ici
            </Text>
          </View>
        ) : (
          <>
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>{documents.length}</Text>
                <Text style={styles.statLabel}>Documents</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {documents.filter(doc => doc.type === 'annual-report').length}
                </Text>
                <Text style={styles.statLabel}>Rapports</Text>
              </View>
              <View style={styles.statCard}>
                <Text style={styles.statNumber}>
                  {documents.filter(doc => doc.type === 'newsletter').length}
                </Text>
                <Text style={styles.statLabel}>Newsletters</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Vos Documents</Text>
            
            {documents.map((document, index) => (
              <View key={document.id} style={styles.documentCard}>
                <LinearGradient
                  colors={[
                    ['#6366F1', '#4F46E5'],
                    ['#10B981', '#059669'],
                    ['#F59E0B', '#D97706'],
                    ['#EC4899', '#DB2777'],
                  ][index % 4]}
                  style={styles.documentGradient}
                >
                  <View style={styles.documentHeader}>
                    <View style={styles.documentInfo}>
                      <Text style={styles.documentIcon}>
                        {getDocumentIcon(document.type)}
                      </Text>
                      <View style={styles.documentDetails}>
                        <Text style={styles.documentTitle}>{document.title}</Text>
                        <Text style={styles.documentType}>
                          {getDocumentTypeName(document.type)}
                        </Text>
                        <Text style={styles.documentCompany}>{document.company}</Text>
                      </View>
                    </View>
                    <View style={styles.documentActions}>
                      <TouchableOpacity
                        onPress={() => viewDocument(document)}
                        style={styles.actionButton}
                      >
                        <Eye size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => deleteDocument(document.id)}
                        style={styles.deleteButton}
                      >
                        <Trash2 size={20} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  
                  <View style={styles.documentFooter}>
                    <View style={styles.dateInfo}>
                      <Calendar size={14} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.dateText}>
                        Créé le {formatDate(document.createdAt)}
                      </Text>
                    </View>
                    <View style={styles.dateInfo}>
                      <Clock size={14} color="rgba(255, 255, 255, 0.8)" />
                      <Text style={styles.dateText}>
                        Modifié le {formatDate(document.updatedAt)}
                      </Text>
                    </View>
                  </View>
                </LinearGradient>
              </View>
            ))}
          </>
        )}
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
    fontSize: 19,
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
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1E293B',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 20,
  },
  documentCard: {
    marginBottom: 16,
  },
  documentGradient: {
    borderRadius: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  documentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
  },
  documentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  documentIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  documentDetails: {
    flex: 1,
  },
  documentTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  documentType: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 2,
  },
  documentCompany: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  documentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.8)',
  },
  documentFooter: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  dateInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 6,
  },
  dateText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
}); 