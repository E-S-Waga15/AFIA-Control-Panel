import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Plus, Edit, Trash2, Upload, Heart, Brain, Eye, Stethoscope, Baby, Bone } from 'lucide-react';
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
import type { RootState, AppDispatch } from '../store/store';

interface Specialty {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  iconUrl?: string;
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

export function ServicesManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch<AppDispatch>();

  // ✅ جلب الاختصاصات من Redux
  const { specialties, loading, error } = useSelector((state: RootState) => state.specialties);
  const { loading: addLoading, error: addError, success, message } = useSelector((state: RootState) => state.addSpecialty);
  const { loading: deleteLoading, error: deleteError, success: deleteSuccess, message: deleteMessage } = useSelector((state: RootState) => state.deleteSpecialty);

  const [services, setServices] = useState<Service[]>(mockServices);

  // State للنماذج
  const [isSpecialtyModalOpen, setIsSpecialtyModalOpen] = useState(false);
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingSpecialty, setEditingSpecialty] = useState<Specialty | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  // ✅ تحميل الاختصاصات من API عند أول تحميل
  useEffect(() => {
    dispatch(fetchSpecialties());
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
      toast.error('يرجى ملء جميع الحقول المطلوبة',{
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
                  {addLoading ? t('common.loading') : (editingSpecialty ? t('specialties.editSpecialty') : t('specialties.addSpecialty'))}
                </Button>
              </div>
            </div>
          </RTLDialog>
        </div>

        {/* Loading specialties */}
        {loading && <p>{t('specialties.loadingSpecialties')}...</p>}
        {error && <p className="text-red-500">{typeof error === 'object' ? error.message : error}</p>}
        {addError && <p className="text-red-500">{addError}</p>}
        {deleteError && <p className="text-red-500">{deleteError}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specialties.map((specialty) => {
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
          })}
        </div>
      </div>

      {/* Services Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">{t('services.title')}</h2>
          <RTLDialog
            open={isServiceModalOpen}
            onOpenChange={setIsServiceModalOpen}
            title={`${editingService ? t('common.edit') : t('common.add')} ${t('services.serviceName')}`}
            trigger={
              <Button onClick={openAddServiceModal} className="flex items-center gap-2">
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('services.addService')}
              </Button>
            }
          >
            <div className="space-y-4">
              <div>
                <Label>{t('services.serviceName')}</Label>
                <Input
                  value={serviceForm.name}
                  onChange={(e) => setServiceForm({ ...serviceForm, name: e.target.value })}
                  placeholder={t('services.serviceName')}
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  placeholder="Detailed description of the service"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Price ($)</Label>
                  <Input
                    type="number"
                    value={serviceForm.price}
                    onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })}
                    placeholder="150"
                  />
                </div>

                <div>
                  <Label>Category</Label>
                  <Input
                    value={serviceForm.category}
                    onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })}
                    placeholder="e.g., General, Cardiology"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setIsServiceModalOpen(false)}>
                  {t('common.cancel')}
                </Button>
                <Button onClick={handleServiceSubmit}>
                  {editingService ? t('common.edit') : t('common.add')} {t('services.serviceName')}
                </Button>
              </div>
            </div>
          </RTLDialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((service) => (
            <Card key={service.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{service.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditServiceModal(service)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteService(service.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{service.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{service.category}</Badge>
                  <div className="text-right">
                    <div className="text-lg font-semibold">${service.price}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
