import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Download, Camera, Edit3, Plus, X } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function ModernCVTemplate() {
    const params = useLocalSearchParams();
    const [isPreview, setIsPreview] = useState(false);
    
    // État pour les informations personnelles
    const [personalInfo, setPersonalInfo] = useState({
        name: 'Jean Dupont',
        title: 'Développeur Full Stack Senior',
        email: 'jean.dupont@email.com',
        phone: '+33 6 12 34 56 78',
        location: 'Paris, France',
        website: 'www.jeandupont.dev',
        summary: 'Développeur passionné avec plus de 8 ans d\'expérience dans la création d\'applications web et mobiles innovantes. Expert en React, Node.js et architecture cloud.',
        profileImage: null
    });

    // État pour l'expérience professionnelle
    const [experiences, setExperiences] = useState([
        {
            id: '1',
            position: 'Lead Developer',
            company: 'TechCorp Solutions',
            period: '2020 - Présent',
            description: 'Direction d\'une équipe de 5 développeurs. Architecture et développement d\'applications SaaS.',
            achievements: ['Migration vers microservices', 'Réduction des coûts cloud de 40%', 'Mise en place CI/CD']
        },
        {
            id: '2',
            position: 'Développeur Full Stack',
            company: 'StartupXYZ',
            period: '2018 - 2020',
            description: 'Développement de la plateforme principale de l\'entreprise de A à Z.',
            achievements: ['Stack React/Node.js', 'Intégration de 15+ APIs', 'Gestion de 100k+ utilisateurs']
        }
    ]);

    // État pour les compétences
    const [skills, setSkills] = useState({
        technical: ['React/React Native', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'GraphQL', 'MongoDB', 'PostgreSQL'],
        soft: ['Leadership', 'Communication', 'Résolution de problèmes', 'Travail d\'équipe', 'Gestion de projet'],
        languages: [
            { name: 'Français', level: 'Natif' },
            { name: 'Anglais', level: 'Courant' },
            { name: 'Espagnol', level: 'Intermédiaire' }
        ]
    });

    // État pour la formation
    const [education, setEducation] = useState([
        {
            id: '1',
            degree: 'Master en Informatique',
            school: 'Université Paris-Saclay',
            period: '2014 - 2016',
            description: 'Spécialisation en Intelligence Artificielle et Big Data'
        },
        {
            id: '2',
            degree: 'Licence en Informatique',
            school: 'Université Paris Diderot',
            period: '2011 - 2014',
            description: 'Mention Très Bien'
        }
    ]);

    // État pour les certifications
    const [certifications, setCertifications] = useState([
        { id: '1', name: 'AWS Solutions Architect', year: '2022' },
        { id: '2', name: 'Google Cloud Professional', year: '2021' },
        { id: '3', name: 'Certified Scrum Master', year: '2020' }
    ]);

    // Charger les données sauvegardées
    useEffect(() => {
        if (params.savedDocument) {
            try {
                const savedDoc = JSON.parse(params.savedDocument as string);
                if (savedDoc.personalInfo) setPersonalInfo(savedDoc.personalInfo);
                if (savedDoc.experiences) setExperiences(savedDoc.experiences);
                if (savedDoc.skills) setSkills(savedDoc.skills);
                if (savedDoc.education) setEducation(savedDoc.education);
                if (savedDoc.certifications) setCertifications(savedDoc.certifications);
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            }
        }
    }, [params.savedDocument]);

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
                type: 'modern-cv',
                personalInfo,
                experiences,
                skills,
                education,
                certifications,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const existingDocuments = await AsyncStorage.getItem('documents');
            const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
            documents.push(documentData);
            await AsyncStorage.setItem('documents', JSON.stringify(documents));

            Alert.alert('Succès', 'CV sauvegardé avec succès!', [{ text: 'OK' }]);
        } catch (error) {
            Alert.alert('Erreur', 'Impossible de sauvegarder le CV.', [{ text: 'OK' }]);
        }
    };

    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setPersonalInfo({ ...personalInfo, profileImage: result.assets[0].uri });
        }
    };

    const updateExperience = (id, field, value) => {
        setExperiences(prev =>
            prev.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const addExperience = () => {
        const newExp = {
            id: Date.now().toString(),
            position: '',
            company: '',
            period: '',
            description: '',
            achievements: []
        };
        setExperiences([...experiences, newExp]);
    };

    const removeExperience = (id) => {
        setExperiences(experiences.filter(exp => exp.id !== id));
    };

    const updateEducation = (id, field, value) => {
        setEducation(prev =>
            prev.map(edu =>
                edu.id === id ? { ...edu, [field]: value } : edu
            )
        );
    };

    const addEducation = () => {
        const newEdu = {
            id: Date.now().toString(),
            degree: '',
            school: '',
            period: '',
            description: ''
        };
        setEducation([...education, newEdu]);
    };

    if (isPreview) {
        return (
            <SafeAreaView style={styles.container}>
                {/* Header Preview */}
                <View style={styles.previewHeader}>
                    <TouchableOpacity onPress={togglePreview} style={styles.headerButton}>
                        <X size={20} color="#FFFFFF" />
                    </TouchableOpacity>
                    
                    <Text style={styles.previewTitle}>Aperçu du CV</Text>
                    
                    <View style={styles.headerActions}>
                        <TouchableOpacity style={styles.headerButton} onPress={saveDocument}>
                            <Save size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Share size={18} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView style={styles.previewScroll} showsVerticalScrollIndicator={false}>
                    {/* En-tête du CV */}
                    <LinearGradient
                        colors={['#667eea', '#764ba2']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.cvHeader}
                    >
                        <View style={styles.profileSection}>
                            {personalInfo.profileImage ? (
                                <Image source={{ uri: personalInfo.profileImage }} style={styles.profileImage} />
                            ) : (
                                <View style={styles.profileImagePlaceholder}>
                                    <Text style={styles.profileInitials}>
                                        {personalInfo.name.split(' ').map(n => n[0]).join('')}
                                    </Text>
                                </View>
                            )}
                            
                            <View style={styles.profileInfo}>
                                <Text style={styles.cvName}>{personalInfo.name}</Text>
                                <Text style={styles.cvTitle}>{personalInfo.title}</Text>
                                
                                <View style={styles.contactInfo}>
                                    <View style={styles.contactItem}>
                                        <Mail size={14} color="#FFFFFF" />
                                        <Text style={styles.contactText}>{personalInfo.email}</Text>
                                    </View>
                                    <View style={styles.contactItem}>
                                        <Phone size={14} color="#FFFFFF" />
                                        <Text style={styles.contactText}>{personalInfo.phone}</Text>
                                    </View>
                                    <View style={styles.contactItem}>
                                        <MapPin size={14} color="#FFFFFF" />
                                        <Text style={styles.contactText}>{personalInfo.location}</Text>
                                    </View>
                                    {personalInfo.website && (
                                        <View style={styles.contactItem}>
                                            <Globe size={14} color="#FFFFFF" />
                                            <Text style={styles.contactText}>{personalInfo.website}</Text>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    </LinearGradient>

                    {/* Résumé */}
                    <View style={styles.cvSection}>
                        <Text style={styles.sectionTitle}>Profil Professionnel</Text>
                        <Text style={styles.summaryText}>{personalInfo.summary}</Text>
                    </View>

                    {/* Expérience */}
                    <View style={styles.cvSection}>
                        <View style={styles.sectionHeader}>
                            <Briefcase size={20} color="#667eea" />
                            <Text style={styles.sectionTitle}>Expérience Professionnelle</Text>
                        </View>
                        
                        {experiences.map((exp, index) => (
                            <View key={exp.id} style={styles.experienceItem}>
                                <View style={styles.timelineMarker} />
                                <View style={styles.experienceContent}>
                                    <Text style={styles.experiencePosition}>{exp.position}</Text>
                                    <Text style={styles.experienceCompany}>{exp.company}</Text>
                                    <Text style={styles.experiencePeriod}>{exp.period}</Text>
                                    <Text style={styles.experienceDescription}>{exp.description}</Text>
                                    
                                    {exp.achievements && exp.achievements.length > 0 && (
                                        <View style={styles.achievementsList}>
                                            {exp.achievements.map((achievement, i) => (
                                                <Text key={i} style={styles.achievementItem}>• {achievement}</Text>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Compétences */}
                    <View style={styles.cvSection}>
                        <View style={styles.sectionHeader}>
                            <Award size={20} color="#667eea" />
                            <Text style={styles.sectionTitle}>Compétences</Text>
                        </View>
                        
                        <View style={styles.skillsContainer}>
                            <Text style={styles.skillCategory}>Techniques</Text>
                            <View style={styles.skillTags}>
                                {skills.technical.map((skill, index) => (
                                    <View key={index} style={styles.skillTag}>
                                        <Text style={styles.skillTagText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>
                            
                            <Text style={[styles.skillCategory, { marginTop: 16 }]}>Soft Skills</Text>
                            <View style={styles.skillTags}>
                                {skills.soft.map((skill, index) => (
                                    <View key={index} style={[styles.skillTag, styles.softSkillTag]}>
                                        <Text style={styles.skillTagText}>{skill}</Text>
                                    </View>
                                ))}
                            </View>

                            <Text style={[styles.skillCategory, { marginTop: 16 }]}>Langues</Text>
                            {skills.languages.map((lang, index) => (
                                <View key={index} style={styles.languageItem}>
                                    <Text style={styles.languageName}>{lang.name}</Text>
                                    <Text style={styles.languageLevel}>{lang.level}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Formation */}
                    <View style={styles.cvSection}>
                        <View style={styles.sectionHeader}>
                            <GraduationCap size={20} color="#667eea" />
                            <Text style={styles.sectionTitle}>Formation</Text>
                        </View>
                        
                        {education.map((edu) => (
                            <View key={edu.id} style={styles.educationItem}>
                                <Text style={styles.educationDegree}>{edu.degree}</Text>
                                <Text style={styles.educationSchool}>{edu.school}</Text>
                                <Text style={styles.educationPeriod}>{edu.period}</Text>
                                {edu.description && (
                                    <Text style={styles.educationDescription}>{edu.description}</Text>
                                )}
                            </View>
                        ))}
                    </View>

                    {/* Certifications */}
                    {certifications.length > 0 && (
                        <View style={[styles.cvSection, { marginBottom: 40 }]}>
                            <Text style={styles.sectionTitle}>Certifications</Text>
                            <View style={styles.certificationsGrid}>
                                {certifications.map((cert) => (
                                    <View key={cert.id} style={styles.certificationCard}>
                                        <Award size={16} color="#764ba2" />
                                        <Text style={styles.certificationName}>{cert.name}</Text>
                                        <Text style={styles.certificationYear}>{cert.year}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Mode Édition
    return (
        <SafeAreaView style={styles.container}>
            {/* Header Édition */}
            <View style={styles.editorHeader}>
                <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
                    <ArrowLeft size={20} color="#667eea" />
                </TouchableOpacity>
                
                <Text style={styles.editorTitle}>Créer mon CV</Text>
                
                <View style={styles.headerActions}>
                    <TouchableOpacity onPress={togglePreview} style={styles.actionButton}>
                        <Eye size={18} color="#667eea" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveDocument} style={styles.actionButton}>
                        <Save size={18} color="#667eea" />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.editorScroll} showsVerticalScrollIndicator={false}>
                {/* Section Informations Personnelles */}
                <View style={styles.editorSection}>
                    <Text style={styles.editorSectionTitle}>Informations Personnelles</Text>
                    
                    <TouchableOpacity onPress={pickImage} style={styles.imagePickerContainer}>
                        {personalInfo.profileImage ? (
                            <Image source={{ uri: personalInfo.profileImage }} style={styles.pickedImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}>
                                <Camera size={32} color="#667eea" />
                                <Text style={styles.imagePlaceholderText}>Ajouter une photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Nom complet</Text>
                        <TextInput
                            style={styles.input}
                            value={personalInfo.name}
                            onChangeText={(text) => setPersonalInfo({ ...personalInfo, name: text })}
                            placeholder="Jean Dupont"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Titre professionnel</Text>
                        <TextInput
                            style={styles.input}
                            value={personalInfo.title}
                            onChangeText={(text) => setPersonalInfo({ ...personalInfo, title: text })}
                            placeholder="Développeur Full Stack"
                        />
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <TextInput
                                style={styles.input}
                                value={personalInfo.email}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, email: text })}
                                placeholder="email@example.com"
                                keyboardType="email-address"
                            />
                        </View>
                        
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>Téléphone</Text>
                            <TextInput
                                style={styles.input}
                                value={personalInfo.phone}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, phone: text })}
                                placeholder="+33 6 12 34 56 78"
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    <View style={styles.inputRow}>
                        <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                            <Text style={styles.inputLabel}>Localisation</Text>
                            <TextInput
                                style={styles.input}
                                value={personalInfo.location}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, location: text })}
                                placeholder="Paris, France"
                            />
                        </View>
                        
                        <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                            <Text style={styles.inputLabel}>Site web</Text>
                            <TextInput
                                style={styles.input}
                                value={personalInfo.website}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, website: text })}
                                placeholder="www.monsite.com"
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Résumé professionnel</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={personalInfo.summary}
                            onChangeText={(text) => setPersonalInfo({ ...personalInfo, summary: text })}
                            placeholder="Décrivez votre parcours et vos objectifs..."
                            multiline
                            numberOfLines={4}
                        />
                    </View>
                </View>

                {/* Section Expérience */}
                <View style={styles.editorSection}>
                    <View style={styles.sectionHeaderEdit}>
                        <Text style={styles.editorSectionTitle}>Expérience Professionnelle</Text>
                        <TouchableOpacity onPress={addExperience} style={styles.addButton}>
                            <Plus size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {experiences.map((exp) => (
                        <View key={exp.id} style={styles.experienceEditCard}>
                            <TouchableOpacity 
                                onPress={() => removeExperience(exp.id)} 
                                style={styles.removeButton}
                            >
                                <X size={16} color="#FF4444" />
                            </TouchableOpacity>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Poste</Text>
                                <TextInput
                                    style={styles.input}
                                    value={exp.position}
                                    onChangeText={(text) => updateExperience(exp.id, 'position', text)}
                                    placeholder="Titre du poste"
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.inputLabel}>Entreprise</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={exp.company}
                                        onChangeText={(text) => updateExperience(exp.id, 'company', text)}
                                        placeholder="Nom de l'entreprise"
                                    />
                                </View>
                                
                                <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.inputLabel}>Période</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={exp.period}
                                        onChangeText={(text) => updateExperience(exp.id, 'period', text)}
                                        placeholder="2020 - Présent"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Description</Text>
                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    value={exp.description}
                                    onChangeText={(text) => updateExperience(exp.id, 'description', text)}
                                    placeholder="Décrivez vos responsabilités..."
                                    multiline
                                    numberOfLines={3}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Section Compétences */}
                <View style={styles.editorSection}>
                    <Text style={styles.editorSectionTitle}>Compétences</Text>
                    
                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Compétences techniques</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={skills.technical.join(', ')}
                            onChangeText={(text) => setSkills({ 
                                ...skills, 
                                technical: text.split(',').map(s => s.trim()).filter(s => s) 
                            })}
                            placeholder="React, Node.js, TypeScript... (séparez par des virgules)"
                            multiline
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.inputLabel}>Soft Skills</Text>
                        <TextInput
                            style={[styles.input, styles.textArea]}
                            value={skills.soft.join(', ')}
                            onChangeText={(text) => setSkills({ 
                                ...skills, 
                                soft: text.split(',').map(s => s.trim()).filter(s => s) 
                            })}
                            placeholder="Leadership, Communication... (séparez par des virgules)"
                            multiline
                        />
                    </View>
                </View>

                {/* Section Formation */}
                <View style={styles.editorSection}>
                    <View style={styles.sectionHeaderEdit}>
                        <Text style={styles.editorSectionTitle}>Formation</Text>
                        <TouchableOpacity onPress={addEducation} style={styles.addButton}>
                            <Plus size={20} color="#FFFFFF" />
                        </TouchableOpacity>
                    </View>

                    {education.map((edu) => (
                        <View key={edu.id} style={styles.experienceEditCard}>
                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>Diplôme</Text>
                                <TextInput
                                    style={styles.input}
                                    value={edu.degree}
                                    onChangeText={(text) => updateEducation(edu.id, 'degree', text)}
                                    placeholder="Master en Informatique"
                                />
                            </View>

                            <View style={styles.inputGroup}>
                                <Text style={styles.inputLabel}>École/Université</Text>
                                <TextInput
                                    style={styles.input}
                                    value={edu.school}
                                    onChangeText={(text) => updateEducation(edu.id, 'school', text)}
                                    placeholder="Université Paris-Saclay"
                                />
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.inputLabel}>Période</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={edu.period}
                                        onChangeText={(text) => updateEducation(edu.id, 'period', text)}
                                        placeholder="2014 - 2016"
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },

    // Header styles
    previewHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#667eea',
    },
    previewTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
    },
    headerButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    headerActions: {
        flexDirection: 'row',
        gap: 12,
    },

    // Editor Header
    editorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    backButton: {
        padding: 8,
    },
    editorTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    actionButton: {
        padding: 8,
        borderRadius: 8,
        backgroundColor: '#f0f0f0',
    },

    // CV Preview Styles
    previewScroll: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    cvHeader: {
        padding: 30,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    profileImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FFFFFF',
    },
    profileInitials: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    profileInfo: {
        flex: 1,
    },
    cvName: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    cvTitle: {
        fontSize: 18,
        color: '#FFFFFF',
        marginBottom: 16,
        opacity: 0.9,
    },
    contactInfo: {
        gap: 8,
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    contactText: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
    },

    // CV Sections
    cvSection: {
        padding: 24,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#1a1a1a',
    },
    summaryText: {
        fontSize: 16,
        lineHeight: 24,
        color: '#4a4a4a',
    },

    // Experience
    experienceItem: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    timelineMarker: {
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: '#667eea',
        marginTop: 6,
        marginRight: 16,
    },
    experienceContent: {
        flex: 1,
    },
    experiencePosition: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    experienceCompany: {
        fontSize: 16,
        color: '#667eea',
        marginBottom: 4,
    },
    experiencePeriod: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 8,
    },
    experienceDescription: {
        fontSize: 15,
        lineHeight: 22,
        color: '#4a4a4a',
        marginBottom: 8,
    },
    achievementsList: {
        marginTop: 8,
    },
    achievementItem: {
        fontSize: 14,
        lineHeight: 20,
        color: '#4a4a4a',
        marginBottom: 4,
    },

    // Skills
    skillsContainer: {
        marginTop: 8,
    },
    skillCategory: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 12,
    },
    skillTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    skillTag: {
        backgroundColor: '#667eea',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    softSkillTag: {
        backgroundColor: '#764ba2',
    },
    skillTagText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '500',
    },
    languageItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    languageName: {
        fontSize: 15,
        color: '#1a1a1a',
    },
    languageLevel: {
        fontSize: 15,
        color: '#666666',
    },

    // Education
    educationItem: {
        marginBottom: 20,
    },
    educationDegree: {
        fontSize: 17,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 4,
    },
    educationSchool: {
        fontSize: 15,
        color: '#667eea',
        marginBottom: 4,
    },
    educationPeriod: {
        fontSize: 14,
        color: '#666666',
    },
    educationDescription: {
        fontSize: 14,
        color: '#4a4a4a',
        marginTop: 4,
    },

    // Certifications
    certificationsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        marginTop: 16,
    },
    certificationCard: {
        backgroundColor: '#f8f9fa',
        paddingVertical: 16,
        paddingHorizontal: 20,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#e0e0e0',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    certificationName: {
        fontSize: 14,
        fontWeight: '500',
        color: '#1a1a1a',
    },
    certificationYear: {
        fontSize: 12,
        color: '#666666',
    },

    // Editor Styles
    editorScroll: {
        flex: 1,
    },
    editorSection: {
        backgroundColor: '#FFFFFF',
        marginVertical: 8,
        marginHorizontal: 16,
        padding: 20,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
    },
    editorSectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#1a1a1a',
        marginBottom: 20,
    },
    sectionHeaderEdit: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    addButton: {
        backgroundColor: '#667eea',
        width: 32,
        height: 32,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    // Image Picker
    imagePickerContainer: {
        alignSelf: 'center',
        marginBottom: 20,
    },
    pickedImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#667eea',
    },
    imagePlaceholder: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: '#667eea',
        borderStyle: 'dashed',
    },
    imagePlaceholderText: {
        fontSize: 14,
        color: '#667eea',
        marginTop: 8,
    },

    // Input Styles
    inputGroup: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '500',
        color: '#666666',
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        color: '#1a1a1a',
        backgroundColor: '#f8f9fa',
    },
    textArea: {
        minHeight: 100,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },

    // Experience Edit Card
    experienceEditCard: {
        backgroundColor: '#f8f9fa',
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        position: 'relative',
    },
    removeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        padding: 4,
        borderRadius: 4,
        backgroundColor: '#fff',
    },
});