import useFormStore from "@/store/form";
import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

interface FormData {
  name: string;
  age: number;
  gender: string;
  profession: string;
}

const UserInfo: React.FC = () => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FormData>();

  const { updateFormData, setStep, formData } = useFormStore();

  const onSubmit: SubmitHandler<FormData> = (data:any) => {
    console.log("Form Data Submitted:", data);
   
    updateFormData(data);

    setStep(2);
  };
  useEffect(() => {
    setValue("name", formData?.name);
    setValue("age", formData?.age);
    setValue("gender", formData?.gender);
    setValue("profession", formData?.profession);
  }, []);

  return (
    <div className="container mx-auto mt-8">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-[90%] md:w-[50%] mx-auto ">
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block  text-sm  mb-2 font-satoshi font-medium"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter Your Name"
            {...register("name", { required: "Name is required" })}
            className="md:w-[100%] w-[100%] border rounded-md py-2 px-3  shadow-md"
          />
          <span className="text-red-500">{errors.name?.message}</span>
        </div>

        <div className="flex justify-between">
          <div className="mb-4 w-[46%]">
            <label
              htmlFor="age"
              className="block  text-sm font-satoshi font-medium mb-2"
            >
              Age
            </label>
            <input
              type="number"
              id="age"
              placeholder="Enter Your Age"
              {...register("age", { required: "Age is required" })}
              className=" w-[100%] border rounded-md py-2 px-3  shadow-md"
            />
            <span className="text-red-500">{errors.age?.message}</span>
          </div>

          <div className="mb-4 w-[46%]">
            <label
              htmlFor="gender"
              className="block  text-sm font-satoshi font-medium mb-2"
            >
              Gender
            </label>
            <select
              id="gender"
              {...register("gender", { required: "Gender is required" })}
              className="w-[100%] rounded-md py-2 px-3  shadow-md"
            >
              <option value="" disabled hidden>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <span className="text-red-500">{errors.gender?.message}</span>
          </div>
        </div>

        <div className="mb-4">
          <label
            htmlFor="profession"
            className="block  text-sm font-satoshi font-medium mb-2 "
          >
            Profession
          </label>
          <input
            type="text"
            id="profession"
            placeholder="Enter Your Profession"
            {...register("profession", { required: "Profession is required" })}
            className=" w-[100%] border rounded-md py-2 px-3  shadow-md"
          />
          <span className="text-red-500">{errors.profession?.message}</span>
        </div>
        <div className="flex justify-end">
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

export default UserInfo;
