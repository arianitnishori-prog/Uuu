import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  experience: string;
  location: string;
  availableSlots: string[];
  price: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  date: string;
  time: string;
  type: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  notes?: string;
}

interface AppContextType {
  appointments: Appointment[];
  doctors: Doctor[];
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  deleteAppointment: (appointmentId: string) => void;
  updateAppointment: (appointmentId: string, updates: Partial<Appointment>) => void;
  getDoctorById: (doctorId: string) => Doctor | undefined;
  searchDoctors: (query: string) => Doctor[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);

  // Sample doctors data
  const doctors: Doctor[] = [
    // Krankenhäuser aus Bild 1
    {
      id: '1',
      name: 'Dr. Nebih Meha',
      specialty: 'Mjekësi e Përgjithshme',
      image: 'https://images.pexels.com/photos/559136/pexels-photo-559136.jpeg',
      rating: 3.4,
      experience: '12 vjet përvojë pune',
      location: 'Rruga "Nebih Meha", Prishtinë',
      availableSlots: ['08:00', '09:30', '11:00', '14:00', '15:30'],
      price: '25€'
    },
    {
      id: '2',
      name: 'Dr. Arben Krasniqi',
      specialty: 'Mjekësi e Përgjithshme',
      image: 'https://images.pexels.com/photos/582750/pexels-photo-582750.jpeg',
      rating: 3.7,
      experience: '8 vjet përvojë pune',
      location: 'Sante Plus General Hospital, Magistralja',
      availableSlots: ['09:00', '10:30', '13:00', '16:30'],
      price: '30€'
    },
    {
      id: '3',
      name: 'Dr. Fatmir Kavaja',
      specialty: 'Kardiologji',
      image: 'https://images.pexels.com/photos/1181680/pexels-photo-1181680.jpeg',
      rating: 3.2,
      experience: '15 vjet përvojë pune',
      location: 'Kavaja Hospital, H4XJ+X39',
      availableSlots: ['08:30', '10:00', '14:30', '17:00'],
      price: '40€'
    },
    {
      id: '4',
      name: 'Dr. Agim Përgjithshëm',
      specialty: 'Kirurgji',
      image: 'https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg',
      rating: 3.3,
      experience: '10 vjet përvojë pune',
      location: 'Spitali i Përgjithshëm, 6P3J+G4F, Shkronjat',
      availableSlots: ['07:30', '09:00', '13:30', '15:00'],
      price: '45€'
    },
    {
      id: '5',
      name: 'Dr. Bahri Specialty',
      specialty: 'Specialitete të Ndryshme',
      image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
      rating: 4.6,
      experience: '18 vjet përvojë pune',
      location: 'Bahçeci Specialty Hospital, E65',
      availableSlots: ['08:00', '11:00', '14:00', '17:00'],
      price: '60€'
    },
    {
      id: '6',
      name: 'Dr. Mehmet Poliklinika',
      specialty: 'Mjekësi e Përgjithshme',
      image: 'https://images.pexels.com/photos/6203459/pexels-photo-6203459.jpeg',
      rating: 4.0,
      experience: '7 vjet përvojë pune',
      location: 'Poliklinika Kavaja, M529+6H7, Mehmet',
      availableSlots: ['09:30', '12:00', '15:30', '18:00'],
      price: '28€'
    },
    // Krankenhäuser aus Bild 2
    {
      id: '7',
      name: 'Dr. John American',
      specialty: 'Mjekësi e Përgjithshme',
      image: 'https://images.pexels.com/photos/612608/pexels-photo-612608.jpeg',
      rating: 3.5,
      experience: '20 vjet përvojë pune',
      location: 'American Hospital, Prishtinë',
      availableSlots: ['08:00', '10:00', '13:00', '16:00'],
      price: '50€'
    },
    {
      id: '8',
      name: 'Dr. Vita Spitali',
      specialty: 'Pediatri',
      image: 'https://images.pexels.com/photos/1170979/pexels-photo-1170979.jpeg',
      rating: 3.6,
      experience: '9 vjet përvojë pune',
      location: 'VitaHospital, Prishtinë',
      availableSlots: ['09:00', '11:30', '14:30', '17:30'],
      price: '35€'
    },
    {
      id: '9',
      name: 'Dr. Linda Spitali',
      specialty: 'Dermatologji',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg',
      rating: 3.9,
      experience: '11 vjet përvojë pune',
      location: 'Spitali Lindja, Prishtinë',
      availableSlots: ['08:30', '10:30', '13:30', '16:30'],
      price: '38€'
    },
    {
      id: '10',
      name: 'Dr. Universiteti Klinik',
      specialty: 'Neurologji',
      image: 'https://images.pexels.com/photos/5452293/pexels-photo-5452293.jpeg',
      rating: 3.1,
      experience: '25 vjet përvojë pune',
      location: 'University Clinical Center of Kosovo, Prishtinë',
      availableSlots: ['07:00', '09:30', '12:30', '15:30'],
      price: '55€'
    },
    {
      id: '11',
      name: 'Dr. United Hospital',
      specialty: 'Mjekësi e Përgjithshme',
      image: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg',
      rating: 4.5,
      experience: '14 vjet përvojë pune',
      location: 'UNITED HOSPITAL, Prishtinë',
      availableSlots: ['08:00', '10:00', '14:00', '17:00'],
      price: '42€'
    },
    {
      id: '12',
      name: 'Dr. Aloka Hospital',
      specialty: 'Ortopedi',
      image: 'https://images.pexels.com/photos/5452201/pexels-photo-5452201.jpeg',
      rating: 3.3,
      experience: '16 vjet përvojë pune',
      location: 'Hospital ALOKA, E-65',
      availableSlots: ['09:00', '11:00', '15:00', '18:00'],
      price: '48€'
    },
    {
      id: '13',
      name: 'Dr. Gyne-Kir Gjinekologji',
      specialty: 'Gjinekologji dhe Kirurgji',
      image: 'https://images.pexels.com/photos/1170986/pexels-photo-1170986.jpeg',
      rating: 5.0,
      experience: '22 vjet përvojë pune',
      location: 'GYNE-KIR Gjinekologji dhe Kirurgji, Prishtinë',
      availableSlots: ['08:00', '10:30', '13:00', '16:00'],
      price: '65€'
    }
  ];

