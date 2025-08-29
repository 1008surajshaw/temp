import { FormData } from "@/types";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

type FormStore = {
	step: number;
	formData: FormData;
	setStep: (newStep: number) => void;
	updateFormData: (newData: Partial<FormData>) => void;
};

const useFormStore = create<FormStore>()(
	persist(
		(set) => ({
		  step: 1,
		  editCription: false,
		  formData: {
			name:"",
			age: 0,
			gender: "",
			profession: "",
            city:"",
            preferedNum:0,
			approval:"",
		  },
		  setStep: (newStep) => set({ step: newStep }),
		  updateFormData: (newData) =>
			set((state) => ({ formData: { ...state.formData, ...newData } })),
		  
		}),
		{
          name:"form-store",
		  storage: createJSONStorage(() => localStorage),
		}
	  )
);

export default useFormStore;
