import React, { useRef, useEffect, useMemo } from 'react';
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

  const mapHtml = useMemo(() => {
    const points = heatmapData?.data || [];

    if (!points.length) {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <style>
            html, body, #map { height: 100%; margin: 0; padding: 0; background: #e2e8f0; }
            .empty { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #475569; font-family: -apple-system, Roboto, sans-serif; font-size: 14px; text-align: center; padding: 24px; }
          </style>
        </head>
        <body>
          <div id="map">
            <div class="empty">No location data available yet.</div>
          </div>
        </body>
        </html>
      `;
    }

    const pointsJson = JSON.stringify(
      points.map(p => ({
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [p.lng, p.lat] },
      }))
    );

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" crossorigin="" />
        <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" crossorigin=""></script>
        <style>
          html, body, #map { height: 100%; margin: 0; padding: 0; }
        </style>
        <script>
          function initMap() {
            if (typeof L === 'undefined') {
              setTimeout(initMap, 100);
              return;
            }
            var map = L.map('map', { zoomControl: false });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
              attribution: '&copy; OpenStreetMap contributors',
              maxZoom: 19
            }).addTo(map);
            var geoJson = ${pointsJson};
            var markers = L.geoJSON(geoJson, {
              pointToLayer: function(feature, latlng) {
                return L.marker(latlng).bindPopup('Location');
              }
            }).addTo(map);
            if (markers.getLayers().length > 1) {
              map.fitBounds(markers.getBounds().pad(0.2));
            } else if (markers.getLayers().length === 1) {
              map.setView(markers.getBounds().getCenter(), 10);
            }
          }
        </script>
      </head>
      <body onload="initMap()">
        <div id="map"></div>
      </body>
      </html>
    `;
  }, [heatmapData]);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    });
    return unsubscribe;
  }, [navigation]);

  const renderMapError = React.useCallback(
    () => (
      <View style={styles.mapLoading}>
        <Text style={styles.mapText}>Failed to load map</Text>
        <Text style={styles.mapSubtext}>Check your internet connection</Text>
      </View>
    ),
    []
  );

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
            <View style={styles.mapLoading}>
              <Text style={styles.mapText}>Loading Map...</Text>
            </View>
          ) : (
            <WebView
              originWhitelist={['*']}
              source={{ html: mapHtml }}
              style={styles.map}
              scrollEnabled={false}
              javaScriptEnabled={true}
              domStorageEnabled={true}
              startInLoadingState={false}
              renderError={renderMapError}
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
    height: 280,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.slate[200],
  },
  map: {
    height: 280,
    width: '100%',
  },
  mapLoading: {
    position: 'absolute',
    inset: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.slate[200],
  },
  mapText: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.semibold,
    color: Colors.text,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  mapIcon: {
    fontSize: 40,
    marginBottom: Spacing.sm,
  },
  mapSubtext: {
    fontSize: Typography.sizes.sm,
    color: Colors.textSecondary,
    textAlign: 'center',
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

