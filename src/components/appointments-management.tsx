import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { RTLDialog } from './ui/rtl-dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { CalendarDays, Eye, Filter, ChevronLeft, ChevronRight, Loader2, X } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RTLSelect } from './ui/rtl-select';
import {
  fetchAppointments,
  setFilters,
  clearFilters,
  setCurrentPage
} from '../store/slices/appointmentsSlice';

type AppointmentStatus = 'upcoming' | 'completed' | 'canceled';

interface Appointment {
  doctor_name: string;
  patient_name: string;
  specialization: Array<{
    id: number;
    name: string;
  }>;
  diagnostics: Array<{
    name: string;
    image_path: string;
  }>;
  Analysis: Array<{
    name: string;
    image_path: string;
  }>;
  time: string;
  date: string;
  medicines: Array<{
    medicine_name: string;
    quantity: number;
    number_of_taken_doses: number;
  }>;
  status: AppointmentStatus;
}

interface PaginationInfo {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const doctors = ['All Doctors', 'Dr. Sarah Johnson', 'Dr. Michael Chen', 'Dr. Jennifer Lee'];

export function AppointmentsManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();

  // Redux state
  const {
    appointments,
    loading,
    error,
    pagination,
    filters
  } = useSelector((state) => state.appointments);

  // Local state for UI
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // كشف حجم الشاشة مع إعادة التقييم عند تغيير الحجم
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  React.useEffect(() => {
    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsMobile(newWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // إعادة تقييم حجم الشاشة عند إعادة تحميل المكون
  React.useEffect(() => {
    const checkMobileOnLoad = () => {
      setIsMobile(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };

    // التحقق مرة أخرى بعد تحميل المكون بالكامل
    const timer = setTimeout(checkMobileOnLoad, 100);
    return () => clearTimeout(timer);
  }, []);

  // Fetch appointments when filters change
  useEffect(() => {
    dispatch(fetchAppointments({
      date: filters.date,
      status: filters.status !== 'all' ? filters.status : '',
      page: filters.page
    }));
  }, [dispatch, filters]);

  const applyFilters = () => {
    dispatch(setFilters({
      date: filters.date,
      status: filters.status,
      page: 1 // Reset to first page when applying filters
    }));
  };

  const clearFilters = () => {
    dispatch(clearFilters());
  };

  const handlePageChange = (newPage: number) => {
    dispatch(setCurrentPage(newPage));
  };

  const viewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailsOpen(true);
  };

  const getStatusBadgeProps = (status: AppointmentStatus) => {
    switch (status) {
      case 'upcoming':
        return { variant: 'default' as const, className:  'bg-primary text-white hover:bg-primary' };
      case 'completed':
        return { variant: 'secondary' as const, className: 'bg-green-600 text-white hover:bg-green-700' };
      case 'canceled':
        return { variant: 'destructive' as const, className: 'bg-secondary text-white hover:bg-secondary' };
      default:
        return { variant: 'outline' as const, className: 'bg-secondary text-white hover:bg-secondary' };
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const dayNames = isRTL
      ? ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']
      : ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const dayName = dayNames[date.getDay()];
    const fullDate = dateStr; // التاريخ بالصيغة الكاملة كما هو مطلوب

    return isRTL ? ` ${fullDate} ${dayName}` : `${fullDate} ${dayName}`;
  };

  // مكون عرض الكروت للموبايل
  const MobileAppointmentsCards = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {appointments.map((appointment, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold text-primary">
                {appointment.patient_name}
              </CardTitle>
              <Badge variant={getStatusBadgeProps(appointment.status).variant} className={getStatusBadgeProps(appointment.status).className}>
                {appointment.status === 'upcoming' ? t('appointments.scheduled') :
                 appointment.status === 'completed' ? t('appointments.completed') :
                 t('appointments.cancelled')}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t('appointments.doctorName')}:</span>
                <span className="text-sm">{appointment.doctor_name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t('appointments.date')}:</span>
                <span className="text-sm">{formatDate(appointment.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{t('appointments.time')}:</span>
                <span className="text-sm">{appointment.time}</span>
              </div>
            </div>
            <div className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => viewDetails(appointment)}
                className="w-full flex items-center justify-center gap-2"
              >
                <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('pharmacy.viewDetails')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

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
              <Label>{t('appointments.date')}</Label>
              <Input
                type="date"
                value={filters.date}
                onChange={(e) => dispatch(setFilters({ date: e.target.value }))}
              />
            </div>

            <div>
              <Label>{t('appointments.status')}</Label>
              <RTLSelect
                value={filters.status}
                onValueChange={(value) => dispatch(setFilters({ status: value }))}
                placeholder={t('appointments.status')}
              >
                <SelectItem value="all">{t('appointments.allStatuses')}</SelectItem>
                <SelectItem value="upcoming">{t('appointments.scheduled')}</SelectItem>
                <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                <SelectItem value="canceled">{t('appointments.cancelled')}</SelectItem>
              </RTLSelect>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={applyFilters}>{t('common.apply')}</Button>
              <Button variant="outline" onClick={() => window.location.reload()}>{t('common.clear')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Appointments Display */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('appointments.title')} ({pagination.total})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="p-6 text-center">
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>{t('appointments.loadingAppointments')}</span>
              </div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">{t('appointments.errorLoading')}: {error}</div>
          ) : (
            <>
              {/* عرض الجدول في الشاشات الكبيرة */}
              {!isMobile ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.patientName')}</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.doctorName')}</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.date')} </TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}> {t('appointments.time')}</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.status')}</TableHead>
                      <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.map((appointment, index) => (
                      <TableRow key={index}>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>{appointment.patient_name}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>{appointment.doctor_name}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                        
                            <div>{formatDate(appointment.date)}</div>
                        
                        
                        </TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                          
                          
                            <div className="text-sm text-muted-foreground">{appointment.time}</div>
                          
                        </TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                          <Badge variant={getStatusBadgeProps(appointment.status).variant} className={getStatusBadgeProps(appointment.status).className}>
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
              ) : (
                /* عرض الكروت في الموبايل */
                <div className="p-4">
                  <MobileAppointmentsCards />
                </div>
              )}

              {/* Pagination */}
              {pagination.last_page > 1 && (
                <div className="p-4 flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                  
                    disabled={pagination.current_page >= pagination.last_page}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  
                    {isRTL ? 'التالي' : 'Next'}
                  </Button>

                  <span className="text-sm text-muted-foreground">
                    {t('common.page')} {pagination.current_page} {t('common.of')} {pagination.last_page} {t('common.pagination')}
                  </span>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page <= 1}
                  >
                    {isRTL ? 'السابق' : 'Previous'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Appointment Details Dialog */}
      <RTLDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={`${t('appointments.title')} ${t('pharmacy.viewDetails')}`}
        maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
      >
        {selectedAppointment && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('appointments.patientName')}</Label>
                <div className="p-2 bg-muted rounded">{selectedAppointment.patient_name}</div>
              </div>
              <div>
                <Label>{t('appointments.doctorName')}</Label>
                <div className="p-2 bg-muted rounded">{selectedAppointment.doctor_name}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>{t('appointments.date')}</Label>
                <div className={`p-2 bg-muted rounded ${isMobile ? 'text-sm' : ''}`}>{formatDate(selectedAppointment.date)}</div>
              </div>
              <div>
                <Label>{t('appointments.time')}</Label>
                <div className="p-2 bg-muted rounded">{selectedAppointment.time}</div>
              </div>
              <div>
                <Label>Status</Label>
                <div className="p-2">
                  <Badge variant={getStatusBadgeProps(selectedAppointment.status).variant} className={getStatusBadgeProps(selectedAppointment.status).className}>
                   
                       {selectedAppointment.status === 'upcoming' ? t('appointments.scheduled') :
                             selectedAppointment.status === 'completed' ? t('appointments.completed') :
                             t('appointments.cancelled')}
                  </Badge>
                </div>
              </div>
            </div>

            {selectedAppointment.specialization && selectedAppointment.specialization.length > 0 && (
              <div >
                <Label>{t('appointments.specialization')}</Label>
                <div className="p-3 bg-muted rounded mt-1 ">
                  {selectedAppointment.specialization.map((spec, index) => (
                    <span key={index} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm mr-2 mb-1">
                      {spec.name}
                    <span>   </span>
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedAppointment.diagnostics && selectedAppointment.diagnostics.length > 0 && (
              <div>
               <Label>{t('appointments.diagnostics')}</Label>
                <div className="p-3 bg-muted rounded mt-1">
                  {selectedAppointment.diagnostics.map((diagnostic, index) => (
                    <div key={index} className="mb-2">
                      <div className="font-medium">{diagnostic.name}</div>
                      {diagnostic.image_path && (
                        <img
                          src={diagnostic.image_path}
                          alt={diagnostic.name}
                          className="w-20 h-20 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

       {selectedAppointment.Analysis && selectedAppointment.Analysis.length > 0 && (
              <div>
               <Label>{t('appointments.Analysis')}</Label>
                <div className="p-3 bg-muted rounded mt-1">
                  {selectedAppointment.Analysis.map((analysis, index) => (
                    <div key={index} className="mb-2">
                      <div className="font-medium">{analysis.name}</div>
                      {analysis.image_path && (
                        <img
                          src={analysis.image_path}
                          alt={analysis.name}
                          className="w-20 h-20 object-cover rounded mt-1"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {selectedAppointment.medicines && selectedAppointment.medicines.length > 0 && (
              <div>
               <Label>{t('appointments.prescribedMedicines')}</Label>
                <div className="p-3 bg-muted rounded mt-1">
                <div className="space-y-2">
                  {selectedAppointment.medicines.map((medicine, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                      <span>{medicine.medicine_name}</span>
                      <span className="text-sm text-muted-foreground">
                        {medicine.quantity} {t('appointments.units')} ({medicine.number_of_taken_doses} {t('appointments.taken')})
                      </span>
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setIsDetailsOpen(false)}>{t('common.close')}</Button>
            </div>
          </div>
        )}
      </RTLDialog>
    </div>
  );
}