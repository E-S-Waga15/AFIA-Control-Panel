import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, CheckCircle, XCircle, Loader2, Power, PowerOff } from "lucide-react";
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
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { useLanguage } from "../contexts/LanguageContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { RTLSelect } from "./ui/rtl-select";
import { RTLDialog } from "./ui/rtl-dialog";
import { toast } from 'react-toastify';
import { registerAdmin, deleteAdminAPI, toggleAdminStatusAPI } from "../store/slices/adminSlice";
import { fetchAdmins } from "../store/slices/adminsDisplaySlice";
import CustomDatePicker from './ui/CustomDatePicker';
import "./../styles/responsive-utils.css";

interface AdminFormData {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  gender: string;
  birthdate: string;
}

interface AdminAPIData {
  fullName: string;
  username: string;
  phone: string;
  password: string;
  gender: string;
  birthdate: string;
}

interface Admin {
  id: string;
  full_name: string;
  username: string;
  status: string;
  number: string;
  account_type: string;
  birth_date?: string;
  gender: string;
  governorate_id: number | null;
  number_verified_at: string | null;
  created_at: string;
  updated_at: string;
  fullName?: string; // For backward compatibility with display
  phone?: string; // For backward compatibility with display
  accountStatus?: string; // For backward compatibility with display
  governorate?: string; // For backward compatibility with display
}

const genders = ["male", "female"];

