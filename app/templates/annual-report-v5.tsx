import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Dimensions, Platform, Alert, Animated, PanResponder } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Save, Share, Eye, TrendingUp, Users, Target, Award, Sparkles, ChevronRight, Plus, X, Moon, Sun, Layers, Zap, Globe, Activity, Atom, Orbit, Rocket, Compass, Grid3x3, Hexagon, Box, Circle, Triangle, Square, Pentagon, Octagon } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function AnnualReportTemplate() {
    const params = useLocalSearchParams();
    const [title, setTitle] = useState('MONOLITHE 2024');
    const [company, setCompany] = useState('BRUTALCORP');
    const [introduction, setIntroduction] = useState('La force pure de la simplicité brutale rencontre la fluidité organique du progrès...');
    const [isPreview, setIsPreview] = useState(false);

    // Animation liquide subtile
    const liquidFlow = useRef(new Animated.Value(0)).current;
    const stoneFloat = useRef(new Animated.Value(0)).current;

    // Métriques avec structure monolithique
    const [monolithMetrics, setMonolithMetrics] = useState([
        { id: 'pillar1', value: '847M', label: 'CAPITAL', shape: 'rectangle', color: '#D4A574' },
        { id: 'pillar2', value: '12.7K', label: 'FORCE', shape: 'pentagon', color: '#8B7355' },
        { id: 'pillar3', value: '98.2%', label: 'SOLIDITÉ', shape: 'hexagon', color: '#A0826D' },
        { id: 'pillar4', value: '∞', label: 'POTENTIEL', shape: 'circle', color: '#BC9A6A' },
    ]);

    // Sections en strates géologiques
    const [geologicalLayers, setGeologicalLayers] = useState([
        {
            id: 'bedrock',
            name: 'FONDATIONS',
            depth: 'Strate Primaire',
            elements: [
                { type: 'granite', label: 'Infrastructure Quantum', value: 'Inébranlable' },
                { type: 'obsidian', label: 'Sécurité Absolue', value: 'Impénétrable' },
                { type: 'marble', label: 'Architecture Pure', value: 'Éternelle' },
            ],
            texture: 'rough',
            color: '#2C2416',
        },
        {
            id: 'mantle',
            name: 'EXPANSION',
            depth: 'Strate Dynamique',
            elements: [
                { type: 'magma', label: 'Croissance Explosive', value: '+347%' },
                { type: 'crystal', label: 'Innovation Cristallisée', value: '23 Brevets' },
                { type: 'ore', label: 'Ressources Optimisées', value: '99.8% Efficience' },
            ],
            texture: 'fluid',
            color: '#4A3F2A',
        },
        {
            id: 'surface',
            name: 'HORIZON',
            depth: 'Strate Visible',
            elements: [
                { type: 'soil', label: 'Impact Sociétal', value: '1M+ Vies' },
                { type: 'water', label: 'Fluidité Opérationnelle', value: 'Adaptative' },
                { type: 'air', label: 'Vision Atmosphérique', value: 'Illimitée' },
            ],
            texture: 'smooth',
            color: '#6B5D45',
        },
    ]);

    // Charger les données sauvegardées
    useEffect(() => {
        if (params.savedDocument) {
            try {
                const savedDoc = JSON.parse(params.savedDocument as string);
                setTitle(savedDoc.title || title);
                setCompany(savedDoc.company || company);
                setIntroduction(savedDoc.introduction || introduction);
                if (savedDoc.monolithMetrics) setMonolithMetrics(savedDoc.monolithMetrics);
                if (savedDoc.geologicalLayers) setGeologicalLayers(savedDoc.geologicalLayers);
            } catch (error) {
                console.error('Erreur lors du chargement:', error);
            }
        }
    }, [params.savedDocument]);

    // Animation liquide subtile
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(liquidFlow, {
                    toValue: 1,
                    duration: 8000,
                    useNativeDriver: true,
                }),
                Animated.timing(liquidFlow, {
                    toValue: 0,
                    duration: 8000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        Animated.loop(
            Animated.sequence([
                Animated.timing(stoneFloat, {
                    toValue: -10,
                    duration: 4000,
                    useNativeDriver: true,
                }),
                Animated.timing(stoneFloat, {
                    toValue: 0,
                    duration: 4000,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

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
                type: 'annual-report-brutalism',
                title,
                company,
                introduction,
                monolithMetrics,
                geologicalLayers,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };

            const existingDocuments = await AsyncStorage.getItem('documents');
            const documents = existingDocuments ? JSON.parse(existingDocuments) : [];
            documents.push(documentData);
            await AsyncStorage.setItem('documents', JSON.stringify(documents));

            Alert.alert('Gravé dans la pierre', 'Document archivé dans le monolithe.', [{ text: 'OK' }]);
        } catch (error) {
            Alert.alert('Érosion détectée', 'Impossible de graver le document.', [{ text: 'OK' }]);
        }
    };

    const updateMonolithMetric = (id: string, field: string, value: string) => {
        setMonolithMetrics(prev =>
            prev.map(metric =>
                metric.id === id ? { ...metric, [field]: value } : metric
            )
        );
    };

    const updateGeologicalLayer = (layerId: string, elementIndex: number, field: string, value: string) => {
        setGeologicalLayers(prev =>
            prev.map(layer =>
                layer.id === layerId
                    ? {
                        ...layer,
                        elements: layer.elements.map((element, index) =>
                            index === elementIndex ? { ...element, [field]: value } : element
                        )
                    }
                    : layer
            )
        );
    };

    // Fonction pour générer des formes géométriques
    const renderGeometricShape = (shape: string, size: number, color: string) => {
        switch (shape) {
            case 'rectangle':
                return <View style={[styles.shapeRectangle, { width: size, height: size * 0.6, backgroundColor: color }]} />;
            case 'pentagon':
                return (
                    <View style={[styles.shapePentagon, { width: size, height: size }]}>
                        <View style={[styles.pentagonInner, { backgroundColor: color }]} />
                    </View>
                );
            case 'hexagon':
                return <Hexagon size={size} color={color} />;
            case 'circle':
                return <View style={[styles.shapeCircle, { width: size, height: size, backgroundColor: color }]} />;
            default:
                return <Square size={size} color={color} />;
        }
    };

    if (isPreview) {
        return (
            <SafeAreaView style={styles.brutalContainer}>
                {/* Header Brutaliste Minimaliste */}
                <View style={styles.brutalHeader}>
                    <TouchableOpacity onPress={togglePreview} style={styles.stoneButton}>
                        <X size={20} color="#2C2416" strokeWidth={3} />
                    </TouchableOpacity>

                    <View style={styles.monolithTitle}>
                        <Box size={20} color="#8B7355" strokeWidth={3} />
                        <Text style={styles.monolithTitleText}>APERÇU MONOLITHIQUE</Text>
                    </View>

                    <View style={styles.stoneRow}>
                        <TouchableOpacity style={styles.stoneButton}>
                            <Save size={18} color="#2C2416" strokeWidth={3} />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.stoneButton}>
                            <Share size={18} color="#2C2416" strokeWidth={3} />
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView
                    style={styles.brutalScroll}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Page de Titre Monumentale */}
                    <View style={styles.monumentalCover}>
                        <Animated.View
                            style={[
                                styles.floatingStone,
                                { transform: [{ translateY: stoneFloat }] }
                            ]}
                        >
                            <LinearGradient
                                colors={['#D4A574', '#8B7355', '#2C2416']}
                                style={styles.monumentGradient}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                            >
                                <View style={styles.monumentContent}>
                                    <View style={styles.brutalistLogo}>
                                        <Octagon size={60} color="#2C2416" strokeWidth={4} />
                                    </View>

                                    <Text style={styles.monumentYear}>MMXXIV</Text>
                                    <View style={styles.solidBar} />
                                    <Text style={styles.monumentTitle}>{title}</Text>
                                    <Text style={styles.monumentCompany}>{company}</Text>

                                    <View style={styles.foundationBlocks}>
                                        <View style={styles.foundationBlock}>
                                            <Text style={styles.blockNumber}>I</Text>
                                            <Text style={styles.blockLabel}>GENÈSE</Text>
                                        </View>
                                        <View style={styles.foundationDivider} />
                                        <View style={styles.foundationBlock}>
                                            <Text style={styles.blockNumber}>XII</Text>
                                            <Text style={styles.blockLabel}>CYCLES</Text>
                                        </View>
                                        <View style={styles.foundationDivider} />
                                        <View style={styles.foundationBlock}>
                                            <Text style={styles.blockNumber}>∞</Text>
                                            <Text style={styles.blockLabel}>ÉTERNEL</Text>
                                        </View>
                                    </View>
                                </View>
                            </LinearGradient>
                        </Animated.View>
                    </View>

                    {/* Section Liquide Organique */}
                    <View style={styles.liquidSection}>
                        <Animated.View
                            style={[
                                styles.liquidContainer,
                                {
                                    transform: [{
                                        translateX: liquidFlow.interpolate({
                                            inputRange: [0, 1],
                                            outputRange: [-20, 20],
                                        })
                                    }]
                                }
                            ]}
                        >
                            <View style={styles.liquidBlob}>
                                <LinearGradient
                                    colors={['#D4A57433', '#8B735533', '#A0826D33']}
                                    style={styles.liquidGradient}
                                >
                                    <Text style={styles.liquidQuote}>❝</Text>
                                    <Text style={styles.liquidText}>{introduction}</Text>
                                    <View style={styles.liquidSignature}>
                                        <View style={styles.liquidDot} />
                                        <Text style={styles.liquidAuthor}>ARCHITECTE EN CHEF</Text>
                                    </View>
                                </LinearGradient>
                            </View>
                        </Animated.View>
                    </View>

                    {/* Métriques Monolithiques */}
                    <View style={styles.metricsMonolith}>
                        <Text style={styles.stratumTitle}>PILIERS DE FORCE</Text>

                        <View style={styles.monolithGrid}>
                            {monolithMetrics.map((metric, index) => (
                                <View key={metric.id} style={styles.monolithPillar}>
                                    <View style={styles.pillarTop}>
                                        {renderGeometricShape(metric.shape, 60, metric.color)}
                                    </View>
                                    <View style={[styles.pillarBody, { backgroundColor: metric.color + '20' }]}>
                                        <Text style={[styles.pillarValue, { color: metric.color }]}>{metric.value}</Text>
                                        <View style={[styles.pillarDivider, { backgroundColor: metric.color }]} />
                                        <Text style={styles.pillarLabel}>{metric.label}</Text>
                                    </View>
                                    <View style={[styles.pillarBase, { backgroundColor: metric.color }]} />
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* Strates Géologiques */}
                    <View style={styles.geologicalSection}>
                        <Text style={styles.stratumTitle}>COUPE GÉOLOGIQUE</Text>

                        {geologicalLayers.map((layer, layerIndex) => (
                            <View key={layer.id} style={styles.geologicalLayer}>
                                <LinearGradient
                                    colors={[layer.color, layer.color + 'CC', layer.color + '66']}
                                    style={[styles.layerGradient, { opacity: 0.9 - layerIndex * 0.2 }]}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 0 }}
                                >
                                    <View style={styles.layerHeader}>
                                        <Text style={styles.layerName}>{layer.name}</Text>
                                        <Text style={styles.layerDepth}>{layer.depth}</Text>
                                    </View>

                                    <View style={styles.layerElements}>
                                        {layer.elements.map((element, index) => (
                                            <View key={index} style={styles.elementContainer}>
                                                <View style={styles.elementMarker}>
                                                    <View style={[styles.elementDot, { backgroundColor: layer.color }]} />
                                                </View>
                                                <View style={styles.elementContent}>
                                                    <Text style={styles.elementType}>{element.type.toUpperCase()}</Text>
                                                    <Text style={styles.elementLabel}>{element.label}</Text>
                                                    <Text style={styles.elementValue}>{element.value}</Text>
                                                </View>
                                            </View>
                                        ))}
                                    </View>

                                    <View style={[styles.layerTexture, styles[`texture${layer.texture}`]]} />
                                </LinearGradient>
                            </View>
                        ))}
                    </View>

                    {/* Footer Monumental */}
                    <View style={styles.monumentalFooter}>
                        <View style={styles.footerMonolith}>
                            <Pentagon size={40} color="#8B7355" strokeWidth={3} />
                            <Text style={styles.footerEternal}>ÆTERNUM</Text>
                            <Text style={styles.footerCopyright}>{company} • MMXXIV</Text>
                            <View style={styles.footerFoundation} />
                        </View>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    // Mode Édition Brutaliste
    return (
        <SafeAreaView style={styles.editorBrutal}>
            {/* Header Atelier */}
            <View style={styles.atelierHeader}>
                <TouchableOpacity onPress={handleGoBack} style={styles.chiselButton}>
                    <ArrowLeft size={20} color="#D4A574" strokeWidth={3} />
                </TouchableOpacity>

                <View style={styles.atelierTitle}>
                    <Box size={24} color="#8B7355" strokeWidth={3} />
                    <Text style={styles.atelierTitleText}>ATELIER DE SCULPTURE</Text>
                </View>

                <View style={styles.atelierTools}>
                    <TouchableOpacity onPress={togglePreview} style={styles.chiselButton}>
                        <Eye size={18} color="#D4A574" strokeWidth={3} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={saveDocument} style={styles.chiselButton}>
                        <Save size={18} color="#D4A574" strokeWidth={3} />
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.atelierScroll} showsVerticalScrollIndicator={false}>
                {/* Bloc Principal */}
                <View style={styles.sculptureBlock}>
                    <View style={styles.blockHeader}>
                        <Square size={20} color="#8B7355" strokeWidth={3} />
                        <Text style={styles.blockTitle}>BLOC PRIMAIRE</Text>
                    </View>

                    <View style={styles.chiselingArea}>
                        <View style={styles.inputStone}>
                            <Text style={styles.stoneLabel}>GRAVURE PRINCIPALE</Text>
                            <TextInput
                                style={styles.stoneInput}
                                value={title}
                                onChangeText={setTitle}
                                placeholder="Titre monumental..."
                                placeholderTextColor="#8B735566"
                            />
                        </View>

                        <View style={styles.inputStone}>
                            <Text style={styles.stoneLabel}>SIGNATURE</Text>
                            <TextInput
                                style={styles.stoneInput}
                                value={company}
                                onChangeText={setCompany}
                                placeholder="Marque éternelle..."
                                placeholderTextColor="#8B735566"
                            />
                        </View>

                        <View style={styles.inputStone}>
                            <Text style={styles.stoneLabel}>INSCRIPTION</Text>
                            <TextInput
                                style={[styles.stoneInput, styles.stoneTextArea]}
                                value={introduction}
                                onChangeText={setIntroduction}
                                placeholder="Message gravé..."
                                placeholderTextColor="#8B735566"
                                multiline
                                numberOfLines={4}
                            />
                        </View>
                    </View>
                </View>

                {/* Bloc des Piliers */}
                <View style={styles.sculptureBlock}>
                    <View style={styles.blockHeader}>
                        <Hexagon size={20} color="#8B7355" strokeWidth={3} />
                        <Text style={styles.blockTitle}>PILIERS MONUMENTAUX</Text>
                    </View>

                    <View style={styles.pillarWorkshop}>
                        {monolithMetrics.map((metric) => (
                            <View key={metric.id} style={styles.pillarMold}>
                                <View style={styles.moldHeader}>
                                    {renderGeometricShape(metric.shape, 40, metric.color)}
                                </View>
                                <View style={styles.moldInputs}>
                                    <TextInput
                                        style={[styles.moldInput, { borderBottomColor: metric.color }]}
                                        value={metric.value}
                                        onChangeText={(value) => updateMonolithMetric(metric.id, 'value', value)}
                                        placeholder="Valeur"
                                        placeholderTextColor="#8B735566"
                                    />
                                    <TextInput
                                        style={[styles.moldInput, { borderBottomColor: metric.color }]}
                                        value={metric.label}
                                        onChangeText={(value) => updateMonolithMetric(metric.id, 'label', value)}
                                        placeholder="Inscription"
                                        placeholderTextColor="#8B735566"
                                    />
                                </View>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Bloc Géologique */}
                <View style={styles.sculptureBlock}>
                    <View style={styles.blockHeader}>
                        <Layers size={20} color="#8B7355" strokeWidth={3} />
                        <Text style={styles.blockTitle}>STRATES TECTONIQUES</Text>
                    </View>

                    {geologicalLayers.map((layer) => (
                        <View key={layer.id} style={styles.stratumEditor}>
                            <View style={[styles.stratumHeader, { backgroundColor: layer.color + '33' }]}>
                                <Text style={[styles.stratumName, { color: layer.color }]}>{layer.name}</Text>
                                <Text style={styles.stratumDepth}>{layer.depth}</Text>
                            </View>

                            {layer.elements.map((element, index) => (
                                <View key={index} style={styles.elementEditor}>
                                    <View style={[styles.elementMarkerEdit, { backgroundColor: layer.color }]} />
                                    <View style={styles.elementInputs}>
                                        <TextInput
                                            style={styles.elementInput}
                                            value={element.label}
                                            onChangeText={(value) => updateGeologicalLayer(layer.id, index, 'label', value)}
                                            placeholder="Formation"
                                            placeholderTextColor="#8B735566"
                                        />
                                        <TextInput
                                            style={styles.elementInput}
                                            value={element.value}
                                            onChangeText={(value) => updateGeologicalLayer(layer.id, index, 'value', value)}
                                            placeholder="Mesure"
                                            placeholderTextColor="#8B735566"
                                        />
                                    </View>
                                </View>
                            ))}
                        </View>
                    ))}
                </View>

                {/* Outils de Sculpture */}
                <View style={styles.sculptureTools}>
                    <Text style={styles.toolsTitle}>OUTILS DE TAILLE</Text>

                    <View style={styles.toolsGrid}>
                        {[
                            { icon: Box, name: 'MASSE', desc: 'Force brute' },
                            { icon: Triangle, name: 'CISEAU', desc: 'Précision' },
                            { icon: Circle, name: 'POLISSOIR', desc: 'Finition' },
                            { icon: Pentagon, name: 'COMPAS', desc: 'Géométrie' },
                        ].map((tool, index) => {
                            const Icon = tool.icon;
                            return (
                                <View key={index} style={styles.toolCard}>
                                    <Icon size={32} color="#8B7355" strokeWidth={2} />
                                    <Text style={styles.toolName}>{tool.name}</Text>
                                    <Text style={styles.toolDesc}>{tool.desc}</Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    // Conteneurs principaux
    brutalContainer: {
        flex: 1,
        backgroundColor: '#F5E6D3',
    },
    editorBrutal: {
        flex: 1,
        backgroundColor: '#EFE0CC',
    },

    // Header Brutaliste
    brutalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#F5E6D3',
        borderBottomWidth: 4,
        borderBottomColor: '#2C2416',
    },
    stoneButton: {
        width: 44,
        height: 44,
        backgroundColor: '#D4A574',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 3,
        borderColor: '#2C2416',
    },
    monolithTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    monolithTitleText: {
        fontSize: 14,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 2,
    },
    stoneRow: {
        flexDirection: 'row',
        gap: 12,
    },

    brutalScroll: {
        flex: 1,
    },

    // Page de Couverture Monumentale
    monumentalCover: {
        height: height,
        padding: 40,
        justifyContent: 'center',
    },
    floatingStone: {
        flex: 1,
    },
    monumentGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 8,
        borderColor: '#2C2416',
    },
    monumentContent: {
        alignItems: 'center',
    },
    brutalistLogo: {
        marginBottom: 32,
    },
    monumentYear: {
        fontSize: 16,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 8,
        marginBottom: 16,
    },
    solidBar: {
        width: 100,
        height: 8,
        backgroundColor: '#2C2416',
        marginBottom: 24,
    },
    monumentTitle: {
        fontSize: 48,
        fontWeight: '900',
        color: '#2C2416',
        textAlign: 'center',
        letterSpacing: -2,
        marginBottom: 8,
    },
    monumentCompany: {
        fontSize: 24,
        fontWeight: '700',
        color: '#4A3F2A',
        letterSpacing: 6,
        marginBottom: 48,
    },
    foundationBlocks: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2C241633',
        paddingVertical: 20,
        paddingHorizontal: 32,
    },
    foundationBlock: {
        alignItems: 'center',
    },
    blockNumber: {
        fontSize: 28,
        fontWeight: '900',
        color: '#2C2416',
        marginBottom: 4,
    },
    blockLabel: {
        fontSize: 10,
        fontWeight: '700',
        color: '#4A3F2A',
        letterSpacing: 2,
    },
    foundationDivider: {
        width: 4,
        height: 40,
        backgroundColor: '#2C2416',
        marginHorizontal: 32,
    },

    // Section Liquide
    liquidSection: {
        paddingVertical: 80,
        paddingHorizontal: 40,
        backgroundColor: '#F5E6D3',
    },
    liquidContainer: {
        alignItems: 'center',
    },
    liquidBlob: {
        width: width * 0.85,
        borderRadius: 200,
        overflow: 'hidden',
    },
    liquidGradient: {
        padding: 40,
        borderRadius: 200,
        borderWidth: 3,
        borderColor: '#8B7355',
    },
    liquidQuote: {
        fontSize: 80,
        color: '#8B7355',
        opacity: 0.3,
        position: 'absolute',
        top: 0,
        left: 20,
    },
    liquidText: {
        fontSize: 18,
        lineHeight: 30,
        color: '#2C2416',
        fontStyle: 'italic',
        textAlign: 'center',
        marginBottom: 24,
    },
    liquidSignature: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    liquidDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#8B7355',
    },
    liquidAuthor: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B7355',
        letterSpacing: 3,
    },

    // Métriques Monolithiques
    metricsMonolith: {
        paddingVertical: 80,
        paddingHorizontal: 20,
        backgroundColor: '#EFE0CC',
    },
    stratumTitle: {
        fontSize: 32,
        fontWeight: '900',
        color: '#2C2416',
        textAlign: 'center',
        letterSpacing: 4,
        marginBottom: 60,
    },
    monolithGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        gap: 20,
    },
    monolithPillar: {
        width: (width - 80) / 2,
        alignItems: 'center',
    },
    pillarTop: {
        marginBottom: 16,
    },
    pillarBody: {
        width: '100%',
        padding: 20,
        borderWidth: 3,
        borderColor: '#2C2416',
        marginBottom: -3,
    },
    pillarValue: {
        fontSize: 32,
        fontWeight: '900',
        textAlign: 'center',
        marginBottom: 12,
    },
    pillarDivider: {
        height: 3,
        marginBottom: 12,
    },
    pillarLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#2C2416',
        textAlign: 'center',
        letterSpacing: 2,
    },
    pillarBase: {
        width: '120%',
        height: 12,
        borderWidth: 3,
        borderColor: '#2C2416',
    },

    // Formes géométriques
    shapeRectangle: {
        borderWidth: 3,
        borderColor: '#2C2416',
    },
    shapePentagon: {
        transform: [{ rotate: '36deg' }],
    },
    pentagonInner: {
        width: '70%',
        height: '70%',
        transform: [{ rotate: '-36deg' }],
        borderWidth: 3,
        borderColor: '#2C2416',
    },
    shapeCircle: {
        borderRadius: 50,
        borderWidth: 3,
        borderColor: '#2C2416',
    },

    // Strates Géologiques
    geologicalSection: {
        paddingVertical: 80,
        backgroundColor: '#F5E6D3',
    },
    geologicalLayer: {
        marginBottom: -20,
    },
    layerGradient: {
        paddingVertical: 40,
        paddingHorizontal: 30,
        borderWidth: 3,
        borderColor: '#2C2416',
    },
    layerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    layerName: {
        fontSize: 24,
        fontWeight: '900',
        color: '#F5E6D3',
        letterSpacing: 2,
    },
    layerDepth: {
        fontSize: 12,
        fontWeight: '700',
        color: '#F5E6D3AA',
        letterSpacing: 1,
    },
    layerElements: {
        gap: 16,
    },
    elementContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5E6D333',
        padding: 16,
        borderWidth: 2,
        borderColor: '#F5E6D366',
    },
    elementMarker: {
        marginRight: 16,
    },
    elementDot: {
        width: 24,
        height: 24,
        borderWidth: 3,
        borderColor: '#F5E6D3',
    },
    elementContent: {
        flex: 1,
    },
    elementType: {
        fontSize: 10,
        fontWeight: '900',
        color: '#F5E6D3',
        letterSpacing: 2,
        marginBottom: 4,
    },
    elementLabel: {
        fontSize: 16,
        fontWeight: '700',
        color: '#F5E6D3',
        marginBottom: 2,
    },
    elementValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#F5E6D3CC',
    },
    layerTexture: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: 100,
        height: '100%',
        opacity: 0.1,
    },
    texturerough: {
        backgroundColor: '#2C2416',
    },
    texturefluid: {
        backgroundColor: '#4A3F2A',
        borderRadius: 50,
    },
    texturesmooth: {
        backgroundColor: '#6B5D45',
    },

    // Footer Monumental
    monumentalFooter: {
        paddingVertical: 100,
        alignItems: 'center',
        backgroundColor: '#EFE0CC',
    },
    footerMonolith: {
        alignItems: 'center',
    },
    footerEternal: {
        fontSize: 24,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 8,
        marginTop: 20,
        marginBottom: 8,
    },
    footerCopyright: {
        fontSize: 12,
        fontWeight: '700',
        color: '#8B7355',
        letterSpacing: 2,
        marginBottom: 20,
    },
    footerFoundation: {
        width: 200,
        height: 8,
        backgroundColor: '#2C2416',
    },

    // Mode Éditeur - Atelier
    atelierHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 16,
        backgroundColor: '#EFE0CC',
        borderBottomWidth: 4,
        borderBottomColor: '#8B7355',
    },
    chiselButton: {
        width: 40,
        height: 40,
        backgroundColor: '#D4A57433',
        borderWidth: 2,
        borderColor: '#8B7355',
        justifyContent: 'center',
        alignItems: 'center',
    },
    atelierTitle: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    atelierTitleText: {
        fontSize: 16,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 1,
    },
    atelierTools: {
        flexDirection: 'row',
        gap: 12,
    },

    atelierScroll: {
        flex: 1,
    },

    // Blocs de sculpture
    sculptureBlock: {
        margin: 20,
        backgroundColor: '#F5E6D3',
        borderWidth: 4,
        borderColor: '#8B7355',
    },
    blockHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 16,
        backgroundColor: '#8B735533',
        borderBottomWidth: 3,
        borderBottomColor: '#8B7355',
    },
    blockTitle: {
        fontSize: 14,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 2,
    },

    chiselingArea: {
        padding: 24,
    },
    inputStone: {
        marginBottom: 24,
    },
    stoneLabel: {
        fontSize: 12,
        fontWeight: '900',
        color: '#8B7355',
        letterSpacing: 2,
        marginBottom: 8,
    },
    stoneInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#2C2416',
        paddingHorizontal: 16,
        paddingVertical: 12,
        fontSize: 16,
        fontWeight: '700',
        color: '#2C2416',
    },
    stoneTextArea: {
        height: 100,
        textAlignVertical: 'top',
    },

    // Atelier des piliers
    pillarWorkshop: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 16,
        gap: 16,
    },
    pillarMold: {
        width: (width - 88) / 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#2C2416',
        padding: 16,
    },
    moldHeader: {
        alignItems: 'center',
        marginBottom: 16,
    },
    moldInputs: {
        gap: 12,
    },
    moldInput: {
        borderBottomWidth: 3,
        paddingVertical: 8,
        fontSize: 14,
        fontWeight: '700',
        color: '#2C2416',
        textAlign: 'center',
    },

    // Éditeur de strates
    stratumEditor: {
        marginBottom: 24,
        borderWidth: 3,
        borderColor: '#8B7355',
    },
    stratumHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        borderBottomWidth: 2,
        borderBottomColor: '#8B7355',
    },
    stratumName: {
        fontSize: 16,
        fontWeight: '900',
        letterSpacing: 1,
    },
    stratumDepth: {
        fontSize: 12,
        color: '#8B7355',
    },
    elementEditor: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#8B735533',
    },
    elementMarkerEdit: {
        width: 16,
        height: 16,
        marginRight: 16,
    },
    elementInputs: {
        flex: 1,
        gap: 8,
    },
    elementInput: {
        backgroundColor: '#FFFFFF',
        borderWidth: 2,
        borderColor: '#D4A574',
        paddingHorizontal: 12,
        paddingVertical: 6,
        fontSize: 14,
        fontWeight: '600',
        color: '#2C2416',
    },

    // Outils de sculpture
    sculptureTools: {
        margin: 20,
        padding: 24,
        backgroundColor: '#F5E6D3',
        borderWidth: 4,
        borderColor: '#8B7355',
    },
    toolsTitle: {
        fontSize: 18,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 3,
        textAlign: 'center',
        marginBottom: 24,
    },
    toolsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        justifyContent: 'space-around',
    },
    toolCard: {
        width: (width - 120) / 2,
        backgroundColor: '#FFFFFF',
        borderWidth: 3,
        borderColor: '#2C2416',
        padding: 20,
        alignItems: 'center',
    },
    toolName: {
        fontSize: 14,
        fontWeight: '900',
        color: '#2C2416',
        letterSpacing: 1,
        marginTop: 12,
        marginBottom: 4,
    },
    toolDesc: {
        fontSize: 12,
        color: '#8B7355',
        textAlign: 'center',
    },
});