import React, { useState } from 'react';
import { motion, useAnimation, Variants } from 'framer-motion';
import { FaStethoscope, FaUser, FaFileMedical, FaDownload, FaUpload } from 'react-icons/fa';

interface UserProfile {
  name: string;
  age: string;
  notes: string;
  medicalInfo: string;
  symptoms: string[];
}

const App: React.FC = () => {
  const controls = useAnimation();
  const [explode] = useState(Math.random() > 0.5);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    age: '',
    notes: '',
    medicalInfo: '',
    symptoms: [],
  });
  const [showProfile, setShowProfile] = useState(false);
  const [showMedicalInfo, setShowMedicalInfo] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);

  // Animation Variants
  const easyVariants: Variants = {
    initial: { opacity: 0, scale: 0.5, y: -50 },
    animate: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 1,
        ease: 'easeOut',
      },
    },
    finalPosition: {
      scale: 0.4,
      x: -40,
      y: -40,
      transition: {
        duration: 0.5,
        delay: 1,
      },
    },
  };

  const letterVariants: Variants = {
    initial: { opacity: 1, scale: 1, x: 0, y: 0, rotate: 0 },
    explode: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: (i - 1.5) * 50,
      y: (i - 1.5) * 50,
      rotate: (i - 1.5) * 90,
      transition: { duration: 0.5, delay: 1 + i * 0.1 },
    }),
    fold: (i: number) => ({
      opacity: 0,
      scale: 0,
      x: 0,
      y: 0,
      rotateX: 90,
      transition: { duration: 0.5, delay: 1 + i * 0.1 },
    }),
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/json') {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const json = JSON.parse(event.target?.result as string);
          setUserProfile(json);
          alert('Profile data uploaded successfully.');
        } catch (error) {
          alert('Invalid JSON file.');
        }
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid JSON file.');
    }
  };

  const handleDownload = () => {
    const json = JSON.stringify(userProfile, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const href = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = href;
    link.download = 'userProfile.json';
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(href);
  };

  const handleAddSymptom = () => {
    const category = prompt('Enter Symptom Category:');
    if (!category) return;
    const symptom = prompt('Enter Symptom Details:');
    if (!symptom) return;
    setUserProfile({
      ...userProfile,
      symptoms: [...userProfile.symptoms, `${category}: ${symptom}`],
    });
  };

  const handleDiagnose = () => {
    alert('Payment required for diagnosis. Please proceed to payment.');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-[#40E0D0] via-[#7FFFD4] to-[#FFD700]">
      {/* Logo Display */}
      <div className="logo-container">
        <motion.div
          variants={easyVariants}
          initial="initial"
          animate={controls}
          className="logo-text"
        >
          <motion.span variants={letterVariants} custom={0} animate={explode ? 'explode' : 'fold'}>
            e
          </motion.span>
          <motion.span variants={letterVariants} custom={1} animate={explode ? 'explode' : 'fold'}>
            G
          </motion.span>
          <motion.span variants={letterVariants} custom={2} animate={explode ? 'explode' : 'fold'}>
            P
          </motion.span>
        </motion.div>
      </div>

      {/* Subtitle */}
      <div className="subtitle">Your Health, Simplified</div>

      {/* Top Navigation */}
      <div className="navbar">
        <button 
          className="nav-button" 
          onClick={() => setShowProfile(true)}
          aria-label="Open Profile"
          title="Open Profile"
        >
          <FaUser size={20} color="white" />
        </button>
        <button 
          className="nav-button" 
          onClick={() => setShowMedicalInfo(true)}
          aria-label="Open Medical Information"
          title="Open Medical Information"
        >
          <FaFileMedical size={20} color="white" />
        </button>
        <button 
          className="nav-button" 
          onClick={() => setShowDiagnostics(true)}
          aria-label="Open Diagnostics"
          title="Open Diagnostics"
        >
          <FaStethoscope size={20} color="white" />
        </button>
      </div>

      {/* Profile Modal */}
      {showProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-4 text-xl font-bold">Profile Information</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={userProfile.name}
              onChange={(e) =>
                setUserProfile({ ...userProfile, name: e.target.value })
              }
              className="mb-2 w-full rounded border p-2"
            />
            <input
              type="number"
              placeholder="Enter your age"
              value={userProfile.age}
              onChange={(e) =>
                setUserProfile({ ...userProfile, age: e.target.value })
              }
              className="mb-2 w-full rounded border p-2"
            />
            <textarea
              placeholder="Enter your notes"
              value={userProfile.notes}
              onChange={(e) =>
                setUserProfile({ ...userProfile, notes: e.target.value })
              }
              className="mb-4 h-24 w-full rounded border p-2"
            />
            <div className="flex justify-between">
              <button
                onClick={handleDownload}
                className="rounded bg-purple-500 px-4 py-2 text-white flex items-center gap-2"
                aria-label="Download Profile"
              >
                <FaDownload /> Download
              </button>
              <label className="rounded bg-green-500 px-4 py-2 text-white flex items-center gap-2 cursor-pointer">
                <FaUpload /> Upload
                <input
                  type="file"
                  accept=".json"
                  onChange={handleUpload}
                  className="hidden"
                  aria-label="Upload Profile"
                />
              </label>
              <button
                onClick={() => setShowProfile(false)}
                className="rounded bg-red-500 px-4 py-2 text-white"
                aria-label="Close Profile Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Medical Information Modal */}
      {showMedicalInfo && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-4 text-xl font-bold">Medical Information</h2>
            <textarea
              placeholder="Enter your conditions or medications"
              value={userProfile.medicalInfo}
              onChange={(e) =>
                setUserProfile({ ...userProfile, medicalInfo: e.target.value })
              }
              className="mb-4 h-32 w-full rounded border p-2"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowMedicalInfo(false)}
                className="rounded bg-red-500 px-4 py-2 text-white"
                aria-label="Close Medical Information Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Diagnostics Modal */}
      {showDiagnostics && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2 className="mb-4 text-xl font-bold">Diagnostics</h2>
            <div className="mb-4">
              <button
                onClick={handleAddSymptom}
                className="rounded bg-blue-500 px-4 py-2 text-white"
                aria-label="Add New Symptom"
              >
                Add Symptom
              </button>
            </div>
            <div className="mb-4">
              <h3 className="mb-2 font-semibold">Selected Symptoms:</h3>
              {userProfile.symptoms.length > 0 ? (
                <ul className="list-disc list-inside">
                  {userProfile.symptoms.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              ) : (
                <p>No symptoms selected.</p>
              )}
            </div>
            <div className="flex justify-between">
              <button
                onClick={handleDiagnose}
                className="rounded bg-green-500 px-4 py-2 text-white"
                aria-label="Start Diagnosis"
              >
                Diagnose
              </button>
              <button
                onClick={() => setShowDiagnostics(false)}
                className="rounded bg-red-500 px-4 py-2 text-white"
                aria-label="Close Diagnostics Modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
