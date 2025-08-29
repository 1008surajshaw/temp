import useFormStore from '@/store/form';
import React,{ useEffect} from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { FiArrowLeft } from "react-icons/fi";

interface FormData {
  city: string;
  preferedNum: number;
}

const PreferencesStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
   
    formState: { errors },
  } = useForm<FormData>();
  

  const { updateFormData ,formData ,setStep} = useFormStore();
  
  const onSubmit: SubmitHandler<FormData> = (data:any) => {
 
     updateFormData(data);
    
    setStep(3);
  };

  const backFunction = () => { 
    setStep(1);
  };
 
  useEffect(() => {  
        setValue("city", formData?.city);
        setValue("preferedNum", formData?.preferedNum);
      
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[90%] md:w-[50%]  mx-auto">
       

        <div className="mb-6">
          <label htmlFor="city" className="block  text-sm mb-2 font-satoshi font-medium">
            City
          </label>
          <input
            type="text"
            id="city"
            placeholder='Enter Your City'
            {...register('city', { required: 'City is required' })}
            className=" w-[100%] border rounded-md py-2 px-3  shadow-md"
          />
          <span className="text-red-500">{errors.city?.message}</span>
        </div>

        <div className="mb-6">
          <label htmlFor="preferedNumber" className="block  text-sm mb-2 font-satoshi font-medium">
            Prefered Number
          </label>
          <input
            type="text"
            id="preferedNumber"
            placeholder='Enter Your Prefered Number'
            {...register('preferedNum', { required: 'Prefered Number is required' })}
            className=" w-[100%] border rounded-md py-2 px-3  shadow-md"
          />
          <span className="text-red-500">{errors.preferedNum?.message}</span>
        </div>

        <div className="flex justify-between mt-6">
          <div className='flex flex-row cursor-pointer' onClick={backFunction}>
          <FiArrowLeft  className='mt-5 text-lightgray mr-1'/>

            <button type="button" className='text-lightgray font-md' >
              Back
            </button>
          </div>
          
          <button
          type="submit"
          className="bg-green-600 text-white py-2 px-4 mt-4  rounded-md hover:bg-green-700 w-[114px] "
            >
              Next
            </button>
        </div>
      </form>
    </div>
  );
};

export default PreferencesStep;
