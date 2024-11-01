 


const host = "http://192.168.1.7:8082/"

export const ItemsUrl = host+"item/"
export  const itemImageUrl = ItemsUrl+"image/"

export const storeUrl = host+"store/"
export  const storeImageUrl = storeUrl+"image/"

export const dummyImageUrl = 'https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg';

export const getPercentage = (discount,total) =>{
    return (discount/total)*100
}