export const LEVEL_CONFIG = [
    {id:1,min:0,max:4,label: "Începător",message: "Start bun! Continuă să salvezi.",iconName: "Sprout"},
    {id: 2,min: 5,max: 14,label: "Entuziast",message: "Începi să faci diferența!",iconName: "Leaf"  },
    {id: 3,min: 15,max: 29,label: "Activist",message: "Ești inima comunității!",iconName: "Heart" },
    {id: 4,min: 30,max: 49,label: "Salvator",message: "Un exemplu pentru toți!",iconName: "Medal" },
    {id: 5,min: 50,max: 999999,label: "Erou Eco",message: "Legendă locală a sustenabilității!",iconName: "Trophy"}
 ];

 export const getCurrentLevel=(points)=>{
    return LEVEL_CONFIG.find(item => points >= item.min && points <=item.max)
 }

