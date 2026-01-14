import React, { useEffect, useState } from 'react';
import { Leaf, Sprout, Heart, Medal, Trophy } from 'lucide-react';
import { getCurrentLevel } from '../utils/Gamification';

const API_URL = "https://food-waste-akaweb-dwcdcearcweeeret.canadacentral-01.azurewebsites.net";

const iconMap = {
  Sprout: <Sprout size={18} strokeWidth={2.5} />,
  Leaf: <Leaf size={18} strokeWidth={2.5} />,
  Heart: <Heart size={18} strokeWidth={2.5} />,
  Medal: <Medal size={18} strokeWidth={2.5}/>,
  Trophy: <Trophy size={18} strokeWidth={2.5} />
};

const largeIconMap = {
  Sprout: <Sprout size={45} strokeWidth={2.5} />,
  Leaf: <Leaf size={40} strokeWidth={2.5} />,
  Heart: <Heart size={40} strokeWidth={2.5}/>,
  Medal: <Medal size={40} strokeWidth={2.5}/>,
  Trophy: <Trophy size={40} strokeWidth={2.5}/>
};



const GamificationCard = ({refreshTrigger}) => {
    const [points,setPoints]=useState(0);
    const [infoLevel, setInfoLevel] = useState(getCurrentLevel(0));
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(()=>{
        const fetchPoints = async () => {
        const storedUser = localStorage.getItem('user');
        if(!storedUser) return;

        const userObj= JSON.parse(storedUser);
        const userId=userObj.id_utilizator;
        try{
            const response = await fetch(`${API_URL}/api/users/${userId}`);
            if(response.ok)
            {
                const data = await response.json();
                const puncteReale = data.points;

                setPoints(puncteReale);

                const infoLevelData=getCurrentLevel(puncteReale); 
                setInfoLevel(infoLevelData);

                const percentReal=puncteReale/infoLevelData.max*100;
                setProgressPercent(percentReal);
            }
        }catch(error)
        {
            console.error("Eroare la citirea punctelor:", error);
        }

    }
        fetchPoints();
    },[refreshTrigger])

    const currentIcon = infoLevel?.iconName ? iconMap[infoLevel.iconName] : iconMap.Sprout;
    const LargeCurrentIcon = infoLevel?.iconName ? largeIconMap[infoLevel.iconName] : largeIconMap.Sprout;

    return (
        <div className='flex flex-col rounded-2xl bg-emerald-100 px-5 py-4 gap-1 relative shadow-lg mx-2'>
            <div className='flex gap-2 items-center'>
                <div className='bg-white text-emerald-700 rounded-lg p-2'>
                    {currentIcon}
                </div>
                <p className='text-emerald-800 text-sm font-extrabold'>
                    {infoLevel?.label}
                </p>
            </div>
            
            <div className='absolute right-4 top-1 text-emerald-600 opacity-30 rotate-[15deg]'>
                {LargeCurrentIcon}
            </div>
            
            <div className='flex justify-between mt-2'>
                 <p className='text-xs text-emerald-700 font-bold'>Progres</p>
                 <p className='text-sm text-emerald-700 font-semibold'>{points} / {infoLevel?.max}</p>
            </div>
            
            <div className='h-2 bg-white rounded-2xl mt-1 overflow-hidden'>
                <div 
                    className='h-full bg-emerald-500 transition-all duration-700 ease-out rounded-2xl' 
                    style={{ width: `${progressPercent}%` }}
                ></div>
            </div>
            
            <p className='text-xs text-emerald-700 font-semibold italic mt-1'>
                {infoLevel?.message}
            </p>
        </div>
    )
}

export default GamificationCard;