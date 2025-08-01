import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Save, Share, Eye, Calendar, MapPin, Clock, Users } from 'lucide-react-native';
import { router } from 'expo-router';

export default function EventInvitationTemplate() {
  const [eventName, setEventName] = useState('');
  const [eventType, setEventType] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [dresscode, setDresscode] = useState('');
  const [rsvp, setRsvp] = useState('');
  const [isPreview, setIsPreview] = useState(false);

  const handleGoBack = () => {
    router.back();
  };

  const togglePreview = () => {
    setIsPreview(!isPreview);
  };

  if (isPreview) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.previewHeader}>
          <TouchableOpacity onPress={togglePreview} style={styles.backButton}>
            <ArrowLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.previewTitle}>Aperçu Invitation</Text>
        </View>
        
        <ScrollView style={styles.previewContent}>
          <View style={styles.invitationContainer}>
            <View style={styles.invitationHeader}>
              <Text style={styles.invitationType}>{eventType || 'INVITATION'}</Text>
              <View style={styles.decorativeLine} />
            </View>
            
            <Text style={styles.invitationTitle}>{eventName || 'Nom de l\'événement'}</Text>
            
            <View style={styles.eventDetails}>
              <View style={styles.detailItem}>
                <Calendar size={20} color="#6B7280" />
                <Text style={styles.detailText}>{date || 'Date de l\'événement'}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <Clock size={20} color="#6B7280" />
                <Text style={styles.detailText}>{time || 'Heure'}</Text>
              </View>
              
              <View style={styles.detailItem}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.detailText}>{location || 'Lieu de l\'événement'}</Text>
              </View>
            </View>
            
            <Text style={styles.invitationDescription}>
              {description || 'Description de l\'événement...'}
            </Text>
            
            {dresscode && (
              <View style={styles.additionalInfo}>
                <Text style={styles.infoLabel}>Code vestimentaire :</Text>
                <Text style={styles.infoText}>{dresscode}</Text>
              </View>
            )}
            
            <View style={styles.rsvpSection}>
              <Text style={styles.rsvpTitle}>RSVP</Text>
              <Text style={styles.rsvpText}>{rsvp || 'Informations de confirmation'}</Text>
            </View>
            
            <View style={styles.invitationFooter}>
              <Text style={styles.footerText}>Nous espérons vous compter parmi nous</Text>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Invitation Événement</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={togglePreview} style={styles.actionButton}>
            <Eye size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Save size={20} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Share size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.editorContent}>
        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Nom de l'événement</Text>
          <TextInput
            style={styles.textInput}
            value={eventName}
            onChangeText={setEventName}
            placeholder="Ex: Soirée de Gala Annuelle"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Type d'événement</Text>
          <TextInput
            style={styles.textInput}
            value={eventType}
            onChangeText={setEventType}
            placeholder="Ex: Conférence, Gala, Séminaire..."
          />
        </View>

        <View style={styles.formRow}>
          <View style={[styles.formSection, styles.halfWidth]}>
            <Text style={styles.fieldLabel}>Date</Text>
            <TextInput
              style={styles.textInput}
              value={date}
              onChangeText={setDate}
              placeholder="JJ/MM/AAAA"
            />
          </View>

          <View style={[styles.formSection, styles.halfWidth]}>
            <Text style={styles.fieldLabel}>Heure</Text>
            <TextInput
              style={styles.textInput}
              value={time}
              onChangeText={setTime}
              placeholder="HH:MM"
            />
          </View>
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Lieu</Text>
          <TextInput
            style={styles.textInput}
            value={location}
            onChangeText={setLocation}
            placeholder="Adresse complète du lieu"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Description</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Décrivez l'événement, le programme..."
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Code vestimentaire (optionnel)</Text>
          <TextInput
            style={styles.textInput}
            value={dresscode}
            onChangeText={setDresscode}
            placeholder="Ex: Tenue de soirée, Business casual..."
          />
        </View>

        <View style={styles.formSection}>
          <Text style={styles.fieldLabel}>Informations RSVP</Text>
          <TextInput
            style={[styles.textInput, styles.smallTextArea]}
            value={rsvp}
            onChangeText={setRsvp}
            placeholder="Email, téléphone, date limite de réponse..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.templateInfo}>
          <Text style={styles.infoTitle}>Conseils pour une invitation réussie :</Text>
          <Text style={styles.infoText}>• Soyez clair sur la date, l'heure et le lieu</Text>
          <Text style={styles.infoText}>• Indiquez le dress code si nécessaire</Text>
          <Text style={styles.infoText}>• Précisez la date limite de réponse</Text>
          <Text style={styles.infoText}>• Incluez toutes les informations pratiques</Text>
          <Text style={styles.infoText}>• Utilisez un ton adapté à l'événement</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  backButton: {
    padding: 8,
  },
  actionButton: {
    padding: 8,
  },
  editorContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  formSection: {
    marginBottom: 24,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    height: 120,
    paddingTop: 12,
  },
  smallTextArea: {
    height: 80,
    paddingTop: 12,
  },
  templateInfo: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  previewHeader: {
    backgroundColor: '#1F2937',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  previewContent: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  invitationContainer: {
    margin: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  invitationHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  invitationType: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2,
    color: '#6B7280',
    marginBottom: 12,
  },
  decorativeLine: {
    width: 60,
    height: 2,
    backgroundColor: '#2563EB',
  },
  invitationTitle: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 40,
  },
  eventDetails: {
    marginBottom: 32,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingLeft: 20,
  },
  detailText: {
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  invitationDescription: {
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
    marginBottom: 24,
    textAlign: 'center',
  },
  additionalInfo: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  rsvpSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 24,
    alignItems: 'center',
  },
  rsvpTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#374151',
    letterSpacing: 1,
    marginBottom: 8,
  },
  rsvpText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  invitationFooter: {
    marginTop: 32,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    fontStyle: 'italic',
    color: '#6B7280',
  },
}); 