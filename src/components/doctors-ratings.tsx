import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Star, Eye, MessageCircle, TrendingUp } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Review {
  id: string;
  patientName: string;
  rating: number;
  comment: string;
  date: string;
  appointmentType: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  profilePicture?: string;
  averageRating: number;
  totalReviews: number;
  reviews: Review[];
}

const mockDoctors: Doctor[] = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiology',
    averageRating: 4.8,
    totalReviews: 127,
    reviews: [
      {
        id: '1',
        patientName: 'John Smith',
        rating: 5,
        comment: 'Excellent doctor! Very thorough examination and clear explanation of my condition. The treatment plan worked perfectly.',
        date: '2024-01-10',
        appointmentType: 'Cardiac Check-up'
      },
      {
        id: '2',
        patientName: 'Emily Davis',
        rating: 5,
        comment: 'Dr. Johnson is fantastic. She took the time to answer all my questions and made me feel comfortable throughout the process.',
        date: '2024-01-08',
        appointmentType: 'Follow-up'
      },
      {
        id: '3',
        patientName: 'Robert Wilson',
        rating: 4,
        comment: 'Very knowledgeable and professional. The wait time was a bit long, but the consultation was worth it.',
        date: '2024-01-05',
        appointmentType: 'Initial Consultation'
      }
    ]
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Internal Medicine',
    averageRating: 4.6,
    totalReviews: 89,
    reviews: [
      {
        id: '4',
        patientName: 'Lisa Brown',
        rating: 5,
        comment: 'Dr. Chen is very attentive and caring. He helped me understand my condition and provided great treatment options.',
        date: '2024-01-12',
        appointmentType: 'General Consultation'
      },
      {
        id: '5',
        patientName: 'Mark Davis',
        rating: 4,
        comment: 'Good doctor with solid medical knowledge. Explained everything clearly and was patient with my questions.',
        date: '2024-01-09',
        appointmentType: 'Annual Physical'
      }
    ]
  },
  {
    id: '3',
    name: 'Dr. Jennifer Lee',
    specialty: 'Dermatology',
    averageRating: 4.9,
    totalReviews: 156,
    reviews: [
      {
        id: '6',
        patientName: 'Anna Wilson',
        rating: 5,
        comment: 'Outstanding dermatologist! Diagnosed my skin condition accurately and the treatment was very effective.',
        date: '2024-01-11',
        appointmentType: 'Skin Consultation'
      },
      {
        id: '7',
        patientName: 'David Johnson',
        rating: 5,
        comment: 'Dr. Lee is amazing. Very thorough examination and gave me excellent advice for my skin care routine.',
        date: '2024-01-07',
        appointmentType: 'Acne Treatment'
      }
    ]
  },
  {
    id: '4',
    name: 'Dr. James Rodriguez',
    specialty: 'Orthopedics',
    averageRating: 4.4,
    totalReviews: 73,
    reviews: [
      {
        id: '8',
        patientName: 'Susan Miller',
        rating: 4,
        comment: 'Knowledgeable orthopedic surgeon. The surgery went well and recovery has been smooth.',
        date: '2024-01-06',
        appointmentType: 'Post-Surgery Follow-up'
      }
    ]
  }
];

export function DoctorsRatings() {
  const { t, isRTL } = useLanguage();
  const [doctors] = useState<Doctor[]>(mockDoctors.sort((a, b) => b.averageRating - a.averageRating));
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

  const viewDetails = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setIsDetailsOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : index < rating
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

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Stats */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-3'}`}>
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.doctorName')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>{doctors[0]?.name}</div>
            <p className="text-xs text-muted-foreground">
              {doctors[0]?.averageRating.toFixed(1)} ⭐ ({doctors[0]?.totalReviews} reviews)
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.averageRating')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {(doctors.reduce((sum, doc) => sum + doc.averageRating, 0) / doctors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">{t('ratings.reviews')}</p>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.reviews')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`font-bold ${isMobile ? 'text-lg' : 'text-2xl'}`}>
              {doctors.reduce((sum, doc) => sum + doc.totalReviews, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('ratings.reviews')}</p>
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
        <CardContent className="space-y-3 sm:space-y-4">
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
                    <AvatarImage src={doctor.profilePicture} />
                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1">
                  <h3 className={`font-semibold ${isMobile ? 'text-base' : ''}`}>{doctor.name}</h3>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : 'text-sm'}`}>{doctor.specialty}</p>
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
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className={`${isMobile ? 'max-w-[95vw] w-[95vw] max-h-[85vh]' : 'max-w-4xl'} max-h-[90vh] overflow-y-auto`}>
          <DialogHeader>
            <DialogTitle>Doctor Reviews & Details</DialogTitle>
          </DialogHeader>

          {selectedDoctor && (
            <div className="space-y-4 sm:space-y-6">
              {/* Doctor Header */}
              <div className={`p-3 sm:p-4 bg-muted rounded-lg ${isMobile ? 'flex flex-col gap-3' : 'flex items-center gap-4'}`}>
                <Avatar className={`${isMobile ? 'w-12 h-12 self-center' : 'w-16 h-16'}`}>
                  <AvatarImage src={selectedDoctor.profilePicture} />
                  <AvatarFallback>{getInitials(selectedDoctor.name)}</AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${isMobile ? 'text-center' : ''}`}>
                  <h2 className={`font-semibold ${isMobile ? 'text-lg' : 'text-xl'}`}>{selectedDoctor.name}</h2>
                  <p className={`text-muted-foreground ${isMobile ? 'text-sm' : ''}`}>{selectedDoctor.specialty}</p>
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
                <h3 className={`font-semibold mb-3 sm:mb-4 ${isMobile ? 'text-base' : 'text-lg'}`}>Patient Reviews</h3>
                <div className="space-y-3 sm:space-y-4">
                  {selectedDoctor.reviews.map((review) => (
                    <Card key={review.id} className="bg-white shadow-sm">
                      <CardContent className="p-3 sm:p-4">
                        <div className={`mb-3 ${isMobile ? 'space-y-2' : 'flex items-start justify-between mb-3'}`}>
                          <div className={isMobile ? 'text-center' : ''}>
                            <div className={`flex items-center gap-2 ${isMobile ? 'justify-center' : ''}`}>
                              <span className={`font-medium ${isMobile ? 'text-sm' : ''}`}>{review.patientName}</span>
                              <Badge variant="outline" className={isMobile ? 'text-xs' : ''}>{review.appointmentType}</Badge>
                            </div>
                            <div className={`flex items-center gap-1 mt-1 ${isMobile ? 'justify-center' : ''}`}>
                              {renderStars(review.rating)}
                              <span className={`text-muted-foreground ml-2 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className={`text-sm ${isMobile ? 'text-center leading-relaxed' : ''}`}>{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              <div className={`flex ${isMobile ? 'justify-center' : 'justify-end'}`}>
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}