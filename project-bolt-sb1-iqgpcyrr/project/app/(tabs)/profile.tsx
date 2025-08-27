import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Image,
  Switch
} from 'react-native';
import { User, Settings, Bell, Shield, CircleHelp as HelpCircle, LogOut, ChevronRight, CreditCard as Edit3, Calendar, Star, Clock } from 'lucide-react-native';
import { useAppContext } from '@/contexts/AppContext';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { appointments } = useAppContext();
  const router = useRouter();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  // Calculate stats
  const totalAppointments = appointments.length;
  const completedAppointments = appointments.filter(a => a.status === 'completed').length;
  const upcomingAppointments = appointments.filter(a => a.status === 'upcoming').length;

  const profileSections = [
    {
      title: 'Account',
      items: [
        {
          icon: Edit3,
          title: 'Ndrysho profilin',
          subtitle: 'Emri, email-i dhe të dhënat personale',
          onPress: () => console.log('Edit profile')
        },
        {
          icon: Calendar,
          title: 'Takimet e mia',
          subtitle: `${totalAppointments} takime gjithsej`,
          onPress: () => router.push('/appointments')
        }
      ]
    },
    {
      title: 'Cilësimet',
      items: [
        {
          icon: Bell,
          title: 'Njoftimet',
          subtitle: 'Njoftimet push për takimet',
          onPress: () => {},
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled
        },
        {
          icon: Shield,
          title: 'Privatësia',
          subtitle: 'Privatësia dhe siguria',
          onPress: () => console.log('Privacy')
        },
        {
          icon: Settings,
          title: 'Cilësimet e aplikacionit',
          subtitle: 'Gjuha, dizajni dhe më shumë',
          onPress: () => console.log('Settings')
        }
      ]
    },
    {
      title: 'Mbështetja',
      items: [
        {
          icon: HelpCircle,
          title: 'Ndihmë & Mbështetje',
          subtitle: 'Pyetje të shpeshta dhe kontakti',
          onPress: () => console.log('Help')
        },
        {
          icon: LogOut,
          title: 'Dil',
          subtitle: 'Dil nga llogaria juaj',
          onPress: () => console.log('Logout'),
          isDestructive: true
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Profili</Text>
        </View>

        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.userInfo}>
            <View style={styles.avatarContainer}>
              <User size={32} color="white" />
            </View>
            <View style={styles.userDetails}>
              <Text style={styles.userName}>Max Mustermann</Text>
              <Text style={styles.userEmail}>max.mustermann@email.com</Text>
              <Text style={styles.memberSince}>Anëtar që nga Janari 2024</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton}>
            <Edit3 size={16} color="#2563EB" />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#EFF6FF' }]}>
              <Calendar size={24} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{totalAppointments}</Text>
            <Text style={styles.statLabel}>Takime</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#F0FDF4' }]}>
              <Clock size={24} color="#10B981" />
            </View>
            <Text style={styles.statNumber}>{upcomingAppointments}</Text>
            <Text style={styles.statLabel}>Të ardhshme</Text>
          </View>
          <View style={styles.statCard}>
            <View style={[styles.statIcon, { backgroundColor: '#FEF3C7' }]}>
              <Star size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statNumber}>{completedAppointments}</Text>
            <Text style={styles.statLabel}>Të përfunduara</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => router.push('/doctors')}
          >
            <Calendar size={20} color="white" />
            <Text style={styles.quickActionText}>Takim i ri</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.quickActionButton, styles.quickActionButtonSecondary]}
            onPress={() => router.push('/appointments')}
          >
            <Clock size={20} color="#2563EB" />
            <Text style={[styles.quickActionText, styles.quickActionTextSecondary]}>
              Takimet e mia
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.sectionContent}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast
                  ]}
                  onPress={item.onPress}
                >
                  <View style={styles.menuItemContent}>
                    <View style={[
                      styles.menuItemIcon,
                      item.isDestructive && styles.menuItemIconDestructive
                    ]}>
                      <item.icon 
                        size={20} 
                        color={item.isDestructive ? "#EF4444" : "#6B7280"} 
                      />
                    </View>
                    <View style={styles.menuItemText}>
                      <Text style={[
                        styles.menuItemTitle,
                        item.isDestructive && styles.menuItemTitleDestructive
                      ]}>
                        {item.title}
                      </Text>
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemAction}>
                    {item.hasSwitch ? (
                      <Switch
                        value={item.switchValue}
                        onValueChange={item.onSwitchChange}
                        trackColor={{ false: '#E5E7EB', true: '#93C5FD' }}
                        thumbColor={item.switchValue ? '#2563EB' : '#F3F4F6'}
                      />
                    ) : (
                      <ChevronRight 
                        size={20} 
                        color={item.isDestructive ? "#EF4444" : "#9CA3AF"} 
                      />
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appInfoText}>KUPot'dhem</Text>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
  },
  profileCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2563EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  memberSince: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#EFF6FF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
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
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
    fontWeight: '500',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
    marginTop: 20,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#2563EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  quickActionButtonSecondary: {
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#2563EB',
  },
  quickActionText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  quickActionTextSecondary: {
    color: '#2563EB',
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  sectionContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuItemIconDestructive: {
    backgroundColor: '#FEF2F2',
  },
  menuItemText: {
    flex: 1,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#1F2937',
  },
  menuItemTitleDestructive: {
    color: '#EF4444',
  },
  menuItemSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  menuItemAction: {
    marginLeft: 12,
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  appInfoText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  versionText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});