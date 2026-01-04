    import React, { useState} from 'react';
    import {Search} from 'lucide-react';


    const Searchbar = ({className, rounded,backgroundInp,value, onChange})=>{

        return (

            <div className={`relative ${className}`}>
            <input type="text" placeholder="Caută prieteni sau prod" value={value} onChange={(e)=> onChange(e.target.value)} className={` ${rounded} ${backgroundInp} px-10 border outline-none focus:border-green-500 w-full`} />
            <Search className='absolute left-2 top-1/2 -translate-y-1/2 text-gray-500'/>
            </div>
        );
    }

    export default Searchbar;