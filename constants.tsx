
import React from 'react';

export const TRANSLATIONS = {
  ar: {
    appName: 'شيف العيلة',
    tagline: 'مساعدك الذكي في المطبخ',
    uploadPhoto: 'رفع صورة',
    takePhoto: 'تصوير',
    generateRecipe: 'ابتكار وصفة',
    history: 'السجل',
    profile: 'حسابي',
    dietaryPrefs: 'النظام الغذائي',
    diseases: 'الحالة الصحية',
    modeFree: 'حر',
    modeCalculated: 'محسوب',
    detecting: 'جاري التحليل...',
    noIngredients: 'لم يتم العثور على مكونات.',
    substitutes: 'البدائل',
    save: 'حفظ الإعدادات',
    age: 'العمر',
    weight: 'الوزن (كجم)',
    height: 'الطول (سم)',
    ingredientsFound: 'المكونات المكتشفة',
    diabetes: 'السكري',
    hypertension: 'الضغط',
    celiac: 'حساسية القمح',
    none: 'بدون'
  },
  en: {
    appName: 'Family Chef',
    tagline: 'Your smart kitchen assistant',
    uploadPhoto: 'Upload',
    takePhoto: 'Camera',
    generateRecipe: 'Create Recipe',
    history: 'History',
    profile: 'Profile',
    dietaryPrefs: 'Dietary',
    diseases: 'Health Status',
    modeFree: 'Free',
    modeCalculated: 'Calculated',
    detecting: 'Analyzing...',
    noIngredients: 'No items found.',
    substitutes: 'Substitutes',
    save: 'Save Profile',
    age: 'Age',
    weight: 'Weight',
    height: 'Height',
    ingredientsFound: 'Detected Items',
    diabetes: 'Diabetes',
    hypertension: 'Hypertension',
    celiac: 'Celiac',
    none: 'None'
  }
};

export const Icons = {
  Camera: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z" />
    </svg>
  ),
  Upload: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 3 3m-3-3v15" />
    </svg>
  ),
  History: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
    </svg>
  ),
  User: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
    </svg>
  )
};
