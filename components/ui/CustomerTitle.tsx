import { CgSortAz } from "react-icons/cg";
import { BiSolidSave } from "react-icons/bi";

export default function CustomerTitle({ title, icon }: { title: string, icon?: React.ReactNode }) {
    return (
        <div className="px-6 flex items-center justify-between" >
            <div className="flex items-center">
                {icon && <div className="mr-2">{icon}</div>}
                <h1 className="text-2xl font-semibold text-gray-800">{title}</h1>
            </div>
            <div className='flex gap-6 items-center'>
                <div className="grid grid-cols-2 items-center m-3 border border-gray-200 rounded-md divide-x-2 divide-gray-200 bg-white">
                    <button className='hover:bg-gray-100 cursor-pointer'>
                        <CgSortAz className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
                    </button>
                    <button className='hover:bg-gray-100 cursor-pointer'>
                        <BiSolidSave className="inline-block px-1 mx-3 w-8 h-8 text-gray-600" />
                    </button>
                </div>
            </div>
        </div >
    );
}
