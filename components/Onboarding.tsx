import React, { useState } from 'react';
import { KENYAN_COUNTIES } from '../constants';
import { Gender, UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({
    interestedIn: [],
    gender: Gender.Male,
    county: KENYAN_COUNTIES[46], // Default Nairobi
    isVerified: false
  });

  const handleInputChange = (field: keyof UserProfile, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleInterestToggle = (interest: Gender) => {
    const current = formData.interestedIn || [];
    if (current.includes(interest)) {
      handleInputChange('interestedIn', current.filter(i => i !== interest));
    } else {
      handleInputChange('interestedIn', [...current, interest]);
    }
  };

  const handleNext = async () => {
    if (step === 3) {
      setLoading(true);
      // Simulate verification delay
      setTimeout(() => {
        // Determine avatar based on gender for the user profile
        let avatarUrl = 'https://randomuser.me/api/portraits/women/50.jpg'; // default
        if (formData.gender === Gender.Male) {
            avatarUrl = 'https://randomuser.me/api/portraits/men/50.jpg';
        } else if (formData.gender === Gender.Female) {
            avatarUrl = 'https://randomuser.me/api/portraits/women/50.jpg';
        } else {
            // Transgender - random pick for mock
            const type = Math.random() > 0.5 ? 'men' : 'women';
            avatarUrl = `https://randomuser.me/api/portraits/${type}/50.jpg`;
        }

        onComplete({
            ...formData,
            id: 'user_me',
            isVerified: true, // Auto verify in this demo after upload
            avatarUrl: avatarUrl
        } as UserProfile);
        setLoading(false);
      }, 2000);
    } else {
      setStep(prev => prev + 1);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-slate-800">Let's get to know you</h2>
      <p className="text-slate-500 text-sm">We need your real details for verification.</p>
      
      <div>
        <label className="block text-sm font-medium text-slate-700">Full Name (As on ID)</label>
        <input 
          type="text" 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
          placeholder="e.g. John Kamau"
          value={formData.name || ''}
          onChange={e => handleInputChange('name', e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
           <label className="block text-sm font-medium text-slate-700">Age</label>
           <input 
            type="number" 
            min="18"
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
            value={formData.age || ''}
            onChange={e => handleInputChange('age', parseInt(e.target.value))}
          />
        </div>
        <div>
           <label className="block text-sm font-medium text-slate-700">Gender</label>
           <select 
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
            value={formData.gender}
            onChange={e => handleInputChange('gender', e.target.value)}
           >
             {Object.values(Gender).map(g => <option key={g} value={g}>{g}</option>)}
           </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Phone Number</label>
        <input 
          type="tel" 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
          placeholder="+254 7..."
          value={formData.phone || ''}
          onChange={e => handleInputChange('phone', e.target.value)}
        />
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-700">Town/City</label>
        <input 
          type="text" 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
          placeholder="e.g. Westlands"
          value={formData.town || ''}
          onChange={e => handleInputChange('town', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-slate-800">Verify Identity</h2>
      <p className="text-slate-500 text-sm">To ensure safety, please upload a clear photo of your National ID or Driver's License.</p>
      
      <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center bg-slate-50">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 mx-auto text-slate-400 mb-2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z" />
        </svg>
        <label className="block">
          <span className="sr-only">Choose ID photo</span>
          <input 
            type="file" 
            accept="image/*"
            className="block w-full text-sm text-slate-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-rose-50 file:text-rose-700
              hover:file:bg-rose-100
              cursor-pointer
            "
            onChange={(e) => {
                if(e.target.files && e.target.files[0]) {
                    handleInputChange('idPhoto', e.target.files[0]);
                }
            }}
          />
        </label>
        {formData.idPhoto && (
            <p className="mt-2 text-sm text-green-600 font-medium">
                {formData.idPhoto.name} selected
            </p>
        )}
      </div>

      <div className="bg-blue-50 p-4 rounded-md flex items-start space-x-3">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <p className="text-xs text-blue-800">
            Your ID is used solely for verification. It is encrypted and never shared. We prioritize women's safety by strictly verifying all users.
        </p>
      </div>
    </div>
  );

  const renderStep3 = () => (
     <div className="space-y-4 animate-in fade-in slide-in-from-right duration-500">
      <h2 className="text-2xl font-bold text-slate-800">Your Preferences</h2>
      
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">I am interested in meeting:</label>
        <div className="space-y-2">
            {[Gender.Male, Gender.Female, Gender.Transgender].map((g) => (
                 <label key={g} className={`flex items-center p-3 border rounded-lg cursor-pointer transition ${formData.interestedIn?.includes(g) ? 'border-rose-500 bg-rose-50' : 'border-slate-200 hover:border-rose-200'}`}>
                    <input 
                        type="checkbox" 
                        className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                        checked={formData.interestedIn?.includes(g)}
                        onChange={() => handleInterestToggle(g)}
                    />
                    <span className="ml-3 text-slate-700 font-medium">{g === Gender.Transgender ? 'Transgender People' : g === Gender.Male ? 'Men' : 'Women'}</span>
                 </label>
            ))}
        </div>
      </div>

       <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Preferred County</label>
        <p className="text-xs text-slate-500 mb-2">Find matches in your area or explore other counties.</p>
        <select 
          className="block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
          value={formData.county}
          onChange={e => handleInputChange('county', e.target.value)}
        >
          {KENYAN_COUNTIES.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Short Bio</label>
        <textarea 
          className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-rose-500 focus:ring-rose-500 p-3 border"
          rows={3}
          placeholder="Tell us a bit about yourself..."
          value={formData.bio || ''}
          onChange={e => handleInputChange('bio', e.target.value)}
        />
      </div>
    </div>
  );

  return (
    <div className="p-6 h-full flex flex-col justify-center">
      <div className="mb-8">
        <div className="flex space-x-2">
            {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 rounded-full ${i <= step ? 'bg-rose-500' : 'bg-slate-200'}`} />
            ))}
        </div>
      </div>

      <div className="flex-1">
        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>

      <div className="mt-6 flex justify-between">
         {step > 1 && (
            <button 
                onClick={() => setStep(prev => prev - 1)}
                className="px-6 py-3 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50"
            >
                Back
            </button>
         )}
         <button 
            onClick={handleNext}
            disabled={
                (step === 1 && (!formData.name || !formData.age || !formData.phone)) ||
                (step === 2 && !formData.idPhoto) ||
                (step === 3 && (formData.interestedIn?.length === 0 || !formData.bio))
            }
            className={`px-6 py-3 bg-rose-600 text-white rounded-lg font-medium shadow-lg hover:bg-rose-700 flex-1 ml-4 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center`}
         >
            {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
            ) : step === 3 ? 'Finish & Start' : 'Next'}
         </button>
      </div>
    </div>
  );
};

export default Onboarding;