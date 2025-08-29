import usepersonalStore from "@/store/form";
import UserInfoStep from "./Forms/user-info";
import PreferencesStep from "./Forms/preferences-step";
import Confirmations from "./Forms/confirmations";
import usericon from "@/assets/userImg.png"
import preference from "@/assets/preference.png"
import approval from "@/assets/approval.png"



export default function RenderStep() {

	//@ts-ignore
	const step = usepersonalStore((state) => state.step);
	const steps = [
		{
			id: 1,
			title: "User Info",
			image: usericon,
		},
		{
			id: 2,
			title: "Preferences Step",
			image: preference,
		},
		{
			id: 3,
			title: "Confirmation",
			image: approval,
		}
	];

	return (
		<div className="w-11/12 mx-auto pt-4 mt-2 relative">
			
			<div className="flex items-center justify-between bg-blue-600 w-[90%] lg:w-[50%] mx-auto rounded-full h-14 p-4">
				{steps.map((itm, idx) => (
					<div key={idx} className="flex items-center justify-start gap-4">
						{itm.id <= step ? (
							<div className="w-10 h-10 rounded-full bg-white cursor-pointer flex justify-center items-center">
								<img src={itm.image} alt={itm.title} className="w-7 h-7" />
							</div>
						) : null}

						<div className="font-bold text-2xl font-serif text-white tracking-normal text-left ">
							{itm.id === step ? itm.title : null}
						</div>

						<div className="hidden md:block">
							{itm.id > step ? (
								<div className="w-10 h-10 rounded-full bg-white cursor-pointer flex justify-center items-center ml-0">
									<img
										src={itm.image}
										alt={itm.title}
										className="w-7 h-7 opacity-30"
									/>
								</div>
							) : null}
						</div>
					</div>
				))}
			</div>

			{step === 1 && <UserInfoStep/>}
			{step === 2 && <PreferencesStep />}
			{step === 3 && <Confirmations />}

			
		</div>
	);
}
