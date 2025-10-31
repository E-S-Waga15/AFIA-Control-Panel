import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, TrendingUp, Users, Calendar, Pill, Building2, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { useLanguage } from '../contexts/LanguageContext';
import { Skeleton } from './ui/skeleton';
import { RTLSelect } from './ui/rtl-select';
import { useSelector, useDispatch } from 'react-redux';
import { fetchSummaryStats, fetchTrendsData, fetchDoctorsStats, setSelectedPeriod } from '../store/slices/dashboardSlice';
import "../styles/responsive-utils.css";

export function DashboardHome() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
   const [isExporting, setIsExporting] = useState(false);
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();

  // Get data from Redux store
  const {
    summaryStats,
    summaryStatsLoading,
    summaryStatsError,
    trendsData,
    trendsLoading,
    trendsError,
    doctorsStats,
    doctorsStatsLoading,
    doctorsStatsError
  } = useSelector((state) => state.dashboard);

  // كشف حجم الشاشة مع إعادة التقييم عند تغيير الحجم
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // إعادة تقييم حجم الشاشة عند إعادة تحميل المكون
  React.useEffect(() => {
    const checkMobileOnLoad = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      setIsMobile(width < 768);
    };

    // التحقق فوراً عند التحميل
    checkMobileOnLoad();

    // ثم التحقق مرة أخرى بعد تحميل المكون بالكامل
    const timer = setTimeout(checkMobileOnLoad, 100);
    return () => clearTimeout(timer);
  }, []);

  // جلب البيانات من الـ API عند تحميل المكون
  React.useEffect(() => {
    dispatch(fetchSummaryStats());
    if (selectedPeriod) {
      dispatch(fetchTrendsData(selectedPeriod));
    }
    dispatch(fetchDoctorsStats());
  }, [dispatch]);

  // جلب بيانات التريندات عند تغيير الفترة
  React.useEffect(() => {
    if (selectedPeriod) {
      dispatch(fetchTrendsData(selectedPeriod));
    }
  }, [selectedPeriod, dispatch]);

  // إضافة مراقبة لحجم الشاشة مع إعادة التحقق الدوري
  React.useEffect(() => {
    let timeoutId;

    const handleResize = () => {
      const newWidth = window.innerWidth;
      setWindowWidth(newWidth);
      setIsMobile(newWidth < 768);
    };

    const debouncedResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleResize, 150);
    };

    window.addEventListener('resize', debouncedResize);
    return () => {
      window.removeEventListener('resize', debouncedResize);
      clearTimeout(timeoutId);
    };
  }, []);

  // Mock data for the chart - سيتم استبدالها بالبيانات من الـ API
  const dailyData = [];
  const monthlyData = [];

  // استخدام البيانات من الـ API إذا كانت متوفرة، وإلا استخدام البيانات الوهمية
  const chartData = selectedPeriod === 'day'
    ? (trendsData?.data?.length > 0 ? trendsData.data : dailyData)
    : selectedPeriod === 'week'
    ? (trendsData?.data?.length > 0 ? trendsData.data : [])
    : (trendsData?.data?.length > 0 ? trendsData.data : monthlyData);

  // استخدام البيانات من الـ API للإحصائيات
  const totalStats = summaryStats || {
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalPharmacies: 0,
    appointmentGrowth: '0%',
    patientGrowth: '0%',
    doctorGrowth: '0%',
    pharmacyGrowth: '0%'
  };

  // استخدام البيانات من الـ API للأطباء
  const topDoctors = doctorsStats?.topDoctors || [];

  const appointmentStats = doctorsStats?.appointmentStats || {
    totalBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    scheduledBookings: 0,
    cancellationRate: '0%',
    completionRate: '0%',
    scheduledRate: '0%',
    averageBookingsPerDay: 0,
    averageBookingsPerMonth: 0,
    peakBookingHour: ''
  };

  // استخدام البيانات من الـ API لتوزيع حالات المواعيد
  const appointmentStatusData = doctorsStats?.appointmentStatusData || [];

  // Custom label for pie chart with white text
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // استخدم النسبة من البيانات بدلاً من حسابها بواسطة Recharts
    const dataPercentage = appointmentStatusData[index]?.percentage || `${(percent * 100).toFixed(1)}%`;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="font-semibold"
        style={{ fontSize: '14px', fontWeight: 'bold' }}
      >
        {dataPercentage}
      </text>
    );
  };

  // Loading Skeletons
  const SummaryCardsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-4 rounded" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-24" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const ChartSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <Skeleton className="h-full w-full" />
        </div>
      </CardContent>
    </Card>
  );

  const DoctorsTableSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {[...Array(5)].map((_, index) => (
            <div key={index} className="flex items-center space-x-4">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );

  const StatsCardsSkeleton = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, index) => (
        <Card key={index}>
          <CardHeader className="pb-3">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-12 mb-2" />
            <Skeleton className="h-3 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const PieChartSkeleton = () => (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="h-96 flex items-center justify-center">
            <Skeleton className="h-80 w-80 rounded-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-32" />
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center justify-between p-5 bg-muted/30 rounded-xl">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
   


  return (
    <div className="w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex p-4 flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
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
            <SelectItem value="week">{t('dashboard.weekly')}</SelectItem>
            <SelectItem value="month">{t('dashboard.monthly')}</SelectItem>
          </RTLSelect>
          <Button 
            onClick={() => {
              const link = document.createElement('a');
              link.href = 'http://192.168.1.6:8000/api/generate-report';
              link.download = 'report.xlsx';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
            className="bg-primary hover:bg-primary/90"
          >
            <Download className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('dashboard.exportReport')}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="px-4 pb-6">
        {summaryStatsLoading ? (
          <SummaryCardsSkeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="bg-white shadow-sm">
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

            <Card className="bg-white shadow-sm">
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

            <Card className="bg-white shadow-sm">
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

            <Card className="bg-white shadow-sm">
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
        )}
      </div>

      {/* Chart Section */}
      {trendsLoading ? (
        <ChartSkeleton />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="mobile-heading text-primary">
              {selectedPeriod === 'day' ? t('dashboard.daily') : t('dashboard.monthly')} {t('dashboard.statisticsTrends')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="h-80"
              dir={isRTL ? 'rtl' : 'ltr'}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: isRTL ? 20 : 5, left: isRTL ? 5 : 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 12, dx: isRTL ? -18 : 0, dy: 10, textAnchor: isRTL ? 'end' : 'middle' }}
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
      )}
      <div className="h-10"></div>
      {/* Detailed Reports Section - Arabic */}
      <div className="space-y-6" dir="rtl">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-primary">التقارير التفصيلية</h2>
            <p className="text-sm text-muted-foreground">إحصائيات شاملة عن الأطباء والمواعيد</p>
          </div>
       
        </div>

        {/* Top Doctors Table */}
        {doctorsStatsLoading ? (
          <DoctorsTableSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-right">الأطباء الأكثر حجزاً</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right hidden sm:table-cell">اسم الطبيب</TableHead>
                      <TableHead className="text-right">التخصص</TableHead>
                      <TableHead className="text-right">إجمالي المواعيد</TableHead>
                      <TableHead className="text-right hidden md:table-cell">المواعيد المكتملة</TableHead>
                      <TableHead className="text-right hidden md:table-cell">المواعيد الملغاة</TableHead>
                      <TableHead className="text-right hidden lg:table-cell">نسبة الإكمال</TableHead>
                      <TableHead className="text-right">التقييم</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topDoctors.map((doctor, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium text-right hidden sm:table-cell">{doctor.name}</TableCell>
                        <TableCell className="text-right">
                          <div className="sm:hidden font-medium">{doctor.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {doctor.specialty.length > 0 ? doctor.specialty.map(s => s.name).join(', ') : 'لا يوجد تخصص'}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 items-center justify-center">
                            {doctor.totalAppointments}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 items-center justify-center">
                            {doctor.completedAppointments}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                            {doctor.cancelledAppointments}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
                          <span className="text-green-600 font-semibold">
                            {((doctor.completedAppointments / doctor.totalAppointments) * 100).toFixed(1)}%
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-1 justify-center  ">
                            <span className="font-semibold">{doctor.rating}</span>
                            <span className="text-yellow-500">★</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Appointment Statistics Cards */}
        <div className="px-4 pb-6">
          {doctorsStatsLoading ? (
            <StatsCardsSkeleton />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-right">إجمالي الحجوزات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary text-right">
                    {(appointmentStats.completedBookings + appointmentStats.scheduledBookings + appointmentStats.cancelledBookings)}
                  </div>
                  <p className="text-xs text-muted-foreground text-right mt-1">
                    جميع المواعيد المسجلة
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-right">المواعيد المكتملة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600 text-right">
                    {appointmentStats.completedBookings}
                  </div>
                  <p className="text-xs text-green-600 text-right mt-1">
                    نسبة الإكمال: {appointmentStats.completionRate}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-right">المواعيد المحجوزة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary text-right">
                    {appointmentStats.scheduledBookings}
                  </div>
                  <p className="text-xs text-primary text-right mt-1">
                    قيد الانتظار
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-right">المواعيد الملغاة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-600 text-right">
                    {appointmentStats.cancelledBookings}
                  </div>
                  <p className="text-xs text-red-600 text-right mt-1">
                    نسبة الإلغاء: {appointmentStats.cancellationRate}
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

       

        {/* Pie Chart - Appointment Status Distribution */}
        {doctorsStatsLoading ? (
          <PieChartSkeleton />
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-primary text-right">توزيع حالات المواعيد</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                {/* Pie Chart */}
                <div className="h-96 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={appointmentStatusData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomLabel}
                        outerRadius={140}
                        innerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {appointmentStatusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={3} stroke="#fff" />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            return (
                              <div className="bg-card border-2 border-border rounded-lg shadow-xl p-4" dir="rtl">
                                <div className="flex items-center gap-2 mb-2">
                                  <div
                                    className="w-4 h-4 rounded-full"
                                    style={{ backgroundColor: data.color }}
                                  />
                                  <p className="font-semibold text-lg">{data.name}</p>
                                </div>
                                <p className="text-sm mb-1">
                                  العدد: <span className="font-bold">{data.value}</span> موعد
                                </p>
                                <p className="text-sm">
                                  النسبة: <span className="font-bold" style={{ color: data.color }}>{data.percentage}</span>
                                </p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Legend and Stats */}
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-right">تفاصيل التوزيع</h3>
                  {appointmentStatusData.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-5 bg-gradient-to-l from-muted/30 to-transparent rounded-xl border-2 border-border/50 hover:border-primary/30 transition-all duration-200 hover:shadow-md"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="font-semibold text-lg">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.value} موعد
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-left">
                          <p className="text-3xl font-bold" style={{ color: item.color }}>
                            {item.percentage}
                          </p>
                        </div>
                        <div
                          className="w-6 h-6 rounded-full shadow-lg ring-2 ring-white"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>
                    </div>
                  ))}

                  {/* Summary Box */}
                  <div className="mt-6 p-5 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border-2 border-primary/20">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-1 h-6 bg-primary rounded-full" />
                      <p className="text-sm font-semibold text-primary text-right">ملخص الإحصائيات</p>
                    </div>
                    <div className="space-y-2 text-right">
                      <p className="text-sm">
                        • إجمالي المواعيد: <span className="font-bold text-primary">
                          {(appointmentStats.completedBookings + appointmentStats.scheduledBookings + appointmentStats.cancelledBookings)}
                        </span>
                      </p>
                      <p className="text-sm">
                        • معدل النجاح: <span className="font-bold text-green-600">{appointmentStats.completionRate}</span>
                      </p>
                      <p className="text-sm">
                        • معدل الإلغاء: <span className="font-bold text-red-600">{appointmentStats.cancellationRate}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Additional Statistics */}
      <div className="px-4 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">{t('dashboard.recentActivity')}</CardTitle>
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

          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-primary">{t('dashboard.systemHealth')}</CardTitle>
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
    </div>
  );
}