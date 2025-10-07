import React, { useState, useEffect, useRef } from "react";
import { Filter, Plus, Edit, Trash2, History, CheckCircle, XCircle, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { ImageUpload } from './ui/image-upload';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { MedicalHistory } from "./medical-history";
import { useLanguage } from "../contexts/LanguageContext";
import { RTLSelect } from "./ui/rtl-select";
import { RTLDialog } from "./ui/rtl-dialog";
import { toast } from 'react-toastify';
import { fetchGovernorates } from "../store/slices/governoratesSlice";
import { fetchSpecialties } from "../store/slices/specialtiesSlice";
import { registerUser, toggleUserStatusAPI } from "../store/slices/userSlice";
import { fetchUsers } from "../store/slices/usersDisplaySlice";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaCheckCircle } from 'react-icons/fa';
type UserType = "doctor" | "patient" | "pharmacist";
type AccountStatus = "active" | "inactive";

interface User {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  gender: string;
  email: string;
  accountType: UserType;
  accountStatus: AccountStatus;
  birthdate?: string;
  nationalId?: string;
  governorate_id?: number;
  governorate?: string;
  city?: string;
  street?: string;
  specialties?: number[];
  bio?: string;
  profilePicture?: string;
  pharmacyName?: string;
  consultationPrice?: string;
}

const genders = ["male", "female"];

export function UserManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const specialtiesData = useSelector((state) => (state as any).specialties.specialties);
  const specialtiesLoading = useSelector((state) => (state as any).specialties.loading);
  const governoratesLoading = useSelector((state) => (state as any).governorates.loading);
  const users = useSelector((state) => (state as any)?.usersDisplay?.users || []);
  const usersLoading = useSelector((state) => (state as any)?.usersDisplay?.loading || false);
  const governorates = useSelector((state) => (state as any).governorates.governorates);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<UserType>("doctor");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showMedicalHistory, setShowMedicalHistory] = useState<User | null>(null);
  const [selectedAccountTypeFilter, setSelectedAccountTypeFilter] = useState<string>("doctor");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const calendarRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState<{
    fullName: string;
    username: string;
    phone: string;
    gender: string;
    email: string;
    password: string;
    birthdate: string;
    nationalId: string;
    governorate: string;
    city: string;
    street: string;
    specialties: number[];
    bio: string;
    profilePicture: string;
    pharmacyName: string;
    consultationPrice: string;
  }>({
    fullName: "",
    username: "",
    phone: "",
    gender: "",
    email: "",
    password: "",
    birthdate: "",
    nationalId: "",
    governorate: "",
    city: "",
    street: "",
    specialties: [] as number[],
    bio: "",
    profilePicture: "",
    pharmacyName: "",
    consultationPrice: "",
  });

  // جلب البيانات من API عند تحميل الكومبوننت وعند تغيير الفلتر
  useEffect(() => {
    (dispatch as any)(fetchUsers(selectedAccountTypeFilter || 'doctor'));
  }, [dispatch, selectedAccountTypeFilter]);

  // جلب المحافظات والاختصاصات عند تحميل الكومبوننت
  useEffect(() => {
    (dispatch as any)(fetchGovernorates());
    (dispatch as any)(fetchSpecialties());
  }, [dispatch]);

  // إغلاق التقويم عند النقر خارجة
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
        dateInputRef.current && !dateInputRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
    };

    if (isCalendarOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isCalendarOpen]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      phone: "",
      email: "",
      gender: "",
      password: "",
      birthdate: "",
      nationalId: "",
      governorate: "",
      city: "",
      street: "",
      specialties: [],
      bio: "",
      profilePicture: "",
      pharmacyName: "",
      consultationPrice: "",
    });
    setSelectedImage(null); // إعادة تعيين الصورة المحددة
  };

  const openAddModal = (userType: UserType) => {
    setSelectedUserType(userType);
    resetForm();
    setEditingUser(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setSelectedUserType(user.accountType);
    setFormData({
      fullName: user.fullName,
      username: user.username,
      phone: user.phone,
      gender: user.gender,
      email: user.email,
      password: "",
      birthdate: user.birthdate || "",
      nationalId: user.nationalId || "",
      governorate: user.governorate_id?.toString() || user.governorate || "",
      city: user.city || "",
      street: user.street || "",
      specialties: user.specialties || [],
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      pharmacyName: user.pharmacyName || "",
      consultationPrice: user.consultationPrice || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // تحضير البيانات حسب نوع المستخدم
      const userData = {
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
        accountType: selectedUserType,
        birthdate: formData.birthdate,
        governorate_id: parseInt(formData.governorate),
        gender: formData.gender,
        ...(selectedUserType === "patient" && {
          nationalId: formData.nationalId,
        }),
        ...((selectedUserType === "doctor" || selectedUserType === "pharmacist") && {
          city: formData.city,
          street: formData.street,
        }),
        ...(selectedUserType === "doctor" && {
          specialties_id: formData.specialties,
          bio: formData.bio,
          profilePicture: selectedImage, // استخدام الـ File بدلاً من URL
          price: parseFloat(formData.consultationPrice) || 0,
        }),
        ...(selectedUserType === "pharmacist" && {
          pharmacyName: formData.pharmacyName,
          pharmacyPicture: selectedImage, // استخدام الـ File بدلاً من URL
        }),
      };

      // إعداد البيانات للإرسال
      const formDataToSend = new FormData();

      // إضافة البيانات النصية
      formDataToSend.append('fullName', userData.fullName || '');
      formDataToSend.append('username', userData.username || '');
      formDataToSend.append('phone', userData.phone || '');
      formDataToSend.append('password', userData.password || '');
      formDataToSend.append('accountType', userData.accountType || '');
      formDataToSend.append('birthdate', userData.birthdate || '');
      formDataToSend.append('governorate_id', userData.governorate_id?.toString() || '');
      formDataToSend.append('gender', userData.gender || '');

      if (selectedUserType === "patient" && userData.nationalId) {
        formDataToSend.append('nationalId', userData.nationalId);
      }

      if ((selectedUserType === "doctor" || selectedUserType === "pharmacist")) {
        formDataToSend.append('city', userData.city || '');
        formDataToSend.append('street', userData.street || '');
      }

      if (selectedUserType === "doctor") {
        // إرسال الأقسام كمصفوفة منفصلة لكل عنصر
        formData.specialties.forEach(specialtyId => {
          formDataToSend.append('specialties_id[]', specialtyId.toString());
        });
        formDataToSend.append('bio', userData.bio || '');
        formDataToSend.append('price', (userData.price || 0).toString());

        if (selectedImage) {
          formDataToSend.append('profilePicture', selectedImage);
        }
      }

      if (selectedUserType === "pharmacist") {
        formDataToSend.append('pharmacyName', userData.pharmacyName || '');

        if (selectedImage) {
          formDataToSend.append('pharmacyPicture', selectedImage);
        }
      }

      // إرسال البيانات إلى API
      const result = await (dispatch as any)(registerUser(formDataToSend));
      const statusCode = result.payload?.status || result.meta?.requestStatus === 'fulfilled' ? 200 : result.error?.message;
        
      // 2. تطبيق الشرط: إذا كان كود الحالة 200 (نجاح)
      if (statusCode === 200 || statusCode === 201) { 
          // 200 و 201 هي أكواد النجاح الشائعة

          // نجح الإرسال - رسالة نجاح
          const message = result.payload?.message || "تمت العملية بنجاح";

          const CustomToastContent = () => (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                  <CheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
                  <span>{message}</span>
              </div>
          );

          // إغلاق المودل وإعادة تعيين الفورم
          toast.success(<CustomToastContent />, {
              position: "top-center",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
              onClose: () => {
                  setIsAddModalOpen(false);
                  resetForm();
              }
          });

      } else { 
          // فشل الإرسال - أكواد حالة أخرى (مثل 400, 401, 500) أو فشل عام

          // رسالة خطأ
          const errorMessage = result.payload?.message || result.payload || "حدث خطأ أثناء حفظ المستخدم";
          
          toast.error(errorMessage, {
              position: "top-center",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              theme: "light",
          });
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = (id: string) => {
    // حذف المستخدم من الـ API والـ state
    // سيتم إضافة API call هنا لاحقاً
    console.log('حذف المستخدم:', id);
  };

  // لا يزال يجب أن نحافظ على هذه الدالة لتحديث الحالة داخليًا
  const toggleUserStatus = async (id: string, currentStatus: AccountStatus) => {
    try {
      // استدعاء API تغيير حالة المستخدم
      const result = await (dispatch as any)(toggleUserStatusAPI({ userId: id, currentStatus }));

      if (toggleUserStatusAPI.fulfilled.match(result)) {
        // نجح التبديل - رسالة نجاح من الـ API response
        const message = result.payload?.message || "تم تغيير حالة المستخدم بنجاح";

        const CustomToastContent = () => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
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
        });

        // إعادة جلب بيانات المستخدمين لتحديث القائمة
        (dispatch as any)(fetchUsers(selectedAccountTypeFilter || 'doctor'));
      } else {
        // فشل التبديل - رسالة خطأ من الـ API response
        const errorMessage = result.payload?.message || result.payload || "حدث خطأ أثناء تغيير حالة المستخدم";
        toast.error(errorMessage, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "light",
        });
      }
    } catch (error) {
      toast.error("حدث خطأ غير متوقع", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };


  const confirmToggleStatus = (id: string, currentStatus: AccountStatus) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>
            {currentStatus === "active"
              ? "Deactivate User?"
              : "Activate User?"}
          </h4>
          <p style={{ fontSize: "14px", marginBottom: "12px" }}>
            {currentStatus === "active"
              ? "Are you sure you want to deactivate this account?"
              : "Are you sure you want to activate this account?"}
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirmp"
              onClick={() => {
                // هنا التبديل الفعلي
                toggleUserStatus(id, currentStatus);
                closeToast();
              }}
            >
              Confirm
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              Cancel
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


  const addSpecialty = (specialtyId: string) => {
    const id = parseInt(specialtyId);
    if (!formData.specialties.includes(id)) {
      setFormData({
        ...formData,
        specialties: [...formData.specialties, id],
      });
    }
  };

  const removeSpecialty = (specialtyId: number) => {
    setFormData({
      ...formData,
      specialties: formData.specialties.filter((id) => id !== specialtyId),
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <RTLDialog
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title={editingUser ? t('users.editUser') : t('users.addUser')}
          maxWidth="max-w-2xl"
          className="max-h-[90vh] overflow-y-auto"
          trigger={
            <Button
              onClick={() => openAddModal("doctor")}
              className="flex items-center gap-2"
            >
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('users.addUser')}
            </Button>
          }
        >
          {/* دائرة التحميل في الأسفل */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-[9999]">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3 mb-8">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري الإرسال...</span>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {!editingUser && (
              <div>
                <Label>{t('users.accountType')}</Label>
                <RTLSelect
                  value={selectedUserType}
                  onValueChange={(value: UserType) =>
                    setSelectedUserType(value)
                  }
                  placeholder={t('users.accountType')}
                >
                  <SelectItem value="doctor">{t('users.doctor')}</SelectItem>
                  <SelectItem value="patient">{t('users.patient')}</SelectItem>
                  <SelectItem value="pharmacist">{t('users.pharmacist')}</SelectItem>
                </RTLSelect>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('users.fullName')}</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>{t('users.username')}</Label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder={t('users.username')}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('users.phone')}</Label>
                <Input
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>

              <div>
                <Label>{t('users.governorate')}</Label>
                {governoratesLoading ? (
                  <div className="rtl-select-loading" dir={isRTL ? 'rtl' : 'ltr'}>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {t('common.loading') || 'Loading...'}
                  </div>
                ) : (
                  <RTLSelect

                    value={formData.governorate}

                    onValueChange={(value) => {
                      setFormData({
                        ...formData,
                        governorate: value
                      })
                    }}
                    placeholder={t('users.governorate')}
                  >
                    {governorates.map((governorate) => (
                      <SelectItem
                        key={governorate.id}
                        value={governorate.id.toString()}
                      >
                        {isRTL ? governorate.nameAr : governorate.nameEn}
                      </SelectItem>
                    ))}
                  </RTLSelect>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>{t('users.gender')}</Label>
                <RTLSelect
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                  placeholder={t('users.gender')}
                >
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender === 'male' ? t('users.male') : t('users.female')}
                    </SelectItem>
                  ))}
                </RTLSelect>
              </div>
              <div>
                <Label>{t('users.birthdate')}</Label>
                <div className="relative">
                  <div className="relative">
                    <input
                      ref={dateInputRef}
                      type="text"
                      readOnly
                      value={formData.birthdate}
                      onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                      className="w-full m-0 px-6 py-1 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 bg-white text-gray-900 placeholder:text-gray-500 hover:border-primary/50 cursor-pointer"
                      placeholder={t('users.birthdate')}
                    />
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  </div>

                  {/* Custom Dropdown Calendar */}
                  {isCalendarOpen && (
                    <div
                      ref={calendarRef}
                      className="absolute top-full left-0 mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                      style={{
                        minWidth: '280px',
                        maxHeight: '350px' /* تصغير الحد الأقصى للارتفاع الكلي */
                      }}
                    >
                      <div className="p-3" style={{ maxHeight: '330px', overflowY: 'auto' }}>
                        <DatePicker
                          selected={formData.birthdate ? new Date(formData.birthdate) : null}
                          onChange={(date: Date | null) => {
                            setFormData({
                              ...formData,
                              birthdate: date ? date.toISOString().split('T')[0] : ""
                            });
                            setIsCalendarOpen(false); // إغلاق التقويم عند التحديد
                          }}
                          inline
                          dateFormat="yyyy-MM-dd"
                          maxDate={new Date()}
                          minDate={new Date('1900-01-01')}
                          showYearDropdown
                          showMonthDropdown
                          dropdownMode="select"
                          yearDropdownItemNumber={5}
                          scrollableYearDropdown
                          calendarClassName="custom-datepicker-dropdown-calendar"
                        />
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>

            {selectedUserType === "patient" && (
              <div>
                <Label>{t('users.nationalId')}</Label>
                <Input
                  value={formData.nationalId}
                  onChange={(e) =>
                    setFormData({ ...formData, nationalId: e.target.value })
                  }
                  placeholder={t('users.nationalId')}
                />
              </div>
            )}

            <div>
              <Label>{t('login.password')}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  editingUser
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
              />
            </div>


            {(selectedUserType === "doctor" ||
              selectedUserType === "pharmacist") && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-primary">
                      {t('users.addressInfo')}
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>{t('users.city')}</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder={t('users.city')}
                        />
                      </div>
                      <div>
                        <Label>{t('users.street')}</Label>
                        <Input
                          value={formData.street}
                          onChange={(e) =>
                            setFormData({ ...formData, street: e.target.value })
                          }
                          placeholder={t('users.street')}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedUserType === "pharmacist" && (
                    <div>
                      <Label>{t('users.pharmacyName')}</Label>
                      <Input
                        value={formData.pharmacyName}
                        onChange={(e) =>
                          setFormData({ ...formData, pharmacyName: e.target.value })
                        }
                        placeholder={t('users.pharmacyName')}
                      />
                    </div>
                  )}
                </>
              )}

            {selectedUserType === "doctor" && (
              <>
                <div>
                  <Label>{t('users.specialties')}</Label>
                  {specialtiesLoading ? (
                    <div className="rtl-select-loading" dir={isRTL ? 'rtl' : 'ltr'}>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t('common.loading') || 'Loading...'}
                    </div>
                  ) : specialtiesData && specialtiesData.length > 0 ? (
                    <>
                      <RTLSelect
                        value=""
                        onValueChange={addSpecialty}
                        placeholder={t('users.specialties')}
                      >
                        {specialtiesData.map((specialty) => (
                          <SelectItem key={specialty.id} value={specialty.id.toString()}>
                            {specialty.name}
                          </SelectItem>
                        ))}
                      </RTLSelect>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {formData.specialties.length > 0 ? (
                          formData.specialties.map((specialtyId) => {
                            // البحث عن الاختصاص في البيانات من الباك إيند
                            // استخدام == بدلاً من === للتعامل مع string vs number
                            const specialty = specialtiesData?.find(s => s.id == specialtyId);
                            return (
                              <Badge
                                key={specialtyId}
                                variant="secondary"
                                className="cursor-pointer hover:bg-secondary/80 transition-colors"
                                onClick={() => removeSpecialty(specialtyId)}
                              >
                                {specialty?.name || `اختصاص ${specialtyId}`} ×
                              </Badge>
                            );
                          })
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">
                            {t('users.noSpecialtiesSelected') || 'لم يتم اختيار أي تخصصات بعد'}
                          </p>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="rtl-select-loading" dir={isRTL ? 'rtl' : 'ltr'}>
                      <span className="text-red-500">
                        {t('common.error') || 'Error'}: {t('users.noSpecialtiesAvailable') || 'لا توجد تخصصات متاحة من الخادم'}
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <Label>{t('users.bio')}</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) =>
                      setFormData({ ...formData, bio: e.target.value })
                    }
                    placeholder={t('users.bio')}
                  />
                </div>

                <div>
                  <Label>{t('users.consultationPrice')}</Label>
                  <Input
                    type="number"
                    value={formData.consultationPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, consultationPrice: e.target.value })
                    }
                    placeholder={t('users.consultationPrice')}
                  />
                </div>

                <div>
                  <Label>{t('users.profilePicture')}</Label>
                  <ImageUpload
                    onImageSelect={(file) => {
                      setSelectedImage(file);
                    }}
                    currentImage={selectedImage ? URL.createObjectURL(selectedImage) : formData.profilePicture}
                    buttonText={t('users.uploadImage')}
                  />
                </div>
              </>
            )}

            {(
              selectedUserType === "pharmacist") && (
                <div>
                  <Label>{t('users.profilePicture')}</Label>
                  <ImageUpload
                    onImageSelect={(file) => {
                      setSelectedImage(file);
                    }}
                    currentImage={selectedImage ? URL.createObjectURL(selectedImage) : formData.profilePicture}
                    buttonText={t('users.uploadImage')}
                  />
                </div>)}

            <Separator />



            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-primary hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  editingUser ? t('users.editUser') : t('users.addUser')
                )}
              </Button>
            </div>
          </div>
        </RTLDialog>
      </div>

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
              <Label>{t('users.accountType')}</Label>
              <RTLSelect
                value={selectedAccountTypeFilter}
                onValueChange={(value: string) => setSelectedAccountTypeFilter(value)}
                placeholder={t('users.accountType')}
              >
                <SelectItem value="doctor">{t('users.doctor')}</SelectItem>
                <SelectItem value="patient">{t('users.patient')}</SelectItem>
                <SelectItem value="pharmacist">{t('users.pharmacist')}</SelectItem>
              </RTLSelect>
            </div>

            <div className="flex items-end gap-2">
              <Button onClick={() => {
                // جلب البيانات حسب الفلتر المحدد
                (dispatch as any)(fetchUsers(selectedAccountTypeFilter || 'doctor'));
              }}>{t('common.apply')}</Button>
              <Button variant="outline" onClick={() => {
                setSelectedAccountTypeFilter("doctor");
                (dispatch as any)(fetchUsers('doctor'));
              }}>{t('common.clear')}</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('users.fullName')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('users.phone')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('users.governorate')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>
                  {selectedAccountTypeFilter === 'patient' ? t('users.nationalId') :
                    selectedAccountTypeFilter === 'pharmacist' ? t('users.pharmacyName') :
                      t('users.specialties')}
                </TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('users.username')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('users.status')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {usersLoading ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>جاري تحميل المستخدمين...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    لا توجد مستخدمين من هذا النوع
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>{user.fullName}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>{user.phone}</TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                      {user.governorate_id ? (
                        <span>
                          {isRTL
                            ? governorates.find(g => g.id === user.governorate_id)?.nameAr || user.governorate
                            : governorates.find(g => g.id === user.governorate_id)?.nameEn || user.governorate
                          }
                        </span>
                      ) : user.governorate && (
                        <span>
                          {isRTL
                            ? governorates.find(g => g.nameEn === user.governorate || g.nameAr === user.governorate)?.nameAr || user.governorate
                            : governorates.find(g => g.nameEn === user.governorate || g.nameAr === user.governorate)?.nameEn || user.governorate
                          }
                        </span>
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                      {selectedAccountTypeFilter === 'patient' ? (
                        user.nationalId || t('users.noNationalId')
                      ) : selectedAccountTypeFilter === 'pharmacist' ? (
                        user.pharmacy_name || t('users.noPharmacy')
                      ) : (
                        user.specialties && user.specialties.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                           {user.specialties.map((specialty, index) => (
    <Badge
        key={specialty.id || index}
        variant="outline"
        // 🚀 أضف علامة "!" لفرض تطبيق الألوان
        className="p-1 my-1 bg-primary/10 hover:bg-primary/20 text-primary"
    >
        {specialty.name || `تخصص ${specialty.id}`}
    </Badge>
))}
                           
                          </div>
                        ) : (
                          t('users.noSpecialties')
                        )
                      )}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                      {user.username}
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                      <div className={`flex items-center gap-2 cursor-pointer`} onClick={() => confirmToggleStatus(user.id, user.accountStatus)}
                        title={user.accountStatus === "active" ? t('users.deactivate') : t('users.activate')}>
                        <Badge
                          variant={
                            user.accountStatus === "active"
                              ? "default"
                              : "destructive"
                          }
                        >
                          {user.accountStatus === "active" ? (
                            <CheckCircle className="w-6 h-6 text-green-500" />
                          ) : (
                            <XCircle className="w-6 h-6 text-red-500" />
                          )}
                          {user.accountStatus === 'active' ? t('users.active') : t('users.inactive')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                      <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditModal(user)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowMedicalHistory(user)}
                          className="bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Medical History Dialog */}
      <RTLDialog
        open={!!showMedicalHistory}
        onOpenChange={() => setShowMedicalHistory(null)}
        title={t('users.medicalHistory')}
        maxWidth="max-w-4xl"
        className="max-h-[90vh] overflow-hidden"
      >
        <div className="overflow-y-auto max-h-[80vh]">
          {showMedicalHistory && (
            <MedicalHistory
              patientId={showMedicalHistory.id}
              patientName={showMedicalHistory.fullName}
              userRole="admin"
            />
          )}
        </div>
      </RTLDialog>
    </div>
  );
}

