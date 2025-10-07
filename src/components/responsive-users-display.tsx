// مكون متجاوب لعرض المستخدمين
function UsersDisplay({ users, usersLoading, governorates, selectedAccountTypeFilter, t, isRTL }: {
  users: User[],
  usersLoading: boolean,
  governorates: any[],
  selectedAccountTypeFilter: string,
  t: (key: string) => string,
  isRTL: boolean
}) {
  if (usersLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="flex items-center justify-center gap-2">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>جاري تحميل المستخدمين...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (users.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          لا توجد مستخدمين من هذا النوع
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      {/* عرض كروت في الموبايل */}
      <div className="block md:hidden space-y-4">
        {users.map((user) => (
          <Card key={user.id} className="p-4">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{user.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{user.username}</p>
                </div>
                <Badge variant={user.accountStatus === "active" ? "default" : "destructive"}>
                  {user.accountStatus === 'active' ? t('users.active') : t('users.inactive')}
                </Badge>
              </div>

              <div className="space-y-1 text-sm">
                <p><span className="font-medium">{t('users.phone')}:</span> {user.phone}</p>
                <p><span className="font-medium">{t('users.governorate')}:</span> {
                  user.governorate_id ? (
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
                  )
                }</p>

                {selectedAccountTypeFilter === 'patient' && (
                  <p><span className="font-medium">{t('users.nationalId')}:</span> {user.nationalId || t('users.noNationalId')}</p>
                )}

                {selectedAccountTypeFilter === 'pharmacist' && (
                  <p><span className="font-medium">{t('users.pharmacyName')}:</span> {user.pharmacyName || t('users.noPharmacy')}</p>
                )}

                {selectedAccountTypeFilter === 'doctor' && (
                  <div>
                    <span className="font-medium">{t('users.specialties')}:</span>
                    {user.specialties && user.specialties.length > 0 ? (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.specialties.slice(0, 2).map((specialty, index) => (
                          <Badge key={specialty.id || index} variant="outline" className="text-xs">
                            {specialty.name || `تخصص ${specialty.id}`}
                          </Badge>
                        ))}
                        {user.specialties.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.specialties.length - 2}
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground"> {t('users.noSpecialties')}</span>
                    )}
                  </div>
                )}
              </div>

              <div className="flex gap-2 pt-2">
                <Button variant="outline" size="sm" className="flex-1">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <History className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* عرض الجدول في الشاشات الكبيرة */}
      <div className="hidden md:block">
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
                {users.map((user) => (
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
                        user.pharmacyName || t('users.noPharmacy')
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
                      <div className={`flex items-center gap-2 cursor-pointer`}>
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
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-primary/10 hover:bg-primary/20 text-primary"
                        >
                          <History className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  );
}

export { UsersDisplay };
