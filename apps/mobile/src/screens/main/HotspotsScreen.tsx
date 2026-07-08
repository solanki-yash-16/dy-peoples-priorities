import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Spacing, BorderRadius, Typography } from '../../theme';
import { Card } from '../../components/Card';
import { TopTabBar } from '../../navigation/CustomTabBar';
import { mockHotspots } from '../../utils/mockData';
import { useQuery } from '@tanstack/react-query';
import { complaintApi } from '../../api/complaint';
import WebView from 'react-native-webview';

interface HotspotsScreenProps {
  navigation: any;
}

export const HotspotsScreen: React.FC<HotspotsScreenProps> = ({
  navigation,
}) => {
  const getSeverityColor = (score: number): string => {
    if (score >= 85) return Colors.error;
    if (score >= 70) return Colors.warning;
    return Colors.success;
  };

  const getSeverityLabel = (score: number): string => {
    if (score >= 85) return 'Critical';
    if (score >= 70) return 'High';
    return 'Moderate';
  };

  const { data: heatmapData, isLoading: isLoadingHeatmap } = useQuery({
    queryKey: ['heatmap'],
    queryFn: () => complaintApi.getHeatmap(),
  });

  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return unsubscribe;
  }, [navigation]);

  const generateLeafletHtml = () => {
    const points = heatmapData?.data || [];
    const centerLat = points[0]?.lat || 28.6139;
    const centerLng = points[0]?.lng || 77.209;

    const markersCode = points
      .map(
        (p: any) =>
          `L.marker([${p.lat}, ${p.lng}], {icon: redIcon}).addTo(map);`
      )
      .join('\\n');

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
        <style>
          body { padding: 0; margin: 0; }
          html, body, #map { height: 100%; width: 100%; }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map('map', { zoomControl: false }).setView([${centerLat}, ${centerLng}], 10);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OSM'
          }).addTo(map);
          var redIcon = L.icon({
            iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
            iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41]
          });
          ${markersCode}
        </script>
      </body>
      </html>
    `;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <TopTabBar navigation={navigation} />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.title}>Demand Hotspots</Text>
        <Text style={styles.subtitle}>
          Geographic concentration of citizen demand
        </Text>

        <View style={styles.mapContainer}>
          {isLoadingHeatmap ? (
            <Text style={styles.mapText}>Loading Map...</Text>
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{ html: generateLeafletHtml() }}
              style={{ width: '100%', height: '100%' }}
              scrollEnabled={false}
            />
          )}
        </View>

        <View style={styles.list}>
          {mockHotspots.map(hotspot => (
            <Card key={hotspot.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={styles.titleContainer}>
                  <Text style={styles.cardTitle}>{hotspot.region}</Text>
                  <Text style={styles.topIssue}>{hotspot.topIssue}</Text>
                </View>
                <View
                  style={[
                    styles.severityBadge,
                    {
                      backgroundColor:
                        getSeverityColor(hotspot.demandScore) + '15',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.severityText,
                      { color: getSeverityColor(hotspot.demandScore) },
                    ]}
                  >
                    {getSeverityLabel(hotspot.demandScore)}
                  </Text>
                </View>
              </View>

              <View style={styles.scoreRow}>
                <View style={styles.scoreItem}>
                  <Text style={styles.scoreLabel}>Demand Score</Text>
                  <View style={styles.scoreBarContainer}>
                    <View style={styles.scoreBarBackground}>
                      <View
                        style={[
                          styles.scoreBarFill,
                          {
                            width: `${hotspot.demandScore}%`,
                            backgroundColor: getSeverityColor(
                              hotspot.demandScore,
                            ),
                          },
                        ]}
                      />
                    </View>
                  </View>
                  <Text style={styles.scoreValue}>{hotspot.demandScore}</Text>
                </View>
              </View>

              <View style={styles.statsRow}>
                <View style={styles.statBox}>
                  <Text style={styles.statValue}>
                    {hotspot.submissionCount}
                  </Text>
                  <Text style={styles.statLabel}>Submissions</Text>
                </View>
                <View style={styles.statBox}>
                  <Text
                    style={[
                      styles.statValue,
                      {
                        color:
                          hotspot.growthRate > 0
                            ? Colors.error
                            : Colors.success,
                      },
                    ]}
                  >
                    {hotspot.growthRate > 0 ? '+' : ''}
                    {hotspot.growthRate}%
                  </Text>
                  <Text style={styles.statLabel}>Growth</Text>
                </View>
              </View>
            </Card>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    padding: Spacing.md,
    // paddingTop: tabBarHeight + Spacing.md,
    paddingBottom: Spacing.tabBar,
  },
  title: {
    fontSize: Typography.sizes.xl,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: Typography.sizes.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  mapContainer: {
    height: 250,
    backgroundColor: Colors.slate[100],
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  mapIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  mapText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  mapSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
  },
  list: {
    gap: Spacing.sm,
  },
  card: {
    // padding: Spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  titleContainer: {
    flex: 1,
    marginRight: Spacing.sm,
  },
  cardTitle: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
  },
  topIssue: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textTransform: 'capitalize',
  },
  severityBadge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
  },
  severityText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.semibold,
  },
  scoreRow: {
    marginBottom: Spacing.md,
  },
  scoreItem: {
    gap: Spacing.xs,
  },
  scoreLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
  },
  scoreBarContainer: {
    height: 8,
  },
  scoreBarBackground: {
    height: 8,
    backgroundColor: Colors.slate[200],
    borderRadius: 4,
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  scoreValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statBox: {
    flex: 1,
  },
  statValue: {
    fontSize: Typography.sizes.md,
    fontWeight: Typography.weights.bold,
    color: Colors.text,
  },
  statLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
});
