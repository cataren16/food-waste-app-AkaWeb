import React, { useEffect, useState } from 'react';
import { Leaf, Sprout, Heart, Medal, Trophy } from 'lucide-react';

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

const getCurrentLevel = (points) => {
    if (points < 5) return { label: 'ÎNCEPĂTOR', max: 5, iconName: 'Sprout', message: 'Start bun! Continuă să salvezi.' };
    if (points < 15) return { label: 'PASIONAT', max: 15, iconName: 'Leaf', message: 'Super! Frigiderul tău e fericit.' };
    if (points < 30) return { label: 'SALVATOR', max: 30, iconName: 'Heart', message: 'Iubești mâncarea, nu risipa!' };
    if (points < 50) return { label: 'EXPERT', max: 50, iconName: 'Medal', message: 'Un exemplu pentru comunitate!' };
    return { label: 'EROU LOCAL', max: 100, iconName: 'Trophy', message: 'Ești un campion anti-risipă!' };
};

const GamificationCard = ({ count = 0 }) => {
    const [infoLevel, setInfoLevel] = useState(getCurrentLevel(0));
    const [progressPercent, setProgressPercent] = useState(0);

    useEffect(() => {
        const levelData = getCurrentLevel(count);
        setInfoLevel(levelData);

        if (levelData && levelData.max > 0) {
            const percent = Math.min((count / levelData.max) * 100, 100);
            setProgressPercent(percent);
        } else {
            setProgressPercent(0);
        }
    }, [count]);

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
                 <p className='text-sm text-emerald-700 font-semibold'>{count} / {infoLevel?.max}</p>
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