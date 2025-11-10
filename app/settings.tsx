import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Mail,
  Lock,
  MessageSquare,
  Users,
  Camera,
  Bell,
  Globe,
  Shield,
  LogOut,
  UserPlus,
  LogIn,
  ChevronRight
} from 'lucide-react-native';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [collaborationEnabled, setCollaborationEnabled] = useState(false);

  // États pour les informations du compte
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  const handleGoBack = () => {
    router.back();
  };

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }
    setIsLoggedIn(true);
    Alert.alert('Succès', 'Connexion réussie');
  };

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: () => {
            setIsLoggedIn(false);
            setEmail('');
            setPassword('');
            setFullName('');
            setPhone('');
            Alert.alert('Succès', 'Vous êtes déconnecté');
          }
        }
      ]
    );
  };

  const handleRegister = () => {
    if (!email || !password || !fullName) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    setIsLoggedIn(true);
    Alert.alert('Succès', 'Compte créé avec succès');
  };

  const handleUpdatePhoto = () => {
    Alert.alert('Photo de profil', 'Fonctionnalité de mise à jour de photo en cours de développement');
  };

  const handleUpdateProfile = () => {
    if (!fullName || !email) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }
    Alert.alert('Succès', 'Profil mis à jour avec succès');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Section Connexion / Déconnexion */}
        {!isLoggedIn ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <LogIn size={20} color="#1E293B" />
              <Text style={styles.sectionTitle}>Connexion</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Connectez-vous à votre compte</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
                <Text style={styles.primaryButtonText}>Se connecter</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Section Création de compte */}
        {!isLoggedIn ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <UserPlus size={20} color="#1E293B" />
              <Text style={styles.sectionTitle}>Création de compte</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.cardTitle}>Créer un nouveau compte</Text>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone (optionnel)</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleRegister}>
                <Text style={styles.primaryButtonText}>Créer le compte</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Section Personnalisation du compte (si connecté) */}
        {isLoggedIn ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <User size={20} color="#1E293B" />
              <Text style={styles.sectionTitle}>Personnalisation du compte</Text>
            </View>

            <View style={styles.card}>
              <TouchableOpacity style={styles.photoButton} onPress={handleUpdatePhoto}>
                <Camera size={24} color="#1E293B" />
                <Text style={styles.photoButtonText}>Changer la photo de profil</Text>
              </TouchableOpacity>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nom complet</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Jean Dupont"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="votre.email@exemple.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+33 6 12 34 56 78"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              <TouchableOpacity style={styles.primaryButton} onPress={handleUpdateProfile}>
                <Text style={styles.primaryButtonText}>Enregistrer les modifications</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}

        {/* Section Collaboration et Chat */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>Collaboration et Chat</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Activer la collaboration</Text>
                <Text style={styles.settingDescription}>
                  Permettre à d'autres utilisateurs de collaborer sur vos documents
                </Text>
              </View>
              <Switch
                value={collaborationEnabled}
                onValueChange={setCollaborationEnabled}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>

            <TouchableOpacity style={styles.menuItem}>
              <MessageSquare size={20} color="#1E293B" />
              <Text style={styles.menuItemText}>Ouvrir le chat de collaboration</Text>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Users size={20} color="#1E293B" />
              <Text style={styles.menuItemText}>Gérer les collaborateurs</Text>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Notifications */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Bell size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>Notifications</Text>
          </View>

          <View style={styles.card}>
            <View style={styles.settingRow}>
              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>Notifications activées</Text>
                <Text style={styles.settingDescription}>
                  Recevoir des notifications pour les mises à jour
                </Text>
              </View>
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                trackColor={{ false: '#E2E8F0', true: '#3B82F6' }}
                thumbColor="#FFFFFF"
              />
            </View>
          </View>
        </View>

        {/* Section Préférences */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Globe size={20} color="#1E293B" />
            <Text style={styles.sectionTitle}>Préférences</Text>
          </View>

          <View style={styles.card}>
            <TouchableOpacity style={styles.menuItem}>
              <Globe size={20} color="#1E293B" />
              <Text style={styles.menuItemText}>Langue</Text>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemValue}>Français</Text>
                <ChevronRight size={20} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Shield size={20} color="#1E293B" />
              <Text style={styles.menuItemText}>Confidentialité et sécurité</Text>
              <ChevronRight size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Section Déconnexion (si connecté) */}
        {isLoggedIn ? (
          <View style={styles.section}>
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={styles.logoutButtonText}>Se déconnecter</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        <View style={styles.footer}>
          <Text style={styles.footerText}>DocEdit v1.0.0</Text>
          <Text style={styles.footerSubtext}>© 2025 Tous droits réservés</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#475569',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingVertical: 14,
    marginBottom: 16,
    gap: 8,
  },
  photoButtonText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    gap: 12,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1E293B',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuItemValue: {
    fontSize: 14,
    color: '#64748B',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    borderRadius: 8,
    paddingVertical: 14,
    gap: 8,
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  footer: {
    marginTop: 32,
    marginBottom: 24,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  footerSubtext: {
    fontSize: 12,
    color: '#94A3B8',
  },
});
