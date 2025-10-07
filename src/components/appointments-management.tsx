import React, { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CalendarDays, Eye, Filter } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RTLSelect } from './ui/rtl-select';

type AppointmentStatus = 'upcoming' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  diagnosis?: string;
  prescribedMedicines?: string[];
  notes?: string;
}

const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-15',
    time: '10:00 AM',
    status: 'upcoming',
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    doctorName: 'Dr. Michael Chen',
    date: '2024-01-14',
    time: '2:30 PM',
    status: 'completed',
    diagnosis: 'Hypertension follow-up',
    prescribedMedicines: ['Lisinopril 10mg', 'Hydrochlorothiazide 25mg'],
    notes: 'Blood pressure well controlled. Continue current medication regimen.'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-01-13',
    time: '11:15 AM',
    status: 'completed',
    diagnosis: 'Annual check-up',
    prescribedMedicines: ['Vitamin D3 1000IU'],
    notes: 'Overall health good. Recommend regular exercise and vitamin D supplementation.'
  },
  {
    id: '4',
    patientName: 'Lisa Brown',
    doctorName: 'Dr. Jennifer Lee',
    date: '2024-01-12',
    time: '9:00 AM',
    status: 'cancelled',
  }
];

const doctors = ['All Doctors', 'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Jennifer Lee'];

export function AppointmentsManagement() {
  const { t, isRTL } = useLanguage();
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>(mockAppointments);
  const [selectedDoctor, setSelectedDoctor] = useState('All Doctors');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const applyFilters = () => {
    let filtered = appointments;

    if (selectedDoctor !== 'All Doctors') {
      filtered = filtered.filter(apt => apt.doctorName === selectedDoctor);
    }

    if (selectedDate) {
      filtered = filtered.filter(apt => apt.date === selectedDate);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedStatus);
    }

    setFilteredAppointments(filtered);
  };

  const clearFilters = () => {
    setSelectedDoctor('All Doctors');
    setSelectedDate('');
    setSelectedStatus('all');
    setFilteredAppointments(appointments);
  };

  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const getStatusBadgeVariant = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return 'default';
      case 'completed':
        return 'secondary';
      case 'cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('common.filter')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t('appointments.doctorName')}</Label>
              <RTLSelect
                value={selectedDoctor}
                onValueChange={setSelectedDoctor}
                placeholder={t('appointments.doctorName')}
              >
                {doctors.map(doctor => (
                  <SelectItem key={doctor} value={doctor}>{doctor}</SelectItem>
                ))}
              </RTLSelect>
            </div>
            
            <div>
              <Label>{t('appointments.date')}</Label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            
            <div>
              <Label>{t('appointments.status')}</Label>
              <RTLSelect
                value={selectedStatus}
                onValueChange={setSelectedStatus}
                placeholder={t('appointments.status')}
              >
                <SelectItem value="all">{t('appointments.allStatuses')}</SelectItem>
                <SelectItem value="upcoming">{t('appointments.scheduled')}</SelectItem>
                <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
              </RTLSelect>
            </div>
            
            <div className="flex items-end gap-2">
              <Button onClick={applyFilters}>{t('common.apply')}</Button>
              <Button variant="outline" onClick={clearFilters}>{t('common.clear')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('appointments.title')} ({filteredAppointments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.patientName')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.doctorName')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.date')} & {t('appointments.time')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.status')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAppointments.map((appointment) => (
                <TableRow key={appointment.id}>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{appointment.patientName}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{appointment.doctorName}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div>
                      <div>{formatDate(appointment.date)}</div>
                      <div className="text-sm text-muted-foreground">{appointment.time}</div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Badge variant={getStatusBadgeVariant(appointment.status)}>
                      {appointment.status === 'upcoming' ? t('appointments.scheduled') :
                       appointment.status === 'completed' ? t('appointments.completed') :
                       t('appointments.cancelled')}
                    </Badge>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(appointment)}
                      className="flex items-center gap-2"
                    >
                      <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('pharmacy.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('appointments.title')} {t('pharmacy.viewDetails')}</DialogTitle>
          </DialogHeader>
          
          {selectedAppointment && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('appointments.patientName')}</Label>
                  <div className="p-2 bg-muted rounded">{selectedAppointment.patientName}</div>
                </div>
                <div>
                  <Label>{t('appointments.doctorName')}</Label>
                  <div className="p-2 bg-muted rounded">{selectedAppointment.doctorName}</div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>{t('appointments.date')}</Label>
                  <div className="p-2 bg-muted rounded">{formatDate(selectedAppointment.date)}</div>
                </div>
                <div>
                  <Label>Time</Label>
                  <div className="p-2 bg-muted rounded">{selectedAppointment.time}</div>
                </div>
                <div>
                  <Label>Status</Label>
                  <div className="p-2">
                    <Badge variant={getStatusBadgeVariant(selectedAppointment.status)}>
                      {selectedAppointment.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedAppointment.status === 'completed' && (
                <>
                  <div>
                    <Label>Diagnosis</Label>
                    <div className="p-3 bg-muted rounded mt-1">
                      {selectedAppointment.diagnosis || 'No diagnosis recorded'}
                    </div>
                  </div>

                  <div>
                    <Label>Prescribed Medicines</Label>
                    <div className="p-3 bg-muted rounded mt-1">
                      {selectedAppointment.prescribedMedicines && selectedAppointment.prescribedMedicines.length > 0 ? (
                        <ul className="list-disc list-inside space-y-1">
                          {selectedAppointment.prescribedMedicines.map((medicine, index) => (
                            <li key={index}>{medicine}</li>
                          ))}
                        </ul>
                      ) : (
                        'No medicines prescribed'
                      )}
                    </div>
                  </div>

                  <div>
                    <Label>Notes</Label>
                    <div className="p-3 bg-muted rounded mt-1">
                      {selectedAppointment.notes || 'No additional notes'}
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}