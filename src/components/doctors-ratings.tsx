import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { RTLDialog } from './ui/rtl-dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchRatingStats } from '../store/slices/ratingSlice';

interface Review {
  id: number;
  patientName: string;
  rating: string;
  date: string;
}

interface Specialty {
  id: number;
  name: string;
}

interface Doctor {
  id: number;
  name: string;
  specialty: Specialty[];
  profilePicture: string | null;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}


export function DoctorsRatings() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const { summaryStats, doctorsRanking, loading, error } = useSelector((state: any) => state.ratings);

  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
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

  // Fetch rating stats on component mount
  useEffect(() => {
    dispatch(fetchRatingStats());
  }, [dispatch]);

  const doctors = [...doctorsRanking].sort((a, b) => b.averageRating - a.averageRating);

  const viewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsOpen(true);
  };

  const renderStars = (rating: number | string) => {
    const numericRating = typeof rating === 'string' ? parseFloat(rating) : rating;
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(numericRating)
            ? 'fill-yellow-400 text-yellow-400'
            : index < numericRating
            ? 'fill-yellow-200 text-yellow-400'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 4.0) return 'text-blue-600';
    if (rating >= 3.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <div className="grid gap-3 grid-cols-1 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="bg-white shadow-sm">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="p-6 text-center">
            <p className="text-red-600">Error loading rating data: {error}</p>
            <Button
              onClick={() => dispatch(fetchRatingStats())}
              className="mt-4"
              variant="outline"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Stats */}
      <div className={`grid gap-2 ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-1 md:grid-cols-3 gap-3'}`}>
        <Card className={`bg-white shadow-sm ${isMobile ? 'p-3' : ''}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-1 ${isMobile ? 'p-2' : 'pb-2'}`}>
            <CardTitle className={`text-xs font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{t('ratings.doctorName')}</CardTitle>
            <TrendingUp className={`h-3 w-3 text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-2 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg sm:text-2xl'}`}>{doctors[0]?.name}</div>
            <p className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
              {doctors[0]?.averageRating.toFixed(1)} ⭐ ({doctors[0]?.totalReviews} reviews)
            </p>
          </CardContent>
        </Card>

        <Card className={`bg-white shadow-sm ${isMobile ? 'p-3' : ''}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-1 ${isMobile ? 'p-2' : 'pb-2'}`}>
            <CardTitle className={`text-xs font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{t('ratings.averageRating')}</CardTitle>
            <Star className={`h-3 w-3 text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-2 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg sm:text-2xl'}`}>
              {summaryStats.globalAverageRating.toFixed(1)}
            </div>
            <p className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>{t('ratings.reviews')}</p>
          </CardContent>
        </Card>

        <Card className={`bg-white shadow-sm ${isMobile ? 'p-3 col-span-2' : ''}`}>
          <CardHeader className={`flex flex-row items-center justify-between space-y-0 pb-1 ${isMobile ? 'p-2' : 'pb-2'}`}>
            <CardTitle className={`text-xs font-medium ${isMobile ? 'text-xs' : 'text-sm'}`}>{t('ratings.reviews')}</CardTitle>
            <MessageCircle className={`h-3 w-3 text-muted-foreground ${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
          </CardHeader>
          <CardContent className={isMobile ? 'p-2 pt-0' : ''}>
            <div className={`font-bold ${isMobile ? 'text-sm' : 'text-lg sm:text-2xl'}`}>
              {doctors.reduce((sum, doc) => sum + doc.totalReviews, 0)}
            </div>
            <p className={`text-xs text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>{t('ratings.reviews')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Ranking */}
      <Card className="bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('ratings.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4 ">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className={`p-3 sm:p-4 border rounded-lg hover:bg-muted/50 transition-colors ${isMobile ? 'space-y-3' : 'flex items-center justify-between'}`}
            >
              <div className={`flex items-center gap-3 ${isMobile ? 'w-full' : 'gap-4'}`}>
                <div className="flex items-center gap-2">
                  <span className={`font-bold text-muted-foreground ${isMobile ? 'text-xl' : 'text-2xl'}`}>
                    #{index + 1}
                  </span>
                  <Avatar className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'}`}>
                    <AvatarImage src={doctor.profilePicture || undefined} />
                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : ''}`}>{doctor.name}</h3>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'}`}>
                    {doctor.specialty.length > 0 ? doctor.specialty.map(s => s.name).join(', ') : 'No specialty'}
                  </p>
                </div>
              </div>

              <div className={`flex items-center gap-3 ${isMobile ? 'w-full justify-between' : 'gap-4'}`}>
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    {renderStars(doctor.averageRating)}
                  </div>
                  <div className={`font-bold ${getRatingColor(doctor.averageRating)} ${isMobile ? 'text-base' : 'text-lg'}`}>
                    {doctor.averageRating.toFixed(1)}
                  </div>
                  <div className={`text-muted-foreground ${isMobile ? 'text-xs' : 'text-xs'}`}>
                    {doctor.totalReviews} reviews
                  </div>
                </div>

                <Button
                  variant="outline"
                  size={isMobile ? "sm" : "default"}
                  onClick={() => viewDetails(doctor)}
                  className={`flex items-center gap-2 ${isMobile ? 'text-xs px-3' : ''}`}
                >
                  <Eye className="w-4 h-4" />
                  {isMobile ? 'View' : 'View Details'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Doctor Details Dialog */}
      <RTLDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={t('ratings.doctorReviews')}
        maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
        className="max-h-[90vh] overflow-y-auto"
      >
        {selectedDoctor && (
          <div className="space-y-4 sm:space-y-6">
            {/* Doctor Header */}
            <div className={`p-3 sm:p-4 bg-muted rounded-lg ${isMobile ? 'flex flex-col gap-3 items-center' : 'flex items-center  gap-4'}`}>
              <Avatar className={`${isMobile ? 'w-12 h-12' : 'w-16 h-16'}`}>
                <AvatarImage src={selectedDoctor.profilePicture || undefined} />
                <AvatarFallback>{getInitials(selectedDoctor.name)}</AvatarFallback>
              </Avatar>
              <div className={`flex-1 ${isMobile ? 'text-center' : ''}`}>
                <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>{selectedDoctor.name}</h2>
                <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                  {selectedDoctor.specialty.length > 0 ? selectedDoctor.specialty.map(s => s.name).join(', ') : 'No specialty'}
                </p>
                <div className={`flex items-center gap-2 mt-2 ${isMobile ? 'justify-center' : ''}`}>
                  <div className="flex items-center gap-1">
                    {renderStars(selectedDoctor.averageRating)}
                  </div>
                  <span className={`font-bold ${getRatingColor(selectedDoctor.averageRating)}`}>
                    {selectedDoctor.averageRating.toFixed(1)}
                  </span>
                  <span className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>
                    ({selectedDoctor.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div>
              <h3 className={`font-semibold mb-3 sm:mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>{t('ratings.patientReviews')}</h3>
              <div className="space-y-3 sm:space-y-4">
                {selectedDoctor.reviews.map((review) => (
                  <Card key={review.id} className="bg-white shadow-sm">
                    <CardContent className="p-3 sm:p-4">
                      <div className={`mb-3 ${isMobile ? 'space-y-2' : 'flex items-start justify-between mb-3'}`}>
                        <div className={isMobile ? 'text-center' : ''}>
                          <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
                            <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{review.patientName}</span>
                          </div>
                          <div className={`flex items-center gap-1 mt-1 ${isMobile ? 'justify-center' : ''}`}>
                            {renderStars(review.rating)}
                            <span className={`text-muted-foreground ml-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                              {formatDate(review.date)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <p className={`text-sm ${isMobile ? 'text-center leading-relaxed' : ''}`}>
                        {t('ratings.rating')}: {review.rating}/5.0
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className={`flex ${isMobile ? 'justify-center' : 'justify-end'}`}>
              <Button onClick={() => setIsDetailsOpen(false)}>{t('common.close')}</Button>
            </div>
          </div>
        )}
      </RTLDialog>
    </div>
  );
}