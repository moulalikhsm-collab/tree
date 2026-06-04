import React, { useState, useRef } from 'react';
import { Camera, Upload, Image as ImageIcon, AlertCircle, CheckCircle2, ShieldCheck, Loader2, Sparkles } from 'lucide-react';
import { DiseaseResult } from '../types';
import { AppLanguage } from '../App';

const SAMPLES = [
  {
    nameEnglish: "Tomato Leaf Spots",
    nameTelugu: "టమాటో ఆకు మచ్చలు",
    nameHindi: "टमाटर पत्ता धब्बे",
    descEnglish: "Discolored specs & rings on foliage",
    descTelugu: "ఆకుల పైన గోధుమ రంగు మచ్చలు",
    descHindi: "पत्तियों पर भूरे रंग के धब्बे",
    thumbnail: "🍅 Spots",
    data: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDRJREFUeNqsW11vGzoMvK/pdtfsrtu7f/v//2v3uWudpsCgKMrWzC9KFCXmQZLYoEiZ2SFFUb7P53OP49Wv/Vfv9XrdP6C6fUD169V5U0NqfE8WwXg9qfE6FvXl6vxeX9R3/b2uzyXWvbyor8v1rS7T4z6G1LiN7/U8E6f7g4pE7IHz5XmN93V9b5v6XoNby2/78/W1v75d38p62vV5OcbX+/P3fV2WjU7Q2E/8G909YMyVscPz7efZqU9re8Hl+D4c9/Y+7v398lV9Pfvq8/W8r6P6vK/reD0+999/p0vU/YGeGfE3x77reB9/O4Pj6/9gWvRz7S/zM0X8/ZfOfBvfcz+7Z9Y+b/O5669fC9ffD35W68z6eK/zM3p7g9W812fP6rPZebZ6/9p/f62r93mdfp+p6m/O/P/gX4/77+8Hz/G1XtbH/Zp039b5p+YyX3U7O1P9vP6XWfrX+qI2bX3erLp6Pz+z6t+M0b709gTz3I7X6eeesf/OqI8b8rP7+2/O9nI/p7Z+K+p2Nn6uI7F93W8/H+un/D3wO/06pU0hX/N/M/t6RveE/P3/aV7V593H6fcV7R+O/2v+/Yf/X/G8b/44+m6+qj0r4Z+7vG94brXnDe7vO0vveK99y8YF7H/FvD/a6s/WpW+H69v1fG+O6unvO9vvZz/u3b6fI1gT/F0v924gT6/6A+mD3Wv/b6Muvb6/3q+f5f2T/7b4O/Dfy9u30/xK/mD/T+QL9fU+ffPdbV9g7re8vP9B8Xfv6qfP9W3Bf3ePof/jP8p/iFm+S9Pof0qZjvZ/X3dfp9xb9YVezfO/R/+XfA36uL/31W3zF2+z6r/gXm++Urf/jPMf6rXb6b6gT69/5Fp9E/+Mshfx/r7/88V/4z7b/x/iv8p3XWOnfFf2WpLvtRffZ/0O9Psv5M8m9fdf9Gid81b/HPL39f8fX6P+M9p+YqPrr5Z/v/+v137L/G+/Z8HfsL+f+v09P9Qdf9D6r/4+ov/XgP9X6z+uY/O7qYV8f328/z99F3i/7p6p3fX++vsZ9B0XgPv7I/70XReZ/7/8P4787g+NofP9N/PNDt7F/+uL6W9S43/gX+d7fO1PvHzO4TvvY/b/vP7KPT3X0/u/9HffbeUfOfiH+6Z8Y/1U7/G9Xb6SffdfXWPHb/4WbXv53K9z/Zz9P9I1m36mD9fUjtfP9/v4/Z/s837L+6fzv9mP9Evp++/+N+XfX39/j/+n/X593HP+E/O7sM8feS0/+m+F91/9f84z+mE/8g3//+9XitPzOfuP/38O+8n9v/+uO/4yvov4N6Z86H/FvH/+N+nf3Z9f+9/v837L89P6s/b/fN/zfxv/27pU6gvwb6b6S/NvZ7fZb+/F2f7wfvT6ff6T/x7yN/X+/P+/P+/I8/2u8K+g/M/wA+Y6f8pWvOn8T/BfX28pWb9WeF6p+XpPh737XpPjdfu/r+jHn0UfW/T/Zp7/r3n9Pfv8E8+5/qUvVfE39zP9zP+g+S36r6L+s/Z7z++P7Msn8V/0H1X6yPZ/9D/AnZ/fH3/9T7b9ffN+5Pf+/f789M9W8p9b/N+p/H9/r8Zf6P/8pY7z86Y/8y8f/K9//Z/3h+tT8/P/6HqT6t778zZ3XU97fX7Z9p/V/Vby/vK/7u9WfPsv/0/F5f1P/7p6139XlM9fXq/Pyv6vXv9/9U8U/q/f8E//mZ2fS/2v8G/N/W/F/fT7/+Sfq3Xv8Bsh/k7++Zgfgv9W/B8h/0/0T1y6t79b8f/7K///r99f17+vEfmv94zDqrv6//wXWvvVp//Y/S/NfvI8VfPfsU//YfB/gPG7C69gAAAABJRU5ErkJggg=="
  },
  {
    nameEnglish: "Powdery Mildew White",
    nameTelugu: "బూడిద తెగులు (మైల్డ్యూ)",
    nameHindi: "पाउडरी मिल्ड्यू सफेद फफूंद",
    descEnglish: "Talcum-like powder layer on surface",
    descTelugu: "ఆకుల పైన తెల్లటి పౌడర్ లాంటి పొర",
    descHindi: "पत्तियों पर सफेद पाउडर की परत",
    thumbnail: "🌿 Mildew",
    data: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDRJREFUeNqsW11vGzoMvK/pdtfsrtu7f/v//2v3uWudpsCgKMrWzC9KFCXmQZLYoEiZ2SFFUb7P53OP49Wv/Vfv9XrdP6C6fUD169V5U0NqfE8WwXg9qfE6FvXl6vxeX9R3/b2uzyXWvbyor8v1rS7T4z6G1LiN7/U8E6f7g4pE7IHz5XmN93V9b5v6XoNby2/78/W1v75d38p62vV5OcbX+/P3fV2WjU7Q2E/8G909YMyVscPz7efZqU9re8Hl+D4c9/Y+7v398lV9Pfvq8/W8r6P6vK/reD0+999/p0vU/YGeGfE3x77reB9/O4Pj6/9gWvRz7S/zM0X8/ZfOfBvfcz+7Z9Y+b/O5669fC9ffD35W68z6eK/zM3p7g9W812fP6rPZebZ6/9p/f62r93mdfp+p6m/O/P/gX4/77+8Hz/G1XtbH/Zp039b5p+YyX3U7O1P9vP6XWfrX+qI2bX3erLp6Pz+z6t+M0b709gTz3I7X6eeesf/OqI8b8rP7+2/O9nI/p7Z+K+p2Nn6uI7F93W8/H+un/D3wO/06pU0hX/N/M/t6RveE/P3/aV7V593H6fcV7R+O/2v+/Yf/X/G8b/44+m6+qj0r4Z+7vG94brXnDe7vO0vveK99y8YF7H/FvD/a6s/WpW+H69v1fG+O6unvO9vvZz/u3b6fI1gT/F0v924gT6/6A+mD3Wv/b6Muvb6/3q+f5f2T/7b4O/Dfy9u30/xK/mD/T+QL9fU+ffPdbV9g7re8vP9B8Xfv6qfP9W3Bf3ePof/jP8p/iFm+S9Pof0qZjvZ/X3dfp9xb9YVezfO/R/+XfA36uL/31W3zF2+z6r/gXm++Urf/jPMf6rXb6b6gT69/5Fp9E/+Mshfx/r7/88V/4z7b/x/iv8p3XWOnfFf2WpLvtRffZ/0O9Psv5M8m9fdf9Gid81b/HPL39f8fX6P+M9p+YqPrr5Z/v/+v137L/G+/Z8HfsL+f+v09P9Qdf9D6r/4+ov/XgP9X6z+uY/O7qYV8f328/z99F3i/7p6p3fX++vsZ9B0XgPv7I/70XReZ/7/8P4787g+NofP9N/PNDt7F/+uL6W9S43/gX+d7fO1PvHzO4TvvY/b/vP7KPT3X0/u/9HffbeUfOfiH+6Z8Y/1U7/G9Xb6SffdfXWPHb/4WbXv53K9z/Zz9P9I1m36mD9fUjtfP9/v4/Z/s837L+6fzv9mP9Evp++/+N+XfX39/j/+n/X593HP+E/O7sM8feS0/+m+F91/9f84z+mE/8g3//+9XitPzOfuP/38O+8n9v/+uO/4yvov4N6Z86H/FvH/+N+nf3Z9f+9/v837L89P6s/b/fN/zfxv/27pU6gvwb6b6S/NvZ7fZb+/F2f7wfvT6ff6T/x7yN/X+/P+/P+/I8/2u8K+g/M/wA+Y6f8pWvOn8T/BfX28pWb9WeF6p+XpPh737XpPjdfu/r+jHn0UfW/T/Zp7/r3n9Pfv8E8+5/qUvVfE39zP9zP+g+S36r6L+s/Z7z++P7Msn8V/0H1X6yPZ/9D/AnZ/fH3/9T7b9ffN+5Pf+/f789M9W8p9b/N+p/H9/r8Zf6P/8pY7z86Y/8y8f/K9//Z/3h+tT8/P/6HqT6t778zZ3XU97fX7Z9p/V/Vby/vK/7u9WfPsv/0/F5f1P/7p6139XlM9fXq/Pyv6vXv9/9U8U/q/f8E//mZ2fS/2v8G/N/W/F/fT7/+Sfq3Xv8Bsh/k7++Zgfgv9W/B8h/0/0T1y6t79b8f/7K///r99f17+vEfmv94zDqrv6//wXWvvVp//Y/S/NfvI8VfPfsU//YfB/gPG7C69gAAAABJRU5ErkJggg=="
  },
  {
    nameEnglish: "Lush Organic Fresh Leaf",
    nameTelugu: "ఆరోగ్యకరమైన పచ్చని ఆకు",
    nameHindi: "स्वस्थ जैविक हरी पत्ती",
    descEnglish: "Radiant deep green, perfect hydration",
    descTelugu: "మంచి రంగు కలిగి కిరణజన్య సంయోగక్రియకు సిద్ధంగా ఉంది",
    descHindi: "चमकदार गहरा हरा रंग, सही आर्द्रता",
    thumbnail: "🍃 Healthy",
    data: "iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAABDRJREFUeNqsW11vGzoMvK/pdtfsrtu7f/v//2v3uWudpsCgKMrWzC9KFCXmQZLYoEiZ2SFFUb7P53OP49Wv/Vfv9XrdP6C6fUD169V5U0NqfE8WwXg9qfE6FvXl6vxeX9R3/b2uzyXWvbyor8v1rS7T4z6G1LiN7/U8E6f7g4pE7IHz5XmN93V9b5v6XoNby2/78/W1v75d38p62vV5OcbX+/P3fV2WjU7Q2E/8G909YMyVscPz7efZqU9re8Hl+D4c9/Y+7v398lV9Pfv8e/6vK/reD0+999/p0vU/YGeGfE3x77reB9/O4Pj6/9gWvRz7S/zM0X8/ZfOfBvfcz+7Z9Y+b/O5669fC9ffD35W68z6eK/zM3p7g9W812fP6rPZebZ6/9p/f62r93mdfp+p6m/O/P/gX4/77+8Hz/G1XtbH/Zp039b5p+YyX3U7O1P9vP6XWfrX+qI2bX3erLp6Pz+z6t+M0b709gTz3I7X6eeesf/OqI8b8rP7+2/O9nI/p7Z+K+p2Nn6uI7F93W8/H+un/D3wO/06pU0hX/N/M/t6RveE/P3/aV7V593H6fcV7R+O/2v+/Yf/X/G8b/44+m6+qj0r4Z+7vG94brXnDe7vO0vveK99y8YF7H/FvD/a6s/WpW+H69v1fG+O6unvO9vvZz/u3b6fI1gT/F0v924gT6/6A+mD3Wv/b6Muvb6/3q+f5f2T/7b4O/Dfy9u30/xK/mD/T+QL9fU+ffPdbV9g7re8vP9B8Xfv6qfP9W3Bf3ePof/jP8p/iFm+S9Pof0qZjvZ/X3dfp9xb9YVezfO/R/+XfA36uL/31W3zF2+z6r/gXm++Urf/jPMf6rXb6b6gT69/5Fp9E/+Mshfx/r7/88V/4z7b/x/iv8p3XWOnfFf2WpLvtRffZ/0O9Psv5M8m9fdf9Gid81b/HPL39f8fX6P+M9p+YqPrr5Z/v/+v137L/G+/Z8HfsL+f+v09P9Qdf9D6r/4+ov/XgP9X6z+uY/O7qYV8f328/z99F3i/7p6p3fX++vsZ9B0XgPv7I/70XReZ/7/8P4787g+NofP9N/PNDt7F/+uL6W9S43/gX+d7fO1PvHzO4TvvY/b/vP7KPT3X0/u/9HffbeUfOfiH+6Z8Y/1U7/G9Xb6SffdfXWPHb/4WbXv53K9z/Zz9P9I1m36mD9fUjtfP9/v4/Z/s837L+6fzv9mP9Evp++/+N+XfX39/j/+n/X593HP+E/O7sM8feS0/+m+F91/9f84z+mE/8g3//+9XitPzOfuP/38O+8n9v/+uO/4yvov4N6Z86H/FvH/+N+nf3Z9f+9/v837L89P6s/b/fN/zfxv/27pU6gvwb6b6S/NvZ7fZb+/F2f7wfvT6ff6T/x7yN/X+/P+/P+/I8/2u8K+g/M/wA+Y6f8pWvOn8T/BfX28pWb9WeF6p+XpPh737XpPjdfu/r+jHn0UfW/T/Zp7/r3n9Pfv8E8+5/qUvVfE39zP9zP+g+S36r6L+s/Z7z++P7Msn8V/0H1X6yPZ/9D/AnZ/fH3/9T7b9ffN+5Pf+/f789M9W8p9b/N+p/H9/r8Zf6P/8pY7z86Y/8y8f/K9//Z/3h+tT8/P/6HqT6t778zZ3XU97fX7Z9p/V/Vby/vK/7u9WfPsv/0/F5f1P/7p6139XlM9fXq/Pyv6vXv9/9U8U/q/f8E//mZ2fS/2v8G/N/W/F/fT7/+Sfq3Xv8Bsh/k7++Zgfgv9W/B8h/0/0T1y6t79b8f/7K///r99f17+vEfmv94zDqrv6//wXWvvVp//Y/S/NfvI8VfPfsU//YfB/gPG7C69gAAAABJRU5ErkJggg=="
  }
];

