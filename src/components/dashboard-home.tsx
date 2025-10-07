import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Download, TrendingUp, Users, Calendar, Pill, Building2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RTLSelect } from './ui/rtl-select';

export function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const { t, isRTL } = useLanguage();

  // Mock data for the chart
  const dailyData = [
    { date: '2024-01-01', appointments: 45, patients: 32, doctors: 8, pharmacies: 3 },
    { date: '2024-01-02', appointments: 52, patients: 38, doctors: 8, pharmacies: 3 },
    { date: '2024-01-03', appointments: 48, patients: 35, doctors: 9, pharmacies: 3 },
    { date: '2024-01-04', appointments: 61, patients: 42, doctors: 9, pharmacies: 4 },
    { date: '2024-01-05', appointments: 55, patients: 40, doctors: 10, pharmacies: 4 },
    { date: '2024-01-06', appointments: 49, patients: 36, doctors: 10, pharmacies: 4 },
    { date: '2024-01-07', appointments: 58, patients: 44, doctors: 11, pharmacies: 4 },
  ];

  const monthlyData = [
    { date: 'Jan 2024', appointments: 1520, patients: 1180, doctors: 45, pharmacies: 12 },
    { date: 'Feb 2024', appointments: 1680, patients: 1250, doctors: 48, pharmacies: 13 },
    { date: 'Mar 2024', appointments: 1780, patients: 1320, doctors: 52, pharmacies: 14 },
    { date: 'Apr 2024', appointments: 1650, patients: 1280, doctors: 55, pharmacies: 15 },
    { date: 'May 2024', appointments: 1820, patients: 1400, doctors: 58, pharmacies: 16 },
    { date: 'Jun 2024', appointments: 1920, patients: 1480, doctors: 60, pharmacies: 17 },
  ];

  const chartData = selectedPeriod === 'day' ? dailyData : monthlyData;

  // Summary statistics
  const totalStats = {
    totalAppointments: 11370,
    totalPatients: 7910,
    totalDoctors: 60,
    totalPharmacies: 17,
    appointmentGrowth: '+12.5%',
    patientGrowth: '+8.3%',
    doctorGrowth: '+5.2%',
    pharmacyGrowth: '+6.7%'
  };

  const handleExportReport = () => {
    // In a real app, this would generate and download a report
    const reportData = {
      period: selectedPeriod,
      data: chartData,
      summary: totalStats,
      generatedAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(reportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `medlife-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <RTLSelect
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            placeholder={t('dashboard.period')}
            className="w-32"
          >
            <SelectItem value="day">{t('dashboard.daily')}</SelectItem>
            <SelectItem value="month">{t('dashboard.monthly')}</SelectItem>
          </RTLSelect>
          <Button onClick={handleExportReport} className="bg-primary hover:bg-primary/90">
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('dashboard.exportReport')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalAppointments')}</CardTitle>
            <Calendar className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStats.totalAppointments.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {totalStats.appointmentGrowth} {t('dashboard.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.totalPatients')}</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStats.totalPatients.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {totalStats.patientGrowth} {t('dashboard.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.activeDoctors')}</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStats.totalDoctors}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {totalStats.doctorGrowth} {t('dashboard.fromLastMonth')}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('dashboard.partnerPharmacies')}</CardTitle>
            <Building2 className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{totalStats.totalPharmacies}</div>
            <div className="flex items-center text-xs text-green-600">
              <TrendingUp className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
              {totalStats.pharmacyGrowth} {t('dashboard.fromLastMonth')}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart Section */}
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            {selectedPeriod === 'day' ? t('dashboard.daily') : t('dashboard.monthly')} {t('dashboard.statisticsTrends')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80" dir={isRTL ? 'rtl' : 'ltr'}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart 
                data={chartData}
                margin={{ top: 20, right: isRTL ? 30 : 5, left: isRTL ? 5 : 30, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12,  dx: isRTL ? -18 : 0, dy:10, textAnchor: isRTL ? 'end' : 'middle' }}
                  tickFormatter={(value) => {
                    if (selectedPeriod === 'day') {
                      const date = new Date(value);
                      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                    } else {
                      // للعرض الشهري
                      const date = new Date(value);
                      return `${date.getMonth() + 1}-${date.getFullYear()}`;
                    }
                  }}
                  reversed={isRTL}
                />
                <YAxis 
                  tick={{ 
                    fontSize: 12, 
                    textAnchor: isRTL ? 'end' : 'start',
                    dx: isRTL ? 5 : -30  // إضافة مسافة متساوية للغتين
                  }} 
                  orientation={isRTL ? 'right' : 'left'}
                  width={isRTL ? 50 : 50}  // عرض ثابت للمحور
                />
                <Tooltip 
                  labelFormatter={(value) => {
                    
                    if (selectedPeriod === 'day') {
                      const date = new Date(value);
                      return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
                    } else {
                      const date = new Date(value);
                      return `${date.getMonth() + 1}-${date.getFullYear()}`;
                    }
                  }}
                  contentStyle={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                />
                <Legend 
                  wrapperStyle={{
                    direction: isRTL ? 'rtl' : 'ltr',
                    textAlign: isRTL ? 'right' : 'left'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="appointments" 
                  stroke="#1e3561" 
                  strokeWidth={3}
                  name={t('dashboard.appointments')}
                  dot={{ fill: '#1e3561', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="patients" 
                  stroke="#f9555c" 
                  strokeWidth={2}
                  name={t('dashboard.patients')}
                  dot={{ fill: '#f9555c', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="doctors" 
                  stroke="#059669" 
                  strokeWidth={2}
                  name={t('dashboard.doctors')}
                  dot={{ fill: '#059669', strokeWidth: 2, r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="pharmacies" 
                  stroke="#7c3aed" 
                  strokeWidth={2}
                  name={t('dashboard.pharmacies')}
                  dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t('dashboard.recentActivity')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.newPatientRegistrationsToday')}</span>
              <span className="font-semibold text-primary">23</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.appointmentsScheduledToday')}</span>
              <span className="font-semibold text-primary">67</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.prescriptionsFilledToday')}</span>
              <span className="font-semibold text-primary">89</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.averageRatingThisMonth')}</span>
              <span className="font-semibold text-primary">4.7/5</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-primary">{t('dashboard.systemHealth')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.serverUptime')}</span>
              <span className="font-semibold text-green-600">99.9%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.databasePerformance')}</span>
              <span className="font-semibold text-green-600">{t('dashboard.excellent')}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.activeUserSessions')}</span>
              <span className="font-semibold text-primary">1,247</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">{t('dashboard.dataBackupStatus')}</span>
              <span className="font-semibold text-green-600">{t('dashboard.complete')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}