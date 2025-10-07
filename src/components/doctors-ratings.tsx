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
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.doctorName')}</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{doctors[0]?.name}</div>
            <p className="text-xs text-muted-foreground">
              {doctors[0]?.averageRating.toFixed(1)} ⭐ ({doctors[0]?.totalReviews} reviews)
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.averageRating')}</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(doctors.reduce((sum, doc) => sum + doc.averageRating, 0) / doctors.length).toFixed(1)}
            </div>
            <p className="text-xs text-muted-foreground">{t('ratings.reviews')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('ratings.reviews')}</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {doctors.reduce((sum, doc) => sum + doc.totalReviews, 0)}
            </div>
            <p className="text-xs text-muted-foreground">{t('ratings.reviews')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Doctors Ranking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('ratings.title')}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {doctors.map((doctor, index) => (
            <div
              key={doctor.id}
              className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-muted-foreground">
                    #{index + 1}
                  </span>
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={doctor.profilePicture} />
                    <AvatarFallback>{getInitials(doctor.name)}</AvatarFallback>
                  </Avatar>
                </div>
                
                <div>
                  <h3 className="font-semibold">{doctor.name}</h3>
                  <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="flex items-center gap-1">
                    {renderStars(doctor.averageRating)}
                  </div>
                  <div className={`text-lg font-bold ${getRatingColor(doctor.averageRating)}`}>
                    {doctor.averageRating.toFixed(1)}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {doctor.totalReviews} reviews
                  </div>
                </div>

                <Button
                  variant="outline"
                  onClick={() => viewDetails(doctor)}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Doctor Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Doctor Reviews & Details</DialogTitle>
          </DialogHeader>
          
          {selectedDoctor && (
            <div className="space-y-6">
              {/* Doctor Header */}
              <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={selectedDoctor.profilePicture} />
                  <AvatarFallback>{getInitials(selectedDoctor.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">{selectedDoctor.name}</h2>
                  <p className="text-muted-foreground">{selectedDoctor.specialty}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center gap-1">
                      {renderStars(selectedDoctor.averageRating)}
                    </div>
                    <span className={`font-bold ${getRatingColor(selectedDoctor.averageRating)}`}>
                      {selectedDoctor.averageRating.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">
                      ({selectedDoctor.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Patient Reviews</h3>
                <div className="space-y-4">
                  {selectedDoctor.reviews.map((review) => (
                    <Card key={review.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{review.patientName}</span>
                              <Badge variant="outline">{review.appointmentType}</Badge>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                              <span className="text-sm text-muted-foreground ml-2">
                                {formatDate(review.date)}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

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