  // Initialize with some sample appointments
  useEffect(() => {
    const sampleAppointments: Appointment[] = [
      {
        id: '1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Müller',
        specialty: 'Allgemeinmedizin',
        date: '15. Jan 2025',
        time: '14:30',
        type: 'Kontroll rutinor',
        status: 'upcoming',
        notes: 'Kontroll vjetor parandalues'
      },
      {
        id: '2',
        doctorId: '2',
        doctorName: 'Dr. Michael Weber',
        specialty: 'Kardiologie',
        date: '18. Jan 2025',
        time: '09:15',
        type: 'Kontroll pasues',
        status: 'upcoming',
        notes: 'Kontroll i tensionit'
      }
    ];
    setAppointments(sampleAppointments);
  }, []);

  const addAppointment = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const deleteAppointment = (appointmentId: string) => {
    setAppointments(prev => prev.filter(app => app.id !== appointmentId));
  };

  const updateAppointment = (appointmentId: string, updates: Partial<Appointment>) => {
    setAppointments(prev =>
      prev.map(app =>
        app.id === appointmentId
          ? { ...app, ...updates }
          : app
      )
    );
  };

  const getDoctorById = (doctorId: string): Doctor | undefined => {
    return doctors.find(doctor => doctor.id === doctorId);
  };

  const searchDoctors = (query: string): Doctor[] => {
    if (!query.trim()) return doctors;
    
    return doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(query.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(query.toLowerCase()) ||
      doctor.location.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <AppContext.Provider
      value={{
        appointments,
        doctors,
        addAppointment,
        deleteAppointment,
        updateAppointment,
        getDoctorById,
        searchDoctors,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider }