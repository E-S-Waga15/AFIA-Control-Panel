import React, { useState, useEffect, useRef } from "react";
import { Filter, Plus, Edit, Trash2, History, CheckCircle, XCircle, Loader, Loader2, Eye, EyeOff } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Separator } from "./ui/separator";
import { MedicalHistory } from "./medical-history";
import { useLanguage } from "../contexts/LanguageContext";
import { RTLDialog } from "./ui/rtl-dialog";
import { RTLSelect } from "./ui/rtl-select";
import { ImageUpload } from './ui/image-upload';
import CustomDatePicker from './ui/CustomDatePicker';
import { toast } from 'react-toastify';
import { fetchGovernorates } from "../store/slices/governoratesSlice";
import { fetchSpecialties } from "../store/slices/specialtiesSlice";
import { registerUser, toggleUserStatusAPI, deleteUserAPI } from "../store/slices/userSlice";
import { fetchUsers } from "../store/slices/usersDisplaySlice";
import { updateUser } from "../store/slices/userEditSlice";
import DatePicker from "react-datepicker";
import "./../styles/responsive-utils.css";
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
  national_id?: string;
  governorate_id?: number;
  governorate?: string;
  city?: string;
  street?: string;
  specialties?: { id: number; name: string }[];
  bio?: string;
  profilePicture?: string;
  pharmacyName?: string;
  price?: string;
}

const genders = ["male", "female"];

export function UserManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 768;
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
  const [showPassword, setShowPassword] = useState(false);
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
    national_id: string;
    governorate: string;
    city: string;
    street: string;
    specialties: number[];
    bio: string;
    profilePicture: string;
    pharmacyName: string;
    price: string;
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
    price: "",
  });

  // جلب البيانات من API عند تحميل الكومبوننت وعند تغيير الفلتر
  useEffect(() => {
    (dispatch as any)(fetchUsers(selectedAccountTypeFilter ?? 'doctor'));
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
      price: "",
    });
    setSelectedImage(null); // إعادة تعيين الصورة المحددة
    setShowPassword(false); // إعادة تعيين حالة إظهار كلمة المرور
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
      national_id: user.national_id || "",
      governorate: (() => {
        // If governorate_id is available, use it
        if (user.governorate_id) {
          return user.governorate_id.toString();
        }
        // Otherwise, find governorate by name
        if (user.governorate && governorates.length > 0) {
          const foundGovernorate = governorates.find(g =>
            g.name === user.governorate ||
            g.nameAr === user.governorate ||
            g.nameEn === user.governorate
          );
          return foundGovernorate ? foundGovernorate.id.toString() : "";
        }
        return "";
      })(),
      city: user.city || "",
      street: user.street || "",
      specialties: user.specialties?.map(s => s.id) || [],
      bio: user.bio || "",
      profilePicture: user.profilePicture || "",
      pharmacyName: user.pharmacyName || "",
      price: user.price || "",
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
price: parseFloat(formData.price) || 0,
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
        formDataToSend.append('price', userData.price?.toString() || '0');

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

      // إرسال البيانات إلى API - استخدم API مختلف حسب نوع العملية
      let result;
      if (editingUser) {
        // للتعديل، أرسل البيانات كـ object
        result = await (dispatch as any)(updateUser({
          userId: editingUser.id,
          userData: userData
        }));
      } else {
        // للإنشاء، أرسل البيانات كـ FormData
        result = await (dispatch as any)(registerUser(formDataToSend));
      }


      // 2. تطبيق الشرط: إذا كان كود الحالة 200 (نجاح)
      if (result.payload?.success === true) {
        // نجح الإرسال - رسالة نجاح
        const message = result.payload?.message || "تمت العملية بنجاح";

        const CustomToastContent = () => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
            <span>{message}</span>
          </div>
        );

        // إغلاق المودل وإعادة تعيين الفورم
        toast(<CustomToastContent />, {
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
            // إعادة جلب بيانات المستخدمين لتحديث الجدول بعد التعديل الناجح
            (dispatch as any)(fetchUsers(selectedAccountTypeFilter ?? 'doctor'));
          }
        });

      } else {
        // فشل الإرسال - رسالة خطأ
        const errorMessage = result.payload?.message || result.error?.message || "حدث خطأ أثناء حفظ المستخدم";

        const CustomToastContent = () => (
          <div style={{ display: 'flex', alignItems: 'center' }}>

            <span>{errorMessage}</span>
          </div>
        );

        toast.error(<CustomToastContent />, {
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

  const deleteUser = async (id: string) => {
    try {
      // استدعاء API حذف المستخدم
      const result = await (dispatch as any)(deleteUserAPI(id));

         if (result.payload?.success === true) {
        // نجح الحذف - رسالة نجاح من الـ API response
        const message = result.payload?.message || "تم حذف المستخدم بنجاح";

        const CustomToastContent = () => (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CheckCircle style={{ color: 'green', marginRight: '10px', fontSize: '24px' }} />
            <span>{message}</span>
          </div>
        );

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
        (dispatch as any)(fetchUsers(selectedAccountTypeFilter ?? 'doctor'));
      } else {
        // فشل الحذف - رسالة خطأ من الـ API response
        const errorMessage = result.payload || "حدث خطأ أثناء حذف المستخدم";
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
      toast.error("حدث خطأ غير متوقع أثناء حذف المستخدم", {
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

  const confirmDeleteUser = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
          <h4 style={{ margin: "0 0 8px 0" }}>
          
          </h4>
          <p style={{ fontSize: "14px", marginBottom: "12px", marginRight:"15px", marginLeft:"15px"}}>
            هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirm"
              onClick={() => {
                deleteUser(id);
                closeToast();
              }}
            >
              حذف
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              إلغاء
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
        (dispatch as any)(fetchUsers(selectedAccountTypeFilter ?? 'doctor'));
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
         
          </h4>
          <p style={{ fontSize: "14px", marginBottom: "12px", marginRight:"35px"}}>
            {currentStatus === "active"
              ? "هل أنت متأكد من أنك تريد تعطيل هذا المستخدم؟"
              : "هل أنت متأكد من أنك تريد تفعيل هذا المستخدم؟"}
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
            تاكيد
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              إلغاء
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
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex gap-4 ">
        <RTLDialog
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title={editingUser ? t('users.editUser') : t('users.addUser')}
          trigger={
            <Button
              onClick={() => openAddModal("doctor")}
              className="flex items-center gap-2"
            >
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('users.addUser')}
            </Button>
          }
          maxWidth={isMobile ? "w-300px" : "max-w-4xl"}
          className="max-h-[90vh] overflow-hidden"
        >
          {/* دائرة التحميل في المنتصف */}
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري الإرسال...</span>
              </div>
            </div>
          )}

          <div className={`space-y-4 ${isMobile ? 'px-2' : ''}`}>
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

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              <div>
                <Label>{t('users.fullName')}</Label>
                <Input
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={isMobile ? 'min-h-[44px] w-full' : ''}
                  style={{
                    fontSize: isMobile ? '16px' : 'inherit',
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
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
                  className={isMobile ? 'min-h-[44px] w-full' : ''}
                  style={{
                    fontSize: isMobile ? '16px' : 'inherit',
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                />
              </div>
            </div>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              <div>
                <Label>{t('users.phone')}</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // فقط أرقام
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  placeholder={t('users.phone')}
                  maxLength={10}
                  className={`w-full ${isMobile ? 'min-h-[44px]' : ''}`}
                  style={{
                    fontSize: isMobile ? '16px' : 'inherit',
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
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
                      { governorate.name}
                      </SelectItem>
                    ))}
                  </RTLSelect>
                )}
              </div>
            </div>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
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
              <div className="w-full">
                <CustomDatePicker
                  value={formData.birthdate}
                  onChange={(date) => setFormData({ ...formData, birthdate: date })}
                  label={t('users.birthdate')}
                  placeholder={t('users.birthdate')}
                  isRTL={isRTL}
                  isMobile={isMobile}
                />
              </div>
            </div>

            {selectedUserType === "patient" && (
              <div>
                <Label>{t('users.nationalId')}</Label>
                <Input
                  type="text"
                  value={formData.nationalId}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, ''); // فقط أرقام
                    if (value.length <= 11) {
                      setFormData({ ...formData, nationalId: value });
                    }
                  }}
                  placeholder={t('users.nationalId')}
                  maxLength={11}
                  className={isMobile ? 'min-h-[44px]' : ''}
                  style={{
                    fontSize: isMobile ? '16px' : 'inherit',
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                />
              </div>
            )}

            <div className="w-full">
              <Label>{t('login.password')}</Label>
              <div className="relative w-full">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    editingUser
                      ? "Leave blank to keep current password"
                      : "ادخل كلمة مرور "
                  }
                  className={`w-full ${isMobile ? 'min-h-[44px]' : ''}`}
                  style={{
                    fontSize: isMobile ? '16px' : 'inherit',
                    textAlign: isRTL ? 'right' : 'left',
                    direction: isRTL ? 'rtl' : 'ltr'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-6 w-6" />
                  ) : (
                    <Eye className="h-6 w-6" />
                  )}
                    <div className='w-4'></div>
                </button>
              </div>
            </div>


            {(selectedUserType === "doctor" ||
              selectedUserType === "pharmacist") && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-primary">
                      {t('users.addressInfo')}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>{t('users.city')}</Label>
                        <Input
                          value={formData.city}
                          onChange={(e) =>
                            setFormData({ ...formData, city: e.target.value })
                          }
                          placeholder={t('users.city')}
                          className={isMobile ? 'min-h-[44px]' : ''}
                          style={isMobile ? { fontSize: '16px' } : {}}
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
                          className={isMobile ? 'min-h-[44px]' : ''}
                          style={isMobile ? { fontSize: '16px' } : {}}
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
                        className={isMobile ? 'min-h-[44px]' : ''}
                        style={isMobile ? { fontSize: '16px' } : {}}
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
                            {'لم يتم اختيار أي تخصصات بعد'}
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
                    className={isMobile ? 'min-h-[100px]' : ''}
                  />
                </div>

                <div>
                  <Label>{t('users.consultationPrice')}</Label>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Allow empty value or valid decimal numbers
                      if (value === "" || /^\d*\.?\d*$/.test(value)) {
                        setFormData({ ...formData, price: value });
                      }
                    }}
                    placeholder={t('users.consultationPrice')}
                    className={isMobile ? 'min-h-[44px]' : ''}
                    style={isMobile ? { fontSize: '16px' } : {}}
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

            <div className={`flex justify-end gap-4 ${isMobile ? 'flex-col space-y-2' : ''}`}>
              <Button
                variant="outline"
                onClick={() => setIsAddModalOpen(false)}
                disabled={isSubmitting}
                className={isMobile ? 'w-full min-h-[44px] order-2' : ''}
              >
                {t('common.cancel')}
              </Button>
              <Button
                onClick={handleSubmit}
                className={`bg-primary hover:bg-primary/90 ${isMobile ? 'w-full min-h-[44px] order-1' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin mr-2" />
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
      <Card className="mobile-padding">
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

      <Card className="mobile-padding">
        <CardContent className="p-0">
          {isMobile ? (
            // Mobile Cards View
            <div className="space-y-4">
              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تحميل المستخدمين...</span>
                  </div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  لا توجد مستخدمين من هذا النوع
                </div>
              ) : (
                users.map((user) => (
                  <>
                  <Card key={user.id} className="mobile-card mobile-padding">
                    <CardContent className="pb-0 ">
                      {/* رأس البطاقة - الاسم وحالة المستخدم */}
                      <div className="mobile-card-header flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg text-primary font-semibold">{user.fullName}</h3>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                        <div
                          className={`cursor-pointer transition-all hover:scale-105`}
                          onClick={() => confirmToggleStatus(user.id, user.accountStatus)}
                          title={user.accountStatus === "active" ? t('users.deactivate') : t('users.activate')}
                        >
                          <Badge
                            variant={
                              user.accountStatus === "active"
                                ? "default"
                                : "destructive"
                            }
                            className="mobile-text-sm px-3 py-1"
                          >
                            {user.accountStatus === "active" ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            {user.accountStatus === 'active' ? t('users.active') : t('users.inactive')}
                          </Badge>
                        </div>
                      </div>

                      {/* معلومات المستخدم */}
                      <div className="mobile-card-info space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground font-medium">{t('users.phone')}:  </span>
                            <span className="text-sm mr-2">{user.phone}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground font-medium">{t('users.governorate')}:  </span>
                            <span className="text-sm mr-2">
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
                            </span>
                          </div>
                        </div>

                        <div className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground mt-1"></div>
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground font-medium block">
                              {selectedAccountTypeFilter === 'patient' ? t('users.nationalId') :
                                selectedAccountTypeFilter === 'pharmacist' ? t('users.pharmacyName') :
                                  t('users.specialties')}:  
                            </span>
                            <div className="mt-1">
                              {selectedAccountTypeFilter === 'patient' ? (
                                <span className="text-sm bg-muted px-6 py-1 rounded text-xs   ">
                                      {       user.national_id || t('users.noNationalId')}
                                </span>
                              ) : selectedAccountTypeFilter === 'pharmacist' ? (
                                <span className="text-sm bg-muted px-2 py-1 rounded text-xs justify-center items-center">
                                  {user.pharmacy_name || t('users.noPharmacy')}
                                </span>
                              ) : (
                                user.specialties && user.specialties.length > 0 ? (
                                  <div className="flex flex-wrap gap-1 justify-center items-center">
                                    {user.specialties.map((specialty, index) => (
                                      <Badge
                                        key={specialty.id || index}
                                        variant="outline"
                                        className="mobile-text-sm p-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs"
                                      >
                                        {specialty.name || `تخصص ${specialty.id}`}
                                      </Badge>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    {t('users.noSpecialties')}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* أزرار الإجراءات */}
                      <div className="mobile-card-actions flex flex-col gap-2 justify-center items-center">
                        {/* الزرين العلويين */}
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            asChild
                            className="mobile-button bg-primary/10 hover:bg-primary/20 text-primary text-sm"
                          >
                            <Link to={`/user-information/${user.id}`}>
                              <History className="w-3 h-3 mr-1" />
                              {t('users.medicalHistory')}
                            </Link>
                          </Button>

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDeleteUser(user.id)}
                            className="mobile-button text-sm text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {t('common.delete')}
                          </Button>
                        </div>

                        {/* زر التعديل تحت الزرين الآخرين */}
                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(user)}
                            className="mobile-button text-sm"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            {t('common.edit')}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                   

                  </Card>
                   <div className="h-2"></div>
                   </>
                ))
              )}
            </div>
          ) : (
            // Desktop Table View - existing code
            <div className="mobile-table-container">
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
                            user.national_id || t('users.noNationalId')
                          ) : selectedAccountTypeFilter === 'pharmacist' ? (
                            user.pharmacy_name || t('users.noPharmacy')
                          ) : (
                            user.specialties && user.specialties.length > 0 ? (
                              <div className="flex flex-wrap gap-1">
                                {user.specialties.map((specialty, index) => (
                                  <Badge
                                    key={specialty.id || index}
                                    variant="outline"
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
                              asChild
                              className="bg-primary/10 hover:bg-primary/20 text-primary"
                            >
                              <Link to={`/user-information/${user.id}`}>
                                <History className="w-4 h-4" />
                              </Link>
                            </Button>
                            <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDeleteUser(user.id)}
                            className="mobile-button text-xs text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
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
            </div>
          )}
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

