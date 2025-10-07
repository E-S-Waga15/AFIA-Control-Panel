import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { RTLDialog } from './ui/rtl-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Pill, MapPin, User, Phone, FileText, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { RTLSelect } from './ui/rtl-select';

type DispenseStatus = 'not-dispensed' | 'dispensed' | 'dispensed-elsewhere';

interface MobilePrescription {
  id: string;
  patientName: string;
  patientPhone: string;
  doctorName: string;
  medicineName: string;
  dosage: string;
  quantity: string;
  instructions: string;
  prescribedDate: string;
  dispenseStatus: DispenseStatus;
  province: string;
}

const mockMobilePrescriptions: MobilePrescription[] = [
  {
    id: '1',
    patientName: 'John Smith',
    patientPhone: '(555) 123-4567',
    doctorName: 'Dr. Sarah Johnson',
    medicineName: 'Lisinopril',
    dosage: '10mg',
    quantity: '30 tablets',
    instructions: 'Take one tablet daily with water',
    prescribedDate: '2024-01-14',
    dispenseStatus: 'not-dispensed',
    province: 'Ontario'
  },
  {
    id: '2',
    patientName: 'Emily Davis',
    patientPhone: '(555) 234-5678',
    doctorName: 'Dr. Michael Chen',
    medicineName: 'Hydrochlorothiazide',
    dosage: '25mg',
    quantity: '30 tablets',
    instructions: 'Take one tablet daily in the morning',
    prescribedDate: '2024-01-14',
    dispenseStatus: 'dispensed',
    province: 'Ontario'
  },
  {
    id: '3',
    patientName: 'Robert Wilson',
    patientPhone: '(555) 345-6789',
    doctorName: 'Dr. Sarah Johnson',
    medicineName: 'Vitamin D3',
    dosage: '1000IU',
    quantity: '60 capsules',
    instructions: 'Take one capsule daily with meals',
    prescribedDate: '2024-01-13',
    dispenseStatus: 'not-dispensed',
    province: 'Quebec'
  },
  {
    id: '4',
    patientName: 'Lisa Brown',
    patientPhone: '(555) 456-7890',
    doctorName: 'Dr. Jennifer Lee',
    medicineName: 'Amoxicillin',
    dosage: '500mg',
    quantity: '21 capsules',
    instructions: 'Take one capsule three times daily with food',
    prescribedDate: '2024-01-12',
    dispenseStatus: 'dispensed-elsewhere',
    province: 'British Columbia'
  }
];

const provinces = [
  'All Provinces', 'Alberta', 'British Columbia', 'Manitoba', 'New Brunswick', 
  'Newfoundland and Labrador', 'Northwest Territories', 'Nova Scotia', 'Nunavut', 
  'Ontario', 'Prince Edward Island', 'Quebec', 'Saskatchewan', 'Yukon'
];

