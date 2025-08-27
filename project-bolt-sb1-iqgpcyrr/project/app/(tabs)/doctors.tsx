import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  TextInput,
  Modal,
  Alert
} from 'react-native';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Clock,
  Calendar,
  X
} from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function DoctorsScreen() {
  const { doctors, addAppointment } = useAppContext();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('Konsultim');

  // Get unique specialties
  const specialties = Array.from(new Set(doctors.map(doctor => doctor.specialty)));

  // Filter doctors
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = !selectedSpecialty || doctor.specialty === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setShowBookingModal(true);
  };

  const confirmBooking = () => {
    if (!selectedDate || !selectedTime) {
      Alert.alert('Gabim', 'Ju lutemi zgjidhni datën dhe orën.');
      return;
    }

    const appointment = {
      doctorId: selectedDoctor.id,
      doctorName: selectedDoctor.name,
      specialty: selectedDoctor.specialty,
      date: selectedDate,
      time: selectedTime,
      type: appointmentType,
      status: 'upcoming' as const,
      notes: `Takim me ${selectedDoctor.name}`
    };

    addAppointment(appointment);
    setShowBookingModal(false);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    
    Alert.alert(
      'Takimi u rezervua!', 
      `Takimi juaj me ${selectedDoctor.name} më ${selectedDate} në orën ${selectedTime} u rezervua me sukses.`,
      [
        { text: 'OK', onPress: () => router.push('/appointments') }
      ]
    );
  };

  // Sample dates for next 14 days
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      const day = date.getDate();
      const month = date.toLocaleDateString('de-DE', { month: 'short' });
      const weekday = date.toLocaleDateString('de-DE', { weekday: 'short' });
      dates.push({
        full: date.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' }),
        display: `${weekday}, ${day}. ${month}`,
        value: `${day}. ${month} ${date.getFullYear()}`
      });
    }
    return dates;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Gjej mjekë</Text>
            <Text style={styles.subtitle}>
              {filteredDoctors.length} mjekë të disponueshëm
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#6B7280" />
            <TextInput
              style={styles.searchInput}
              placeholder="Kërko mjek ose specialitet..."
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>
        </View>

        {/* Specialty Filter */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[
                styles.filterChip,
                !selectedSpecialty && styles.filterChipActive
              ]}
              onPress={() => setSelectedSpecialty('')}
            >
              <Text style={[
                styles.filterChipText,
                !selectedSpecialty && styles.filterChipTextActive
              ]}>
                Të gjithë
              </Text>
            </TouchableOpacity>
            {specialties.map((specialty) => (
              <TouchableOpacity
                key={specialty}
                style={[
                  styles.filterChip,
                  selectedSpecialty === specialty && styles.filterChipActive
                ]}
                onPress={() => setSelectedSpecialty(
                  selectedSpecialty === specialty ? '' : specialty
                )}
              >
                <Text style={[
                  styles.filterChipText,
                  selectedSpecialty === specialty && styles.filterChipTextActive
                ]}>
                  {specialty}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Doctors List */}
        <View style={styles.doctorsList}>
          {filteredDoctors.map((doctor) => (
            <View key={doctor.id} style={styles.doctorCard}>
              <View style={styles.doctorHeader}>
                <Image 
                  source={{ uri: doctor.image }} 
                  style={styles.doctorImage}
                />
                <View style={styles.doctorInfo}>
                  <Text style={styles.doctorName}>{doctor.name}</Text>
                  <Text style={styles.doctorSpecialty}>{doctor.specialty}</Text>
                  <Text style={styles.doctorExperience}>{doctor.experience}</Text>
                  
                  <View style={styles.doctorMeta}>
                    <View style={styles.ratingContainer}>
                      <Star size={16} color="#FCD34D" fill="#FCD34D" />
                      <Text style={styles.rating}>{doctor.rating}</Text>
                    </View>
                    <View style={styles.locationContainer}>
                      <MapPin size={14} color="#6B7280" />
                      <Text style={styles.location}>{doctor.location}</Text>
                    </View>
                  </View>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{doctor.price}</Text>
                </View>
              </View>

              <View style={styles.availableTimes}>
                <Text style={styles.availableTimesTitle}>Oraret e disponueshme:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {doctor.availableSlots.slice(0, 4).map((time, index) => (
                    <View key={index} style={styles.timeSlot}>
                      <Clock size={12} color="#2563EB" />
                      <Text style={styles.timeSlotText}>{time}</Text>
                    </View>
                  ))}
                  {doctor.availableSlots.length > 4 && (
                    <View style={styles.timeSlot}>
                      <Text style={styles.timeSlotText}>+{doctor.availableSlots.length - 4}</Text>
                    </View>
                  )}
                </ScrollView>
              </View>

              <TouchableOpacity 
                style={styles.bookButton}
                onPress={() => handleBookAppointment(doctor)}
              >
                <Calendar size={18} color="white" />
                <Text style={styles.bookButtonText}>Rezervo takim</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Rezervo takim</Text>
            <TouchableOpacity
              onPress={() => setShowBookingModal(false)}
              style={styles.closeButton}
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            {selectedDoctor && (
              <>
                {/* Doctor Info */}
                <View style={styles.modalDoctorInfo}>
                  <Image 
                    source={{ uri: selectedDoctor.image }} 
                    style={styles.modalDoctorImage}
                  />
                  <View>
                    <Text style={styles.modalDoctorName}>{selectedDoctor.name}</Text>
                    <Text style={styles.modalDoctorSpecialty}>{selectedDoctor.specialty}</Text>
                    <Text style={styles.modalDoctorPrice}>{selectedDoctor.price}</Text>
                  </View>
                </View>

                {/* Date Selection */}
                <View style={styles.selectionSection}>
                  <Text style={styles.selectionTitle}>Zgjidh datën</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {getAvailableDates().slice(0, 7).map((date, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.dateOption,
                          selectedDate === date.value && styles.dateOptionActive
                        ]}
                        onPress={() => setSelectedDate(date.value)}
                      >
                        <Text style={[
                          styles.dateOptionText,
                          selectedDate === date.value && styles.dateOptionTextActive
                        ]}>
                          {date.display}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Time Selection */}
                <View style={styles.selectionSection}>
                  <Text style={styles.selectionTitle}>Zgjidh orën</Text>
                  <View style={styles.timeGrid}>
                    {selectedDoctor.availableSlots.map((time, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.timeOption,
                          selectedTime === time && styles.timeOptionActive
                        ]}
                        onPress={() => setSelectedTime(time)}
                      >
                        <Text style={[
                          styles.timeOptionText,
                          selectedTime === time && styles.timeOptionTextActive
                        ]}>
                          {time}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                {/* Appointment Type */}
                <View style={styles.selectionSection}>
                  <Text style={styles.selectionTitle}>Lloji i takimit</Text>
                  {['Konsultim', 'Ekzaminim', 'Kontroll pasues', 'Parandalim'].map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.typeOption,
                        appointmentType === type && styles.typeOptionActive
                      ]}
                      onPress={() => setAppointmentType(type)}
                    >
                      <Text style={[
                        styles.typeOptionText,
                        appointmentType === type && styles.typeOptionTextActive
                      ]}>
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Book Button */}
                <TouchableOpacity 
                  style={[
                    styles.confirmBookButton,
                    (!selectedDate || !selectedTime) && styles.confirmBookButtonDisabled
                  ]}
                  onPress={confirmBooking}
                  disabled={!selectedDate || !selectedTime}
                >
                  <Text style={styles.confirmBookButtonText}>Konfirmo takimin</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
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
  searchContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
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
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#1F2937',
  },
  filterContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: 'white',
  },
  doctorsList: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  doctorCard: {
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
  doctorHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  doctorImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  doctorInfo: {
    flex: 1,
  },
  doctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  doctorSpecialty: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 2,
    fontWeight: '500',
  },
  doctorExperience: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  doctorMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  location: {
    fontSize: 12,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10B981',
  },
  availableTimes: {
    marginBottom: 16,
  },
  availableTimesTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  timeSlot: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 4,
  },
  timeSlotText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '500',
  },
  bookButton: {
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  bookButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeButton: {
    padding: 8,
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalDoctorInfo: {
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'center',
  },
  modalDoctorImage: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 16,
  },
  modalDoctorName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  modalDoctorSpecialty: {
    fontSize: 14,
    color: '#2563EB',
    marginTop: 2,
  },
  modalDoctorPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginTop: 4,
  },
  selectionSection: {
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  dateOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  dateOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  dateOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateOptionTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  timeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    minWidth: 80,
    alignItems: 'center',
  },
  timeOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  timeOptionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  timeOptionTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  typeOption: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'white',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    marginBottom: 8,
  },
  typeOptionActive: {
    borderColor: '#2563EB',
    backgroundColor: '#EFF6FF',
  },
  typeOptionText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  typeOptionTextActive: {
    color: '#2563EB',
    fontWeight: '600',
  },
  confirmBookButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmBookButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  confirmBookButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});