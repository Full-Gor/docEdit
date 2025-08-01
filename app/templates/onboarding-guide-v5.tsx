import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingGuideV5Template() {
    const params = useLocalSearchParams();
    const [title, setTitle] = useState('Guide d\'Accueil');
    const [company, setCompany] = useState('Votre Entreprise');
    const [department, setDepartment] = useState('Ressources Humaines');
    const [date, setDate] = useState('01/01/2024');
    const [introduction, setIntroduction] = useState('Bienvenue dans notre équipe...');
    const [isPreview, setIsPreview] = useState(false);

    // Animation pour les transitions
    const fadeAnim = useRef(new Animated.Value(0)).current;

    // Charger les données sauvegardées
    useEffect(() => {
        if (params.savedDocument) {
            try {
                const savedDoc = JSON.parse(params.savedDocument as string);
                setTitle(savedDoc.title || title);
                setCompany(savedDoc.company || company);
                setDepartment(savedDoc.department || department);
                setDate(savedDoc.date || date);
                setIntroduction(savedDoc.introduction || introduction);
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            }
        }
    }, [params.savedDocument]);

    // Animation de transition
    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    }, [isPreview]);

    const handleGoBack = () => {
        router.back();
    };

    const togglePreview = () => {
        setIsPreview(!isPreview);
    };

    const saveDocument = async () => {
        try {
            const documentData = {
                id: Date.now().toString(),
                type: 'onboarding-guide-v5',
                title,
                company,
                department,
                date,
                introduction,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const existingDocuments = await AsyncStorage.getItem('documents');
            const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
            documents.push(documentData);
            await AsyncStorage.setItem('documents', JSON.stringify(documents));

            Alert.alert('Document Sauvegardé', 'Guide d\'accueil enregistré avec succès.', [{ text: 'OK' }]);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le document.', [{ text: 'OK' }]);
        }
    };

    if (isPreview) {
        return (
            <SafeAreaView style={styles.previewContainer}>
                {/* Header Preview */}
                <View style={styles.previewHeader}>
                    <TouchableOpacity onPress={togglePreview} style={styles.previewBackButton}>
                        <Eye size={20} color="#374151" />
                    </TouchableOpacity>

                    <View style={styles.previewTitle}>
                        <Text style={styles.previewTitleText}>Mode Visualisation</Text>
                    </View>

                    <View style={styles.previewActions}>
                        <TouchableOpacity style={styles.previewActionButton}>
                            <Save size={18} color="#374151" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.previewActionButton}>
                            <Share size={18} color="#374151" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                    {/* Contenu du preview */}
                    <View style={styles.previewContent}>
                        <Text style={styles.previewMainTitle}>{title}</Text>
                        <Text style={styles.previewCompany}>{company}</Text>
                        <Text style={styles.previewDepartment}>Département : {department}</Text>
                        <Text style={styles.previewDate}>Date : {date}</Text>
                        <Text style={styles.previewIntroduction}>{introduction}</Text>

                        {/* Zone pour votre code personnalisé */}
                        <View style={styles.customCodeZone}>
                            <Text style={styles.customCodeTitle}>Zone pour votre code personnalisé</Text>
                            <Text style={styles.customCodeDescription}>
                                Intégrez ici votre code personnalisé pour le guide d'accueil v5
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Mode Édition
    return (
        <SafeAreaView style={styles.editorContainer}>
            {/* Header de l'éditeur */}
            <LinearGradient
                colors={['#8B5CF6', '#7C3AED']}
                style={styles.editorHeader}
            >
                <TouchableOpacity onPress={handleGoBack} style={styles.headerButton}>
                    <ArrowLeft size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <View style={styles.headerCenter}>
                    <Text style={styles.headerTitle}>Guide d'Accueil V5</Text>
                </View>

                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={togglePreview} style={styles.headerButton}>
                        <Eye size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveDocument} style={styles.headerButton}>
                        <Save size={18} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>
            </LinearGradient>

            <ScrollView style={styles.editorScroll} showsVerticalScrollIndicator={false}>
                {/* Informations de base */}
                <View style={styles.basicInfoSection}>
                    <Text style={styles.sectionTitle}>Informations de Base</Text>

                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Titre du Guide</Text>
                        <TextInput
                            style={styles.professionalInput}
                            value={title}
                            onChangeText={setTitle}
                            placeholder="Titre du guide d'accueil..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Entreprise</Text>
                        <TextInput
                            style={styles.professionalInput}
                            value={company}
                            onChangeText={setCompany}
                            placeholder="Nom de l'entreprise..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Département</Text>
                        <TextInput
                            style={styles.professionalInput}
                            value={department}
                            onChangeText={setDepartment}
                            placeholder="Département responsable..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Date</Text>
                        <TextInput
                            style={styles.professionalInput}
                            value={date}
                            onChangeText={setDate}
                            placeholder="Date du guide..."
                            placeholderTextColor="#9CA3AF"
                        />
                    </View>

                    <View style={styles.inputField}>
                        <Text style={styles.inputLabel}>Introduction</Text>
                        <TextInput
                            style={[styles.professionalInput, styles.textArea]}
                            value={introduction}
                            onChangeText={setIntroduction}
                            placeholder="Message de bienvenue..."
                            placeholderTextColor="#9CA3AF"
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Zone pour code personnalisé */}
                <View style={styles.customCodeSection}>
                    <Text style={styles.sectionTitle}>Zone pour Code Personnalisé</Text>
                    <View style={styles.customCodeContainer}>
                        <Text style={styles.customCodeText}>
                            Intégrez ici votre code personnalisé pour le guide d'accueil v5.
                            {'\n\n'}Cette zone est réservée pour votre développement spécifique.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Conteneurs principaux
    editorContainer: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },

    // Header de l'éditeur
    editorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
    },
    headerButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerCenter: {
        flex: 1,
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },

    editorScroll: {
        flex: 1,
    },

    // Section informations de base
    basicInfoSection: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#1F2937',
        marginBottom: 20,
    },
    inputField: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#374151',
        marginBottom: 8,
    },
    professionalInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D1D5DB',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1F2937',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },

    // Zone code personnalisé
    customCodeSection: {
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    customCodeContainer: {
        backgroundColor: '#FEF3C7',
        borderRadius: 12,
        padding: 20,
        borderWidth: 2,
        borderColor: '#F59E0B',
        borderStyle: 'dashed',
    },
    customCodeText: {
        fontSize: 14,
        color: '#92400E',
        lineHeight: 20,
        textAlign: 'center',
    },

    // MODE PREVIEW
    previewContainer: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },

    // Header Preview
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    previewBackButton: {
        padding: 8,
    },
    previewTitle: {
        flex: 1,
        alignItems: 'center',
    },
    previewTitleText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#374151',
    },
    previewActions: {
        flexDirection: 'row',
        gap: 12,
    },
    previewActionButton: {
        width: 36,
        height: 36,
        borderRadius: 8,
        backgroundColor: '#F3F4F6',
        justifyContent: 'center',
        alignItems: 'center',
    },

    previewScroll: {
        flex: 1,
    },

    // Contenu Preview
    previewContent: {
        padding: 32,
    },
    previewMainTitle: {
        fontSize: 32,
        fontWeight: '800',
        color: '#1F2937',
        textAlign: 'center',
        marginBottom: 16,
    },
    previewCompany: {
        fontSize: 18,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 8,
    },
    previewDepartment: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 4,
    },
    previewDate: {
        fontSize: 14,
        color: '#6B7280',
        textAlign: 'center',
        marginBottom: 32,
    },
    previewIntroduction: {
        fontSize: 16,
        lineHeight: 24,
        color: '#374151',
        marginBottom: 40,
    },

    // Zone code personnalisé Preview
    customCodeZone: {
        backgroundColor: '#FEF3C7',
        borderRadius: 16,
        padding: 24,
        borderWidth: 2,
        borderColor: '#F59E0B',
        borderStyle: 'dashed',
        alignItems: 'center',
    },
    customCodeTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#92400E',
        marginBottom: 12,
    },
    customCodeDescription: {
        fontSize: 14,
        color: '#92400E',
        textAlign: 'center',
        lineHeight: 20,
    },
}); 