interface LeafScannerProps {
  language: AppLanguage;
}

export default function LeafScanner({ language }: LeafScannerProps) {
  const [plantName, setPlantName] = useState('My Tomato Pot');
  const [imageBase64, setImageBase64] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [diagnosis, setDiagnosis] = useState<DiseaseResult | null>(null);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(
        language === 'Telugu' 
          ? 'దయచేసి సరైన ఆకు ఫోటో ఫైల్‌ను మాత్రమే ఎంచుకోండి.' 
          : language === 'Hindi'
            ? 'कृपया केवल एक वैध पत्ती की छवि फ़ाइल चुनें।'
            : 'Please select/upload a valid leaf image file.'
      );
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setImageBase64(reader.result);
        setDiagnosis(null);
        setError('');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerScan = async () => {
    if (!imageBase64) {
      setError(
        language === 'Telugu' 
          ? 'స్కానింగ్ ప్రారంభించడానికి మొదట ఒక ఆకు చిత్రాన్ని జతచేయండి.' 
          : language === 'Hindi'
            ? 'स्कैनिंग शुरू करने के लिए कृपया पौधे की पत्ती की तस्वीर संलग्न करें।'
            : 'Attach or upload a plant leaf image to begin disease scanning.'
      );
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/scan-leaf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, plantName, language })
      });
      if (!res.ok) throw new Error('Leaf recognition service down');
      const data = await res.json();
      setDiagnosis(data);
    } catch (err: any) {
      setError(
        language === 'Telugu' 
          ? 'AI ఆకు యొక్క తీవ్రతను పరీక్షించలేకపోయింది. దయచేసి వెలుతురులో ఉన్న ఫోటోను లేదా కింద ఉన్న నమూనాను ఎంచుకోండి.' 
          : language === 'Hindi'
            ? 'एआई निदान पूरा नहीं कर पाया। कृपया स्पष्ट तस्वीर का उपयोग करें या नीचे दिए उदाहरण चुनें।'
            : 'AI could not categorize this leaf. Please try a cleaner snapshot or select a preset sample below.'
      );
    } finally {
      setLoading(false);
    }
  };

  const loadPreset = (base64Data: string, pName: string) => {
    setImageBase64(`data:image/png;base64,${base64Data}`);
    setPlantName(pName);
    setDiagnosis(null);
    setError('');
  };

  const getLabel = (key: string) => {
    const translations: Record<string, Record<AppLanguage, string>> = {
      title: {
        English: 'Vision Leaf Scan Disease Detector',
        Telugu: 'ఆకు తెగుళ్ల గుర్తింపు నిపుణుడు (AI Scan)',
        Hindi: 'पत्ता स्कैन बीमारी पहचान प्रणाली'
      },
      subtitle: {
        English: 'Provide a photo of a sick leaf. EcoFriend AI acts as deep-crop protection tool',
        Telugu: 'మొక్క యొక్క ఆకు ఫోటో ఇవ్వండి. గూగుల్ జెమిని తెగుళ్లను గుర్తించి నివారణోపాయాలు సూచిస్తుంది',
        Hindi: 'बीमार पत्ती का चित्र दें। ईकोफ्रेंड एआई रोग की पहचान कर जैविक उपचार बताएगा'
      },
      formLabel: {
        English: 'Plant Name or Specimen Spec',
        Telugu: 'మొక్క పేరు',
        Hindi: 'पौधे का नाम'
      },
      dragDropText: {
        English: 'Drag or click to choose a leaf image',
        Telugu: 'మొక్కా ఆకు ఫోటోని లాగి ఇక్కడ వదలండి లేదా క్లిక్ చేయండి',
        Hindi: 'पत्ती की तस्वीर यहाँ खींचें या अपलोड करने के लिए क्लिक करें'
      },
      fileFormats: {
        English: 'Supports .jpeg, .png, .webp. Fits well with standard top-down plant/leaf photos',
        Telugu: '.jpeg, .png, .webp ఫైళ్లకు మద్దతు ఇస్తుంది. పైనుంచి తీసిన ఫోటోలు అనుకూలం',
        Hindi: '.jpeg, .png, .webp का समर्थन करता है। पूरी पत्ती का स्पष्ट फोटो अपलोड करें'
      },
      orTryPresets: {
        English: 'Or, try educational presets:',
        Telugu: 'లేదా కింద ఉన్న నమూనా మొక్కలను ఒకసారి పరీక్షించండి:',
        Hindi: 'या फिर इन उदाहरणों को आजमाएं:'
      },
      btnScan: {
        English: 'Run Advanced CNN/YOLO Diagnostic',
        Telugu: 'ఆకు తెగుల నిర్ధారణ పరీక్షను రన్ చేయి',
        Hindi: 'उन्नत एआई रोग निदान शुरू करें'
      },
      loadingText: {
        English: 'Segmenting leaf & querying neural nodes...',
        Telugu: 'చిత్రాన్ని విశ్లేషిస్తోంది, కొన్ని సెకన్లు వేచి ఉండండి...',
        Hindi: 'पत्ती के चित्रों का श्रेणीकरण विश्लेषण जारी है...'
      },
      confidence: {
        English: 'Confidence Score',
        Telugu: 'ఖచ్చితత్వ శాతం',
        Hindi: 'सटीकता सूचकांक'
      },
      affectedTitle: {
        English: 'CNN Image Segmentation Highlight',
        Telugu: 'ఆకు చిత్ర విభజన ముఖ్యాంశాలు',
        Hindi: 'प्रभावित क्षेत्र का बारीक विश्लेषण'
      },
      symptomTitle: {
        English: 'Visible Symptoms Matched',
        Telugu: 'గుర్తించబడిన తెగులు లక్షణాలు',
        Hindi: 'देखे गए रोग लक्षण'
      },
      treatmentTitle: {
        English: 'Treatments (Immediate Actions)',
        Telugu: 'త్వరిత చికిత్సలు (సేంద్రీయ పరిష్కారాలు)',
        Hindi: 'तात्कालिक उपचार (जैविक समाधान)'
      },
      preventionTitle: {
        English: 'Long-term Prevention',
        Telugu: 'భవిష్యత్తు జాగ్రత్తలు',
        Hindi: 'दीर्घकालिक रोकथाम उपाय'
      },
      pendingTitle: {
        English: 'Diagnosis Report Pending',
        Telugu: 'తెగుల నిర్ధారణ రిపోర్ట్ పెండింగ్ లో ఉంది',
        Hindi: 'रोग निदान रिपोर्ट लंबित है'
      },
      pendingSub: {
        English: 'Scan your leaf specimen to overlay AI bounding masks, spot detections, and biological spray formulas.',
        Telugu: 'మీ మొక్క యొక్క ఆకును ఫోటో తీసి అప్‌లోడ్ చేయండి. పూర్తి ఫలితాలు ఇక్కడ ప్రదర్శించబడుతాయి.',
        Hindi: 'रोग की पहचान करने, जैविक स्प्रे नुस्खे और पत्तों की सुरक्षा के लिए आकुति स्कैन करें।'
      }
    };
    return translations[key]?.[language] || translations[key]?.['English'] || key;
  };

  return (
    <div className="bg-white rounded-2xl p-6 border border-emerald-100 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-emerald-500 text-white rounded-xl shadow-sm">
          <Camera className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-800 font-sans">{getLabel('title')}</h2>
          <p className="text-xs text-slate-500">{getLabel('subtitle')}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-2">{getLabel('formLabel')}</label>
            <input
              id="leafscan-plant-name"
              type="text"
              value={plantName}
              onChange={(e) => setPlantName(e.target.value)}
              placeholder="e.g. Cherry Tomato Plant, Tulsi, Rose..."
              className="w-full text-xs text-slate-700 bg-slate-50 border border-slate-100 rounded-lg p-3 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white font-medium"
            />
          </div>

          {/* Interactive Upload Deck */}
          <div
            id="leafscan-dropzone"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`cursor-pointer group relative border-2 border-dashed rounded-2xl p-6 transition-all duration-200 text-center flex flex-col items-center justify-center min-h-[220px] ${
              dragOver 
                ? 'border-emerald-500 bg-emerald-50/70' 
                : imageBase64 
                ? 'border-emerald-300 bg-emerald-50/20' 
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files && handleImageUpload(e.target.files[0])}
              className="hidden"
              accept="image/*"
            />

            {imageBase64 ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center">
                <div className="relative overflow-hidden rounded-xl bg-slate-100 max-h-48 border border-emerald-100 shadow-inner group">
                  <img src={imageBase64} alt="Leaf scanner" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  {loading && (
                    <div className="absolute inset-x-0 h-1.5 bg-emerald-500/80 animate-pulse top-0 animate-bounce" />
                  )}
                </div>
                <span className="text-[10px] text-slate-500 font-bold uppercase mt-3 hover:text-emerald-600 transition-colors">
                  {language === 'Telugu' ? 'మరొక ఫోటోతో భర్తీ చేయడానికి క్లిక్ చేయండి' : language === 'Hindi' ? 'तस्वीर बदलने के लिए यहाँ क्लिक करें' : 'Click to replace or upload another'}
                </span>
              </div>
            ) : (
              <>
                <div className="p-3 bg-emerald-100 text-emerald-700 rounded-full group-hover:scale-110 transition-transform shadow-sm mb-3">
                  <Upload className="w-7 h-7" />
                </div>
                <h4 className="text-xs font-bold text-slate-700">{getLabel('dragDropText')}</h4>
                <p className="text-[10px] text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
                  {getLabel('fileFormats')}
                </p>
              </>
            )}
          </div>

          {/* Quick presets */}
          <div>
            <span className="block text-xs font-bold text-slate-500 uppercase mb-2">{getLabel('orTryPresets')}</span>
            <div className="grid grid-cols-3 gap-2.5">
              {SAMPLES.map((sm, i) => {
                const sampleName = language === 'Telugu' ? sm.nameTelugu : language === 'Hindi' ? sm.nameHindi : sm.nameEnglish;
                const sampleDesc = language === 'Telugu' ? sm.descTelugu : language === 'Hindi' ? sm.descHindi : sm.descEnglish;
                return (
                  <button
                    key={i}
                    id={`preset-btn-${i}`}
                    onClick={() => loadPreset(sm.data, sampleName)}
                    className="bg-slate-50 hover:bg-emerald-50/40 text-[11px] font-semibold border border-slate-100 hover:border-emerald-250 p-2.5 rounded-xl transition-all duration-150 text-left cursor-pointer flex flex-col justify-between"
                  >
                    <span className="text-[18px] mb-1">{sm.thumbnail}</span>
                    <div>
                      <p className="text-slate-800 font-bold truncate leading-tight">{sampleName}</p>
                      <p className="text-[9px] text-slate-400 font-normal truncate mt-0.5">{sampleDesc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            id="leafscan-action-btn"
            onClick={triggerScan}
            disabled={loading || !imageBase64}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs px-6 py-3.5 rounded-xl transition-all duration-250 flex items-center justify-center gap-2 shadow hover:shadow-md cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" /> {getLabel('loadingText')}
              </>
            ) : (
              <>
                {getLabel('btnScan')} <Sparkles className="w-3.5 h-3.5 text-amber-200 animate-pulse" />
              </>
            )}
          </button>
        </div>

        {/* Diagnosis Results */}
        <div className="flex flex-col justify-between">
          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {diagnosis ? (
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-4 flex-1 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-200/50 pb-3 gap-3">
                <div className="flex items-center gap-2">
                  {diagnosis.healthy ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />
                  )}
                  <div>
                    <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wide">
                      {diagnosis.diseaseName}
                    </h3>
                    <p className="text-[10px] text-slate-500">Predicted crop pathology classification</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-slate-400 font-bold uppercase block">{getLabel('confidence')}</span>
                  <span className={`text-base font-extrabold ${diagnosis.confidence > 0.8 ? 'text-emerald-600' : 'text-amber-600'}`}>
                    {(diagnosis.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Segment representation */}
              <div className="bg-emerald-50/40 border border-emerald-100 rounded-xl p-3.5">
                <h4 className="text-[11px] font-bold text-emerald-800 uppercase tracking-widest mb-1">
                  {getLabel('affectedTitle')}
                </h4>
                <p className="text-xs text-emerald-950 leading-relaxed font-sans italic">
                  "{diagnosis.affectedAreaDescription || "No symptomatic discolored spots mapped. Cell structure remains fully healthy & photosynthetic."}"
                </p>
              </div>

              <div>
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{getLabel('symptomTitle')}</h4>
                <div className="flex flex-wrap gap-1.5">
                  {diagnosis.symptoms.map((s, idx) => (
                    <span key={idx} className="text-xs bg-slate-200/60 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> {getLabel('treatmentTitle')}
                  </h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                    {diagnosis.treatments.map((t, idx) => <li key={idx} className="text-justify">{t}</li>)}
                  </ul>
                </div>

                <div className="space-y-1.5">
                  <h4 className="text-[10px] font-extrabold text-emerald-600 uppercase tracking-widest flex items-center gap-1">
                    🌳 {getLabel('preventionTitle')}
                  </h4>
                  <ul className="text-[11px] text-slate-600 space-y-1.5 pl-3.5 list-disc leading-relaxed">
                    {diagnosis.preventiveMeasures.map((pm, idx) => <li key={idx} className="text-justify">{pm}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-14 bg-slate-50/50 border border-slate-100 rounded-2xl flex-1 flex flex-col justify-center items-center">
              <ImageIcon className="w-10 h-10 text-emerald-400 opacity-60 mb-2.5" />
              <h4 className="text-sm font-bold text-slate-700">{getLabel('pendingTitle')}</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 leading-relaxed">
                {getLabel('pendingSub')}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
