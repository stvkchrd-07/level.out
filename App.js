import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, Text, View, SafeAreaView, ScrollView, 
  TouchableOpacity, Modal, TextInput, Platform, StatusBar 
} from 'react-native';
import { User, Activity, Plus, X } from 'lucide-react-native';
import { supabase } from './lib/supabase';
import Auth from './components/Auth'; // Importing the auth screen we just made

export default function App() {
  const [session, setSession] = useState(null);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [splitType, setSplitType] = useState('equally');

  // Listen for login/logout events from Supabase
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  // Quick logout function attached to the profile button
  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  // The Gatekeeper: If there is no active session, show the Auth screen
  if (!session) {
    return <Auth />;
  }

  // If logged in, show the main level.out dashboard
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logoText}>level.out</Text>
        <TouchableOpacity style={styles.profileButton} onPress={handleLogout}>
          <User color="#111" size={20} strokeWidth={1.5} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Balances - Curvy Mobile Cards */}
        <View style={styles.balanceContainer}>
          <View style={[styles.balanceCard, styles.cardOwed]}>
            <Text style={styles.balanceLabelLight}>You are owed</Text>
            <Text style={styles.balanceAmountLight}>₹3,200</Text>
          </View>
          <View style={[styles.balanceCard, styles.cardOwe]}>
            <Text style={styles.balanceLabelDark}>You owe</Text>
            <Text style={styles.balanceAmountDark}>₹1,450</Text>
          </View>
        </View>

        {/* Groups - Horizontal Mobile Scroll */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Groups</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
            {['Weekend Trip', 'Goa 2026', 'Apartment', 'Dinners'].map((group, index) => (
              <TouchableOpacity key={index} style={styles.groupPill}>
                <Text style={styles.groupText}>{group}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Activity Feed */}
        <View style={styles.section}>
          <View style={styles.activityHeader}>
            <Activity color="#FF5A36" size={18} />
            <Text style={styles.sectionTitle}>Recent Activity</Text>
          </View>
          
          <View style={styles.activityList}>
            <TouchableOpacity style={styles.activityItem}>
              <View style={styles.activityIcon}><Text style={styles.emoji}>🚗</Text></View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Rental Car</Text>
                <Text style={styles.activitySubtitle}>Weekend Trip</Text>
              </View>
              <View style={styles.activityAmounts}>
                <Text style={styles.amountLabel}>You lent</Text>
                <Text style={[styles.amountValue, { color: '#FF5A36' }]}>₹1,200</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity style={styles.activityItem}>
              <View style={styles.activityIcon}><Text style={styles.emoji}>🍕</Text></View>
              <View style={styles.activityDetails}>
                <Text style={styles.activityTitle}>Pizza Night</Text>
                <Text style={styles.activitySubtitle}>Apartment</Text>
              </View>
              <View style={styles.activityAmounts}>
                <Text style={styles.amountLabel}>You owe</Text>
                <Text style={styles.amountValue}>₹450</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} activeOpacity={0.8} onPress={() => setShowAddExpense(true)}>
        <Plus color="#FFF" size={24} />
        <Text style={styles.fabText}>Split</Text>
      </TouchableOpacity>

      {/* Add Expense Modal */}
      <Modal visible={showAddExpense} animationType="slide" transparent={true} onRequestClose={() => setShowAddExpense(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>New Expense</Text>
              <TouchableOpacity onPress={() => setShowAddExpense(false)} style={styles.closeButton}>
                <X color="#111" size={20} />
              </TouchableOpacity>
            </View>

            <TextInput style={styles.inputLarge} placeholder="What is this for?" placeholderTextColor="#A1A1AA" />
            
            <View style={styles.amountInputContainer}>
              <Text style={styles.currencySymbol}>₹</Text>
              <TextInput style={styles.inputAmount} placeholder="0" keyboardType="numeric" placeholderTextColor="#D4D4D8" />
            </View>

            <Text style={styles.subHeading}>Split Method</Text>
            <View style={styles.splitOptions}>
              {['equally', 'percentage', 'custom'].map((type) => (
                <TouchableOpacity key={type} onPress={() => setSplitType(type)} style={[styles.splitPill, splitType === type && styles.splitPillActive]}>
                  <Text style={[styles.splitPillText, splitType === type && styles.splitPillTextActive]}>{type}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Add Expense</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16 },
  logoText: { fontSize: 22, fontWeight: '800', letterSpacing: -0.5, color: '#111' }, // Bumped up font weight for the editorial look
  profileButton: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  scrollContent: { paddingHorizontal: 24 },
  balanceContainer: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 32 },
  balanceCard: { flex: 1, padding: 24, borderRadius: 32 },
  cardOwed: { backgroundColor: '#FF5A36' },
  cardOwe: { backgroundColor: '#F3F4F6' },
  balanceLabelLight: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
  balanceAmountLight: { fontSize: 32, fontWeight: '300', color: '#FFFFFF' },
  balanceLabelDark: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280', marginBottom: 8 },
  balanceAmountDark: { fontSize: 32, fontWeight: '300', color: '#111' },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280', fontWeight: '500', marginBottom: 16 },
  horizontalScroll: { overflow: 'visible' },
  groupPill: { paddingHorizontal: 24, paddingVertical: 16, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E7EB', borderRadius: 24, marginRight: 12 },
  groupText: { fontSize: 16, fontWeight: '300', color: '#111' },
  activityHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  activityList: { gap: 12 },
  activityItem: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#FAFAFA', borderRadius: 24 },
  activityIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  emoji: { fontSize: 24 },
  activityDetails: { flex: 1 },
  activityTitle: { fontSize: 18, fontWeight: '300', color: '#111', marginBottom: 4 },
  activitySubtitle: { fontSize: 13, color: '#6B7280' },
  activityAmounts: { alignItems: 'flex-end' },
  amountLabel: { fontSize: 12, color: '#6B7280', marginBottom: 4 },
  amountValue: { fontSize: 18, fontWeight: '400', color: '#111' },
  fab: { position: 'absolute', bottom: 32, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', backgroundColor: '#111', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 32, gap: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.15, shadowRadius: 12, elevation: 5 },
  fabText: { color: '#FFF', fontSize: 16, fontWeight: '500' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, minHeight: '80%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  modalTitle: { fontSize: 20, fontWeight: '300' },
  closeButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#F3F4F6', justifyContent: 'center', alignItems: 'center' },
  inputLarge: { fontSize: 32, fontWeight: '300', marginBottom: 24, color: '#111' },
  amountInputContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 40 },
  currencySymbol: { fontSize: 48, fontWeight: '300', color: '#A1A1AA', marginRight: 8 },
  inputAmount: { fontSize: 64, fontWeight: '300', color: '#111', flex: 1 },
  subHeading: { fontSize: 12, textTransform: 'uppercase', letterSpacing: 1, color: '#6B7280', marginBottom: 12 },
  splitOptions: { flexDirection: 'row', gap: 8, marginBottom: 48 },
  splitPill: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, borderWidth: 1, borderColor: '#E5E7EB' },
  splitPillActive: { backgroundColor: '#111', borderColor: '#111' },
  splitPillText: { fontSize: 14, color: '#111', textTransform: 'capitalize' },
  splitPillTextActive: { color: '#FFF' },
  saveButton: { backgroundColor: '#111', paddingVertical: 20, borderRadius: 32, alignItems: 'center', marginTop: 'auto', marginBottom: Platform.OS === 'ios' ? 24 : 0 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: '500' },
});