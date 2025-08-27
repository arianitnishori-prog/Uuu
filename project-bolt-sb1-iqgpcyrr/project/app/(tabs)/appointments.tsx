import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert
} from 'react-native';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  X,
  ChevronRight,
  Filter
} from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';

type FilterType = 'all' | 'upcoming' | 'completed';

export default function AppointmentsScreen() {
  const { appointments, deleteAppointment } = useAppContext();
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'all') return true;
    return appointment.status === filter;
  });

  const handleDeleteAppointment = (appointmentId: string, doctorName: string) => {
    Alert.alert(
      'Fshi takimin',
      `A doni të fshini takimin me ${doctorName}?`,
      [
        { text: 'Anulo', style: 'cancel' },
        { 
          text: 'Fshi', 
          style: 'destructive',
          onPress: () => deleteAppointment(appointmentId)
        }
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'upcoming': return '#10B981';
      case 'completed': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'upcoming': return 'I ardhshëm';
      case 'completed': return 'I përfunduar';
      default: return status;
    }
  };

  const upcomingCount = appointments.filter(a => a.status === 'upcoming').length;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Takimet e mia</Text>
            <Text style={styles.subtitle}>
              {upcomingCount} takime të ardhshme
            </Text>
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>

        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[
              { key: 'all', label: 'Të gjitha' },
              { key: 'upcoming', label: 'Të ardhshme' },
              { key: 'completed', label: 'Të përfunduara' }
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.filterTab,
                  filter === item.key && styles.filterTabActive
                ]}
                onPress={() => setFilter(item.key as FilterType)}
              >
                <Text style={[
                  styles.filterTabText,
                  filter === item.key && styles.filterTabTextActive
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Appointments List */}
        <View style={styles.appointmentsList}>
          {filteredAppointments.length > 0 ? (
            filteredAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentDate}>
                    <Calendar size={20} color="#2563EB" />
                    <Text style={styles.dateText}>{appointment.date}</Text>
                  </View>
                  <View style={[
                    styles.statusBadge, 
                    { backgroundColor: getStatusColor(appointment.status) + '20' }
                  ]}>
                    <Text style={[
                      styles.statusText,
                      { color: getStatusColor(appointment.status) }
                    ]}>
                      {getStatusText(appointment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentContent}>
                  <View style={styles.doctorInfo}>
                    <Text style={styles.doctorName}>{appointment.doctorName}</Text>
                    <Text style={styles.specialty}>{appointment.specialty}</Text>
                    <Text style={styles.appointmentType}>{appointment.type}</Text>
                  </View>

                  <View style={styles.appointmentDetails}>
                    <View style={styles.detailRow}>
                      <Clock size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{appointment.time}</Text>
                    </View>
                    {appointment.notes && (
                      <Text style={styles.notesText}>{appointment.notes}</Text>
                    )}
                  </View>
                </View>

                {appointment.status === 'upcoming' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={styles.deleteBtn}
                      onPress={() => handleDeleteAppointment(appointment.id, appointment.doctorName)}
                    >
                      <X size={16} color="#EF4444" />
                      <Text style={styles.deleteBtnText}>Fshi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.detailsBtn}>
                      <Text style={styles.detailsBtnText}>Detajet</Text>
                      <ChevronRight size={16} color="#2563EB" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Calendar size={64} color="#D1D5DB" />
              <Text style={styles.emptyStateTitle}>
                {filter === 'all' ? 'Nuk ka takime' : `Nuk ka takime ${getStatusText(filter).toLowerCase()}`}
              </Text>
              <Text style={styles.emptyStateText}>
                {filter === 'upcoming' || filter === 'all'
                  ? 'Rezervoni takimin tuaj të parë me një nga mjekët tanë.'
                  : `Nuk keni takime ${getStatusText(filter).toLowerCase()}.`
                }
              </Text>
            </View>
          )}
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {appointments.filter(a => a.status === 'completed').length}
            </Text>
            <Text style={styles.statLabel}>Të përfunduara</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>
              {appointments.filter(a => a.status === 'upcoming').length}
            </Text>
            <Text style={styles.statLabel}>Të ardhshme</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{appointments.filter(a => a.status === 'completed').length}</Text>
            <Text style={styles.statLabel}>Të përfunduara</Text>
          </View>
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  filterBtn: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: {
    backgroundColor: '#2563EB',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterTabTextActive: {
    color: 'white',
  },
  appointmentsList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  appointmentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  appointmentDate: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  appointmentContent: {
    marginBottom: 16,
  },
  doctorInfo: {
    marginBottom: 12,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  specialty: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  appointmentType: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '500',
    marginTop: 4,
  },
  appointmentDetails: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    color: '#6B7280',
  },
  notesText: {
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
    marginTop: 4,
  },
  appointmentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
  },
  deleteBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#EF4444',
  },
  detailsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  detailsBtnText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2563EB',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 32,
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 24,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2563EB',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    fontWeight: '500',
  },
});