// Add custom styles for react-datepicker
const datePickerStyles = `
  .custom-datepicker-calendar {
    font-family: inherit !important;
    border: 1px solid #e2e8f0 !important;
    border-radius: 12px !important;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1) !important;
    overflow: hidden !important;
  }

  .custom-datepicker-dropdown-calendar {
    display: flex !important;
    flex-direction: column !important;
  }

  .custom-datepicker-dropdown-calendar .react-datepicker__current-month,
  .custom-datepicker-dropdown-calendar .react-datepicker__day-name {
    color: #1e3561 !important;
    font-weight: 600 !important;
  }

  .custom-datepicker-calendar .react-datepicker__day {
    color: #374151 !important;
    padding: 8px !important;
    font-size: 14px !important;
    transition: all 0.2s ease !important;
  }

  .custom-datepicker-calendar .react-datepicker__day:hover {
    background-color: #eff6ff !important;
    color: #3b82f6 !important;
  }

  .custom-datepicker-calendar .react-datepicker__day--selected {
    background-color: #3b82f6 !important;
    color: white !important;
  }

  .custom-datepicker-dropdown-calendar .react-datepicker__header {
    background-color: #e2e8f0 !important;
    border-bottom: none !important;
    padding: 12px !important; /* تقليل الـ padding */
  }

  .custom-datepicker-dropdown-calendar .react-datepicker__day-names,
  .custom-datepicker-dropdown-calendar .react-datepicker__month {
    order: 2 !important;
  }

  .custom-datepicker-dropdown-calendar .react-datepicker__year-dropdown,
  .custom-datepicker-dropdown-calendar .react-datepicker__month-dropdown {
    order: 3 !important; /* لجعلها تظهر بعد التقويم */
    position: static !important;
    margin-top: 8px !important;
    margin-bottom: 0 !important;
    border-top: 1px solid #e2e8f0 !important;
    border-bottom: none !important;
    border-radius: 0 0 8px 8px !important;
    max-height: 50px !important; /* تقليل الارتفاع */
    box-shadow: none !important;
  }

  .custom-datepicker-dropdown-calendar .react-datepicker__navigation {
    border: none !important;
    background: none !important;
    outline: none !important;
    top: 12px !important; /* تعديل الموقع ليتناسب مع الـ padding الجديد */
  }

  .custom-datepicker-calendar .react-datepicker__year-dropdown::-webkit-scrollbar,
  .custom-datepicker-calendar .react-datepicker__month-dropdown::-webkit-scrollbar {
    width: 6px !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-dropdown::-webkit-scrollbar-track,
  .custom-datepicker-calendar .react-datepicker__month-dropdown::-webkit-scrollbar-track {
    background: #f8fafc !important;
    border-radius: 3px !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-dropdown::-webkit-scrollbar-thumb,
  .custom-datepicker-calendar .react-datepicker__month-dropdown::-webkit-scrollbar-thumb {
    background: #cbd5e1 !important;
    border-radius: 3px !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-dropdown::-webkit-scrollbar-thumb:hover,
  .custom-datepicker-calendar .react-datepicker__month-dropdown::-webkit-scrollbar-thumb:hover {
    background: #94a3b8 !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-option,
  .custom-datepicker-calendar .react-datepicker__month-option {
    padding: 8px 12px !important;
    cursor: pointer !important;
    transition: background-color 0.2s ease !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-option:hover,
  .custom-datepicker-calendar .react-datepicker__month-option:hover {
    background-color: #f3f4f6 !important;
  }

  .custom-datepicker-calendar .react-datepicker__year-option--selected,
  .custom-datepicker-calendar .react-datepicker__month-option--selected {
    background-color: #3b82f6 !important;
    color: white !important;
  }

  .custom-datepicker-dropdown-calendar[dir="rtl"] .react-datepicker__navigation-icon::before {
    border-color: #1e3561 !important;
    border-width: 2px 0 0 2px !important;
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleElement = document.createElement('style');
  styleElement.textContent = datePickerStyles;
  document.head.appendChild(styleElement);
}
