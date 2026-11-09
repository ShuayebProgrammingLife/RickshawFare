import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { TRANSPORT_LABELS } from '../data/fareData';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { showAlert } from '../utils/alert';

const { width, height } = Dimensions.get('window');

export default function ReceiptModal({ visible, onClose, fareData, routeData, theme, language }) {
  const [isExporting, setIsExporting] = useState(false);

  if (!fareData || !routeData) return null;

  const formatDate = new Date();

  const buildReceiptHtml = () => `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 24px;
            color: #1f2937;
          }
          .header {
            text-align: center;
            background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary});
            color: white;
            padding: 24px;
            border-radius: 16px;
            margin-bottom: 24px;
          }
          .title {
            font-size: 24px;
            font-weight: bold;
            margin: 0 0 6px 0;
          }
          .subtitle {
            font-size: 14px;
            opacity: 0.9;
            margin: 0;
          }
          .section {
            margin-bottom: 18px;
            padding-bottom: 14px;
            border-bottom: 1px solid #e5e7eb;
          }
          .row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
            gap: 12px;
          }
          .label {
            color: #6b7280;
            font-size: 14px;
          }
          .value {
            color: #111827;
            font-size: 14px;
            font-weight: 600;
            text-align: right;
          }
          .total {
            margin-top: 18px;
            padding: 16px;
            text-align: center;
            border-radius: 14px;
            background: #f3f4f6;
          }
          .total-label {
            font-size: 14px;
            color: #374151;
            margin-bottom: 8px;
          }
          .total-value {
            font-size: 34px;
            font-weight: 800;
            color: ${theme.primary};
          }
          .note {
            margin-top: 24px;
            font-size: 12px;
            color: #6b7280;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">${language === 'bn' ? 'ডিজিটাল মানি রিসিট' : 'Digital Money Receipt'}</div>
          <p class="subtitle">RickshawFare</p>
        </div>

        <div class="section">
          <div class="row">
            <div class="label">${language === 'bn' ? 'তারিখ' : 'Date'}</div>
            <div class="value">${formatDate.toLocaleDateString()}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'সময়' : 'Time'}</div>
            <div class="value">${formatDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
          </div>
        </div>

        <div class="section">
          <div class="row">
            <div class="label">${language === 'bn' ? 'কোথা থেকে' : 'From'}</div>
            <div class="value">${routeData.from}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'কোথায়' : 'To'}</div>
            <div class="value">${routeData.to}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'যানবাহন' : 'Transport'}</div>
            <div class="value">${TRANSPORT_LABELS[routeData.transport] || routeData.transport}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'দূরত্ব' : 'Distance'}</div>
            <div class="value">${routeData.distance} km</div>
          </div>
        </div>

        <div class="section">
          <div class="row">
            <div class="label">${language === 'bn' ? 'ভিত্তি ভাড়া' : 'Base Fare'}</div>
            <div class="value">৳${fareData.breakdown.baseFare}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'দূরত্ব চার্জ' : 'Distance Charge'}</div>
            <div class="value">৳${fareData.breakdown.distanceCharge}</div>
          </div>
          <div class="row">
            <div class="label">${language === 'bn' ? 'অতিরিক্ত চার্জ' : 'Extra Charge'}</div>
            <div class="value">৳${fareData.breakdown.surcharges || 0}</div>
          </div>
        </div>

        <div class="total">
          <div class="total-label">${language === 'bn' ? 'সর্বমোট প্রাক্কলিত ভাড়া' : 'Total Estimated Fare'}</div>
          <div class="total-value">৳${fareData.estimatedFare}</div>
        </div>

        <div class="note">
          ${language === 'bn'
            ? 'এটি একটি সম্ভাব্য ভাড়া। ট্রাফিক এবং আবহাওয়া ভেদে ভাড়া কম-বেশি হতে পারে।'
            : 'This is an estimated fare. Actual fare may vary based on traffic and weather.'}
        </div>
      </body>
    </html>
  `;

  const handleDownloadPdf = async () => {
    try {
      setIsExporting(true);
      const { uri } = await Print.printToFileAsync({
        html: buildReceiptHtml(),
        base64: false,
      });

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        showAlert(
          '⚠️',
          language === 'bn'
            ? `PDF তৈরি হয়েছে: ${uri}`
            : `PDF created at: ${uri}`
        );
        return;
      }

      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: language === 'bn' ? 'রিসিট PDF সেভ বা শেয়ার করুন' : 'Save or share receipt PDF',
        UTI: 'com.adobe.pdf',
      });
    } catch (error) {
      showAlert(
        '⚠️',
        language === 'bn'
          ? 'PDF তৈরি করা যায়নি'
          : 'Could not create PDF'
      );
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.receiptContainer, { backgroundColor: theme.card }]}>
          <LinearGradient
            colors={[theme.primary, theme.secondary]}
            style={styles.receiptHeader}
          >
            <MaterialCommunityIcons name="check-circle" size={40} color="#fff" />
            <Text style={styles.headerTitle}>
              {language === 'bn' ? 'ডিজিটাল মানি রিসিট' : 'Digital Money Receipt'}
            </Text>
            <Text style={styles.headerSubtitle}>RickshawFare 🚲</Text>
          </LinearGradient>

          <ScrollView style={styles.receiptBody}>
            <View style={styles.section}>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'তারিখ:' : 'Date:'}
                </Text>
                <Text style={[styles.value, { color: theme.text }]}>
                  {new Date().toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'সময়:' : 'Time:'}
                </Text>
                <Text style={[styles.value, { color: theme.text }]}>
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.primary }]}>
                {language === 'bn' ? 'যাত্রার বিবরণ' : 'Trip Details'}
              </Text>
              <View style={styles.routeBox}>
                <View style={styles.routeRow}>
                  <MaterialCommunityIcons name="map-marker" size={20} color={theme.accent} />
                  <Text style={[styles.routeText, { color: theme.text }]}>{routeData.from}</Text>
                </View>
                <View style={styles.routeLine} />
                <View style={styles.routeRow}>
                  <MaterialCommunityIcons name="map-marker-check" size={20} color={theme.primary} />
                  <Text style={[styles.routeText, { color: theme.text }]}>{routeData.to}</Text>
                </View>
              </View>
              
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'যানবাহন:' : 'Transport:'}
                </Text>
                <Text style={[styles.value, { color: theme.text }]}>
                  {TRANSPORT_LABELS[routeData.transport]}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={[styles.label, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'দূরত্ব:' : 'Distance:'}
                </Text>
                <Text style={[styles.value, { color: theme.text }]}>
                  {routeData.distance} km
                </Text>
              </View>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.border }]} />

            <View style={styles.fareSection}>
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'ভিত্তি ভাড়া' : 'Base Fare'}
                </Text>
                <Text style={[styles.fareValue, { color: theme.text }]}>৳{fareData.breakdown.baseFare}</Text>
              </View>
              <View style={styles.fareRow}>
                <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>
                  {language === 'bn' ? 'দূরত্ব চার্জ' : 'Distance Charge'}
                </Text>
                <Text style={[styles.fareValue, { color: theme.text }]}>৳{fareData.breakdown.distanceCharge}</Text>
              </View>
              {fareData.breakdown.surcharges > 0 && (
                <View style={styles.fareRow}>
                  <Text style={[styles.fareLabel, { color: theme.textSecondary }]}>
                    {language === 'bn' ? 'অতিরিক্ত চার্জ' : 'Extra Surcharge'}
                  </Text>
                  <Text style={[styles.fareValue, { color: theme.primary }]}>+৳{fareData.breakdown.surcharges}</Text>
                </View>
              )}
              
              <LinearGradient
                colors={[theme.primary + '20', 'transparent']}
                style={styles.totalBox}
              >
                <Text style={[styles.totalLabel, { color: theme.text }]}>
                  {language === 'bn' ? 'সর্বমোট প্রাক্কলিত ভাড়া' : 'Total Estimated Fare'}
                </Text>
                <Text style={[styles.totalValue, { color: theme.accent }]}>৳{fareData.estimatedFare}</Text>
              </LinearGradient>
            </View>

            <View style={styles.noteBox}>
              <Text style={styles.noteText}>
                {language === 'bn' 
                  ? '* এটি একটি সম্ভাব্য ভাড়া। ট্রাফিক এবং আবহাওয়া ভেদে ভাড়া কম-বেশি হতে পারে।' 
                  : '* This is an estimated fare. Actual fare may vary based on traffic and weather.'}
              </Text>
            </View>
          </ScrollView>

          <View style={[styles.actionBar, { borderTopColor: theme.border }]}>
            <TouchableOpacity
              style={[styles.downloadButton, { backgroundColor: theme.accent }]}
              onPress={handleDownloadPdf}
              disabled={isExporting}
            >
              <MaterialCommunityIcons name="file-pdf-box" size={18} color="#fff" />
              <Text style={styles.downloadButtonText}>
                {isExporting
                  ? (language === 'bn' ? 'তৈরি হচ্ছে...' : 'Creating...')
                  : (language === 'bn' ? 'PDF ডাউনলোড' : 'Download PDF')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.closeButton, { backgroundColor: theme.primary }]} onPress={onClose}>
              <Text style={styles.closeButtonText}>
                {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  receiptContainer: {
    width: width * 0.9,
    maxHeight: height * 0.8,
    borderRadius: 25,
    overflow: 'hidden',
    elevation: 10,
  },
  receiptHeader: {
    padding: 25,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 14,
    marginTop: 5,
  },
  receiptBody: {
    padding: 20,
  },
  section: {
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginVertical: 10,
    opacity: 0.2,
  },
  routeBox: {
    marginBottom: 15,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  routeLine: {
    width: 2,
    height: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginLeft: 9,
    marginVertical: 4,
  },
  fareSection: {
    marginTop: 10,
  },
  fareRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  fareLabel: {
    fontSize: 13,
  },
  fareValue: {
    fontSize: 13,
    fontWeight: '500',
  },
  totalBox: {
    marginTop: 15,
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  totalValue: {
    fontSize: 32,
    fontWeight: '900',
    marginTop: 5,
  },
  noteBox: {
    marginTop: 20,
    padding: 10,
  },
  noteText: {
    color: '#888',
    fontSize: 11,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    padding: 14,
    borderTopWidth: 1,
  },
  downloadButton: {
    flex: 1.25,
    paddingVertical: 15,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    flex: 1,
    paddingVertical: 15,
    alignItems: 'center',
    borderRadius: 14,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
