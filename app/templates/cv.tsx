import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, Mail, Phone, MapPin, Briefcase, GraduationCap, Award, Globe, Download, Camera, Edit3, Plus, X, Grid, Ruler, Compass, Square, Circle, Triangle, Hash, Cpu, Database, Code, Terminal, FileText, Layers, Package, Tool, Settings, Zap } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';

const { width, height } = Dimensions.get('window');

export default function BlueprintCVTemplate() {
    const params = useLocalSearchParams();
    const [isPreview, setIsPreview] = useState(false);
    
    // État pour les informations personnelles
    const [personalInfo, setPersonalInfo] = useState({
        name: 'ALEXANDRE MARTIN',
        title: 'ARCHITECTE LOGICIEL',
        email: 'a.martin@blueprint.io',
        phone: '+33.6.42.78.90.12',
        location: 'PARIS.FR.EU',
        website: 'blueprint.martin.io',
        summary: 'Conception et construction de systèmes distribués haute performance. Spécialiste en architecture microservices et solutions cloud-native.',
        profileImage: null,
        projectCode: 'CV-2024-AM-001',
        version: 'v2.4.7'
    });

    // État pour l'expérience avec structure technique
    const [experiences, setExperiences] = useState([
        {
            id: '1',
            position: 'LEAD ARCHITECT',
            company: 'TECHFORGE SYSTEMS',
            period: '2020→NOW',
            specs: {
                team: '12 DEV',
                stack: 'K8S/GO/RUST',
                scale: '10M REQ/DAY'
            },
            blueprints: [
                { id: 'bp1', name: 'MICROSERVICES MESH', status: 'DEPLOYED' },
                { id: 'bp2', name: 'EVENT-DRIVEN ARCH', status: 'STABLE' },
                { id: 'bp3', name: 'ZERO-DOWNTIME CD', status: 'ACTIVE' }
            ]
        },
        {
            id: '2',
            position: 'SR. ENGINEER',
            company: 'DATAPIPE CORP',
            period: '2018→2020',
            specs: {
                team: '5 DEV',
                stack: 'PYTHON/KAFKA',
                scale: '1TB/HOUR'
            },
            blueprints: [
                { id: 'bp4', name: 'STREAM PROCESSOR', status: 'LEGACY' },
                { id: 'bp5', name: 'ML PIPELINE', status: 'ARCHIVED' }
            ]
        }
    ]);

    // Compétences techniques en modules
    const [technicalModules, setTechnicalModules] = useState([
        {
            id: 'core',
            name: 'CORE SYSTEMS',
            version: '8.2',
            components: ['Distributed Systems', 'System Design', 'Performance Optimization', 'Scalability']
        },
        {
            id: 'lang',
            name: 'LANGUAGES',
            version: '11.0',
            components: ['Go', 'Rust', 'Python', 'TypeScript', 'C++']
        },
        {
            id: 'infra',
            name: 'INFRASTRUCTURE',
            version: '5.7',
            components: ['Kubernetes', 'Docker', 'Terraform', 'AWS/GCP', 'Service Mesh']
        },
        {
            id: 'data',
            name: 'DATA LAYER',
            version: '3.4',
            components: ['PostgreSQL', 'Redis', 'Elasticsearch', 'Kafka', 'Cassandra']
        }
    ]);

    // Certifications comme badges techniques
    const [certifications, setCertifications] = useState([
        { id: '1', code: 'AWS-SAP', name: 'Solutions Architect Pro', issuer: 'AWS', year: '2023' },
        { id: '2', code: 'CKA', name: 'Kubernetes Admin', issuer: 'CNCF', year: '2022' },
        { id: '3', code: 'GCP-ACE', name: 'Cloud Engineer', issuer: 'Google', year: '2022' }
    ]);

    // Formation comme versions
    const [education, setEducation] = useState([
        {
            id: '1',
            degree: 'M.ENG COMPUTER SCIENCE',
            school: 'POLYTECH PARIS',
            period: '2014-2016',
            specs: 'Distributed Systems & AI'
        },
        {
            id: '2',
            degree: 'B.SC ENGINEERING',
            school: 'UNIVERSITÉ TECH',
            period: '2011-2014',
            specs: 'Software Engineering'
        }
    ]);

    // Charger les données sauvegardées
    useEffect(() => {
        if (params.savedDocument) {
            try {
                const savedDoc = JSON.parse(params.savedDocument as string);
                if (savedDoc.personalInfo) setPersonalInfo(savedDoc.personalInfo);
                if (savedDoc.experiences) setExperiences(savedDoc.experiences);
                if (savedDoc.technicalModules) setTechnicalModules(savedDoc.technicalModules);
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
                type: 'blueprint-cv',
                personalInfo,
                experiences,
                technicalModules,
                education,
                certifications,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const existingDocuments = await AsyncStorage.getItem('documents');
            const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
            documents.push(documentData);
            await AsyncStorage.setItem('documents', JSON.stringify(documents));

            Alert.alert('Blueprint Saved', 'Document archived in system.', [{ text: 'OK' }]);
        } catch (error) {
            Alert.alert('Error', 'Failed to save blueprint.', [{ text: 'OK' }]);
        }
    };

    const updateExperience = (id, field, value) => {
        setExperiences(prev =>
            prev.map(exp =>
                exp.id === id ? { ...exp, [field]: value } : exp
            )
        );
    };

    const updateModule = (id, field, value) => {
        setTechnicalModules(prev =>
            prev.map(module =>
                module.id === id ? { ...module, [field]: value } : module
            )
        );
    };

    if (isPreview) {
        return (
            <SafeAreaView style={styles.blueprintContainer}>
                {/* Blueprint Header */}
                <View style={styles.blueprintHeader}>
                    <View style={styles.blueprintControls}>
                        <TouchableOpacity onPress={togglePreview} style={styles.controlButton}>
                            <X size={16} color="#0A66C2" strokeWidth={2} />
                        </TouchableOpacity>
                        
                        <View style={styles.blueprintMeta}>
                            <Text style={styles.blueprintCode}>{personalInfo.projectCode}</Text>
                            <Text style={styles.blueprintVersion}>{personalInfo.version}</Text>
                        </View>
                        
                        <View style={styles.controlsRight}>
                            <TouchableOpacity style={styles.controlButton}>
                                <Grid size={16} color="#0A66C2" strokeWidth={2} />
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.controlButton}>
                                <Layers size={16} color="#0A66C2" strokeWidth={2} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <ScrollView style={styles.blueprintScroll} showsVerticalScrollIndicator={false}>
                    {/* Grid Background */}
                    <View style={styles.gridBackground}>
                        {[...Array(50)].map((_, i) => (
                            <View key={i} style={styles.gridLine} />
                        ))}
                    </View>

                    {/* Title Block - Technical Drawing Style */}
                    <View style={styles.titleBlock}>
                        <View style={styles.titleFrame}>
                            <View style={styles.cornerMarker} />
                            <View style={[styles.cornerMarker, styles.cornerTR]} />
                            <View style={[styles.cornerMarker, styles.cornerBL]} />
                            <View style={[styles.cornerMarker, styles.cornerBR]} />
                            
                            <Text style={styles.blueprintName}>{personalInfo.name}</Text>
                            <Text style={styles.blueprintTitle}>{personalInfo.title}</Text>
                            
                            <View style={styles.specLine} />
                            
                            <View style={styles.contactGrid}>
                                <View style={styles.contactModule}>
                                    <Square size={12} color="#0A66C2" strokeWidth={2} />
                                    <Text style={styles.contactLabel}>{personalInfo.email}</Text>
                                </View>
                                <View style={styles.contactModule}>
                                    <Triangle size={12} color="#0A66C2" strokeWidth={2} />
                                    <Text style={styles.contactLabel}>{personalInfo.phone}</Text>
                                </View>
                                <View style={styles.contactModule}>
                                    <Circle size={12} color="#0A66C2" strokeWidth={2} />
                                    <Text style={styles.contactLabel}>{personalInfo.location}</Text>
                                </View>
                                <View style={styles.contactModule}>
                                    <Hash size={12} color="#0A66C2" strokeWidth={2} />
                                    <Text style={styles.contactLabel}>{personalInfo.website}</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    {/* System Overview */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>01</Text>
                            </View>
                            <Text style={styles.sectionTitle}>SYSTEM OVERVIEW</Text>
                            <View style={styles.sectionLine} />
                        </View>
                        
                        <View style={styles.overviewBox}>
                            <Text style={styles.overviewText}>{personalInfo.summary}</Text>
                            <View style={styles.dimensionMarks}>
                                <Text style={styles.dimension}>↔ FULL STACK</Text>
                                <Text style={styles.dimension}>↕ 8+ YEARS</Text>
                            </View>
                        </View>
                    </View>

                    {/* Experience Architecture */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>02</Text>
                            </View>
                            <Text style={styles.sectionTitle}>DEPLOYMENT HISTORY</Text>
                            <View style={styles.sectionLine} />
                        </View>

                        {experiences.map((exp, index) => (
                            <View key={exp.id} style={styles.deploymentBlock}>
                                <View style={styles.deploymentHeader}>
                                    <View style={styles.deploymentId}>
                                        <Text style={styles.deploymentIdText}>EXP.{index + 1}</Text>
                                    </View>
                                    <View style={styles.deploymentInfo}>
                                        <Text style={styles.deploymentRole}>{exp.position}</Text>
                                        <Text style={styles.deploymentCompany}>{exp.company}</Text>
                                    </View>
                                    <Text style={styles.deploymentPeriod}>{exp.period}</Text>
                                </View>
                                
                                <View style={styles.specsGrid}>
                                    <View style={styles.specItem}>
                                        <Text style={styles.specLabel}>TEAM</Text>
                                        <Text style={styles.specValue}>{exp.specs.team}</Text>
                                    </View>
                                    <View style={styles.specItem}>
                                        <Text style={styles.specLabel}>STACK</Text>
                                        <Text style={styles.specValue}>{exp.specs.stack}</Text>
                                    </View>
                                    <View style={styles.specItem}>
                                        <Text style={styles.specLabel}>SCALE</Text>
                                        <Text style={styles.specValue}>{exp.specs.scale}</Text>
                                    </View>
                                </View>
                                
                                <View style={styles.blueprintsList}>
                                    {exp.blueprints.map((bp) => (
                                        <View key={bp.id} style={styles.blueprintItem}>
                                            <FileText size={14} color="#0A66C2" strokeWidth={2} />
                                            <Text style={styles.blueprintItemName}>{bp.name}</Text>
                                            <View style={[styles.statusIndicator, styles[`status${bp.status}`]]} />
                                        </View>
                                    ))}
                                </View>
                            </View>
                        ))}
                    </View>

                    {/* Technical Modules */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>03</Text>
                            </View>
                            <Text style={styles.sectionTitle}>TECHNICAL MODULES</Text>
                            <View style={styles.sectionLine} />
                        </View>

                        <View style={styles.modulesGrid}>
                            {technicalModules.map((module) => (
                                <View key={module.id} style={styles.moduleCard}>
                                    <View style={styles.moduleHeader}>
                                        <Cpu size={16} color="#0A66C2" strokeWidth={2} />
                                        <Text style={styles.moduleName}>{module.name}</Text>
                                        <Text style={styles.moduleVersion}>v{module.version}</Text>
                                    </View>
                                    <View style={styles.moduleComponents}>
                                        {module.components.map((comp, i) => (
                                            <Text key={i} style={styles.componentText}>• {comp}</Text>
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Education Timeline */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>04</Text>
                            </View>
                            <Text style={styles.sectionTitle}>BUILD PIPELINE</Text>
                            <View style={styles.sectionLine} />
                        </View>

                        <View style={styles.pipelineContainer}>
                            {education.map((edu, index) => (
                                <View key={edu.id} style={styles.pipelineStage}>
                                    <View style={styles.pipelineNode}>
                                        <Text style={styles.nodeNumber}>{index + 1}</Text>
                                    </View>
                                    {index < education.length - 1 && <View style={styles.pipelineConnector} />}
                                    <View style={styles.pipelineInfo}>
                                        <Text style={styles.pipelineDegree}>{edu.degree}</Text>
                                        <Text style={styles.pipelineSchool}>{edu.school}</Text>
                                        <Text style={styles.pipelinePeriod}>{edu.period}</Text>
                                        <Text style={styles.pipelineSpecs}>[{edu.specs}]</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Certifications */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <View style={styles.sectionNumber}>
                                <Text style={styles.sectionNumberText}>05</Text>
                            </View>
                            <Text style={styles.sectionTitle}>VERIFIED MODULES</Text>
                            <View style={styles.sectionLine} />
                        </View>

                        <View style={styles.certGrid}>
                            {certifications.map((cert) => (
                                <View key={cert.id} style={styles.certBadge}>
                                    <View style={styles.certHeader}>
                                        <Award size={14} color="#0A66C2" strokeWidth={2} />
                                        <Text style={styles.certCode}>{cert.code}</Text>
                                    </View>
                                    <Text style={styles.certName}>{cert.name}</Text>
                                    <View style={styles.certMeta}>
                                        <Text style={styles.certIssuer}>{cert.issuer}</Text>
                                        <Text style={styles.certYear}>{cert.year}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Footer Signature */}
                    <View style={styles.blueprintFooter}>
                        <View style={styles.signatureBlock}>
                            <Text style={styles.signatureLabel}>ARCHITECT SIGNATURE</Text>
                            <View style={styles.signatureLine} />
                            <Text style={styles.signatureDate}>DATE: {new Date().toISOString().split('T')[0]}</Text>
                        </View>
                        <View style={styles.stampBlock}>
                            <View style={styles.stamp}>
                                <Text style={styles.stampText}>CERTIFIED</Text>
                                <Text style={styles.stampText}>BLUEPRINT</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Mode Édition
    return (
        <SafeAreaView style={styles.editorContainer}>
            {/* Editor Header */}
            <View style={styles.editorHeader}>
                <TouchableOpacity onPress={handleGoBack} style={styles.editorControl}>
                    <ArrowLeft size={20} color="#0A66C2" strokeWidth={2} />
                </TouchableOpacity>
                
                <View style={styles.editorTitleBlock}>
                    <Tool size={20} color="#0A66C2" strokeWidth={2} />
                    <Text style={styles.editorTitle}>BLUEPRINT EDITOR</Text>
                </View>
                
                <View style={styles.editorActions}>
                    <TouchableOpacity onPress={togglePreview} style={styles.editorControl}>
                        <Eye size={18} color="#0A66C2" strokeWidth={2} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveDocument} style={styles.editorControl}>
                        <Save size={18} color="#0A66C2" strokeWidth={2} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.editorScroll} showsVerticalScrollIndicator={false}>
                {/* Personal Info Section */}
                <View style={styles.editorSection}>
                    <View style={styles.editorSectionHeader}>
                        <Square size={16} color="#0A66C2" strokeWidth={2} />
                        <Text style={styles.editorSectionTitle}>IDENTIFICATION MODULE</Text>
                    </View>

                    <View style={styles.inputGrid}>
                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>NAME</Text>
                            <TextInput
                                style={styles.blueprintInput}
                                value={personalInfo.name}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, name: text })}
                                placeholder="FULL NAME"
                                placeholderTextColor="#7CA5C7"
                            />
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>TITLE</Text>
                            <TextInput
                                style={styles.blueprintInput}
                                value={personalInfo.title}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, title: text })}
                                placeholder="PROFESSIONAL TITLE"
                                placeholderTextColor="#7CA5C7"
                            />
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputBlock, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>PROJECT CODE</Text>
                                <TextInput
                                    style={styles.blueprintInput}
                                    value={personalInfo.projectCode}
                                    onChangeText={(text) => setPersonalInfo({ ...personalInfo, projectCode: text })}
                                    placeholder="CV-YYYY-XX-000"
                                    placeholderTextColor="#7CA5C7"
                                />
                            </View>
                            
                            <View style={[styles.inputBlock, { flex: 0.5, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>VERSION</Text>
                                <TextInput
                                    style={styles.blueprintInput}
                                    value={personalInfo.version}
                                    onChangeText={(text) => setPersonalInfo({ ...personalInfo, version: text })}
                                    placeholder="v0.0.0"
                                    placeholderTextColor="#7CA5C7"
                                />
                            </View>
                        </View>

                        <View style={styles.inputRow}>
                            <View style={[styles.inputBlock, { flex: 1, marginRight: 8 }]}>
                                <Text style={styles.inputLabel}>EMAIL</Text>
                                <TextInput
                                    style={styles.blueprintInput}
                                    value={personalInfo.email}
                                    onChangeText={(text) => setPersonalInfo({ ...personalInfo, email: text })}
                                    placeholder="email@domain.io"
                                    placeholderTextColor="#7CA5C7"
                                    keyboardType="email-address"
                                />
                            </View>
                            
                            <View style={[styles.inputBlock, { flex: 1, marginLeft: 8 }]}>
                                <Text style={styles.inputLabel}>PHONE</Text>
                                <TextInput
                                    style={styles.blueprintInput}
                                    value={personalInfo.phone}
                                    onChangeText={(text) => setPersonalInfo({ ...personalInfo, phone: text })}
                                    placeholder="+00.0.00.00.00.00"
                                    placeholderTextColor="#7CA5C7"
                                    keyboardType="phone-pad"
                                />
                            </View>
                        </View>

                        <View style={styles.inputBlock}>
                            <Text style={styles.inputLabel}>SYSTEM OVERVIEW</Text>
                            <TextInput
                                style={[styles.blueprintInput, styles.blueprintTextArea]}
                                value={personalInfo.summary}
                                onChangeText={(text) => setPersonalInfo({ ...personalInfo, summary: text })}
                                placeholder="Technical summary..."
                                placeholderTextColor="#7CA5C7"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>
                </View>

                {/* Experience Section */}
                <View style={styles.editorSection}>
                    <View style={styles.editorSectionHeader}>
                        <Database size={16} color="#0A66C2" strokeWidth={2} />
                        <Text style={styles.editorSectionTitle}>DEPLOYMENT RECORDS</Text>
                        <TouchableOpacity style={styles.addModuleButton}>
                            <Plus size={16} color="#FFFFFF" strokeWidth={2} />
                        </TouchableOpacity>
                    </View>

                    {experiences.map((exp, index) => (
                        <View key={exp.id} style={styles.deploymentEditor}>
                            <View style={styles.deploymentEditorHeader}>
                                <Text style={styles.deploymentEditorId}>EXP.{index + 1}</Text>
                                <TouchableOpacity style={styles.removeButton}>
                                    <X size={14} color="#E74C3C" strokeWidth={2} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputBlock, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.inputLabel}>POSITION</Text>
                                    <TextInput
                                        style={styles.blueprintInput}
                                        value={exp.position}
                                        onChangeText={(text) => updateExperience(exp.id, 'position', text)}
                                        placeholder="ROLE TITLE"
                                        placeholderTextColor="#7CA5C7"
                                    />
                                </View>
                                
                                <View style={[styles.inputBlock, { flex: 1, marginLeft: 8 }]}>
                                    <Text style={styles.inputLabel}>COMPANY</Text>
                                    <TextInput
                                        style={styles.blueprintInput}
                                        value={exp.company}
                                        onChangeText={(text) => updateExperience(exp.id, 'company', text)}
                                        placeholder="ORGANIZATION"
                                        placeholderTextColor="#7CA5C7"
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={[styles.inputBlock, { flex: 1, marginRight: 8 }]}>
                                    <Text style={styles.inputLabel}>PERIOD</Text>
                                    <TextInput
                                        style={styles.blueprintInput}
                                        value={exp.period}
                                        onChangeText={(text) => updateExperience(exp.id, 'period', text)}
                                        placeholder="YYYY→YYYY"
                                        placeholderTextColor="#7CA5C7"
                                    />
                                </View>
                            </View>
                        </View>
                    ))}
                </View>

                {/* Technical Modules Section */}
                <View style={styles.editorSection}>
                    <View style={styles.editorSectionHeader}>
                        <Cpu size={16} color="#0A66C2" strokeWidth={2} />
                        <Text style={styles.editorSectionTitle}>TECHNICAL MODULES</Text>
                    </View>

                    {technicalModules.map((module) => (
                        <View key={module.id} style={styles.moduleEditor}>
                            <View style={styles.moduleEditorHeader}>
                                <Text style={styles.moduleEditorName}>{module.name}</Text>
                                <TextInput
                                    style={styles.versionInput}
                                    value={module.version}
                                    onChangeText={(text) => updateModule(module.id, 'version', text)}
                                    placeholder="0.0"
                                    placeholderTextColor="#7CA5C7"
                                />
                            </View>
                            <TextInput
                                style={[styles.blueprintInput, styles.blueprintTextArea]}
                                value={module.components.join(', ')}
                                onChangeText={(text) => updateModule(module.id, 'components', text.split(',').map(s => s.trim()).filter(s => s))}
                                placeholder="Component, Component, Component..."
                                placeholderTextColor="#7CA5C7"
                                multiline
                            />
                        </View>
                    ))}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Blueprint Container
    blueprintContainer: {
        flex: 1,
        backgroundColor: '#F0F6FB',
    },
    
    // Blueprint Header
    blueprintHeader: {
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: '#0A66C2',
    },
    blueprintControls: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    controlButton: {
        width: 32,
        height: 32,
        borderWidth: 1,
        borderColor: '#0A66C2',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    blueprintMeta: {
        alignItems: 'center',
    },
    blueprintCode: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    blueprintVersion: {
        fontSize: 8,
        color: '#7CA5C7',
        letterSpacing: 0.5,
    },
    controlsRight: {
        flexDirection: 'row',
        gap: 8,
    },
    
    blueprintScroll: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    
    // Grid Background
    gridBackground: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.03,
    },
    gridLine: {
        height: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#0A66C2',
    },
    
    // Title Block
    titleBlock: {
        margin: 24,
        marginTop: 32,
    },
    titleFrame: {
        borderWidth: 2,
        borderColor: '#0A66C2',
        padding: 32,
        position: 'relative',
        backgroundColor: '#FFFFFF',
    },
    cornerMarker: {
        position: 'absolute',
        width: 12,
        height: 12,
        borderLeftWidth: 2,
        borderTopWidth: 2,
        borderColor: '#0A66C2',
        top: -2,
        left: -2,
    },
    cornerTR: {
        left: 'auto',
        right: -2,
        transform: [{ rotate: '90deg' }],
    },
    cornerBL: {
        top: 'auto',
        bottom: -2,
        transform: [{ rotate: '-90deg' }],
    },
    cornerBR: {
        top: 'auto',
        bottom: -2,
        left: 'auto',
        right: -2,
        transform: [{ rotate: '180deg' }],
    },
    blueprintName: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 2,
        marginBottom: 8,
    },
    blueprintTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#7CA5C7',
        letterSpacing: 4,
        marginBottom: 16,
    },
    specLine: {
        height: 1,
        backgroundColor: '#0A66C2',
        marginVertical: 16,
        opacity: 0.3,
    },
    contactGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    contactModule: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '48%',
    },
    contactLabel: {
        fontSize: 11,
        color: '#0A66C2',
        letterSpacing: 0.5,
        fontWeight: '600',
    },
    
    // Sections
    section: {
        marginHorizontal: 24,
        marginBottom: 32,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionNumber: {
        width: 32,
        height: 32,
        borderWidth: 2,
        borderColor: '#0A66C2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    sectionNumberText: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0A66C2',
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 2,
    },
    sectionLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#0A66C2',
        marginLeft: 12,
    },
    
    // Overview
    overviewBox: {
        borderWidth: 1,
        borderColor: '#0A66C2',
        borderStyle: 'dashed',
        padding: 20,
        backgroundColor: '#F8FBFD',
    },
    overviewText: {
        fontSize: 14,
        lineHeight: 22,
        color: '#0A66C2',
        fontWeight: '500',
    },
    dimensionMarks: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    dimension: {
        fontSize: 10,
        color: '#7CA5C7',
        letterSpacing: 1,
        fontWeight: '700',
    },
    
    // Deployment Block
    deploymentBlock: {
        borderWidth: 2,
        borderColor: '#0A66C2',
        marginBottom: 16,
        backgroundColor: '#FFFFFF',
    },
    deploymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#0A66C2',
        padding: 16,
    },
    deploymentId: {
        width: 48,
        height: 48,
        backgroundColor: '#0A66C2',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    deploymentIdText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    deploymentInfo: {
        flex: 1,
    },
    deploymentRole: {
        fontSize: 16,
        fontWeight: '800',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    deploymentCompany: {
        fontSize: 12,
        color: '#7CA5C7',
        fontWeight: '600',
        letterSpacing: 0.5,
    },
    deploymentPeriod: {
        fontSize: 12,
        fontWeight: '700',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    specsGrid: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#E8F2F9',
    },
    specItem: {
        flex: 1,
        padding: 12,
        borderRightWidth: 1,
        borderRightColor: '#E8F2F9',
        alignItems: 'center',
    },
    specLabel: {
        fontSize: 9,
        fontWeight: '700',
        color: '#7CA5C7',
        letterSpacing: 1,
        marginBottom: 4,
    },
    specValue: {
        fontSize: 11,
        fontWeight: '700',
        color: '#0A66C2',
    },
    blueprintsList: {
        padding: 16,
    },
    blueprintItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#F8FBFD',
        borderWidth: 1,
        borderColor: '#E8F2F9',
    },
    blueprintItemName: {
        flex: 1,
        fontSize: 12,
        fontWeight: '600',
        color: '#0A66C2',
        marginLeft: 8,
        letterSpacing: 0.5,
    },
    statusIndicator: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    statusDEPLOYED: {
        backgroundColor: '#27AE60',
    },
    statusSTABLE: {
        backgroundColor: '#F39C12',
    },
    statusACTIVE: {
        backgroundColor: '#3498DB',
    },
    statusLEGACY: {
        backgroundColor: '#95A5A6',
    },
    statusARCHIVED: {
        backgroundColor: '#BDC3C7',
    },
    
    // Technical Modules
    modulesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
    },
    moduleCard: {
        width: (width - 64) / 2,
        borderWidth: 2,
        borderColor: '#0A66C2',
        backgroundColor: '#FFFFFF',
    },
    moduleHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: '#0A66C2',
        gap: 8,
    },
    moduleName: {
        flex: 1,
        fontSize: 11,
        fontWeight: '800',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    moduleVersion: {
        fontSize: 10,
        color: '#FFFFFF',
        fontWeight: '600',
    },
    moduleComponents: {
        padding: 12,
    },
    componentText: {
        fontSize: 11,
        color: '#0A66C2',
        marginBottom: 4,
        fontWeight: '500',
    },
    
    // Pipeline
    pipelineContainer: {
        paddingLeft: 32,
    },
    pipelineStage: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 24,
        position: 'relative',
    },
    pipelineNode: {
        width: 32,
        height: 32,
        borderWidth: 2,
        borderColor: '#0A66C2',
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
        zIndex: 1,
    },
    nodeNumber: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0A66C2',
    },
    pipelineConnector: {
        position: 'absolute',
        left: 15,
        top: 32,
        width: 2,
        height: 48,
        backgroundColor: '#0A66C2',
    },
    pipelineInfo: {
        flex: 1,
        borderLeftWidth: 2,
        borderLeftColor: '#E8F2F9',
        paddingLeft: 16,
    },
    pipelineDegree: {
        fontSize: 14,
        fontWeight: '800',
        color: '#0A66C2',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    pipelineSchool: {
        fontSize: 12,
        fontWeight: '600',
        color: '#7CA5C7',
        marginBottom: 4,
    },
    pipelinePeriod: {
        fontSize: 11,
        color: '#0A66C2',
        fontWeight: '700',
        marginBottom: 4,
    },
    pipelineSpecs: {
        fontSize: 10,
        color: '#7CA5C7',
        fontStyle: 'italic',
    },
    
    // Certifications
    certGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    certBadge: {
        borderWidth: 2,
        borderColor: '#0A66C2',
        padding: 16,
        width: (width - 72) / 3,
        backgroundColor: '#FFFFFF',
    },
    certHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 8,
    },
    certCode: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    certName: {
        fontSize: 11,
        fontWeight: '600',
        color: '#0A66C2',
        marginBottom: 8,
    },
    certMeta: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    certIssuer: {
        fontSize: 9,
        color: '#7CA5C7',
        fontWeight: '700',
    },
    certYear: {
        fontSize: 9,
        color: '#7CA5C7',
        fontWeight: '700',
    },
    
    // Footer
    blueprintFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 24,
        marginTop: 32,
        borderTopWidth: 2,
        borderTopColor: '#0A66C2',
    },
    signatureBlock: {
        flex: 1,
    },
    signatureLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#7CA5C7',
        letterSpacing: 1,
        marginBottom: 8,
    },
    signatureLine: {
        height: 1,
        backgroundColor: '#0A66C2',
        marginBottom: 8,
        width: 150,
    },
    signatureDate: {
        fontSize: 9,
        color: '#7CA5C7',
        letterSpacing: 0.5,
    },
    stampBlock: {
        justifyContent: 'center',
    },
    stamp: {
        width: 80,
        height: 80,
        borderWidth: 3,
        borderColor: '#0A66C2',
        borderRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
        transform: [{ rotate: '-15deg' }],
    },
    stampText: {
        fontSize: 10,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    
    // Editor Styles
    editorContainer: {
        flex: 1,
        backgroundColor: '#F0F6FB',
    },
    editorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 2,
        borderBottomColor: '#0A66C2',
    },
    editorControl: {
        width: 36,
        height: 36,
        borderWidth: 1,
        borderColor: '#0A66C2',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
    },
    editorTitleBlock: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    editorTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 2,
    },
    editorActions: {
        flexDirection: 'row',
        gap: 8,
    },
    
    editorScroll: {
        flex: 1,
    },
    
    editorSection: {
        backgroundColor: '#FFFFFF',
        margin: 16,
        borderWidth: 2,
        borderColor: '#0A66C2',
    },
    editorSectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#0A66C2',
        gap: 12,
    },
    editorSectionTitle: {
        flex: 1,
        fontSize: 12,
        fontWeight: '900',
        color: '#FFFFFF',
        letterSpacing: 1,
    },
    addModuleButton: {
        width: 24,
        height: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    
    inputGrid: {
        padding: 20,
    },
    inputBlock: {
        marginBottom: 16,
    },
    inputLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#0A66C2',
        letterSpacing: 1,
        marginBottom: 6,
    },
    blueprintInput: {
        borderWidth: 1,
        borderColor: '#0A66C2',
        paddingHorizontal: 12,
        paddingVertical: 10,
        fontSize: 12,
        fontWeight: '600',
        color: '#0A66C2',
        backgroundColor: '#F8FBFD',
        letterSpacing: 0.5,
    },
    blueprintTextArea: {
        minHeight: 80,
        textAlignVertical: 'top',
    },
    inputRow: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    
    deploymentEditor: {
        borderBottomWidth: 1,
        borderBottomColor: '#E8F2F9',
        padding: 16,
    },
    deploymentEditorHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    deploymentEditorId: {
        fontSize: 12,
        fontWeight: '900',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    removeButton: {
        padding: 4,
    },
    
    moduleEditor: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#E8F2F9',
    },
    moduleEditorHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    moduleEditorName: {
        fontSize: 12,
        fontWeight: '800',
        color: '#0A66C2',
        letterSpacing: 1,
    },
    versionInput: {
        borderWidth: 1,
        borderColor: '#0A66C2',
        paddingHorizontal: 8,
        paddingVertical: 4,
        fontSize: 11,
        fontWeight: '600',
        color: '#0A66C2',
        backgroundColor: '#F8FBFD',
        width: 60,
    },
});