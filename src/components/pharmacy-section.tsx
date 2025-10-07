
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RTLDialog } from './ui/rtl-dialog';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Eye, Pill, Clock } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

type DispenseStatus = 'not-dispensed' | 'dispensed' | 'dispensed-elsewhere';

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  medicineName: string;
  dosage: string;
  quantity: string;
  instructions: string;
  prescribedDate: string;
  dispenseStatus: DispenseStatus;
  dispensedDate?: string;
  dispensedBy?: string;
  pharmacyName?: string;
}

const mockPrescriptions: Prescription[] = [
  {
    id: '1',
    patientName: 'John Smith',
    doctorName: 'Dr. Sarah Johnson',
    medicineName: 'Lisinopril',
    dosage: '10mg',
    quantity: '30 tablets',
    instructions: 'Take one tablet daily with water',
    prescribedDate: '2024-01-14',
    dispenseStatus: 'not-dispensed'
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    doctorName: 'Dr. Michael Chen',
    medicineName: 'Hydrochlorothiazide',
    dosage: '25mg',
    quantity: '30 tablets',
    instructions: 'Take one tablet daily in the morning',
    prescribedDate: '2024-01-14',
    dispenseStatus: 'dispensed',
    dispensedDate: '2024-01-15',
    dispensedBy: 'Maria Rodriguez',
    pharmacyName: 'Central Pharmacy'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    doctorName: 'Dr. Sarah Johnson',
    medicineName: 'Vitamin D3',
    dosage: '1000IU',
    quantity: '60 capsules',
    instructions: 'Take one capsule daily with meals',
    prescribedDate: '2024-01-13',
    dispenseStatus: 'dispensed-elsewhere',
    dispensedDate: '2024-01-14',
    pharmacyName: 'Metro Pharmacy'
  },
  {
    id: '4',
    patientName: 'Lisa Brown',
    doctorName: 'Dr. Jennifer Lee',
    medicineName: 'Amoxicillin',
    dosage: '500mg',
    quantity: '21 capsules',
    instructions: 'Take one capsule three times daily with food',
    prescribedDate: '2024-01-12',
    dispenseStatus: 'not-dispensed'
  }
];

export function PharmacySection() {
  const { t, isRTL } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(mockPrescriptions);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const viewDetails = (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsOpen(true);
  };

  const getStatusBadgeVariant = (status: DispenseStatus) => {
    switch (status) {
      case 'not-dispensed':
        return 'destructive';
      case 'dispensed':
        return 'default';
      case 'dispensed-elsewhere':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: DispenseStatus) => {
    switch (status) {
      case 'not-dispensed':
        return t('pharmacy.notDispensed');
      case 'dispensed':
        return t('pharmacy.dispensed');
      case 'dispensed-elsewhere':
        return t('pharmacy.dispensedElsewhere');
      default:
        return status;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const notDispensedCount = prescriptions.filter(p => p.dispenseStatus === 'not-dispensed').length;
  const dispensedCount = prescriptions.filter(p => p.dispenseStatus === 'dispensed').length;
  const dispensedElsewhereCount = prescriptions.filter(p => p.dispenseStatus === 'dispensed-elsewhere').length;

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pharmacy.title')}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{notDispensedCount}</div>
            <p className="text-xs text-muted-foreground">{t('pharmacy.notDispensed')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pharmacy.dispensed')}</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{dispensedCount}</div>
            <p className="text-xs text-muted-foreground">{t('pharmacy.dispensed')}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pharmacy.pharmacyName')}</CardTitle>
            <Pill className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{dispensedElsewhereCount}</div>
            <p className="text-xs text-muted-foreground">{t('pharmacy.dispensedElsewhere')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Prescriptions Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Pill className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('pharmacy.title')} ({prescriptions.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('pharmacy.patientName')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('appointments.doctorName')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('pharmacy.medication')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('pharmacy.prescribedDate')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('pharmacy.dispenseStatus')}</TableHead>
                <TableHead className={isRTL ? 'text-right' : 'text-left'}>{t('common.actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescriptions.map((prescription) => (
                <TableRow key={prescription.id}>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{prescription.patientName}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{prescription.doctorName}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <div>
                      <div>{prescription.medicineName}</div>
                      <div className="text-sm text-muted-foreground">
                        {prescription.dosage} - {prescription.quantity}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>{formatDate(prescription.prescribedDate)}</TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Badge variant={getStatusBadgeVariant(prescription.dispenseStatus)}>
                      {getStatusLabel(prescription.dispenseStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className={isRTL ? 'text-right' : 'text-left'}>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDetails(prescription)}
                      className="flex items-center gap-2"
                    >
                      <Eye className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('pharmacy.viewDetails')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Prescription Details Dialog */}
      <RTLDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={t('pharmacy.prescriptionDetails')}
        maxWidth="max-w-2xl"
      >
          
          {selectedPrescription && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Patient Information</h4>
                  <div className="p-3 bg-muted rounded space-y-1">
                    <div><strong>Name:</strong> {selectedPrescription.patientName}</div>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Prescribing Doctor</h4>
                  <div className="p-3 bg-muted rounded space-y-1">
                    <div><strong>Doctor:</strong> {selectedPrescription.doctorName}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Medication Details</h4>
                <div className="p-3 bg-muted rounded space-y-2">
                  <div><strong>Medicine:</strong> {selectedPrescription.medicineName}</div>
                  <div><strong>Dosage:</strong> {selectedPrescription.dosage}</div>
                  <div><strong>Quantity:</strong> {selectedPrescription.quantity}</div>
                  <div><strong>Instructions:</strong> {selectedPrescription.instructions}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Prescription History</h4>
                <div className="p-3 bg-muted rounded space-y-2">
                  <div><strong>Prescribed Date:</strong> {formatDateTime(selectedPrescription.prescribedDate)}</div>
                  <div className="flex items-center gap-2">
                    <strong>Status:</strong>
                    <Badge variant={getStatusBadgeVariant(selectedPrescription.dispenseStatus)}>
                      {getStatusLabel(selectedPrescription.dispenseStatus)}
                    </Badge>
                  </div>
                  {selectedPrescription.dispensedDate && (
                    <div><strong>Dispensed Date:</strong> {formatDateTime(selectedPrescription.dispensedDate)}</div>
                  )}
                  {selectedPrescription.dispensedBy && (
                    <div><strong>Dispensed By:</strong> {selectedPrescription.dispensedBy}</div>
                  )}
                  {selectedPrescription.pharmacyName && (
                    <div><strong>Pharmacy:</strong> {selectedPrescription.pharmacyName}</div>
                  )}
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
      </RTLDialog>
    </div>
  );
}