import type { PartsDecision, DiagnosisResult } from '../lib/diagnosis';
import { Card, Badge } from './ui';
import { Wrench, CheckCircle2, AlertCircle, DollarSign, PenTool, User, FileText } from 'lucide-react';

interface JobCardProps {
  appliance: string;
  complaint: string;
  diagnosis: DiagnosisResult;
  partsDecision: PartsDecision;
}

export function TechnicianJobCard({ appliance, complaint, diagnosis, partsDecision }: JobCardProps) {
  
  const getTechnicianNotes = () => {
    switch (partsDecision) {
      case 'customer':
        return "Customer will source the part. Verify compatibility before installation. Do not replace without customer approval.";
      case 'technician':
        return "Technician should verify part compatibility and provide the customer with the part cost before replacement.";
      case 'inspection':
        return "Inspect appliance before recommending or ordering replacement parts.";
      default:
        return "Standard inspection required.";
    }
  };

  return (
    <Card className="border-l-4 border-l-blue-600 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
        <Wrench size={120} />
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-6 border-b border-slate-200 pb-4">
          <div>
            <h3 className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-1">Job Card</h3>
            <h2 className="text-2xl font-bold text-slate-900">{appliance} Repair</h2>
          </div>
          <Badge variant="default" className="text-sm px-3 py-1 bg-white border border-slate-200">
            Work Order #FX-{Math.floor(Math.random() * 10000).toString().padStart(4, '0')}
          </Badge>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer Details & Complaint */}
            <div className="space-y-4">
               <div>
                  <h4 className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <User className="w-4 h-4 mr-2" />
                    Customer Complaint
                  </h4>
                  <p className="text-slate-800 bg-white p-3 rounded-lg border border-slate-200 italic text-sm">
                    "{complaint}"
                  </p>
                </div>

               <div>
                 <h4 className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    AI Diagnosis
                 </h4>
                 <div className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-medium text-slate-900">{diagnosis.likelyIssue}</p>
                    <div className="flex items-center mt-2">
                      <div className="flex-1 bg-slate-100 rounded-full h-2 mr-3">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${diagnosis.confidence}%` }}></div>
                      </div>
                      <span className="text-xs font-medium text-slate-600">{diagnosis.confidence}% Match</span>
                    </div>
                 </div>
               </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-4">
               <div>
                  <h4 className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <PenTool className="w-4 h-4 mr-2" />
                    Possible Causes & Parts
                  </h4>
                  <ul className="text-sm text-slate-700 bg-white p-3 rounded-lg border border-slate-200 space-y-1">
                    {diagnosis.possibleCauses.map((cause, i) => (
                      <li key={i} className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        {cause}
                      </li>
                    ))}
                  </ul>
               </div>

                <div>
                  <h4 className="flex items-center text-sm font-medium text-slate-500 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    Estimated Cost Range
                  </h4>
                  <p className="text-lg font-semibold text-slate-900 bg-white p-3 rounded-lg border border-slate-200">
                    {diagnosis.estimatedCostRange}
                  </p>
                </div>
            </div>
          </div>

          {/* Action & Notes */}
          <div className="bg-blue-50/50 p-4 rounded-lg border border-blue-100">
            <h4 className="flex items-center text-sm font-medium text-blue-900 mb-2">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Recommended Action
            </h4>
            <p className="text-sm text-blue-800 mb-4">{diagnosis.recommendedAction}</p>

            <h4 className="flex items-center text-sm font-medium text-amber-900 mb-2 border-t border-blue-100 pt-4">
              <FileText className="w-4 h-4 mr-2 text-amber-600" />
              Technician Notes (Parts Strategy: {
                partsDecision === 'customer' ? 'Customer Supplied' : 
                partsDecision === 'technician' ? 'Tech Supplied' : 'Inspect First'
              })
            </h4>
            <p className="text-sm font-medium text-amber-800 bg-amber-100/50 p-3 rounded border border-amber-200">
              {getTechnicianNotes()}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}