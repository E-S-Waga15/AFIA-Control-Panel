import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Upload, Heart, Brain, Eye, Stethoscope, Baby, Bone, Loader } from 'lucide-react';
import { Skeleton } from './ui/skeleton';

import { useLanguage } from '../contexts/LanguageContext';
import { ImageUpload } from './ui/image-upload';
import { RTLDialog } from './ui/rtl-dialog';
import { toast } from 'react-toastify';
import { FaCheckCircle } from 'react-icons/fa';

// ✅ استدعاء Redux
import { useDispatch, useSelector } from 'react-redux';
import { fetchSpecialties } from '../store/slices/specialtiesSlice';
import { addSpecialty, updateSpecialty, clearAddSpecialtyState } from '../store/slices/addSpecialtySlice';
import { deleteSpecialty, clearDeleteSpecialtyState } from '../store/slices/deleteSpecialtySlice';
import { fetchBanners, addBanner, updateBanner, deleteBanner, clearBannerState } from '../store/slices/bannerSlice';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  iconUrl?: string;
}

interface Banner {
  id: string;
  index: number;
  image: string;
  description: string;
}

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  specialtyId: string;
}

const mockServices: Service[] = [
  {
    id: '1',
    name: 'General Consultation',
    description: 'Standard doctor consultation for general health issues',
    price: 150,
    category: 'General',
    specialtyId: '1'
  },
  {
    id: '2',
    name: 'Cardiac Stress Test',
    description: 'Exercise stress test to evaluate heart function',
    price: 450,
    category: 'Cardiology',
    specialtyId: '2'
  },
  {
    id: '3',
    name: 'Eye Exam',
    description: 'Comprehensive eye examination and vision testing',
    price: 120,
    category: 'Ophthalmology',
    specialtyId: '3'
  },
  {
    id: '4',
    name: 'Annual Physical',
    description: 'Complete annual health check-up and screening',
    price: 200,
    category: 'General',
    specialtyId: '1'
  }
];

const getIconComponent = (iconName: string) => {
  const icons = {
    Heart,
    Brain,
    Eye,
    Stethoscope,
    Baby,
    Bone
  };
  const IconComponent = icons[iconName as keyof typeof icons] || Stethoscope;
  return IconComponent;
};

const getColorClass = (color: string) => {
  const colorClasses = {
    red: 'bg-red-100 text-red-800 border-red-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    green: 'bg-green-100 text-green-800 border-green-200',
    pink: 'bg-pink-100 text-pink-800 border-pink-200',
    orange: 'bg-orange-100 text-orange-800 border-orange-200'
  };
  return colorClasses[color as keyof typeof colorClasses] || 'bg-gray-100 text-gray-800 border-gray-200';
};

// Loading Skeletons
const SpecialtiesGridSkeleton = () => (
  <div className="grid  grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(6)].map((_, index) => (
      <Card key={index} className="w-full border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton className="w-8 h-8 rounded" />
              <Skeleton className="h-5 w-24" />
            </div>
          
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-3/4" />
        </CardContent>
      </Card>
    ))}
  </div>
);

const BannersGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[...Array(3)].map((_, index) => (
      <Card key={index} className="w-full overflow-hidden">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-20" />
            <div className="flex gap-2">
              <Skeleton className="w-8 h-8" />
              <Skeleton className="w-8 h-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    ))}
  </div>
);

export function ServicesManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 768;
  // ✅ جلب الاختصاصات من Redux
  const { specialties, loading, error } = useSelector((state: any) => state.specialties);
  const { loading: addLoading, error: addError, success, message } = useSelector((state: any) => state.addSpecialty);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, message: deleteMessage } = useSelector((state: any) => state.deleteSpecialty);
  const { banners, loading: bannerLoading, error: bannerError, success: bannerSuccess, message: bannerMessage } = useSelector((state: any) => state.banners);

  const [services, setServices] = useState<Service[]>(mockServices);

  // State للنماذج
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedBannerImage, setSelectedBannerImage] = useState<File | null>(null);

  const [specialtyForm, setSpecialtyForm] = useState({
    name: '',
    description: '',
    icon: 'Stethoscope',
    color: 'blue'
  });

  const [serviceForm, setServiceForm] = useState({
    name: '',
    description: '',
    price: '',
    category: ''
  });

  const [bannerForm, setBannerForm] = useState({
    description: ''
  });

  // ✅ تحميل الاختصاصات من API عند أول تحميل
  useEffect(() => {
    dispatch(fetchSpecialties());
  }, [dispatch]);

  // ✅ تحميل البانرات من API عند أول تحميل
  useEffect(() => {
    dispatch(fetchBanners());
  }, [dispatch]);

  // ✅ مراقبة حالة إضافة/تعديل الاختصاص
  useEffect(() => {
    if (success && message) {
      // مكون الرسالة المخصص
      const CustomToastContent = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
          <span>{message}</span>
        </div>
      );

      // عرض التوست
      toast(<CustomToastContent />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClose: () => {

        }
      });

      // تنظيف الحالة بعد عرض الرسالة
      dispatch(clearAddSpecialtyState());
    }
  }, [success, message, dispatch]);

  // ✅ مراقبة حالة حذف الاختصاص
  useEffect(() => {
    if (deleteSuccess && deleteMessage) {
      // مكون الرسالة المخصص للحذف
      const CustomToastContent = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
          <span>{deleteMessage}</span>
        </div>
      );

      // عرض التوست
      toast(<CustomToastContent />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClose: () => {

        }
      });

      // تنظيف الحالة بعد عرض الرسالة
      dispatch(clearDeleteSpecialtyState());
    }
  }, [deleteSuccess, deleteMessage, dispatch]);

  // ✅ مراقبة حالة عمليات الإعلانات
  useEffect(() => {
    if (bannerSuccess && bannerMessage) {
      // مكون الرسالة المخصص
      const CustomToastContent = () => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FaCheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
          <span>{bannerMessage}</span>
        </div>
      );

      // عرض التوست
      toast(<CustomToastContent />, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        onClose: () => {

        }
      });

      // تنظيف الحالة بعد عرض الرسالة
      dispatch(clearBannerState());
    }
  }, [bannerSuccess, bannerMessage, dispatch]);

  const resetSpecialtyForm = () => {
    setSpecialtyForm({
      name: '',
      description: '',
      icon: 'Stethoscope',
      color: 'blue'
    });
    setSelectedImage(null);
  };

  const resetServiceForm = () => {
    setServiceForm({
      name: '',
      description: '',
      price: '',
      category: ''
    });
  };

  const openAddSpecialtyModal = () => {
    resetSpecialtyForm();
    setEditingSpecialty(null);
    setIsSpecialtyModalOpen(true);
  };

  const openEditSpecialtyModal = (specialty: Specialty) => {
    setSpecialtyForm({
      name: specialty.name,
      description: specialty.description,
      icon: specialty.icon,
      color: specialty.color
    });
    setEditingSpecialty(specialty);
    setIsSpecialtyModalOpen(true);
  };

  const handleSpecialtySubmit = async () => {
    if (!specialtyForm.name.trim() || !specialtyForm.description.trim()) {
      toast.error('يرجى ملء جميع الحقول المطلوبة', {
        position: "top-center",
      });
      return;
    }

    try {
      const specialtyData = {
        name: specialtyForm.name,
        description: specialtyForm.description,
        color: specialtyForm.color,
        image: selectedImage || undefined
      };

      if (editingSpecialty) {
        await dispatch(updateSpecialty({
          id: editingSpecialty.id,
          specialtyData
        }));
      } else {
        await dispatch(addSpecialty(specialtyData));
      }

      setIsSpecialtyModalOpen(false);
      resetSpecialtyForm();
    } catch (error) {
      console.error('Error submitting specialty:', error);
    }
  };

  const showDeleteConfirmation = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>{t('specialties.deleteConfirmation')}</h4>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
            {t('specialties.deleteConfirmation')}
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirm"
              onClick={() => {
                handleDeleteSpecialty(id);
                closeToast();
              }}
            >
              {t('common.confirm')}
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              {t('common.close')}
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "custom-toast",
      }
    );
  };

  const handleDeleteSpecialty = async (id: string) => {
    try {
      // @ts-ignore - تجاهل خطأ TypeScript للـ async thunk
      await dispatch(deleteSpecialty(id));
    } catch (error) {
      console.error('Error deleting specialty:', error);
    }
  };

  const openAddServiceModal = () => {
    resetServiceForm();
    setEditingService(null);
    setIsServiceModalOpen(true);
  };

  const openEditServiceModal = (service: Service) => {
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price.toString(),
      category: service.category
    });
    setEditingService(service);
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = () => {
    const newService: Service = {
      id: editingService?.id || Date.now().toString(),
      name: serviceForm.name,
      description: serviceForm.description,
      price: parseFloat(serviceForm.price),
      category: serviceForm.category,
      specialtyId: '1' // يمكن تحديث هذا لاحقاً ليربط بالاختصاص المختار
    };

    if (editingService) {
      setServices(services.map(s => s.id === editingService.id ? newService : s));
    } else {
      setServices([...services, newService]);
    }

    setIsServiceModalOpen(false);
    resetServiceForm();
  };

  const deleteService = (id: string) => {
    setServices(services.filter(s => s.id !== id));
  };

  const resetBannerForm = () => {
    setBannerForm({
      description: ''
    });
    setSelectedBannerImage(null);
  };

  const openAddBannerModal = () => {
    resetBannerForm();
    setEditingBanner(null);
    setIsBannerModalOpen(true);
  };

  const openEditBannerModal = (banner) => {
    setBannerForm({
      description: banner.description
    });
    setEditingBanner(banner);
    setIsBannerModalOpen(true);
  };

  const handleBannerSubmit = async () => {
    if (!bannerForm.description.trim()) {
      toast.error('يرجى إدخال وصف البانر', {
        position: "top-center",
      });
      return;
    }

    try {
      const bannerData = {
        description: bannerForm.description,
        image: selectedBannerImage || undefined
      };

      if (editingBanner) {
        await dispatch(updateBanner({
          id: editingBanner.id,
          bannerData
        }));
      } else {
        await dispatch(addBanner(bannerData));
      }

      setIsBannerModalOpen(false);
      resetBannerForm();
    } catch (error) {
      console.error('Error submitting banner:', error);
    }
  };

  const showDeleteBannerConfirmation = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>{t('banners.deleteConfirmation')}</h4>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
            {t('banners.deleteConfirmation')}
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirm"
              onClick={() => {
                handleDeleteBanner(id);
                closeToast();
              }}
            >
              {t('common.confirm')}
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              {t('common.close')}
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        hideProgressBar: true,
        className: "custom-toast",
      }
    );
  };

  const handleDeleteBanner = async (id: string) => {
    try {
      await dispatch(deleteBanner(id));
    } catch (error) {
      console.error('Error deleting banner:', error);
    }
  };

  return (
    <div className="space-y-8">
      {/* Specialties Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('specialties.title')}</h2>
          <RTLDialog
            open={isSpecialtyModalOpen}
            onOpenChange={setIsSpecialtyModalOpen}
            title={`${editingSpecialty ? t('specialties.editSpecialty') : t('specialties.addSpecialty')}`}
            trigger={
              <Button onClick={openAddSpecialtyModal} className="flex items-center gap-2">
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('specialties.addSpecialty')}
              </Button>
            }
            maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
          >

            <div className="space-y-4">
              <div>
                <Label>{t('specialties.specialtyName')}</Label>
                <Input
                  value={specialtyForm.name}
                  onChange={(e) => setSpecialtyForm({ ...specialtyForm, name: e.target.value })}
                  placeholder={t('specialties.specialtyName')}
                />
              </div>

              <div>
                <Label>{t('specialties.description')}</Label>
                <Textarea
                  value={specialtyForm.description}
                  onChange={(e) => setSpecialtyForm({ ...specialtyForm, description: e.target.value })}
                  placeholder={t('specialties.description')}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t('specialties.color')}</Label>
                  <select
                    className={`w-full p-2 border rounded ${isRTL ? 'text-right' : 'text-left'}`}
                    value={specialtyForm.color}
                    onChange={(e) => setSpecialtyForm({ ...specialtyForm, color: e.target.value })}
                    aria-label="Select specialty color"
                    dir={isRTL ? 'rtl' : 'ltr'}
                  >
                    <option value="red">Red</option>
                    <option value="purple">Purple</option>
                    <option value="blue">Blue</option>
                    <option value="green">Green</option>
                    <option value="pink">Pink</option>
                    <option value="orange">Orange</option>
                  </select>
                </div>
              </div>

              <div className="modal-image-upload-section">
                <Label className="modal-image-upload-label">{t('specialties.imageUpload')}</Label>
                <ImageUpload
                  onImageSelect={(file) => {
                    setSelectedImage(file);
                  }}
                  buttonText={t('users.uploadImage')}
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsSpecialtyModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleSpecialtySubmit} disabled={addLoading}>
                  {addLoading ? (<>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    {t('common.loading')}
                  </>) : (editingSpecialty ? t('specialties.editSpecialty') : t('specialties.addSpecialty'))}
                </Button>
              </div>
            </div>
          </RTLDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <SpecialtiesGridSkeleton />
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500 text-lg">{typeof error === 'object' ? error.message : error}</p>
            </div>
          ) : addError ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500 text-lg">{addError}</p>
            </div>
          ) : deleteError ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500 text-lg">{deleteError}</p>
            </div>
          ) : specialties.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">لا توجد تخصصات متاحة</p>
            </div>
          ) : (
            specialties.map((specialty) => {
              const IconComponent = getIconComponent(specialty.icon);
              return (
                <Card key={specialty.id} className={`${getColorClass(specialty.color)} border-2`}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {specialty.iconUrl !== 'null' ? <img src={specialty.iconUrl} alt={specialty.name} className="w-8 h-8" /> : <IconComponent className="w-8 h-8" />}
                        <CardTitle>{specialty.name}</CardTitle>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openEditSpecialtyModal(specialty)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => showDeleteConfirmation(specialty.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{specialty.description || ""}</p>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Banners Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">الإعلانات</h2>
          <RTLDialog
            open={isBannerModalOpen}
            onOpenChange={setIsBannerModalOpen}
            title={`${editingBanner ? 'تعديل الإعلان' : 'إضافة إعلان جديد'}`}
            trigger={
              <Button onClick={openAddBannerModal} className="flex items-center gap-2">
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                إضافة إعلان
              </Button>
            }
            maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
          >
            <div className="space-y-4">
              <div>
                <Label>وصف الإعلان</Label>
                <Textarea
                  value={bannerForm.description}
                  onChange={(e) => setBannerForm({ ...bannerForm, description: e.target.value })}
                  placeholder="أدخل وصف الإعلان"
                />
              </div>

              <div className="modal-image-upload-section">
                <Label className="modal-image-upload-label">صورة الإعلان</Label>
                <ImageUpload
                  onImageSelect={(file) => {
                    setSelectedBannerImage(file);
                  }}
                  buttonText="رفع صورة الإعلان"
                />
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsBannerModalOpen(false)}>
                  إلغاء
                </Button>
                <Button onClick={handleBannerSubmit} disabled={bannerLoading}>
                  {bannerLoading ? (<>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
                    جاري الحفظ...
                  </>) : (editingBanner ? 'تعديل الإعلان' : 'إضافة الإعلان')}
                </Button>
              </div>
            </div>
          </RTLDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannerLoading ? (
            <BannersGridSkeleton />
          ) : bannerError ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-500 text-lg">{bannerError}</p>
            </div>
          ) : banners.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-500 text-lg">لا توجد إعلانات متاحة</p>
            </div>
          ) : (
            banners.map((banner) => (
              <Card key={banner.id} className="overflow-hidden">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">إعلان #{banner.index + 1}</CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditBannerModal(banner)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => showDeleteBannerConfirmation(banner.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {banner.image && (
                    <div className="aspect-video w-full">
                      <img
                        src={banner.image}
                        alt={banner.description}
                        className="w-full h-full object-cover rounded-md"
                      />
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground">{banner.description}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
