import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Calendar, Plus, FileText, User, Activity } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface MedicalRecord {
  id: string;
  date: string;
  type: 'appointment' | 'diagnosis' | 'prescription' | 'test' | 'surgery' | 'note';
  title: string;
  description: string;
  doctor?: string;
  medications?: string[];
  severity?: 'low' | 'medium' | 'high';
  status?: 'active' | 'resolved' | 'ongoing';
}

interface MedicalHistoryProps {
  patientId: string;
  patientName: string;
  userRole?: string;
}

export function MedicalHistory({ patientId, patientName, userRole = 'admin' }: MedicalHistoryProps) {
  const [records, setRecords] = useState<MedicalRecord[]>([
    {
      id: '1',
      date: '2024-01-15',
      type: 'appointment',
      title: 'General Checkup',
      description: 'Annual health examination. Patient reports feeling well. Blood pressure normal.',
      doctor: 'Dr. Sarah Johnson',
      status: 'resolved'
    },
    {
      id: '2',
      date: '2024-01-20',
      type: 'diagnosis',
      title: 'Hypertension',
      description: 'Patient diagnosed with mild hypertension. Blood pressure readings consistently above normal.',
      doctor: 'Dr. Michael Brown',
      severity: 'medium',
      status: 'ongoing'
    },
    {
      id: '3',
      date: '2024-01-22',
      type: 'prescription',
      title: 'Blood Pressure Medication',
      description: 'Prescribed Lisinopril 10mg daily for hypertension management.',
      doctor: 'Dr. Michael Brown',
      medications: ['Lisinopril 10mg'],
      status: 'active'
    },
    {
      id: '4',
      date: '2024-02-05',
      type: 'test',
      title: 'Blood Work',
      description: 'Complete blood count and lipid panel ordered to monitor overall health.',
      doctor: 'Dr. Sarah Johnson',
      status: 'resolved'
    }
  ]);
  
  const { t, isRTL } = useLanguage();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'appointment' as MedicalRecord['type'],
    title: '',
    description: '',
    doctor: '',
    medications: '',
    severity: 'low' as MedicalRecord['severity'],
    status: 'active' as MedicalRecord['status']
  });

  const getTypeIcon = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'appointment': return <Calendar className="w-4 h-4" />;
      case 'diagnosis': return <Activity className="w-4 h-4" />;
      case 'prescription': return <FileText className="w-4 h-4" />;
      case 'test': return <Activity className="w-4 h-4" />;
      case 'surgery': return <Activity className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: MedicalRecord['type']) => {
    switch (type) {
      case 'appointment': return 'bg-blue-100 text-blue-800';
      case 'diagnosis': return 'bg-red-100 text-red-800';
      case 'prescription': return 'bg-green-100 text-green-800';
      case 'test': return 'bg-purple-100 text-purple-800';
      case 'surgery': return 'bg-orange-100 text-orange-800';
      case 'note': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity?: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return '';
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      case 'ongoing': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddRecord = () => {
    const record: MedicalRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      type: newRecord.type,
      title: newRecord.title,
      description: newRecord.description,
      doctor: newRecord.doctor,
      medications: newRecord.medications ? newRecord.medications.split(',').map(m => m.trim()) : undefined,
      severity: newRecord.severity,
      status: newRecord.status
    };

    setRecords([record, ...records]);
    setNewRecord({
      type: 'appointment',
      title: '',
      description: '',
      doctor: '',
      medications: '',
      severity: 'low',
      status: 'active'
    });
    setIsAddingRecord(false);
  };

  const canEdit = userRole === 'admin' || userRole === 'doctor';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
            <User className={`w-5 h-5 ${isRTL ? 'ml-2' : 'mr-2'}`} />
            {t('medicalHistory.title')} - {patientName}
          </h2>
          <p className="text-sm text-muted-foreground">{t('medicalHistory.title')}</p>
        </div>
        {canEdit && (
          <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary/90">
                <Plus className={`w-4 h-4 ${isRTL ? 'ml-2' : 'mr-2'}`} />
                {t('medicalHistory.addRecord')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>{t('medicalHistory.addRecord')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="type">{t('medicalHistory.recordType')}</Label>
                  <Select value={newRecord.type} onValueChange={(value: MedicalRecord['type']) => setNewRecord({...newRecord, type: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="appointment">{t('medicalHistory.appointment')}</SelectItem>
                      <SelectItem value="diagnosis">{t('medicalHistory.diagnosis')}</SelectItem>
                      <SelectItem value="prescription">{t('medicalHistory.prescription')}</SelectItem>
                      <SelectItem value="test">{t('medicalHistory.test')}</SelectItem>
                      <SelectItem value="surgery">{t('medicalHistory.surgery')}</SelectItem>
                      <SelectItem value="note">{t('medicalHistory.note')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">{t('medicalHistory.title')}</Label>
                  <Input
                    id="title"
                    value={newRecord.title}
                    onChange={(e) => setNewRecord({...newRecord, title: e.target.value})}
                    placeholder={t('medicalHistory.title')}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">{t('medicalHistory.description')}</Label>
                  <Textarea
                    id="description"
                    value={newRecord.description}
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                    placeholder={t('medicalHistory.description')}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="doctor">{t('medicalHistory.doctor')}</Label>
                  <Input
                    id="doctor"
                    value={newRecord.doctor}
                    onChange={(e) => setNewRecord({...newRecord, doctor: e.target.value})}
                    placeholder={t('medicalHistory.doctor')}
                  />
                </div>

                {(newRecord.type === 'prescription') && (
                  <div className="space-y-2">
                    <Label htmlFor="medications">{t('medicalHistory.medications')}</Label>
                    <Input
                      id="medications"
                      value={newRecord.medications}
                      onChange={(e) => setNewRecord({...newRecord, medications: e.target.value})}
                      placeholder={t('medicalHistory.medications')}
                    />
                  </div>
                )}

                {(newRecord.type === 'diagnosis') && (
                  <div className="space-y-2">
                    <Label htmlFor="severity">{t('medicalHistory.severity')}</Label>
                    <Select value={newRecord.severity} onValueChange={(value: MedicalRecord['severity']) => setNewRecord({...newRecord, severity: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">{t('medicalHistory.low')}</SelectItem>
                        <SelectItem value="medium">{t('medicalHistory.medium')}</SelectItem>
                        <SelectItem value="high">{t('medicalHistory.high')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="status">{t('medicalHistory.status')}</Label>
                  <Select value={newRecord.status} onValueChange={(value: MedicalRecord['status']) => setNewRecord({...newRecord, status: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">{t('medicalHistory.active')}</SelectItem>
                      <SelectItem value="resolved">{t('medicalHistory.resolved')}</SelectItem>
                      <SelectItem value="ongoing">{t('medicalHistory.ongoing')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button onClick={handleAddRecord} className="flex-1 bg-primary hover:bg-primary/90">
                    {t('medicalHistory.addRecord')}
                  </Button>
                  <Button variant="outline" onClick={() => setIsAddingRecord(false)} className="flex-1">
                    {t('common.cancel')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {/* Medical Records */}
      <div className="space-y-4">
        {records.map((record) => (
          <Card key={record.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(record.type)}`}>
                    {getTypeIcon(record.type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{record.title}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{new Date(record.date).toLocaleDateString()}</span>
                      {record.doctor && (
                        <>
                          <span>•</span>
                          <span>{record.doctor}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Badge className={getTypeColor(record.type)}>
                    {record.type}
                  </Badge>
                  {record.severity && (
                    <Badge className={getSeverityColor(record.severity)}>
                      {record.severity}
                    </Badge>
                  )}
                  {record.status && (
                    <Badge className={getStatusColor(record.status)}>
                      {record.status}
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm mb-3">{record.description}</p>
              
              {record.medications && record.medications.length > 0 && (
                <>
                  <Separator className="my-3" />
                  <div>
                    <p className="text-sm font-medium mb-2">{t('medicalHistory.medications')}:</p>
                    <div className="flex flex-wrap gap-2">
                      {record.medications.map((med, index) => (
                        <Badge key={index} variant="outline">
                          {med}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {records.length === 0 && (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No Medical Records</h3>
              <p className="text-muted-foreground mb-4">No medical history records found for this patient.</p>
              {canEdit && (
                <Button onClick={() => setIsAddingRecord(true)} className="bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Record
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}