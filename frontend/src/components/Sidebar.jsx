import React from 'react';
import { Link } from 'react-router-dom';
import {NavLink} from 'react-router-dom';
import { Leaf,Users,User,ToolCase,History,CirclePlus} from 'lucide-react';

const getLinkClasses = ({isActive})=>{
    const baseClass='flex flex-col md:flex-row md:gap-3  md:px-5 md:py-3 rounded-2xl items-center'
    if(isActive)
    {
        return `${baseClass} md:bg-emerald-100 md:font-bold text-emerald-600 `
    }
    else 
    {
        return `${baseClass} md:hover:bg-emerald-100 hover:text-emerald-600 md:hover:font-bold `
    }
}
const Sidebar = () => {
  return (
    <div className='flex  md:flex-col fixed bottom-0 md:left-0 md:top-0 md:px-3 md:h-screen h-16 w-full md:w-64  md:space-y-4  bg-white rounded-2xl shadow-md'>
        <div className='hidden md:flex  md:p-6 md:items-center md:gap-2 md:text-emerald-600'>
        <Leaf  size={28} />
        <p className='text-2xl font-extrabold'>AkaWeb</p>
        </div>
        <div className='flex justify-around w-full  md:flex-col md:gap-6  text-gray-600 py-2 '>
            <NavLink to="/feed" className={getLinkClasses}>
                <ToolCase className='w-[30px] h-[30px] md:w-[25px] md:h-[25px]'/>
                <p className="hidden md:block ">Feed Principal</p>
                 <p className="md:hidden block">Feed</p>
            </NavLink>
             <NavLink to="/profile" className={getLinkClasses}>
                <User className='w-[30px] h-[30px] md:w-[25px] md:h-[25px]'/>
                <p className="hidden md:block">Profil & Frigider</p>
                <p className="md:hidden block">Profil</p>
             </NavLink>
             <NavLink className="md:hidden block -mt-8 ">
             <CirclePlus size={75} color="#faf8f7ff" fill="#ec7f31ff" strokeWidth={1} className="drop-shadow-2xl" />
             </NavLink>
             <NavLink to="/groups" className={getLinkClasses}>
                <Users className='w-[30px] h-[30px] md:w-[25px] md:h-[25px]'/>
                <p>Grupuri</p>
                
             </NavLink>
             <NavLink to="/history"className={getLinkClasses}>
                <History className='w-[30px] h-[30px] md:w-[25px] md:h-[25px]'/> 
                <p className="hidden md:block">Istoric & Cereri</p>
                 <p className="md:hidden block">Istoric</p>
             </NavLink>
        </div>
       
    </div>
    );
};

export default Sidebar;