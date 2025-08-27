import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  FlatList,
  Image
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  Stethoscope, 
  Bell,
  ChevronRight,
  Search,
  Star,
  MapPin,
  Trash2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAppContext } from '@/contexts/AppContext';

export default function HomeScreen() {
  const router = useRouter();
  const { appointments, doctors, deleteAppointment, searchDoctors } = useAppContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchResults, setShowSearchResults] = useState(false);

  const upcomingAppointments = appointments.filter(app => app.status === 'upcoming');

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const results = searchDoctors(query);
      setSearchResults(results);
      setShowSearchResults(true);
    } else {
      setShowSearchResults(false);
      setSearchResults([]);
    }
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    deleteAppointment(appointmentId);
  };

  const handleDoctorSelect = (doctor) => {
    setSearchQuery('');
    setShowSearchResults(false);
    router.push('/doctors');
  };

  const quickActions = [
    {
      title: 'Takim i ri',
      icon: Calendar,
      color: '#2563EB',
      onPress: () => router.push('/doctors')
    },
    {
      title: 'Takimet e mia',
      icon: Clock,
      color: '#10B981',
      onPress: () => router.push('/appointments')
    },
    {
      title: 'Gjej mjekë',
      icon: Stethoscope,
      color: '#F59E0B',
      onPress: () => router.push('/doctors')
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Preshendetje!</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.appName}>KUPot'dhem</Text>
            <TouchableOpacity style={styles.notificationBtn}>
              <Bell size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Kërko mjekë..."
              value={searchQuery}
              onChangeText={handleSearch}
              onFocus={() => searchQuery && setShowSearchResults(true)}
            />
          </View>
          
          {/* Search Results */}
          {showSearchResults && (
            <View style={styles.searchResults}>
              {searchResults.length > 0 ? (
                <ScrollView 
                  style={styles.searchResultsScroll}
                  showsVerticalScrollIndicator={true}
                  nestedScrollEnabled={true}
                >
                  {searchResults.map((item) => (
                    <TouchableOpacity 
                      key={item.id}
                      style={styles.searchResultItem}
                      onPress={() => handleDoctorSelect(item)}
                    >
                      <Image source={{ uri: item.image }} style={styles.searchResultImage} />
                      <View style={styles.searchResultInfo}>
                        <Text style={styles.searchResultName}>{item.name}</Text>
                        <Text style={styles.searchResultSpecialty}>{item.specialty}</Text>
                        <View style={styles.searchResultMeta}>
                          <Star size={12} color="#FCD34D" fill="#FCD34D" />
                          <Text style={styles.searchResultRating}>{item.rating}</Text>
                          <MapPin size={12} color="#6B7280" />
                          <Text style={styles.searchResultLocation}>{item.location}</Text>
                        </View>
                      </View>
                      <ChevronRight size={16} color="#9CA3AF" />
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              ) : (
                <View style={styles.noResults}>
                  <Text style={styles.noResultsText}>Nuk u gjetën mjekë</Text>
                </View>
              )}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Qasje e shpejtë</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={[styles.quickActionCard, { borderColor: action.color }]}
                onPress={action.onPress}
              >
                <View style={[styles.quickActionIcon, { backgroundColor: action.color }]}>
                  <action.icon size={24} color="white" />
                </View>
                <Text style={styles.quickActionText}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Appointments */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Takimet e ardhshme</Text>
            <TouchableOpacity onPress={() => router.push('/appointments')}>
              <Text style={styles.seeAllText}>Shiko të gjitha</Text>
            </TouchableOpacity>
          </View>
          
          {upcomingAppointments.length > 0 ? (
            upcomingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <TouchableOpacity 
                  style={styles.appointmentContent}
                  onPress={() => router.push('/appointments')}
                >
                  <View style={styles.appointmentDate}>
                    <Text style={styles.appointmentDateText}>{appointment.date}</Text>
                    <Text style={styles.appointmentTimeText}>{appointment.time}</Text>
                  </View>
                  <View style={styles.appointmentDetails}>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.specialty}>{appointment.specialty}</Text>
                    <Text style={styles.appointmentType}>{appointment.type}</Text>
                  </View>
                  <ChevronRight size={20} color="#9CA3AF" />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.deleteButton}
                  onPress={() => handleDeleteAppointment(appointment.id)}
                >
                  <Trash2 size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={48} color="#D1D5DB" />
              <Text style={styles.emptyStateText}>Nuk ka takime të ardhshme</Text>
              <TouchableOpacity 
                style={styles.bookAppointmentBtn}
                onPress={() => router.push('/doctors')}
              >
                <Text style={styles.bookAppointmentBtnText}>Rezervo takim</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Health Tips */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Gesundheitstipp des Tages</Text>
            <Text style={styles.tipTitle}>💧 Pi ujë të mjaftueshëm</Text>
            <Text style={styles.tipText}>
              Pini të paktën 2 litra ujë çdo ditë për të mbështetur trupin tuaj në mënyrë optimale.
            </Text>
          </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  greeting: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
  },
  notificationBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
    position: 'relative',
    zIndex: 1000,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  searchResults: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    maxHeight: 300,
  },
  searchResultsScroll: {
    maxHeight: 280,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchResultImage: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  searchResultInfo: {
    flex: 1,
  },
  searchResultName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  searchResultSpecialty: {
    fontSize: 12,
    color: '#2563EB',
    marginTop: 2,
  },
  searchResultMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  searchResultRating: {
    fontSize: 12,
    color: '#6B7280',
    marginRight: 8,
  },
  searchResultLocation: {
    fontSize: 12,
    color: '#6B7280',
  },
  noResults: {
    padding: 20,
    alignItems: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#6B7280',
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  seeAllText: {
    color: '#2563EB',
    fontSize: 14,
    fontWeight: '500',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    textAlign: 'center',
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  appointmentDate: {
    marginRight: 16,
    alignItems: 'center',
    minWidth: 60,
  },
  appointmentDateText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  appointmentTimeText: {
    fontSize: 16,
    color: '#2563EB',
    fontWeight: '600',
    marginTop: 2,
  },
  appointmentDetails: {
    flex: 1,
  },
  doctorName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  appointmentType: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 4,
  },
  deleteButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    marginLeft: 12,
  },
  emptyState: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
    marginBottom: 16,
  },
  bookAppointmentBtn: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  bookAppointmentBtnText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tipCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  tipTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 8,
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});