export function PharmacyMobile() {
  const { t, isRTL } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<MobilePrescription[]>(mockMobilePrescriptions);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState<MobilePrescription[]>(mockMobilePrescriptions);
  const [selectedProvince, setSelectedProvince] = useState('Ontario'); // Default to pharmacy province
  const [selectedPrescription, setSelectedPrescription] = useState<MobilePrescription | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isDispenseOpen, setIsDispenseOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Filter prescriptions based on province and search term
  const applyFilters = () => {
    let filtered = prescriptions;

    if (selectedProvince !== 'All Provinces') {
      filtered = filtered.filter(p => p.province === selectedProvince);
    }

    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPrescriptions(filtered);
  };

  // Apply filters whenever province or search term changes
  useEffect(() => {
    applyFilters();
  }, [selectedProvince, searchTerm]);

  const viewDetails = (prescription: MobilePrescription) => {
    setSelectedPrescription(prescription);
    setIsDetailsOpen(true);
  };

  const openDispenseModal = (prescription: MobilePrescription) => {
    setSelectedPrescription(prescription);
    setIsDispenseOpen(true);
  };

  const confirmDispense = () => {
    if (selectedPrescription) {
      setPrescriptions(prescriptions.map(p => 
        p.id === selectedPrescription.id 
          ? { ...p, dispenseStatus: 'dispensed' }
          : p
      ));
      
      // Update filtered prescriptions as well
      setFilteredPrescriptions(filteredPrescriptions.map(p => 
        p.id === selectedPrescription.id 
          ? { ...p, dispenseStatus: 'dispensed' }
          : p
      ));
    }
    setIsDispenseOpen(false);
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

  const getStatusIcon = (status: DispenseStatus) => {
    switch (status) {
      case 'not-dispensed':
        return <Clock className="w-4 h-4" />;
      case 'dispensed':
        return <CheckCircle className="w-4 h-4" />;
      case 'dispensed-elsewhere':
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="max-w-md mx-auto bg-background min-h-screen">
      {/* Mobile Header */}
      <div className="bg-primary text-primary-foreground p-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Pill className={`w-6 h-6 ${isRTL ? 'ml-3' : 'mr-3'}`} />
          <h1 className="text-lg font-semibold">{t('pharmacy.title')}</h1>
        </div>
        
        {/* Province Filter */}
        <div className="space-y-3">
          <div>
            <Label className="text-primary-foreground text-sm">{t('pharmacy.filterByProvince')}</Label>
            <RTLSelect
              value={selectedProvince}
              onValueChange={(value) => {
                setSelectedProvince(value);
                applyFilters();
              }}
              placeholder={t('pharmacy.filterByProvince')}
              className="bg-primary-foreground text-primary"
            >
              {provinces.map(province => (
                <SelectItem key={province} value={province}>{province}</SelectItem>
              ))}
            </RTLSelect>
          </div>

          {/* Search */}
          <div>
            <Input
              placeholder={t('pharmacy.searchPrescriptions')}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                applyFilters();
              }}
              className="bg-primary-foreground text-primary placeholder:text-primary/70"
            />
          </div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('pharmacy.title')}</h2>
          <Badge variant="outline">{filteredPrescriptions.length} {t('common.search')}</Badge>
        </div>

        {filteredPrescriptions.map((prescription) => (
          <Card key={prescription.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Patient Info */}
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="font-medium">{prescription.patientName}</span>
                  <Badge variant="outline" className={isRTL ? 'mr-auto' : 'ml-auto'}>
                    <MapPin className={`w-3 h-3 ${isRTL ? 'ml-1' : 'mr-1'}`} />
                    {prescription.province}
                  </Badge>
                </div>

                {/* Doctor Info */}
                <div className="text-sm text-muted-foreground">
                  {t('pharmacy.prescribedBy')} {prescription.doctorName}
                </div>

                {/* Medicine Info */}
                <div className="bg-muted p-3 rounded">
                  <div className="font-medium">{prescription.medicineName}</div>
                  <div className="text-sm text-muted-foreground">
                    {prescription.dosage} - {prescription.quantity}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {t('pharmacy.prescribedDate')}: {formatDate(prescription.prescribedDate)}
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center gap-2">
                  {getStatusIcon(prescription.dispenseStatus)}
                  <Badge variant={getStatusBadgeVariant(prescription.dispenseStatus)}>
                    {getStatusLabel(prescription.dispenseStatus)}
                  </Badge>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewDetails(prescription)}
                    className="flex-1"
                  >
                    <FileText className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                    {t('pharmacy.viewDetails')}
                  </Button>
                  
                  {prescription.dispenseStatus === 'not-dispensed' && (
                    <Button
                      size="sm"
                      onClick={() => openDispenseModal(prescription)}
                      className="flex-1"
                    >
                      <CheckCircle className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                      {t('pharmacy.markAsDispensed')}
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {filteredPrescriptions.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Pill className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">{t('pharmacy.noRecords')}</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your province filter or search terms.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Prescription Details Dialog */}
      <RTLDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={t('pharmacy.prescriptionDetails')}
        maxWidth="max-w-sm"
      >
          
          {selectedPrescription && (
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Patient</h4>
                <div className="p-3 bg-muted rounded space-y-1">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {selectedPrescription.patientName}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {selectedPrescription.patientPhone}
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    {selectedPrescription.province}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Prescription</h4>
                <div className="p-3 bg-muted rounded space-y-2">
                  <div><strong>Medicine:</strong> {selectedPrescription.medicineName}</div>
                  <div><strong>Dosage:</strong> {selectedPrescription.dosage}</div>
                  <div><strong>Quantity:</strong> {selectedPrescription.quantity}</div>
                  <div><strong>Instructions:</strong> {selectedPrescription.instructions}</div>
                  <div><strong>Doctor:</strong> {selectedPrescription.doctorName}</div>
                  <div><strong>Date:</strong> {formatDate(selectedPrescription.prescribedDate)}</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  {getStatusIcon(selectedPrescription.dispenseStatus)}
                  <Badge variant={getStatusBadgeVariant(selectedPrescription.dispenseStatus)}>
                    {getStatusLabel(selectedPrescription.dispenseStatus)}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDetailsOpen(false)} className="flex-1">
                  Close
                </Button>
                {selectedPrescription.dispenseStatus === 'not-dispensed' && (
                  <Button 
                    onClick={() => {
                      setIsDetailsOpen(false);
                      openDispenseModal(selectedPrescription);
                    }}
                    className="flex-1"
                  >
                    Dispense
                  </Button>
                )}
              </div>
            </div>
          )}
      </RTLDialog>

      {/* Dispense Medicine Dialog */}
      <RTLDialog
        open={isDispenseOpen}
        onOpenChange={setIsDispenseOpen}
        title={t('pharmacy.dispenseMedicine')}
        maxWidth="max-w-sm"
      >
          
          {selectedPrescription && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center gap-2 text-green-800 mb-2">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Ready to Dispense</span>
                </div>
                <div className="text-sm text-green-700">
                  Please confirm you are dispensing this medication to the patient.
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <div>
                  <Label className="font-medium">Patient</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {selectedPrescription.patientName}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Medication</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {selectedPrescription.medicineName} {selectedPrescription.dosage}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Quantity</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {selectedPrescription.quantity}
                  </div>
                </div>

                <div>
                  <Label className="font-medium">Instructions</Label>
                  <div className="text-sm p-2 bg-muted rounded">
                    {selectedPrescription.instructions}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsDispenseOpen(false)} className="flex-1">
                  Cancel
                </Button>
                <Button onClick={confirmDispense} className="flex-1 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Confirm Dispense
                </Button>
              </div>
            </div>
          )}
      </RTLDialog>
    </div>
  );
}