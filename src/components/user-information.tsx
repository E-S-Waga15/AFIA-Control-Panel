import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { RTLDialog } from './ui/rtl-dialog';
import { Label } from './ui/label';
import { Printer, Search, FileText, ArrowRight } from 'lucide-react';
import { fetchUserProfile, clearUserProfile } from '../store/slices/userProfileSlice';
import { appointmentsAPI } from '../services/api/appointmentsAPI';
import logoImage from '../assets/logo2.png';

// بيانات احتياطية في حالة عدم توفر البيانات من API
const fallbackMockData = {
    id: '0',
    fullName: 'مستخدم غير محدد',
    username: 'unknown',
    role: 'unknown',
    national_id: 'N/A',
    age: 0,
    subscriptionDate: new Date().toISOString().split('T')[0],
    phone: 'N/A',
    governorate: 'N/A',
    city: 'N/A',
    street: 'N/A',
    accountType: 'unknown',
    birthdate: 'N/A',
    appointments: [],
    medications: [],
    records: [],
    daily_doses_number: null,
    taken_doses: null,
    stats: {},
    bio: '',
    price: '0',
    profilePicture: '',
    status: 'inactive',
    specialties: [],
    pharmacy_name: '',
    pharmacy_picture: '',
};

export function UserInformation() {

    const navigate = useNavigate();
    const { userId } = useParams();
    const [appointmentDetails, setAppointmentDetails] = useState<any>(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [detailsError, setDetailsError] = useState<string | null>(null);
    const [isDetailsOpen, setIsDetailsOpen] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);

    const dispatch = useDispatch();
    const { userProfile, loading, error, success } = useSelector((state: any) => state.userProfile);
const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
    useEffect(() => {
        if (userId) {
            dispatch(fetchUserProfile(userId));
        }

        return () => {
            dispatch(clearUserProfile());
        };
    }, [dispatch, userId]);

    // تحويل بيانات المستخدم من API إلى التنسيق المطلوب للعرض
    const mapApiDataToUser = (apiData) => {
        console.log('Mapping API data:', apiData);

        if (!apiData) return fallbackMockData;

        const baseData = {
            id: apiData.id?.toString() || '0',
            fullName: apiData.fullName || 'مستخدم غير محدد',
            username: apiData.username || 'unknown',
            phone: apiData.phone || 'N/A',
            accountType: apiData.accountType || 'unknown',
            accountStatus: apiData.accountStatus || 'unknown',
            age: apiData.age || 0,
            subscriptionDate: apiData.subscriptionDate || new Date().toISOString().split('T')[0],
            governorate: apiData.governorate || 'N/A',
            city: apiData.city || 'N/A',
            street: apiData.street || 'N/A',
            national_id: apiData.national_id || 'N/A',
            birthdate: apiData.birthdate || 'N/A',
            daily_doses_number: apiData.daily_doses_number || null,
            taken_doses: apiData.taken_doses || null,
        };

        // إضافة البيانات الخاصة بنوع الحساب
        if (apiData.accountType === 'patient') {
            return {
                ...baseData,
                appointments: apiData.appointments || [],
                medications: apiData.medications || [],
                stats: apiData.stats || {},
            };
        } else if (apiData.accountType === 'doctor') {
            return {
                ...baseData,
                bio: apiData.bio || '',
                price: apiData.price || '0',
                profilePicture: apiData.profilePicture || '',
                status: apiData.status || 'inactive',
                specialties: apiData.specialties || [],
                records: apiData.records || [], // استخدام records للأطباء
                stats: apiData.stats || {},
            };
        } else if (apiData.accountType === 'pharmacist') {
            return {
                ...baseData,
                pharmacy_name: apiData.pharmacy_name || '',
                pharmacy_picture: apiData.pharmacy_picture || '',
                records: apiData.records || [],
                stats: apiData.stats || {},
            };
        }

        return baseData;
    };

    const selectedUser = mapApiDataToUser(userProfile) as any;

    const displayAccountType = selectedUser.accountType || 'unknown';

    // تتبع البيانات للتأكد من أنها تصل بشكل صحيح
    console.log('User Profile Data:', userProfile);
    console.log('Selected User:', selectedUser);
    console.log('Display Account Type:', displayAccountType);

    const handlePrint = () => {
        window.print();
    };

    const handleGoBack = () => {
        navigate('/users');
    };

    const fetchAppointmentDetails = async (appointmentId) => {
        setDetailsLoading(true);
        setDetailsError(null);
        try {
            const response = await appointmentsAPI.getAppointmentById(appointmentId);
            if (response.success) {
                setAppointmentDetails(response.data);
                setSelectedAppointment(response.data);
                setIsDetailsOpen(true);
            } else {
                setDetailsError('فشل في جلب تفاصيل الموعد');
            }
        } catch (error) {
            setDetailsError('حدث خطأ أثناء جلب تفاصيل الموعد');
            console.error('Error fetching appointment details:', error);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleCloseModal = () => {
        setIsDetailsOpen(false);
        setAppointmentDetails(null);
        setSelectedAppointment(null);
        setDetailsError(null);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('en-GB');
    };

    const getStatusBadgeProps = (status) => {
        switch (status?.toLowerCase()) {
            case 'completed':
            case 'مكتمل':
                return {
                    variant: 'default' as const,
                    className: 'bg-green-100 text-green-800 hover:bg-green-200'
                };
            case 'scheduled':
            case 'مجدول':
                return {
                    variant: 'default' as const,
                    className: 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                };
            default:
                return {
                    variant: 'outline' as const,
                    className: ''
                };
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen" dir="rtl">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">جاري تحميل بيانات المستخدم...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen" dir="rtl">
                <div className="text-center">
                    <p className="text-red-500 mb-4">حدث خطأ أثناء تحميل البيانات</p>
                    <p className="text-muted-foreground text-sm">{error}</p>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="flex justify-center items-center min-h-screen" dir="rtl">
                <div className="text-center">
                    <p className="text-muted-foreground">لا توجد بيانات متاحة لهذا المستخدم</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6" dir="rtl">
            {/* Back Button */}
            <div className="flex justify-start print:hidden">
                <Button
                    onClick={handleGoBack}
                    variant="outline"
                    className="gap-2"
                >
                    <ArrowRight className="w-4 h-4" />
                    العودة إلى المستخدمين
                </Button>
            </div>

            {/* Official Document */}
            <div className="bg-white rounded-lg shadow-lg print:shadow-none">
                {/* Print Button */}
                <div className="p-4 border-b flex justify-start print:hidden">
                    <Button onClick={handlePrint} className="gap-2">
                        <Printer className="w-4 h-4" />
                        طباعة المستند
                    </Button>
                </div>

                {/* Document Content */}
                <div className="p-6 sm:6 md:p-8">
                    {/* Official Header - Company + User Info Combined (20% of page) */}
                    <div className="border-b-2  pb-3 mb-4">
                        {/* Company Header */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between mb-3 gap-4">
                            
                        <div className="flex items-center gap-3 order-1 sm:order-2">
                                {/* Company Logo */}
                                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center">
                                    <img src={logoImage} alt="Company Logo" className="w-full h-full object-contain" />
                                </div>
                            </div>
                            <div className="text-center sm:text-right order-2 sm:order-1">
                                <h1 className="text-xl sm:text-2xl font-bold text-primary">عافـية</h1>
                                <p className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">مؤسسة ميدلايـف الطبية</p>
                            </div>


                            {/* Document Date - Mobile First */}
                            <div className="text-center sm:text-left text-xs sm:text-sm order-3 w-full sm:w-auto">
                                <p className="text-muted-foreground">تاريخ المستند</p>
                                <p className="font-semibold" dir="ltr">{new Date().toLocaleDateString('en-GB')}</p>
                            </div>
                        </div>

                        {/* Company Contact - Compact */}
                        <div className="pt-4 pb-3 border-t grid grid-cols-3 gap-3 text-xs text-right">

                        </div>

                        {/* Document Title - Compact */}
                        <div className="text-center mt-3 mb-2">
                            <h2 className="text-lg font-bold text-primary uppercase tracking-wide">
                                سجل معلومات المستخدم الرسمي
                            </h2>
                        </div>

                        {/* User Information - Combined and Compact */}
                        <div className="bg-accent p-4 rounded-lg mt-3">
                            <h4 className="font-semibold text-primary mb-4 text-right">المعلومات الشخصية</h4>

                            {/* المعلومات الأساسية */}
                            <div className="space-y-3">
                                {/* الصف الأول - المعلومات الرئيسية - طباعة أفقية */}
                                <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-2 gap-2 text-sm">
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">الاسم الكامل</p>
                                        <p className="font-semibold">{selectedUser.fullName}</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">نوع الحساب</p>
                                        <Badge variant="outline" className="text-xs px-2 py-1 bg-primary/10 text-primary">
                                            {displayAccountType === 'doctor' ? 'طبيب' :
                                                displayAccountType === 'patient' ? 'مريض' :
                                                    'صيدلي'}
                                        </Badge>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">العمر</p>
                                        <p className="font-semibold">{selectedUser.age} سنة</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">اسم المستخدم</p>
                                        <p className="font-semibold">{selectedUser.username}</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">تاريخ الميلاد</p>
                                        <p className="font-semibold" dir="ltr">{selectedUser.birthdate || 'N/A'}</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">رقم الهاتف</p>
                                        <p className="font-semibold" dir="ltr">{selectedUser.phone}</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">تاريخ الاشتراك</p>
                                        <p className="font-semibold" dir="ltr">{new Date(selectedUser.subscriptionDate).toLocaleDateString('en-GB')}</p>
                                    </div>
                                    <div className="text-right print:text-center">
                                        <p className="text-muted-foreground mb-1">الحالة</p>
                                        <Badge variant="outline" className="text-xs px-2 py-1 bg-green-100 text-green-800">
                                            نشط
                                        </Badge>
                                    </div>
                                </div>

                                {/* معلومات خاصة بكل نوع مستخدم */}
                                {selectedUser.national_id && selectedUser.national_id !== '' && (
                                    <div className="grid grid-cols-2 md:grid-cols-4 print:grid-cols-2 gap-4 pt-3 border-t pt-2">
                                        {displayAccountType === 'patient' && (
                                            <div className="text-right">
                                                <p className="text-sm text-muted-foreground mb-1">الرقم الوطني</p>
                                                <p className="font-semibold text-sm" dir="ltr">{selectedUser.national_id}</p>
                                            </div>
                                        )}

                                        <div className="text-right">
                                            <p className="text-sm text-muted-foreground mb-1">المحافظة</p>
                                            <p className="font-semibold text-sm">{selectedUser.governorate}</p>
                                        </div>

                                        {displayAccountType === 'doctor' && (
                                            <>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">المدينة</p>
                                                    <p className="font-semibold text-sm">{selectedUser.city}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عنوان الشارع</p>
                                                    <p className="font-semibold text-sm">{selectedUser.street}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">الاختصاصات</p>
                                                    <div className="flex flex-wrap gap-1">
                                                        {selectedUser.specialties && selectedUser.specialties.length > 0 ? (
                                                            selectedUser.specialties.map((specialty, index) => (
                                                                <Badge
                                                                    key={specialty.id || index}
                                                                    variant="outline"
                                                                    className="text-xs px-2 py-1 bg-primary/10 text-primary"
                                                                >
                                                                    {specialty.name || `تخصص ${specialty.id}`}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <span className="text-sm text-muted-foreground">لا توجد اختصاصات محددة</span>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">سعر الكشف</p>
                                                    <p className="font-semibold text-sm">{selectedUser.price} ل . س</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">التقييم</p>
                                                    <p className="font-semibold text-sm">⭐ {selectedUser.stats?.rating || 'غير محدد'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عدد المرضى الذين قيموه</p>
                                                    <p className="font-semibold text-sm">{selectedUser.stats?.total_reviews || 0}</p>
                                                </div>
                                            </>
                                        )}
                                        {displayAccountType === 'pharmacist' && (
                                            <>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">المدينة</p>
                                                    <p className="font-semibold text-sm">{selectedUser.city}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عنوان الشارع</p>
                                                    <p className="font-semibold text-sm">{selectedUser.street}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">اسم الصيدلية</p>
                                                    <p className="font-semibold text-sm">{selectedUser.pharmacy_name || 'غير محدد'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عدد المرضى المخدومين</p>
                                                    <p className="font-semibold text-sm">{selectedUser.stats?.patients_served_count || 0}</p>
                                                </div>
                                            </>
                                        )}
                                        {displayAccountType === 'patient' && (
                                            <>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عدد الأدوية المصروفة</p>
                                                    <p className="font-semibold text-sm">{selectedUser.stats?.medication_dispenses_count || 0}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-sm text-muted-foreground mb-1">عدد الجرعات اليومية</p>
                                                    <p className="font-semibold text-sm">{selectedUser.daily_doses_number || 0}</p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Appointments Table - For Doctor and Patient */}
                    {displayAccountType !== 'pharmacist' && (
                        (displayAccountType === 'doctor' && selectedUser.records && selectedUser.records.length > 0) ||
                        (displayAccountType === 'patient' && selectedUser.appointments && selectedUser.appointments.length > 0)
                    ) && (
                            <div className="mb-8">
                                <h3 className="font-semibold text-primary mb-3 py-3 border-t-2 border-b-2 text-right"
                                    style={{ borderColor: '#1e3561', borderTopWidth: '2px', borderBottomWidth: '2px' }}>
                                    سجل المواعيد ({displayAccountType === 'doctor' ? selectedUser.records.length : selectedUser.appointments.length} موعد)
                                </h3>
                                <div className="border rounded-lg overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <Table>
                                            <TableHeader>
                                                <TableRow className="bg-primary hover:bg-primary">
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">رقم الموعد</TableHead>
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">
                                                        {displayAccountType === 'doctor' ? 'اسم المريض' : 'اسم الطبيب'}
                                                    </TableHead>
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">التاريخ</TableHead>
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">الوقت</TableHead>
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">الحالة</TableHead>
                                                  
                                                    <TableHead className="text-white text-right text-xs sm:text-sm">التفاصيل</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {(displayAccountType === 'doctor' ? selectedUser.records : selectedUser.appointments).map((item, index) => {
                                                    console.log(`${displayAccountType} data:`, item); // تتبع البيانات
                                                    const appointment = displayAccountType === 'doctor' ?
                                                        { ...item, patientName: item.patientName, doctorName: null } :
                                                        { ...item, doctorName: item.doctorName, patientName: null };

                                                    return (
                                                        <TableRow key={item.id || index} className={index % 2 === 0 ? 'bg-accent/30' : ''}>
                                                            <TableCell className="font-semibold text-right text-xs sm:text-sm py-2 sm:py-3">{item.id || index + 1}</TableCell>
                                                            <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">
                                                                {displayAccountType === 'doctor' ? (appointment.patientName || 'غير محدد') : (appointment.doctorName || 'غير محدد')}
                                                            </TableCell>
                                                            <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3" dir="ltr">
                                                                {item.date ? new Date(item.date).toLocaleDateString('en-GB') : 'غير محدد'}
                                                            </TableCell>
                                                            <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3" dir="ltr">
                                                                {item.time || '-'}
                                                            </TableCell>
                                                            <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">
                                                                <Badge
                                                                    variant={(item.status === 'Completed' || item.status === 'مكتمل') ? 'default' : 'outline'}
                                                                    className={`text-xs sm:text-sm px-2 py-1 ${(item.status === 'Completed' || item.status === 'مكتمل') ? ' bg-primary/10 text-primary' : ''}`}
                                                                >
                                                                    {item.status === 'Completed' || item.status === 'مكتمل' ? 'مكتمل' :
                                                                        item.status === 'Scheduled' || item.status === 'مجدول' ? 'مجدول' :
                                                                            (item.status || '-')}
                                                                </Badge>
                                                            </TableCell>
                                                      
                                                            <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">
                                                                {(item.status === 'completed' || item.status === 'مكتمل') ? (
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-2"
                                                                        onClick={() => fetchAppointmentDetails(item.id)}
                                                                    >
                                                                        <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
                                                                        <span className="sm:hidden">عرض</span>
                                                                    </Button>
                                                                ) : (
                                                                    <span className="text-muted-foreground text-sm">-</span>
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                            </TableBody>
                                        </Table>
                                    </div>
                                </div>
                            </div>
                        )}

                    {/* Medications Table - For Patient Only */}
                    {displayAccountType === 'patient' && selectedUser.medications && selectedUser.medications.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-primary my-3 py-3 border-t-2 border-b-2 text-right"
                                style={{ borderColor: '#1e3561', borderTopWidth: '2px', borderBottomWidth: '2px' }}>
                                الأدوية المصروفة من الصيدلية ({selectedUser.medications.length} دواء)
                            </h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-secondary hover:bg-secondary">
                                                <TableHead className="text-white text-right text-xs sm:text-sm">رقم الصرف</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">اسم الدواء</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">الكمية</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">الصيدلية</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">الصيدلي</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">التاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedUser.medications.map((medication, index) => {
                                                console.log('Medication data:', medication); // تتبع البيانات
                                                return (
                                                    <TableRow key={medication.id || index} className={index % 2 === 0 ? 'bg-accent/30' : ''}>
                                                        <TableCell className="font-semibold text-right text-xs sm:text-sm py-2 sm:py-3">{medication.id || index + 1}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{medication.name || medication.medicationName || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{medication.quantity || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{medication.pharmacyName || medication.pharmacy_name || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{medication.dispensedBy || medication.pharmacistName || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3" dir="ltr">
                                                            {medication.date ? new Date(medication.date).toLocaleDateString('en-GB') : 'غير محدد'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Dispensed Medications Table - For Pharmacist Only */}
                    {displayAccountType === 'pharmacist' && selectedUser.records && selectedUser.records.length > 0 && (
                        <div className="mb-8">
                            <h3 className="font-semibold text-primary mb-3 py-3  border-t-2 border-b-2 text-right"
                                style={{ borderColor: '#1e3561', borderTopWidth: '2px', borderBottomWidth: '2px' }}>
                                الأدوية المصروفة للمرضى ({selectedUser.records.length} صرفية)
                            </h3>
                            <div className="border rounded-lg overflow-hidden">
                                <div className="overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="bg-primary hover:bg-primary">
                                                <TableHead className="text-white text-right text-xs sm:text-sm">رقم الصرف</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">اسم الدواء</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">اسم المريض</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">الكمية</TableHead>
                                                <TableHead className="text-white text-right text-xs sm:text-sm">التاريخ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {selectedUser.records.map((record, index) => {
                                                console.log('Pharmacist record data:', record); // تتبع البيانات
                                                return (
                                                    <TableRow key={record.id || index} className={index % 2 === 0 ? 'bg-accent/30' : ''}>
                                                        <TableCell className="font-semibold text-right text-xs sm:text-sm py-2 sm:py-3">{record.id || index + 1}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{record.medicationName || record.name || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{record.patientName || record.patient_name || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3">{record.quantity || 'غير محدد'}</TableCell>
                                                        <TableCell className="text-right text-xs sm:text-sm py-2 sm:py-3" dir="ltr">
                                                            {record.date ? new Date(record.date).toLocaleDateString('en-GB') : 'غير محدد'}
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* No Data Messages */}
                    {displayAccountType !== 'pharmacist' && (
                        (displayAccountType === 'doctor' && (!selectedUser.records || selectedUser.records.length === 0)) ||
                        (displayAccountType === 'patient' && (!selectedUser.appointments || selectedUser.appointments.length === 0))
                    ) && (
                            <div className="text-center py-8 sm:py-12 bg-accent/30 rounded-lg">
                                <p className="text-muted-foreground text-sm sm:text-base">لا توجد مواعيد مسجلة لهذا المستخدم</p>
                            </div>
                        )}

                    {displayAccountType === 'pharmacist' && (!selectedUser.records || selectedUser.records.length === 0) && (
                        <div className="text-center py-8 sm:py-12 bg-accent/30 rounded-lg">
                            <p className="text-muted-foreground text-sm sm:text-base">لا توجد أدوية مصروفة مسجلة</p>
                        </div>
                    )}

                    {/* Document Footer */}
                    <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
                        <p>هذا مستند رسمي صادر عن نظام مؤسسة ميدلايـف الطبية</p>
                        <p className="mt-1" dir="ltr">ML-{selectedUser.id}-15 :رقم المستند</p>
                        <p className="mt-1">© {new Date().getFullYear()} عافـية. جميع الحقوق محفوظة.</p>
                    </div>
                </div>
            </div>


            {/* Appointment Details Modal */}
            <RTLDialog
                open={isDetailsOpen}
                onOpenChange={setIsDetailsOpen}
                title="تفاصيل الموعد"
                 maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
            >
                {selectedAppointment && (
                    <div className="space-y-6">
                        {/* معلومات المريض والطبيب */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <Label>اسم المريض</Label>
                                <div className="p-2 bg-muted rounded mt-1">{selectedAppointment.patient_name || 'غير محدد'}</div>
                            </div>
                            <div>
                                <Label>اسم الطبيب</Label>
                                <div className="p-2 bg-muted rounded mt-1">{selectedAppointment.doctor_name || 'غير محدد'}</div>
                            </div>
                        </div>

             

                        {/* التخصصات */}
                        {selectedAppointment.specialization && (
                            <div>
                                <Label>اختصاص</Label>
                                <div className="p-3 bg-muted rounded mt-1">
                                    {Array.isArray(selectedAppointment.specialization) ? (
                                        selectedAppointment.specialization.map((spec, index) => (
                                            <span key={index} className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm mr-2 mb-1">
                                                {spec.name || spec}
                                                <span> </span>
                                            </span>
                                        ))
                                    ) : (
                                        <span className="inline-block bg-primary/10 text-primary px-2 py-1 rounded text-sm">
                                            {selectedAppointment.specialization}
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* التحاليل الطبية */}
                        {selectedAppointment.diagnostics && (
                            <div>
                                <Label>التحاليل الطبية</Label>
                                <div className="p-3 bg-muted rounded mt-1">
                                    {Array.isArray(selectedAppointment.diagnostics) ? (
                                        selectedAppointment.diagnostics.map((diagnostic, index) => (
                                            <div key={index} className="mb-2">
                                                <div className="font-medium">{diagnostic.name || diagnostic}</div>
                                                {diagnostic.image_path && (
                                                    <img
                                                        src={diagnostic.image_path}
                                                        alt={diagnostic.name || diagnostic}
                                                        className="w-20 h-20 object-cover rounded mt-1"
                                                        onError={(e) => {
                                                            e.currentTarget.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                            </div>
                                        ))
                                    ) : (
                                        <div className="font-medium">{String(selectedAppointment.diagnostics)}</div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* الأدوية الموصوفة */}
                        {selectedAppointment.medicines && (
                            <div>
                                <Label>الأدوية الموصوفة</Label>
                                <div className="p-3 bg-muted rounded mt-1">
                                    {Array.isArray(selectedAppointment.medicines) ? (
                                        selectedAppointment.medicines.map((medicine, index) => (
                                            <div key={index} className="flex justify-between items-center p-2 bg-background rounded">
                                                <span>{medicine.medicine_name || medicine}</span>
                                                <span className="text-sm text-muted-foreground">
                                                    {medicine.quantity || 0} وحدة ({medicine.number_of_taken_doses || 0} مأخوذة)
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="flex justify-between items-center p-2 bg-background rounded">
                                            <span>{String(selectedAppointment.medicines)}</span>
                                            <span className="text-sm text-muted-foreground">غير محدد</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* زر الإغلاق */}
                        <div className="flex justify-end">
                            <Button onClick={handleCloseModal}>إغلاق</Button>
                        </div>
                    </div>
                )}
            </RTLDialog>

            {/* Print Styles */}
            <style>{`
        @media print {
          body {
            background: white;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:shadow-none {
            box-shadow: none !important;
          }

          /* إخفاء عناصر السكرول والتجاوز في الطباعة */
          * {
            overflow: visible !important;
          }

          /* إخفاء أشرطة السكرول في الطباعة */
          ::-webkit-scrollbar {
            display: none !important;
          }

          /* ضمان ظهور الجداول بالكامل في الطباعة */
          .overflow-hidden, .overflow-auto, .overflow-x-auto, .overflow-y-auto {
            overflow: visible !important;
          }

        

          /* تحسين تخطيط الطباعة */
          .space-y-6 > * + * {
            margin-top: 1rem;
          }

          /* إخفاء معلومات المتصفح الافتراضية في الطباعة */
          @page {
            margin: 0;
            size: auto;
          }

          /* إخفاء هيدر وفوتر المتصفح في الطباعة */
          @page :first {
            margin-top: 0;
          }

          @page :left {
            margin-left: 0;
          }

          @page :right {
            margin-right: 0;
          }

          /* إخفاء معلومات الصفحة في الطباعة */
          @page {
            @top-left {
              content: none;
            }
            @top-right {
              content: none;
            }
            @top-center {
              content: none;
            }
            @bottom-left {
              content: none;
            }
            @bottom-right {
              content: none;
            }
            @bottom-center {
              content: none;
            }
          }

          /* إجبار استخدام flexbox للطباعة بدلاً من grid لضمان التوافق */
          .print\\:grid-cols-4 {
            display: flex !important;
            flex-wrap: wrap !important;
            width: 100% !important;
            gap: 0.25rem !important;
          }

          .print\\:grid-cols-4 > div {
            flex: 0 0 15% !important;
            width: 25% !important;
            min-width: 0 !important;
            max-width: 15% !important;
            box-sizing: border-box !important;
          }

          /* ضمان عدم وجود أي تعارض من Tailwind */
          .print\\:grid-cols-4 * {
            flex-basis: 15% !important;
          }

          /* إجبار جميع العناصر الفرعية على اتباع قواعد 4 أعمدة */
          .print\\:grid-cols-4 > div,
          .print\\:grid-cols-4 > div > div,
          .print\\:grid-cols-4 > div > div > div {
            flex: 0 0 15% !important;
            width: 15% !important;
            max-width: 15% !important;
            min-width: 0 !important;
            box-sizing: border-box !important;
          }

          /* إجبار تعطيل أي إعدادات Tailwind قد تتعارض */
          @media print {
            .grid {
              display: block !important;
            }

            .grid-cols-1 {
              display: block !important;
            }

            .grid-cols-2 {
              display: flex !important;
              flex-wrap: wrap !important;
            }

            .grid-cols-2 > * {
              flex: 0 0 50% !important;
              width: 50% !important;
            }

            .grid-cols-3 {
              display: flex !important;
              flex-wrap: wrap !important;
            }

            .grid-cols-3 > * {
              flex: 0 0 33.333% !important;
              width: 33.333% !important;
            }
          }

          /* إجبار استخدام flexbox فقط للـ 4 أعمدة في الطباعة */
          @media print {
            .print\\:grid-cols-4 {
              display: flex !important;
              flex-direction: row !important;
              flex-wrap: wrap !important;
              width: 100% !important;
              gap: 0.25rem !important;
            }

            .print\\:grid-cols-4 > div {
              flex: 0 0 15% !important;
              width: 15% !important;
              max-width: 15% !important;
              min-width: 0 !important;
              box-sizing: border-box !important;
            }

            /* ضمان عدم وجود أي تعارض من أي مكتبة أخرى */
          [class*="grid-cols-4"] > * {
            flex: 0 0 20% !important;
            width: 20% !important;
          }

          /* تحسين حجم النص في الطباعة */
          .text-xs, .text-sm {
            font-size: 10px !important;
          }

          /* تحسين حجم العناوين في الطباعة */
          h1 {
            font-size: 18px !important;
          }

          h2 {
            font-size: 16px !important;
          }

          h3 {
            font-size: 14px !important;
          }

          /* تحسين المساحات في الطباعة */
          .py-2, .py-3 {
            padding-top: 6px !important;
            padding-bottom: 6px !important;
          }
        }
      `}</style>
        </div>
    );
}
