import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { FiArrowLeft } from "react-icons/fi";

import useFormStore from "@/store/form";
import { FormData } from "@/types";


const ConfirmationStep: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue
  } = useForm<FormData>();

  const { updateFormData ,formData ,setStep} = useFormStore();

    useEffect(() => {  
          setValue("approval", formData?.approval);   
    }, []);
    
  const onSubmit: SubmitHandler<FormData> = (data: any) => {
    updateFormData(data);
    alert(formData);
  };

  const backFunction = () => {
    setStep(2);
  };
 
  return (
    <div>
      <div className="container mx-auto mt-8">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="max-w-[90%] md:w-[50%]  mx-auto"
        >
          <div className="mb-4">
          <label
            htmlFor="approval"
            className="block text-sm  mb-2 font-satoshi font-medium"
          >
            Approval
          </label>
          <input
            type="text"
            id="approval"
            placeholder="Enter Your Name"
            {...register("approval", { required: "Name is required" })}
            className="md:w-[100%] w-[100%] border rounded-md py-2 px-3  shadow-md"
          />
          <span className="text-red-500">{errors.approval?.message}</span>
        </div>


          <div className="flex justify-between mt-6">
            <div
              className="flex flex-row cursor-pointer"
              onClick={backFunction}
            >
              <FiArrowLeft className="mt-5 text-lightgray mr-1" />
              <button type="button" className="text-lightgray font-md">
                Back
              </button>
            </div>

            <button
              type="submit"
              className="bg-green-600 py-2 px-4 mt-4  rounded-md hover:bg-green-700 w-[114px] "
            >
              Next
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConfirmationStep;