export function AdminManagement() {
  const { t, isRTL } = useLanguage();
  const dispatch = useDispatch();
  const isMobile = window.innerWidth < 768;
  const admins = useSelector((state) => (state as any)?.adminsDisplay?.admins || []);
  const adminsLoading = useSelector((state) => (state as any)?.adminsDisplay?.loading || false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<Admin | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState<{
    fullName: string;
    username: string;
    phone: string;
    gender: string;
    password: string;
    birthdate: string;
  }>({
    fullName: "",
    username: "",
    phone: "",
    gender: "",
    password: "",
    birthdate: "",
  });

  // جلب البيانات من API عند تحميل الكومبوننت
  useEffect(() => {
    (dispatch as any)(fetchAdmins());
  }, [dispatch]);

  const resetForm = () => {
    setFormData({
      fullName: "",
      username: "",
      phone: "",
      gender: "",
      password: "",
      birthdate: "",
    });
  };

  const openEditModal = (admin: Admin) => {
    setEditingAdmin(admin);
    setFormData({
      fullName: admin.full_name,
      username: admin.username,
      phone: admin.number,
      gender: admin.gender,
      password: "",
      birthdate: admin.birth_date || "",
    });
    setIsAddModalOpen(true);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // إعداد البيانات للإرسال - سيتم إرسالها بالأسماء التالية:
      // fullName, username, phone, password, gender, birthdate
      const adminData: AdminAPIData = {
        fullName: formData.fullName,
        username: formData.username,
        phone: formData.phone,
        password: formData.password,
        gender: formData.gender,
        birthdate: formData.birthdate,
      };

      // إعداد البيانات للإرسال
      const formDataToSend = new FormData();

      // إضافة البيانات النصية
      formDataToSend.append('fullName', adminData.fullName || '');
      formDataToSend.append('username', adminData.username || '');
      formDataToSend.append('phone', adminData.phone || '');
      formDataToSend.append('password', adminData.password || '');
      formDataToSend.append('gender', adminData.gender || '');
      formDataToSend.append('birthdate', adminData.birthdate || '');

      // إرسال البيانات إلى API
      let result;
      if (editingAdmin) {
        // للتعديل، أرسل البيانات كـ object (سيتم إضافة API التعديل لاحقاً)
        result = { payload: { success: true, message: "Admin updated successfully" } };
      } else {
        // للإنشاء، أرسل البيانات كـ object
        result = await (dispatch as any)(registerAdmin(adminData as any));
      }

      // تطبيق الشرط: إذا كان كود الحالة 200 (نجاح)
      if (result.payload?.success === true) {
        const message = result.payload?.message || "تمت العملية بنجاح";

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
          onClose: () => {
            setIsAddModalOpen(false);
            resetForm();
            (dispatch as any)(fetchAdmins());
          }
        });

      } else {
        const errorMessage = result.payload?.message || result.error?.message || "حدث خطأ أثناء حفظ الإدمن";

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

  const deleteAdmin = async (id: string) => {
    try {
      // استدعاء API حذف الإدمن
      const result = await (dispatch as any)(deleteAdminAPI(id as any));

      if (result.payload?.success === true) {
        const message = result.payload?.message || "تم حذف الإدمن بنجاح";

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

        (dispatch as any)(fetchAdmins());
      } else {
        const errorMessage = result.payload || "حدث خطأ أثناء حذف الإدمن";
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
      toast.error("حدث خطأ غير متوقع أثناء حذف الإدمن", {
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

  const confirmDeleteAdmin = (id: string) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
    
          <p style={{ fontSize: "14px", marginBottom: "12px", marginRight:"15px" , marginLeft:"15px" }}>
            هل أنت متأكد من أنك تريد حذف هذا الإدمن؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirm"
              onClick={() => {
                deleteAdmin(id);
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

  // دالة تغيير حالة الإدمن
  const toggleAdminStatus = async (id: string, currentStatus: string) => {
    try {
      // استدعاء API تغيير حالة الإدمن
      const result = await (dispatch as any)(toggleAdminStatusAPI({ adminId: id, currentStatus }));

      if (toggleAdminStatusAPI.fulfilled.match(result)) {
        // نجح التبديل - رسالة نجاح من الـ API response
        const message = result.payload?.message || "تم تغيير حالة الإدمن بنجاح";

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

        // إعادة جلب بيانات الإدمن لتحديث القائمة
        (dispatch as any)(fetchAdmins());
      } else {
        // فشل التبديل - رسالة خطأ من الـ API response
        const errorMessage = result.payload?.message || result.payload || "حدث خطأ أثناء تغيير حالة الإدمن";
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

  const confirmToggleAdminStatus = (id: string, currentStatus: string) => {
    toast(
      ({ closeToast }) => (
        <div style={{ textAlign: "center" }}>
           
          <p style={{ fontSize: "14px", marginBottom: "12px", marginRight:"35px"}}>
           
            {currentStatus === "active"
              ? t('admins.deactivateAdmin')
              : t('admins.activateAdmin')}
          </p>
          <div
            style={{ display: "flex", justifyContent: "center", gap: "10px" }}
          >
            <button
              className="toast-confirmp"
              onClick={() => {
                // هنا التبديل الفعلي
                toggleAdminStatus(id, currentStatus);
                closeToast();
              }}
            >
              {t('admins.toggleStatus')}
            </button>
            <button className="toast-cancel" onClick={closeToast}>
              {t('common.cancel')}
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
  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      <div className="flex gap-4">
        <RTLDialog
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          title={editingAdmin ? t('admins.editAdmin') : t('admins.addAdmin')}
          trigger={
            <Button className="flex items-center gap-2">
              <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
              {t('admins.addAdmin')}
            </Button>
          }
          maxWidth={isMobile ? "w-300px" : "max-w-2xl"}
          className="max-h-[90vh] overflow-hidden"
        >
          {isSubmitting && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
              <div className="bg-white p-6 rounded-lg shadow-lg flex items-center gap-3">
                <Loader2 className="w-6 h-6 animate-spin" />
                <span>جاري الإرسال...</span>
              </div>
            </div>
          )}

          <div className={`space-y-4 ${isMobile ? 'px-2' : ''}`}>
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              <div>
                <Label>{t('admins.fullName')}</Label>
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
                <Label>{t('admins.username')}</Label>
                <Input
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  placeholder={t('admins.username')}
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
                <Label>{t('admins.phone')}</Label>
                <Input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '');
                    if (value.length <= 10) {
                      setFormData({ ...formData, phone: value });
                    }
                  }}
                  placeholder={t('admins.phone')}
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
                <Label>{t('admins.gender')}</Label>
                <RTLSelect
                  value={formData.gender}
                  onValueChange={(value) =>
                    setFormData({ ...formData, gender: value })
                  }
                  placeholder={t('admins.gender')}
                >
                  {genders.map((gender) => (
                    <SelectItem key={gender} value={gender}>
                      {gender === 'male' ? t('admins.male') : t('admins.female')}
                    </SelectItem>
                  ))}
                </RTLSelect>
              </div>
            </div>

            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2'}`}>
              <div className="w-full">
                <CustomDatePicker
                  value={formData.birthdate}
                  onChange={(date) => setFormData({ ...formData, birthdate: date })}
                  label={t('admins.birthdate')}
                  placeholder={t('admins.birthdate')}
                  isRTL={isRTL}
                  isMobile={isMobile}
                />
              </div>
            </div>

            <div className="w-full">
              <Label>{t('login.password')}</Label>
              <Input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder={
                  editingAdmin
                    ? "Leave blank to keep current password"
                    : "Enter password"
                }
                className={`w-full ${isMobile ? 'min-h-[44px]' : ''}`}
                style={{
                  fontSize: isMobile ? '16px' : 'inherit',
                  textAlign: isRTL ? 'right' : 'left',
                  direction: isRTL ? 'rtl' : 'ltr'
                }}
              />
            </div>

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
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    جاري الإرسال...
                  </>
                ) : (
                  editingAdmin ? t('admins.editAdmin') : t('admins.addAdmin')
                )}
              </Button>
            </div>
          </div>
        </RTLDialog>
      </div>

      <Card className="mobile-padding">
        <CardContent className="p-0">
          {isMobile ? (
            <div className="space-y-4">
              {adminsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري تحميل الإدمن...</span>
                  </div>
                </div>
              ) : admins.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t('admins.noAdmins')}
                </div>
              ) : (
                admins.map((admin) => (
                  <>
                  <Card key={admin.id} className="mobile-card mobile-padding">
                    <CardContent className="pb-0">
                      <div className="mobile-card-header flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg text-primary font-semibold">{admin.full_name}</h3>
                          <p className="text-sm text-muted-foreground">@{admin.username}</p>
                        </div>
                        <div
                          className={`cursor-pointer transition-all hover:scale-105`}
                          onClick={() => confirmToggleAdminStatus(admin.id, admin.status)}
                          title={admin.status === "active" ? t('admins.deactivate') : t('admins.activate')}
                        >
                          <Badge
                            variant={
                              admin.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className="mobile-text-sm px-3 py-1"
                          >
                            {admin.status === "active" ? (
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                            ) : (
                              <XCircle className="w-4 h-4 text-red-500 mr-2" />
                            )}
                            {admin.status === 'active' ? t('admins.active') : t('admins.inactive')}
                          </Badge>
                        </div>
                      </div>

                      <div className="mobile-card-info space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                          <div className="flex-1">
                            <span className="text-sm text-muted-foreground font-medium">{t('admins.phone')}: </span>
                            <span className="text-sm mr-2">{admin.number}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mobile-card-actions flex flex-col gap-2 justify-center items-center">

                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(admin)}
                            className="mobile-button text-sm"
                          >
                            <Edit className="w-3 h-3 mr-1" />
                            {t('common.edit')}
                          </Button>
                        </div>

                        <div className="flex justify-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => confirmDeleteAdmin(admin.id)}
                            className="mobile-button text-sm text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
                          >
                            <Trash2 className="w-3 h-3 mr-1" />
                            {t('common.delete')}
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
            <div className="mobile-table-container">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('admins.fullName')}</TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('admins.username')}</TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('admins.phone')}</TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('admins.gender')}</TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('admins.status')}</TableHead>
                    <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminsLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center gap-2">
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>جاري تحميل الإدمن...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : admins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        {t('admins.noAdmins')}
                      </TableCell>
                    </TableRow>
                  ) : (
                    admins.map((admin) => (
                      <TableRow key={admin.id}>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>{admin.full_name}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>{admin.username}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>{admin.number}</TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                          {admin.gender === 'male' ? t('admins.male') : t('admins.female')}
                        </TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                          <div className={`flex items-center gap-2 cursor-pointer`} onClick={() => confirmToggleAdminStatus(admin.id, admin.status)}
                            title={admin.status === "active" ? t('admins.deactivate') : t('admins.activate')}>
                            <Badge
                              variant={
                                admin.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {admin.status === "active" ? (
                                <CheckCircle className="w-6 h-6 text-green-500" />
                              ) : (
                                <XCircle className="w-6 h-6 text-red-500" />
                              )}
                              {admin.status === 'active' ? t('admins.active') : t('admins.inactive')}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openEditModal(admin)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => confirmDeleteAdmin(admin.id)}
                              className="text-red-600 border-red-300 hover:bg-red-50 hover:border-red-400"
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
    </div>
  );
}