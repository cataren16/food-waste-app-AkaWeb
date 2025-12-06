import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf,ToolCase,History,User,CirclePlus,Users,LogOut } from 'lucide-react';
import {NavLink,useNavigate} from 'react-router-dom';
import GamificationCard from './GamificationCard'

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

    
    };

const Sidebar = ({refreshTrigger}) => {

    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('user'); 
            navigate('/login');}
  return (
    <div className='flex  md:flex-col fixed bottom-0 md:left-0 md:top-0 md:px-3 md:h-screen h-16 w-full md:w-64  md:space-y-4 md:gap-4 bg-white rounded-2xl shadow-md'>
      
        <div className='hidden md:flex  md:p-6 md:items-center md:gap-4 md:text-emerald-600'>
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
       
        <div className='hidden md:block pt-7'>
        <GamificationCard refreshTrigger={refreshTrigger}/>
        </div>
        <div className='hidden md:block h-20 '></div>
        <div className='hidden md:block md:flex gap-2 px-2 py-5 text-gray-600 hover:text-emerald-600' onClick={handleLogout}> 
           <LogOut strokeWidth={2.5}  />
           <p className='font-bold text-lg'>Deconectare</p>
        </div>
    </div>
    );
};

export default Sidebar;