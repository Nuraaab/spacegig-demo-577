import { useState, useCallback, useMemo } from 'react';
import createContextHook from '@nkzw/create-context-hook';
import { PropertyType, ListingType } from '@/mocks/properties';

export interface ListingFormData {
  listingCategory: 'property' | 'job' | null;
  listingType: ListingType;
  propertyType: PropertyType | null;
  beds: number;
  baths: number;
  den: number;
  sqft: string;
  location: string;
  price: string;
  description: string;
  amenities: string[];
  country: string;
  streetAddress: string;
  apt: string;
  city: string;
  state: string;
  zipCode: string;
  images: string[];
}

const initialFormData: ListingFormData = {
  listingCategory: null,
  listingType: 'rent',
  propertyType: null,
  beds: 1,
  baths: 1,
  den: 0,
  sqft: '',
  location: '',
  price: '0',
  description: '',
  amenities: [],
  country: 'United States',
  streetAddress: '',
  apt: '',
  city: '',
  state: '',
  zipCode: '',
  images: [],
};

export const [ListingProvider, useListing] = createContextHook(() => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<ListingFormData>(initialFormData);

  const updateFormData = useCallback((data: Partial<ListingFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, 8));
  }, []);

  const previousStep = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setCurrentStep(1);
  }, []);

  const submitListing = useCallback(async () => {
    console.log('Submitting listing:', formData);
    resetForm();
  }, [formData, resetForm]);

  return useMemo(() => ({
    currentStep,
    formData,
    updateFormData,
    nextStep,
    previousStep,
    resetForm,
    submitListing,
  }), [currentStep, formData, updateFormData, nextStep, previousStep, resetForm, submitListing]);
});
